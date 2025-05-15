import type { AwarenessInfo } from '@omnilate/schema'
import Quill from 'quill'
import QuillCursors from 'quill-cursors'
import type IQuillRange from 'quill-cursors/dist/quill-cursors/i-range'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import type { Component } from 'solid-js'
import { createEffect, createMemo, createSignal, on, onMount } from 'solid-js'
import { createStore } from 'solid-js/store'
import { QuillBinding } from 'y-quill'
import type * as Y from 'yjs'

import type { UserBaseResource } from '@/apis/user'
import { getUser } from '@/apis/user'

Quill.register('modules/cursors', QuillCursors)

interface QuillEditorProps {
  text?: Y.Text
  awarenessMap: Record<string | number, AwarenessInfo>
  onLocalCursorChange: (index: number, length: number) => void
  localClientId: string | number
  key: string
  language: string
  filePath: string
}

const [uidUserMap, setUidUserMap] = createStore<Record<number, UserBaseResource>>({})

const QuillEditor: Component<QuillEditorProps> = (props) => {
  const [quillEl, setQuillEl] = createSignal<HTMLDivElement | null>(null)
  const [binding, setBinding] = createSignal<QuillBinding>()
  let quill: Quill
  let cursors: QuillCursors

  onMount(() => {
    quill = new Quill(quillEl()!, {
      theme: 'snow',
      modules: {
        cursors: true
      }
    })

    cursors = quill.getModule('cursors') as QuillCursors

    quill.on('selection-change', (range, _oldRange, source) => {
      console.log('Selection changed', range, source)
      if (source === 'user') {
        props.onLocalCursorChange(range.index, range.length)
      }
    })
  })

  createEffect(() => {
    if (props.text != null && binding() == null) {
      setBinding(new QuillBinding(props.text, quill))
    }
  })

  const legalClients = createMemo(() => {
    const legal: Record<number | string, AwarenessInfo> = {}
    for (const [id, info] of Object.entries(props.awarenessMap)) {
      if (
        info.active &&
        info.workingOn.filePath.every((node, index) => props.filePath[index] === node) &&
        info.workingOn.key === props.key &&
        info.workingOn.language === props.language
      ) {
        legal[id] = info
      }
    }
    return legal
  })

  createEffect(
    on(
      legalClients,
      (clientList) => {
        if (cursors == null) {
          return
        }

        const cursorMap = cursors.cursors()
        const cursorIds = cursorMap.map((cursor) => cursor.id)
        const onlineClientIds = Object.keys(clientList)

        for (const cursorId of cursorIds) {
          if (!onlineClientIds.includes(cursorId)) {
            cursors.removeCursor(cursorId)
          }
        }

        for (const [clientId, info] of Object.entries(clientList)) {
        // eslint-disable-next-line eqeqeq
          if (clientId == props.localClientId) {
            continue
          }

          if (!Object.keys(uidUserMap).includes(info.uid.toString())) {
            getUser(info.uid)
              .then((user) => {
                setUidUserMap((prev) => ({
                  ...prev,
                  [info.uid]: user
                }))
              })
              .catch((_err) => {})
          }

          cursors.createCursor(clientId, uidUserMap[info.uid]?.name ?? info.uid.toString(), info.color)
          if (info.active) {
            cursors.moveCursor(clientId, info.workingOn.cursor as IQuillRange)
          }
        }
      }
    )
  )

  return (
    <div>
      <div ref={setQuillEl} />
    </div>
  )
}

export default QuillEditor
