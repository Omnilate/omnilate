import type { AwarenessInfo, Discussion, I18Next, I18NextRecord } from '@omnilate/schema'
import { createStore, reconcile } from 'solid-js/store'
import type { SetStoreFunction } from 'solid-js/store'
import { WebsocketProvider } from '@omnilate/y-websocket'
import * as Y from 'yjs'

import { getUserColor } from '@/utils/user-color'

export class YDocI18NextBinding {
  readonly doc: Y.Doc
  readonly provider: WebsocketProvider
  readonly awareness
  readonly awarenessMap: Record<number, AwarenessInfo>
  readonly content: Record<string, I18NextRecord>
  private readonly setContent: SetStoreFunction<Record<string, I18NextRecord>>
  private recordsYMap?: Y.Map<I18Next>

  constructor (readonly url: string, readonly projectId: number, private readonly uid: number) {
    this.doc = new Y.Doc()
    this.provider = new WebsocketProvider(this.url, `i18next-${this.projectId}`, this.doc)

    this.provider.on('status', (event) => {
      if (event.status === 'connected') {
        console.log('Connected to Yjs server')
      } else {
        console.log('Disconnected from Yjs server')
      }
    })

    const [content, setContent] = createStore<Record<string, I18NextRecord>>({})
    // eslint-disable-next-line solid/reactivity
    this.content = content
    this.setContent = setContent

    this.doc.on('update', () => {
      const recordsYMap = this.doc.getMap<I18Next>('records')
      this.recordsYMap ??= recordsYMap
      this.setContent(reconcile(recordsYMap.toJSON(), { key: `i18next-${this.projectId}-records` }))
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
    this.awareness.on('change', () => {
      const m = this.awareness.getStates() as Map<number, AwarenessInfo>
      setAwarenessMap(reconcile(Object.fromEntries(m.entries())))
    })
  }

  addRecord (key: string, lang: string, value: string): void {
    this.doc.transact(() => {
      if (this.recordsYMap == null) {
        return
      }

      let record: I18Next
      if (this.recordsYMap.has(key)) {
        record = this.recordsYMap.get(key)!
      } else {
        record = new I18Next()
        this.recordsYMap.set(key, record)
      }

      if (record.has(lang)) {
        const langRecord = record.get(lang)!
        langRecord.set('value', value)
        langRecord.set('updatedAt', new Date().toISOString())
        langRecord.set('lastEditorId', this.uid)
      }
      this.recordsYMap.set(key, record)
    })
  }

  updateRecord (key: string, lang: string, value: string): void {
    this.doc.transact(() => {
      if (this.recordsYMap == null) {
        return
      }

      const record = this.recordsYMap.get(key)!

      const langRecord = record.get(lang)
      if (langRecord == null) {
        return
      }

      langRecord.set('value', value)
      langRecord.set('updatedAt', new Date().toISOString())
      langRecord.set('lastEditorId', this.uid)
    })
  }

  renameRecord (key: string, newKey: string): void {
    this.doc.transact(() => {
      if (this.recordsYMap == null) {
        return
      }

      const record = this.recordsYMap.get(key)!
      this.recordsYMap.set(newKey, record)
      this.recordsYMap.delete(key)
    })
  }

  deleteRecord (key: string, lang: string): void {
    this.doc.transact(() => {
      if (this.recordsYMap == null) {
        return
      }

      const record = this.recordsYMap.get(key)!
      record.delete(lang)
    })
  }

  addDiscussion (key: string, lang: string, content: string): void {
    this.doc.transact(() => {
      if (this.recordsYMap == null) {
        return
      }

      const record = this.recordsYMap.get(key)!
      const langRecord = record.get(lang)!
      const discussions = langRecord.get.discussions() as Y.Array<Discussion>
      discussions.push([
        {
          content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          authorId: this.uid
        }
      ])
    })
  }

  destroy (): void {
    this.provider.disconnect()
    this.provider.destroy()
  }
}
