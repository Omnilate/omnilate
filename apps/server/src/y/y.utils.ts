import type { IncomingMessage } from 'http'

import * as Y from 'yjs'
import * as syncProtocol from 'y-protocols/sync'
import * as awarenessProtocol from 'y-protocols/awareness'
import * as encoding from 'lib0/encoding'
import * as decoding from 'lib0/decoding'
import * as map from 'lib0/map'
import * as eventloop from 'lib0/eventloop'
import { LeveldbPersistence } from 'y-leveldb'
import type { WebSocket } from 'ws'

import { callbackHandler, isCallbackSet } from './callback.js'

const CALLBACK_DEBOUNCE_WAIT = 2000
const CALLBACK_DEBOUNCE_MAXWAIT = 10000

const debouncer = eventloop.createDebouncer(CALLBACK_DEBOUNCE_WAIT, CALLBACK_DEBOUNCE_MAXWAIT)

const wsReadyState = {
  connecting: 0,
  open: 1,
  closing: 2,
  closed: 3
} as const

// disable gc when using snapshots!
const gcEnabled = process.env.GC !== 'false' && process.env.GC !== '0'
const persistenceDir = process.env.YPERSISTENCE

let persistence: { bindState: (docName: string, ydoc: WSSharedDoc) => void, writeState: (docName: string, ydoc: WSSharedDoc) => Promise<any>, provider: any } | null = null
if (typeof persistenceDir === 'string') {
  console.info('Persisting documents to "' + persistenceDir + '"')
  const ldb = new LeveldbPersistence(persistenceDir)
  persistence = {
    provider: ldb,
    bindState: async (docName, ydoc) => {
      const persistedYdoc = await ldb.getYDoc(docName)
      const newUpdates = Y.encodeStateAsUpdate(ydoc)
      await ldb.storeUpdate(docName, newUpdates)
      Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(persistedYdoc))
      ydoc.on('update', async (update) => {
        await ldb.storeUpdate(docName, update)
      })
    },
    writeState: async (_docName, _ydoc) => {}
  }
}

export const setPersistence = (persistence_: { bindState: (docName: string, ydoc: WSSharedDoc) => void, writeState: (docName: string, ydoc: WSSharedDoc) => Promise<any>, provider: any } | null) => {
  persistence = persistence_
}

export const getPersistence = () => persistence

export const docs = new Map<string, WSSharedDoc>()

const messageSync = 0
const messageAwareness = 1
// const messageAuth = 2

const updateHandler = (update: Uint8Array, _origin: any, doc: WSSharedDoc, _tr: any) => {
  const encoder = encoding.createEncoder()
  encoding.writeVarUint(encoder, messageSync)
  syncProtocol.writeUpdate(encoder, update)
  const message = encoding.toUint8Array(encoder)
  doc.conns.forEach((_, conn) => { send(doc, conn, message) })
}

let contentInitializer = async (_ydoc: Y.Doc): Promise<void> => { await Promise.resolve() }

/**
 * This function is called once every time a Yjs document is created. You can
 * use it to pull data from an external source or initialize content.
 */
export const setContentInitializer = (f: (ydoc: Y.Doc) => Promise<void>) => {
  contentInitializer = f
}

export class WSSharedDoc extends Y.Doc {
  name: string
  /**
   * Maps from conn to set of controlled user ids. Delete all user ids from awareness when this conn is closed
   */
  conns: Map<any, Set<number>>
  awareness: awarenessProtocol.Awareness
  whenInitialized: Promise<void>

  constructor (name: string) {
    super({ gc: gcEnabled })
    this.name = name
    this.conns = new Map()
    this.awareness = new awarenessProtocol.Awareness(this)
    this.awareness.setLocalState(null)
    const awarenessChangeHandler = ({ added, updated, removed }, conn) => {
      const changedClients = added.concat(updated, removed)
      if (conn !== null) {
        const connControlledIDs: Set<number> | undefined = this.conns.get(conn)
        if (connControlledIDs !== undefined) {
          added.forEach((clientID: number) => { connControlledIDs.add(clientID) })
          removed.forEach((clientID: number) => { connControlledIDs.delete(clientID) })
        }
      }
      // broadcast awareness update
      const encoder = encoding.createEncoder()
      encoding.writeVarUint(encoder, messageAwareness)
      encoding.writeVarUint8Array(encoder, awarenessProtocol.encodeAwarenessUpdate(this.awareness, changedClients as number[]))
      const buff = encoding.toUint8Array(encoder)
      this.conns.forEach((_, c) => {
        send(this, c, buff)
      })
    }
    this.awareness.on('update', awarenessChangeHandler)
    this.on('update', /** @type {any} */ (updateHandler))
    if (isCallbackSet) {
      this.on('update', (_update, _origin, doc) => {
        debouncer(() => { callbackHandler(doc as WSSharedDoc) })
      })
    }
    this.whenInitialized = contentInitializer(this)
  }
}

/**
 * Gets a Y.Doc by name, whether in memory or on disk
 *
 * @param {string} docname - the name of the Y.Doc to find or create
 * @param {boolean} gc - whether to allow gc on the doc (applies only when created)
 * @return {WSSharedDoc}
 */
export const getYDoc = (docname: string, gc = true): WSSharedDoc => map.setIfUndefined(docs, docname, () => {
  const doc = new WSSharedDoc(docname)
  doc.gc = gc
  if (persistence !== null) {
    persistence.bindState(docname, doc)
  }
  docs.set(docname, doc)
  return doc
})

const messageListener = (conn: WebSocket, doc: WSSharedDoc, message: Uint8Array) => {
  try {
    const encoder = encoding.createEncoder()
    const decoder = decoding.createDecoder(message)
    const messageType = decoding.readVarUint(decoder)
    switch (messageType) {
      case messageSync:
        encoding.writeVarUint(encoder, messageSync)
        syncProtocol.readSyncMessage(decoder, encoder, doc, conn)

        // If the `encoder` only contains the type of reply message and no
        // message, there is no need to send the message. When `encoder` only
        // contains the type of reply, its length is 1.
        if (encoding.length(encoder) > 1) {
          send(doc, conn, encoding.toUint8Array(encoder))
        }
        break
      case messageAwareness: {
        awarenessProtocol.applyAwarenessUpdate(doc.awareness, decoding.readVarUint8Array(decoder), conn)
        break
      }
    }
  } catch (err) {
    console.error(err)
    // @ts-expect-error error
    doc.emit('error', [err])
  }
}

const closeConn = (doc: WSSharedDoc, conn: any) => {
  if (doc.conns.has(conn)) {
    /**
     * @type {Set<number>}
     */
    const controlledIds = doc.conns.get(conn)
    doc.conns.delete(conn)
    awarenessProtocol.removeAwarenessStates(doc.awareness, Array.from(controlledIds!), null)
    if (doc.conns.size === 0 && persistence !== null) {
      // if persisted, we store state and destroy ydocument
      void persistence.writeState(doc.name, doc).then(() => {
        doc.destroy()
      })
      docs.delete(doc.name)
    }
  }
  conn.close()
}

const send = (doc: WSSharedDoc, conn: WebSocket, m: Uint8Array) => {
  if (conn.readyState !== wsReadyState.connecting && conn.readyState !== wsReadyState.open) {
    closeConn(doc, conn)
  }
  try {
    conn.send(m, {}, (err) => { err != null && closeConn(doc, conn) })
  } catch (e) {
    closeConn(doc, conn)
  }
}

const pingTimeout = 30000

export const setupWSConnection = (conn: WebSocket, req: IncomingMessage, { docName = '', gc = true } = {}) => {
  conn.binaryType = 'arraybuffer'
  // get doc, initialize if it does not exist yet
  const doc = getYDoc(docName, gc)
  doc.getMap('records')

  doc.conns.set(conn, new Set())
  // listen and reply to events
  conn.on('message', (message: ArrayBuffer) => { messageListener(conn, doc, new Uint8Array(message)) })

  // Check if connection is still alive
  let pongReceived = true
  const pingInterval = setInterval(() => {
    if (!pongReceived) {
      if (doc.conns.has(conn)) {
        closeConn(doc, conn)
      }
      clearInterval(pingInterval)
    } else if (doc.conns.has(conn)) {
      pongReceived = false
      try {
        conn.ping()
      } catch (e) {
        closeConn(doc, conn)
        clearInterval(pingInterval)
      }
    }
  }, pingTimeout)
  conn.on('close', () => {
    closeConn(doc, conn)
    clearInterval(pingInterval)
  })
  conn.on('pong', () => {
    pongReceived = true
  })
  // put the following in a variables in a block so the interval handlers don't keep in in
  // scope
  {
    // send sync step 1
    const encoder = encoding.createEncoder()
    encoding.writeVarUint(encoder, messageSync)
    syncProtocol.writeSyncStep1(encoder, doc)
    send(doc, conn, encoding.toUint8Array(encoder))
    const awarenessStates = doc.awareness.getStates()
    if (awarenessStates.size > 0) {
      const encoder = encoding.createEncoder()
      encoding.writeVarUint(encoder, messageAwareness)
      encoding.writeVarUint8Array(encoder, awarenessProtocol.encodeAwarenessUpdate(doc.awareness, Array.from(awarenessStates.keys())))
      send(doc, conn, encoding.toUint8Array(encoder))
    }
  }
}
