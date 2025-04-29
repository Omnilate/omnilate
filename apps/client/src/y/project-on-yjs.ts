import type { AwarenessInfo, ProjectChatMessage, ProjectDirectory, ProjectDirectoryY, ProjectFileInfo } from '@omnilate/schema'
import { WebsocketProvider } from '@omnilate/y-websocket'
import type { Accessor, Setter } from 'solid-js'
import { createSignal } from 'solid-js'
import { createStore, reconcile } from 'solid-js/store'
import * as Y from 'yjs'

import { getUserColor } from '@/utils/user-color'
import { sleep } from '@/utils/sleep'

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
    this.directoryTree = this.projectDoc.getMap<ProjectDirectoryY | Y.Doc>('root')
    this.projectDoc.on('update', () => {
      setDirectoryRoot(reconcile(yDirToJSON(this.directoryTree), { key: `project-${this.projectId}-directory` }))
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
  }

  sendChatMessage (content: string): void {
    this.chatMessagesArray.push([{
      content,
      createdAt: new Date().toISOString(),
      authorId: this.uid
    }])
  }

  async addDirectory (path: string[], name: string): Promise<void> {
    const target = await this.locateTargetMap(this.directoryTree, path)
    const newDir = new Y.Map<ProjectDirectoryY | Y.Doc>()
    target.set(name, newDir)
  }

  async addFile (path: string[], name: string): Promise<void> {
    const target = await this.locateTargetMap(this.directoryTree, path)
    const newFile = new Y.Doc()
    const rootMap = newFile.getMap('root')
    rootMap.set('createdAt', new Date().toISOString())
    rootMap.set('updatedAt', new Date().toISOString())
    rootMap.set('languages', {})
    rootMap.set('fileVersions', {})
    target.set(name, newFile)
  }

  async moveFile (oldPath: string[], newPath: string[]): Promise<void> {
    const oldTarget = await this.locateTargetMap(this.directoryTree, oldPath.slice(0, -1))
    const newTarget = await this.locateTargetMap(this.directoryTree, newPath.slice(0, -1))

    const fileName = oldPath[oldPath.length - 1]
    const file = oldTarget.get(fileName) as Y.Doc
    this.projectDoc.transact(() => {
      newTarget.set(fileName, file)
      oldTarget.delete(fileName)
    })
  }

  async deleteFile (path: string[]): Promise<void> {
    const target = this.locateTargetMap(this.directoryTree, path.slice(0, -1))
    const fileName = path[path.length - 1]
    await this.projectDoc.transact(async () => {
      (await target).delete(fileName)
    })
  }

  async workOnFile (path: string[]): Promise<void> {
    const target = await this.locateTargetMap(this.directoryTree, path)
    if (target instanceof Y.Doc) {
      if (this.currentFileDoc() != null) {
        this.currentFileDoc()?.destroy()
      }

      const file = new FileOnYjs(target, this.uid)
      this.setCurrentFileDoc(file)
      this.awareness.setLocalStateField('active', true)
      this.awareness.setLocalStateField('workingOn', {
        filePath: path,
        key: '',
        language: '',
        page: 0,
        cursorOffset: 0
      })
    }
  }

  leaveFile (): void {
    this.awareness.setLocalStateField('active', false)
    this.awareness.setLocalStateField('workingOn', undefined)
    this.currentFileDoc()?.destroy()
    this.setCurrentFileDoc(undefined)
  }

  focusAt (key: string, lang: string): void {}

  defocus (): void {}

  async locateTargetMap (dir: ProjectDirectoryY, path: string[]): Promise<ProjectDirectoryY> {
    let target = dir
    // for (const p of path) {
    //   if (target.has(p)) {
    //     target = target.get(p) as ProjectDirectoryY
    //   } else {
    //     throw new Error(`Path /${path.join('/')} not found`)
    //   }
    // }

    // retry 3 times if not ready
    for (let i = 0; i < 3; i++) {
      try {
        for (const p of path) {
          if (target.has(p)) {
            target = target.get(p) as ProjectDirectoryY
          } else {
            throw new Error(`Path /${path.join('/')} not found`)
          }
        }
        return target
      } catch (e: unknown) {
        await sleep(500)
      }
    }
    throw new Error(`Path /${path.join('/')} not found`)
  }
}

function yDirToJSON (dir: ProjectDirectoryY): ProjectDirectory {
  const result: ProjectDirectory = {
    type: 'directory',
    children: {}
  }

  for (const [key, value] of dir.entries()) {
    if (value instanceof Y.Doc) {
      result.children[key] = {
        type: 'file'
      }
    } else {
      result.children[key] = yDirToJSON(value)
    }
  }

  return result
}
