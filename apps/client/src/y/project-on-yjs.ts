import type {
  AwarenessInfo, Discussion, LanguageMetaY, LanguageRecordY, ProjectChatMessage,
  ProjectDirectory, ProjectDirectoryY, ProjectFile, ProjectFileY,
  ProjectRecordY
} from '@omnilate/schema'
import { WebsocketProvider } from '@omnilate/y-websocket'
import type { Accessor, Setter } from 'solid-js'
import { createSignal } from 'solid-js'
import { createStore, reconcile } from 'solid-js/store'
import * as Y from 'yjs'

import { getUserColor } from '@/utils/user-color'

import { FileOnYjs } from './file-on-yjs'

export class ProjectOnYjs {
  readonly projectDoc: Y.Doc
  readonly provider: WebsocketProvider
  readonly currentFileDoc: Accessor<FileOnYjs | undefined>
  private readonly setCurrentFileDoc: Setter<FileOnYjs | undefined>
  private readonly chatMessagesArray: Y.Array<ProjectChatMessage>
  readonly chatMessages: ProjectChatMessage[]
  readonly directoryRoot: ProjectDirectory
  private readonly directoryTree: ProjectDirectoryY
  readonly awareness
  readonly awarenessMap: Record<number, AwarenessInfo>
  private readonly syncPromise: Promise<void>

  constructor (readonly url: string, readonly projectId: number, private readonly uid: number) {
    this.projectDoc = new Y.Doc()
    this.provider = new WebsocketProvider(this.url, `project-${this.projectId}`, this.projectDoc)
    this.awareness = this.provider.awareness

    this.provider.on('status', (event) => {
      if (event.status === 'connected') {
        console.log('Connected to Yjs server')
      } else {
        console.log('Disconnected from Yjs server')
      }
    })

    const [chatMessages, setChatMessages] = createStore<ProjectChatMessage[]>([])
    // eslint-disable-next-line solid/reactivity
    this.chatMessages = chatMessages
    this.chatMessagesArray = this.projectDoc.getArray<ProjectChatMessage>('chatMessages')
    this.chatMessagesArray.observe((ev) => {
      const newArr = ev.target.toArray()
      setChatMessages(reconcile(newArr, { key: `project-${this.projectId}-messages` }))
    })

    const [directoryRoot, setDirectoryRoot] = createStore<ProjectDirectory>({
      type: 'directory',
      children: {}
    })
    // eslint-disable-next-line solid/reactivity
    this.directoryRoot = directoryRoot
    this.directoryTree = this.projectDoc.getMap('root')
    this.projectDoc.on('update', () => {
      setDirectoryRoot(
        reconcile(
          this.directoryTree.toJSON() as ProjectDirectory,
          { key: `project-${this.projectId}-directory` }
        )
      )
    })

    const [awarenessMap, setAwarenessMap] = createStore<Record<number, AwarenessInfo>>({})
    // eslint-disable-next-line solid/reactivity
    this.awarenessMap = awarenessMap

    this.awareness = this.provider.awareness
    this.awareness.setLocalState({
      uid: this.uid,
      color: getUserColor(this.uid),
      active: false
    })
    // FIXME: performance issue
    const handleAwarenessChange = (): void => {
      const m = this.awareness.getStates() as Map<number, AwarenessInfo>
      setAwarenessMap(reconcile(Object.fromEntries(m.entries())))
    }
    handleAwarenessChange()
    this.awareness.on('change', handleAwarenessChange)

    this.projectDoc.on('destroy', () => {
      this.awareness.destroy()
    })

    const [currentFileDoc, setCurrentFileDoc] = createSignal<FileOnYjs>()
    this.currentFileDoc = currentFileDoc
    this.setCurrentFileDoc = setCurrentFileDoc

    this.syncPromise = new Promise((resolve) => {
      const interval = setInterval(() => {
        console.log('Waiting for sync flag')
        const syncFlag = this.projectDoc.getText('syncFlag')
        if (syncFlag != null && syncFlag.length > 0) {
          console.log('Sync flag received', syncFlag.toJSON())
          clearInterval(interval)
          resolve()
        }
      }, 250)
    })
  }

  public async sendChatMessage (content: string): Promise<void> {
    await this.syncPromise
    this.chatMessagesArray.push([{
      content,
      createdAt: new Date().toISOString(),
      authorId: this.uid
    }])
  }

  // #region file/dir

  public async addDirectory (path: string[], name: string): Promise<void> {
    await this.syncPromise
    const target = await this.locateNode(this.directoryTree, path)
    if (target.get('type') !== 'directory') {
      throw new Error(`Cannot create directory in a file: /${path.join('/')}`)
    }
    const children = target.get('children') as Y.Map<ProjectDirectoryY | ProjectFileY>

    const newDir: ProjectDirectoryY = new Y.Map()
    newDir.set('type', 'directory')
    newDir.set('children', new Y.Map<ProjectDirectoryY | ProjectFileY>())
    children.set(name, newDir)
  }

  public async addFile (
    path: string[],
    name: string,
    srcLang: string,
    initData: Record<string, string>
  ): Promise<void> {
    await this.syncPromise
    const target = await this.locateNode(this.directoryTree, path)
    if (target.get('type') !== 'directory') {
      throw new Error(`Cannot create file in a file: /${path.join('/')}`)
    }

    const children = target.get('children') as Y.Map<ProjectDirectoryY | ProjectFileY>

    if (children.has(name)) {
      throw new Error(`File already exists: /${path.join('/')}/${name}`)
    }

    this.projectDoc.transact(() => {
      const newFile: ProjectFileY = new Y.Map()
      newFile.set('type', 'file')
      newFile.set('createdAt', new Date().toISOString())
      newFile.set('updatedAt', new Date().toISOString())
      newFile.set('sourceLanguage', srcLang)
      newFile.set('createdAt', new Date().toISOString())
      newFile.set('updatedAt', new Date().toISOString())
      newFile.set('languages', new Y.Map<LanguageMetaY>())

      const records = new Y.Map<ProjectRecordY>()
      for (const [key, value] of Object.entries(initData)) {
        const record: ProjectRecordY = new Y.Map()
        records.set(key, record)
        record.set('updatedAt', new Date().toISOString())

        const languageRecords = new Y.Map<LanguageRecordY>()
        record.set('languages', languageRecords)

        const languageRecord: LanguageRecordY = new Y.Map()
        languageRecords.set(srcLang, languageRecord)
        languageRecord.set('updatedAt', new Date().toISOString())
        languageRecord.set('discussions', new Y.Array<Discussion>())
        languageRecord.set('lastEditorId', this.uid)
        languageRecord.set('value', new Y.Text(value))
        languageRecord.set('state', 'source')
      }

      newFile.set('records', records)
      children.set(name, newFile)
    })
  }

  public async moveNode (oldPos: string[], newPos: string[]): Promise<void> {
    const oldParent = await this.locateNode(this.directoryTree, oldPos.slice(0, -1)) as ProjectDirectoryY
    const newParent = await this.locateNode(this.directoryTree, newPos.slice(0, -1)) as ProjectDirectoryY

    const nodeName = oldPos[oldPos.length - 1]
    const oldParentDir = oldParent.get('children') as Y.Map<ProjectDirectoryY | ProjectFileY>
    const node = oldParentDir.get(nodeName)!
    const newParentDir = newParent.get('children') as Y.Map<ProjectDirectoryY | ProjectFileY>

    this.projectDoc.transact(() => {
      newParentDir.set(nodeName, node)
      oldParentDir.delete(nodeName)
    })
  }

  public async deleteNode (path: string[]): Promise<void> {
    await this.syncPromise
    const parent = await this.locateNode(this.directoryTree, path.slice(0, -1))
    const nodeName = path[path.length - 1]
    const parentDir = (await parent).get('children') as Y.Map<ProjectDirectoryY | ProjectFileY>

    parentDir.delete(nodeName)
  }

  public async workOnFile (path: string[]): Promise<void> {
    await this.syncPromise
    const target = await this.locateNode(this.directoryTree, path)
    if (target.get('type') === 'file') {
      if (this.currentFileDoc() != null) {
        this.currentFileDoc()?.destroy()
      }

      const file = new FileOnYjs(this.projectDoc, target as ProjectFileY, this.uid, this.awareness)
      this.setCurrentFileDoc(file)
      this.awareness.setLocalStateField('active', true)
      this.awareness.setLocalStateField('workingOn', {
        filePath: path,
        key: '',
        language: '',
        page: 0,
        cursor: {
          index: 0,
          length: 0
        }
      })
    }
  }

  public leaveFile (): void {
    this.awareness.setLocalStateField('active', false)
    this.awareness.setLocalStateField('workingOn', undefined)
    this.currentFileDoc()?.destroy()
    this.setCurrentFileDoc(undefined)
  }

  // #endregion

  private async locateNode (dir: ProjectDirectoryY, path: string[]): Promise<ProjectDirectoryY | ProjectFileY> {
    await this.syncPromise
    return path.reduce<ProjectDirectoryY | ProjectFileY>((acc, p) => {
      if (acc.get('type') !== 'directory') {
        throw new Error(`Path /${path.join('/')} not found`)
      }

      const children = acc.get('children') as Y.Map<ProjectDirectoryY | ProjectFileY>
      if (children.has(p)) {
        return children.get(p) as ProjectDirectoryY
      } else {
        throw new Error(`Path /${path.join('/')} not found`)
      }
    }, dir)
  }

  public async getMappedNode (path: string[]): Promise<ProjectDirectory | ProjectFile> {
    const node = await this.locateNode(this.directoryTree, path)
    return node.toJSON() as ProjectDirectory | ProjectFile
  }
}
