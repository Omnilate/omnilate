import type { AwarenessInfo } from '@omnilate/schema'
import type { Component } from 'solid-js'
import { createEffect, For, onCleanup } from 'solid-js'

import type { FileOnYjs } from '@/y/file-on-yjs'

import LanguageRecord from './language-record'

interface RecordProps {
  file?: FileOnYjs
  awareness: Record<string | number, AwarenessInfo>
  key: string
  filePath: string[]
  clientId: string | number
}

const RecordView: Component<RecordProps> = (props) => {
  createEffect(() => {
    props.file?.workOnRecord(props.key)
  })

  onCleanup(() => {
    props.file?.leaveRecord()
  })

  return (
    <div class="flex flex-col w-full p-4 shadow bg-background rounded-xl gap-4">
      {
        (props.file != null) && (
          <For each={Object.entries(props.file.fileStore.records?.[props.key].languages ?? {})}>
            {
              ([lang, record]) => (
                <LanguageRecord
                  key={props.key}
                  awareness={props.awareness}
                  clientId={props.clientId}
                  file={props.file!}
                  filePath={props.filePath}
                  lang={lang}
                  record={record}
                />
              )
            }
          </For>
        )
      }
    </div>
  )
}

export default RecordView
