import type { Component } from 'solid-js'
import { createMemo, For } from 'solid-js'

import type { SupportedLanguageCode } from '@/utils/supported-languages'
import { supportedLanguages } from '@/utils/supported-languages'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface LanguageProgressItemType {
  language: SupportedLanguageCode
  state: 'source' | 'target'
  progress: number
}

interface LanguageProgressProps {
  languages: LanguageProgressItemType[]
  class?: string
}

const stateMap = {
  source: 'Source',
  target: 'Target'
} as const

const LanguageProgressItem: Component<LanguageProgressItemType> = (props) => {
  const language = createMemo(() => {
    return supportedLanguages.find((lang) => lang.code === props.language)!
  })

  return (
    <tr>
      <td class="whitespace-nowrap px-1">{language().icon}</td>
      <td class="whitespace-nowrap px-1">{language().nativeName}</td>
      <td class="whitespace-nowrap px-1"><Badge class="w-full">{stateMap[props.state]}</Badge></td>
      <td class="whitespace-nowrap px-1 w-full"><Progress value={props.progress} /></td>
      <td class="whitespace-nowrap px-1 text-center">{`${props.progress.toFixed(1)}%`}</td>
    </tr>
  )
}

const LanguageProgress: Component<LanguageProgressProps> = (props) => {
  return (
    <table class={props.class}>
      <tbody>
        <For each={props.languages}>
          {LanguageProgressItem}
        </For>
      </tbody>
    </table>
  )
}

export default LanguageProgress
