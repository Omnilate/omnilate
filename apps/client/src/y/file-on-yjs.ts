import type { ProjectFile, ProjectRecord } from '@omnilate/schema'
import type { SetStoreFunction } from 'solid-js/store'
import { createStore, reconcile } from 'solid-js/store'
import type * as Y from 'yjs'

export class FileOnYjs {
  readonly fileStore: ProjectFile
  private readonly setFileStore: SetStoreFunction<ProjectFile>
  readonly rootMap: Y.Map<ProjectFile[keyof ProjectFile]>

  constructor (
    readonly doc: Y.Doc,
    private readonly uid: number
  ) {
    doc.load()
    this.rootMap = doc.getMap('root')

    const [fileStore, setFileStore] = createStore<ProjectFile>({
      sourceLanguage: '',
      languages: [],
      createdAt: '',
      updatedAt: '',
      records: {},
      fileVersions: {}
    })
    // eslint-disable-next-line solid/reactivity
    this.fileStore = fileStore
    this.setFileStore = setFileStore

    const handleUpdate = (): void => {
      const update = this.rootMap.toJSON() as ProjectFile
      this.setFileStore(reconcile(update, { key: `file-${this.rootMap.get('createdAt') as string}` }))
    }
    handleUpdate()
    this.doc.on('update', handleUpdate)
    this.doc.on('sync', () => { console.log('synced') })

    // if (!this.rootMap.get('createdAt')) {
    //   doc.transact(() => {
    //     this.rootMap.set('createdAt', new Date().toISOString())
    //     this.rootMap.set('updatedAt', new Date().toISOString())
    //     this.rootMap.set('sourceLanguage', '')
    //     this.rootMap.set('languages', [])
    //     this.rootMap.set('records', {})
    //     this.rootMap.set('fileVersions', {})
    //   })
    // }
  }

  upsertRecord (key: string, language: string, content: string): void {
    const records = this.rootMap.get('records') as Record<string, ProjectRecord>
    records[key] ??= {}
    if (records[key][language] != null) {
      records[key][language].updatedAt = new Date().toISOString()
      records[key][language].lastEditorId = this.uid
      records[key][language].value = content
      records[key][language].state = 'review-needed'
    } else {
      records[key][language] = {
        discussions: [],
        updatedAt: new Date().toISOString(),
        lastEditorId: this.uid,
        value: content,
        state: 'review-needed'
      }
    }

    const languages = this.rootMap.get('languages') as string[]

    this.doc.transact(() => {
      if (!languages.includes(language)) {
        languages.push(language)
        this.rootMap.set('languages', languages)
      }
      this.rootMap.set('updatedAt', new Date().toISOString())
      this.rootMap.set('records', records)
    })
  }

  renameRecord (key: string, newKey: string): void {
    const records = this.rootMap.get('records') as Record<string, ProjectRecord>
    if (records[key] == null) {
      return
    }
    records[newKey] = records[key]
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete records[key]
    this.doc.transact(() => {
      this.rootMap.set('updatedAt', new Date().toISOString())
      this.rootMap.set('records', records)
    })
  }

  deleteRecord (key: string, language: string): void {
    const records = this.rootMap.get('records') as Record<string, ProjectRecord>
    if (records[key] == null) {
      return
    }
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete records[key][language]
    this.doc.transact(() => {
      this.rootMap.set('updatedAt', new Date().toISOString())
      this.rootMap.set('records', records)
    })
  }

  changeState (
    key: string,
    language: string,
    state: 'review-needed' | 'approved' | 'rejected'
  ): void {
    const records = this.rootMap.get('records') as Record<string, ProjectRecord>
    if (records[key] == null) {
      return
    }
    if (records[key][language] == null) {
      return
    }
    records[key][language].state = state
    this.doc.transact(() => {
      this.rootMap.set('updatedAt', new Date().toISOString())
      this.rootMap.set('records', records)
    })
  }

  addDiscussion (
    key: string,
    language: string,
    content: string
  ): void {
    const records = this.rootMap.get('records') as Record<string, ProjectRecord>
    if (records[key] == null) {
      return
    }
    if (records[key][language] == null) {
      return
    }
    records[key][language].discussions.push({
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorId: this.uid
    })
    this.doc.transact(() => {
      this.rootMap.set('updatedAt', new Date().toISOString())
      this.rootMap.set('records', records)
    })
  }

  destroy (): void {
    this.doc.destroy()
  }
}
