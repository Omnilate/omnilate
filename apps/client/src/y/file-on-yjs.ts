import type {
  AwarenessInfo,
  Discussion, LanguageMetaY, LanguageRecordState,
  LanguageRecordY, ProjectFile, ProjectFileY, ProjectRecordY
} from '@omnilate/schema'
import type { SetStoreFunction } from 'solid-js/store'
import { createStore, reconcile } from 'solid-js/store'
import * as Y from 'yjs'

import type { ProjectOnYjs } from './project-on-yjs'

export class FileOnYjs {
  readonly fileStore: ProjectFile
  private readonly setFileStore: SetStoreFunction<ProjectFile>
  readonly rawRecords: Y.Map<ProjectRecordY>

  constructor (
    readonly doc: Y.Doc,
    readonly fileMap: ProjectFileY,
    private readonly uid: number,
    readonly awareness: ProjectOnYjs['awareness']
  ) {
    this.rawRecords = this.fileMap.get('records') as Y.Map<ProjectRecordY>

    const [fileStore, setFileStore] = createStore<ProjectFile>(
      this.fileMap.toJSON() as ProjectFile
    )
    // eslint-disable-next-line solid/reactivity
    this.fileStore = fileStore
    this.setFileStore = setFileStore

    const handleUpdate = (): void => {
      const update = this.fileMap.toJSON() as ProjectFile
      this.setFileStore(reconcile(update, { key: `file-${this.fileMap.get('createdAt') as string}` }))
    }
    handleUpdate()
    this.fileMap.observeDeep(handleUpdate)
  }

  public workOnRecord (key: string): void {
    const currentAwareness = this.awareness.getLocalState() as AwarenessInfo
    if (!currentAwareness.active) {
      return
    }

    this.awareness.setLocalStateField('active', true)
    this.awareness.setLocalStateField('workingOn', {
      ...currentAwareness.workingOn,
      key,
      cursor: undefined
    })
  }

  public leaveRecord (): void {
    const currentAwareness = this.awareness.getLocalState() as AwarenessInfo
    if (!currentAwareness.active) {
      return
    }

    this.awareness.setLocalStateField('active', true)
    this.awareness.setLocalStateField('workingOn', {
      ...currentAwareness.workingOn,
      key: '',
      language: '',
      cursor: undefined
    })
  }

  public workOnLanguage (language: string): void {
    const currentAwareness = this.awareness.getLocalState() as AwarenessInfo
    if (!currentAwareness.active) {
      return
    }

    this.awareness.setLocalStateField('active', true)
    this.awareness.setLocalStateField('workingOn', {
      ...currentAwareness.workingOn,
      language,
      cursor: undefined
    })
  }

  public leaveLanguage (): void {
    const currentAwareness = this.awareness.getLocalState() as AwarenessInfo
    if (!currentAwareness.active) {
      return
    }

    this.awareness.setLocalStateField('active', true)
    this.awareness.setLocalStateField('workingOn', {
      ...currentAwareness.workingOn,
      language: '',
      cursor: undefined
    })
  }

  public moveCursor (
    filePath: string[],
    key: string,
    language: string,
    range?: { index: number, length: number }
  ): void {
    const currentAwareness = this.awareness.getLocalState() as AwarenessInfo
    if (!currentAwareness.active) {
      return
    }
    this.awareness.setLocalState({
      ...currentAwareness,
      active: true,
      workingOn: {
        ...currentAwareness.workingOn,
        filePath,
        key,
        language,
        cursor: range
      }
    } satisfies AwarenessInfo)
  }

  // #region Key

  public createEmptyKey (key: string): void {
    this.doc.transact(() => {
      let keyRecord = this.rawRecords.get(key)
      if (keyRecord == null) {
        keyRecord = new Y.Map() as ProjectRecordY
        keyRecord.set('languages', new Y.Map<LanguageRecordY>())
        keyRecord.set('updatedAt', new Date().toISOString())
        this.rawRecords.set(key, keyRecord)
      }
    })
  }

  public getRawKey (key: string): ProjectRecordY {
    const keyData = this.rawRecords.get(key)

    if (keyData == null) {
      throw new Error(`Key ${key} not found`)
    }

    return keyData
  }

  public renameKey (oldKey: string, newKey: string): void {
    const oldKeyData = this.getRawKey(oldKey)
    this.doc.transact(() => {
      this.rawRecords.set(newKey, oldKeyData)
      this.rawRecords.delete(oldKey)
    })
  }

  // #endregion Key

  public getLangRecord (key: string, language: string): LanguageRecordY {
    const keyData = this.rawRecords.get(key)
    if (keyData == null) {
      throw new Error(`Key ${key} not found`)
    }

    const langRecords = keyData.get('languages') as Y.Map<LanguageRecordY>
    const langRecord = langRecords.get(language)
    if (langRecord == null) {
      throw new Error(`Language ${language} not found`)
    }

    return langRecord
  }

  private introduceNewLanguage (language: string, source: boolean = false): void {
    const languages = this.fileMap.get('languages') as Y.Map<LanguageMetaY>
    if (languages.get(language) == null) {
      this.doc.transact(() => {
        const langMeta: LanguageMetaY = new Y.Map()
        langMeta.set('source', source)
        langMeta.set('recordsWIPCount', 0)
        langMeta.set('recordsNeedReviewCount', 0)
        langMeta.set('recordsApprovedCount', 0)
        langMeta.set('recordsRejectedCount', 0)
        languages.set(language, langMeta)
      })
    }
  }

  private changeRecordCounts (
    language: string,
    { type, value, increment = 0, decrement = 0 }: {
      type: LanguageRecordState
      value?: number
      increment?: number
      decrement?: number
    }
  ): void {
    const langMeta = this.fileMap.get('languages') as Y.Map<LanguageMetaY>
    const langMetaData = langMeta.get(language)!

    const key = type === 'wip'
      ? 'recordsWIPCount'
      : type === 'review-needed'
        ? 'recordsNeedReviewCount'
        : type === 'approved'
          ? 'recordsApprovedCount'
          : 'recordsRejectedCount'

    if (value != null) {
      langMetaData.set(key, value + increment - decrement)
    } else {
      this.doc.transact(() => {
        const currentCount = langMetaData.get(key) as number
        langMetaData.set(key, currentCount + increment - decrement)
      })
    }
  }

  private addContributor (key: string, language: string): void {
    const keyData = this.rawRecords.get(key)
    if (keyData == null) {
      throw new Error(`Key ${key} not found`)
    }

    const langRecord = this.getLangRecord(key, language)

    const contributorIds = langRecord.get('contributorIds') as number[]
    if (!contributorIds.includes(this.uid)) {
      this.doc.transact(() => {
        contributorIds.push(this.uid)
        langRecord.set('contributorIds', contributorIds)
      })
    }
  }

  public createEmptyLangRecord (key: string, language: string, source: boolean): void {
    const keyData = this.rawRecords.get(key)
    if (keyData == null) {
      throw new Error(`Key ${key} not found`)
    }

    const langRecords = keyData.get('languages') as Y.Map<LanguageRecordY>
    if (langRecords.get(language) == null) {
      this.doc.transact(() => {
        this.introduceNewLanguage(language, source)

        const newRecord: LanguageRecordY = new Y.Map()
        newRecord.set('discussions', new Y.Array<Discussion>())
        newRecord.set('updatedAt', new Date().toISOString())
        newRecord.set('lastEditorId', this.uid)
        newRecord.set('state', source ? 'source' : 'wip')

        const langMeta = this.fileMap.get('languages') as Y.Map<LanguageMetaY>
        const langMetaData = langMeta.get(language)!
        const currentCount = langMetaData.get('recordsWIPCount') as number
        langMetaData.set('recordsWIPCount', currentCount + 1)

        this.fileMap.set('updatedAt', new Date().toISOString())
        keyData.set('languages', langRecords)
        keyData.set('updatedAt', new Date().toISOString())
      })
    }
  }

  public changeRecordState (key: string, lang: string, state: LanguageRecordState): void {
    const langRecord = this.getLangRecord(key, lang)

    this.doc.transact(() => {
      const currentState = langRecord.get('state') as LanguageRecordState
      if (currentState !== state) {
        this.changeRecordCounts(lang, { type: currentState, decrement: 1 })
        this.changeRecordCounts(lang, { type: state, increment: 1 })

        langRecord.set('state', state)
        langRecord.set('updatedAt', new Date().toISOString())
        langRecord.set('lastEditorId', this.uid)
        this.addContributor(key, lang)
      }
    })
  }

  public addDiscussion (key: string, lang: string, content: string): void {
    const langRecord = this.getLangRecord(key, lang)

    this.doc.transact(() => {
      const discussions = langRecord.get('discussions') as Y.Array<Discussion>
      const newDiscussion: Discussion = {
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        authorId: this.uid
      }
      discussions.push([newDiscussion])
      langRecord.set('updatedAt', new Date().toISOString())
    })
  }

  public getLangRecordYText (key: string, language: string): Y.Text {
    const keyData = this.rawRecords.get(key)
    if (keyData == null) {
      throw new Error(`Key ${key} not found`)
    }

    const langRecords = keyData.get('languages') as Y.Map<LanguageRecordY>
    const langRecord = langRecords.get(language)
    if (langRecord == null) {
      throw new Error(`Language ${language} not found`)
    }

    return langRecord.get('value') as Y.Text
  }

  public get sourceLanguage (): string {
    return this.fileMap.get('sourceLanguage') as string
  }

  public destroy (): void {
    this.doc.destroy()
  }
}
