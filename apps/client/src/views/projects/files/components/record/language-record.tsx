import type { LanguageRecord } from '@omnilate/schema'
import { createSignal } from 'solid-js'
import type { Component } from 'solid-js'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { supportedLanguageMap } from '@/utils/supported-languages'
import type { SupportedLanguageCode } from '@/utils/supported-languages'

interface LanguageRecordProps {
  lang: string
  record: LanguageRecord
}

const LanguageRecordItem: Component<LanguageRecordProps> = (props) => {
  const [editing, setEditing] = createSignal(false)

  return (
    <div class="flex gap-4 items-center">
      <div class="flex flex-col gap-2 items-center">
        <div class="font-600">{supportedLanguageMap[props.lang as SupportedLanguageCode].nativeName}</div>
        <Badge class="flex items-center gap-1 text-sm bg-slate-200" variant="secondary">
          <div>{supportedLanguageMap[props.lang as SupportedLanguageCode].icon}</div>
          <span>{props.lang}</span>
        </Badge>
      </div>
      <Badge>
        {props.record.state.toUpperCase()}
      </Badge>
      <div class="flex-1">{props.record.value}</div>
      <div>
        <Button>Edit</Button>
      </div>
    </div>
  )
}

export default LanguageRecordItem
