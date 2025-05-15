import type { AwarenessInfo } from '@omnilate/schema'
import type { Component } from 'solid-js'
import { createSignal, For, onCleanup, Show } from 'solid-js'

import type { FileOnYjs } from '@/y/file-on-yjs'
import { Button } from '@/components/ui/button'
import { supportedLanguageMap } from '@/utils/supported-languages'
import type { SupportedLanguageCode } from '@/utils/supported-languages'
import { Badge } from '@/components/ui/badge'

interface RecordProps {
  file?: FileOnYjs
  awareness: Record<string | number, AwarenessInfo>
  key: string
}

const RecordView: Component<RecordProps> = (props) => {
  onCleanup(() => {
    props.file?.leaveRecord()
  })

  const handleCursorChange = (index: number, length: number): void => {
    props.file?.moveCursor(index, length)
  }

  // const text = createMemo(() => {
  //   const record = props.file?.rawRecords.get(props.key)
  //   if (record == null) {
  //     return
  //   }

  //   const languages = record.get('languages') as Y.Map<LanguageRecordY>
  //   const lang = languages.get(currLang)
  //   if (lang == null) {
  //     throw new Error(`Language ${currLang} not found`)
  //   }
  //   return lang.get('value') as Y.Text
  // })

  return (
    <div class="flex flex-col w-full p-4 shadow bg-background rounded-xl">
      <For each={Object.entries(props.file?.fileStore?.records?.[props.key]?.languages ?? {})}>
        {

        }
      </For>
    </div>
  )
}

export default RecordView
