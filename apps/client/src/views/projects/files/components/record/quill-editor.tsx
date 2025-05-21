import type { AwarenessInfo } from '@omnilate/schema'
import Quill from 'quill'
import QuillCursors from 'quill-cursors'
import type IQuillRange from 'quill-cursors/dist/quill-cursors/i-range'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.bubble.css'
import type { Component } from 'solid-js'
import { createEffect, createMemo, createSignal, on, onCleanup, onMount } from 'solid-js'
import { unwrap } from 'solid-js/store'
import { QuillBinding } from 'y-quill'
import type * as Y from 'yjs'

import type { UserBaseResource } from '@/apis/user'
import { getUser } from '@/apis/user'
import type { FileOnYjs } from '@/y/file-on-yjs'

Quill.register('modules/cursors', QuillCursors)

interface QuillEditorProps {
  file?: FileOnYjs
  text?: Y.Text
  awarenessMap: Record<string | number, AwarenessInfo>
  onLocalCursorChange: (range?: { index: number, length: number }) => void
  localClientId: string | number
  key: string
  language: string
  filePath: string[]
}

const [uidUserMap, setUidUserMap] = createSignal<Record<number, UserBaseResource>>({})

const QuillEditor: Component<QuillEditorProps> = (props) => {
  const [quillEl, setQuillEl] = createSignal<HTMLDivElement | null>(null)
  const [binding, setBinding] = createSignal<QuillBinding>()
  let quill: Quill
  let cursors: QuillCursors

  createEffect(() => {
    props.file?.workOnLanguage(props.language)
  })

  onCleanup(() => { props.file?.leaveLanguage() })

  onMount(() => {
    quill = new Quill(quillEl()!, {
      theme: 'bubble',
      modules: {
        cursors: true
      }
    })

    cursors = quill.getModule('cursors') as QuillCursors

    quill.on('selection-change', (range, _oldRange, source) => {
      if (source === 'user') {
        props.onLocalCursorChange(range)
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
        // eslint-disable-next-line eqeqeq
        id != props.localClientId &&
        info.active &&
        info.workingOn != null &&
        info.workingOn.filePath.every((node, index) => props.filePath[index] === node) &&
        info.workingOn.key === props.key &&
        info.workingOn.language === props.language
      ) {
        const _manualDep = info.workingOn.cursor?.index
        legal[id] = unwrap(info)
      }
    }
    console.log('legalClients', legal)
    return legal
  })

  createEffect(
    on(
      legalClients,
      (clientList) => {
        if (cursors == null) {
          return
        }

        const cursorList = cursors.cursors()
        const cursorIds = cursorList.map((cursor) => cursor.id)
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

          if (!Object.keys(uidUserMap()).includes(info.uid.toString())) {
            getUser(info.uid)
              .then((user) => {
                setUidUserMap((prev) => ({
                  ...prev,
                  [info.uid]: user
                }))
                cursors.removeCursor(clientId)
                cursors.createCursor(clientId, user.name, info.color)
                if (info.active && info.workingOn.cursor != null) {
                  cursors.moveCursor(clientId, info.workingOn.cursor as IQuillRange)
                }
              })
              .catch((_err) => {})
          }

          cursors.createCursor(clientId, uidUserMap()[info.uid]?.name ?? info.uid.toString(), info.color)
          if (info.active) {
            if (info.workingOn.cursor != null) {
              cursors.toggleFlag(clientId, true)
              cursors.moveCursor(clientId, info.workingOn.cursor as IQuillRange)
            } else {
              cursors.toggleFlag(clientId, false)
            }
          }
        }
      }
    )
  )

  return (
    <div class="rounded-xl b-(border solid) w-full">
      <div ref={setQuillEl} style={{ overflow: 'visible' }} />
    </div>
  )
}

export default QuillEditor
