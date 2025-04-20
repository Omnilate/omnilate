import type { AwarenessInfo, ProjectChatMessage, ProjectDirectory, ProjectDirectoryY, ProjectFile, ProjectFileVersion, ProjectLanguage } from '@omnilate/schema'
import { createStore, reconcile } from 'solid-js/store'
import type { SetStoreFunction } from 'solid-js/store'
import { WebsocketProvider } from '@omnilate/y-websocket'
import * as Y from 'yjs'

import { getUserColor } from '@/utils/user-color'

export class ProjectOnYjs {
  readonly projectDoc: Y.Doc
  readonly provider: WebsocketProvider
  protected currentFileDoc?: Y.Doc
  readonly currentFile: ProjectFile
  private readonly setCurrentFile: SetStoreFunction<ProjectFile>
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

    const [currentFile, setCurrentFile] = createStore<ProjectFile>({
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      languages: {},
      fileVersions: {}
    })
    // eslint-disable-next-line solid/reactivity
    this.currentFile = currentFile
    this.setCurrentFile = setCurrentFile

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
  }

  sendChatMessage (content: string): void {
    this.chatMessagesArray.push([{
      content,
      createdAt: new Date().toISOString(),
      authorId: this.uid
    }])
  }

  addDirectory (path: string[], name: string): void {
    const target = locateTargetMap(this.directoryTree, path)
    const newDir = new Y.Map<ProjectDirectoryY | Y.Doc>()
    target.set(name, newDir)
    this.directoryRoot.children[name] = {
      type: 'directory',
      children: {}
    }
  }

  addFile (path: string[], name: string): void {
    const target = locateTargetMap(this.directoryTree, path)
    const newFile = new Y.Doc()
    const rootMap = newFile.getMap('root')
    rootMap.set('createdAt', new Date().toISOString())
    rootMap.set('updatedAt', new Date().toISOString())
    rootMap.set('languages', {})
    rootMap.set('fileVersions', {})
    target.set(name, newFile)
  }

  moveFile (oldPath: string[], newPath: string[]): void {
    const oldTarget = locateTargetMap(this.directoryTree, oldPath.slice(0, -1))
    const newTarget = locateTargetMap(this.directoryTree, newPath.slice(0, -1))

    const fileName = oldPath[oldPath.length - 1]
    const file = oldTarget.get(fileName) as Y.Doc
    this.projectDoc.transact(() => {
      newTarget.set(fileName, file)
      oldTarget.delete(fileName)
    })
  }

  deleteFile (path: string[]): void {
    const target = locateTargetMap(this.directoryTree, path.slice(0, -1))
    const fileName = path[path.length - 1]
    this.projectDoc.transact(() => {
      target.delete(fileName)
    })
  }

  workOnFile (path: string[]): void {
    const target = locateTargetMap(this.directoryTree, path)
    if (target instanceof Y.Doc) {
      this.currentFileDoc = target
      const rootMap = target.getMap('root')
      this.setCurrentFile(
        reconcile({
          createdAt: rootMap.get('createdAt') as string,
          updatedAt: rootMap.get('updatedAt') as string,
          languages: rootMap.get('languages') as Record<string, ProjectLanguage>,
          fileVersions: rootMap.get('fileVersions') as Record<string, ProjectFileVersion>
        }, { key: `project-${this.projectId}-file` })
      )
    }
  }

  focusAt (key: string, lang: string): void {}
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

function locateTargetMap (dir: ProjectDirectoryY, path: string[]): ProjectDirectoryY {
  let target = dir
  for (const p of path) {
    if (target.has(p)) {
      target = target.get(p) as ProjectDirectoryY
    } else {
      throw new Error(`Path /${path.join('/')} not found`)
    }
  }
  return target
}

// export class YDocI18NextBinding {
//   readonly doc: Y.Doc
//   readonly provider: WebsocketProvider
//   readonly awareness
//   readonly awarenessMap: Record<number, AwarenessInfo>
//   readonly content: Record<string, I18NextRecord>
//   private readonly setContent: SetStoreFunction<Record<string, I18NextRecord>>
//   private recordsYMap?: Y.Map<I18Next>

//   constructor (readonly url: string, readonly projectId: number, private readonly uid: number) {
//     this.doc = new Y.Doc()
//     this.provider = new WebsocketProvider(this.url, `i18next-${this.projectId}`, this.doc)

//     this.provider.on('status', (event) => {
//       if (event.status === 'connected') {
//         console.log('Connected to Yjs server')
//       } else {
//         console.log('Disconnected from Yjs server')
//       }
//     })

//     const [content, setContent] = createStore<Record<string, I18NextRecord>>({})
//     // eslint-disable-next-line solid/reactivity
//     this.content = content
//     this.setContent = setContent

//     this.doc.on('update', () => {
//       const recordsYMap = this.doc.getMap<I18Next>('records')
//       this.recordsYMap ??= recordsYMap
//       this.setContent(reconcile(recordsYMap.toJSON(), { key: `i18next-${this.projectId}-records` }))
//     })

//     const [awarenessMap, setAwarenessMap] = createStore<Record<number, AwarenessInfo>>({})
//     // eslint-disable-next-line solid/reactivity
//     this.awarenessMap = awarenessMap

//     this.awareness = this.provider.awareness
//     this.awareness.setLocalState({
//       uid: this.uid,
//       color: getRandomUserColor(this.uid),
//       active: false
//     })
//     // FIXME: performance issue
//     this.awareness.on('change', () => {
//       const m = this.awareness.getStates() as Map<number, AwarenessInfo>
//       setAwarenessMap(reconcile(Object.fromEntries(m.entries())))
//     })
//   }

//   addRecord (key: string, lang: string, value: string): void {
//     this.doc.transact(() => {
//       if (this.recordsYMap == null) {
//         return
//       }

//       let record: I18Next
//       if (this.recordsYMap.has(key)) {
//         record = this.recordsYMap.get(key)!
//       } else {
//         record = new I18Next()
//         this.recordsYMap.set(key, record)
//       }

//       if (record.has(lang)) {
//         const langRecord = record.get(lang)!
//         langRecord.set('value', value)
//         langRecord.set('updatedAt', new Date().toISOString())
//         langRecord.set('lastEditorId', this.uid)
//       }
//       this.recordsYMap.set(key, record)
//     })
//   }

//   updateRecord (key: string, lang: string, value: string): void {
//     this.doc.transact(() => {
//       if (this.recordsYMap == null) {
//         return
//       }

//       const record = this.recordsYMap.get(key)!

//       const langRecord = record.get(lang)
//       if (langRecord == null) {
//         return
//       }

//       langRecord.set('value', value)
//       langRecord.set('updatedAt', new Date().toISOString())
//       langRecord.set('lastEditorId', this.uid)
//     })
//   }

//   renameRecord (key: string, newKey: string): void {
//     this.doc.transact(() => {
//       if (this.recordsYMap == null) {
//         return
//       }

//       const record = this.recordsYMap.get(key)!
//       this.recordsYMap.set(newKey, record)
//       this.recordsYMap.delete(key)
//     })
//   }

//   deleteRecord (key: string, lang: string): void {
//     this.doc.transact(() => {
//       if (this.recordsYMap == null) {
//         return
//       }

//       const record = this.recordsYMap.get(key)!
//       record.delete(lang)
//     })
//   }

//   addDiscussion (key: string, lang: string, content: string): void {
//     this.doc.transact(() => {
//       if (this.recordsYMap == null) {
//         return
//       }

//       const record = this.recordsYMap.get(key)!
//       const langRecord = record.get(lang)!
//       const discussions = langRecord.get.discussions() as Y.Array<Discussion>
//       discussions.push([
//         {
//           content,
//           createdAt: new Date().toISOString(),
//           updatedAt: new Date().toISOString(),
//           authorId: this.uid
//         }
//       ])
//     })
//   }

//   destroy (): void {
//     this.provider.disconnect()
//     this.provider.destroy()
//   }
// }
