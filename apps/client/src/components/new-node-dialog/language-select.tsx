import { createMemo } from 'solid-js'
import type { Component } from 'solid-js'

import { supportedLanguages } from '@/utils/supported-languages'
import type { LanguageOption, SupportedLanguageCode } from '@/utils/supported-languages'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

interface LanguageSelectProps {
  languages?: SupportedLanguageCode[]
  value?: SupportedLanguageCode
  onChange: (value: SupportedLanguageCode) => void
}

const LanguageSelect: Component<LanguageSelectProps> = (props) => {
  const selectedLanguage = (): LanguageOption => {
    return supportedLanguages.find((lang) => lang.code === props.value)!
  }

  const shownLanguages = createMemo(() => {
    if (props.languages == null) {
      return supportedLanguages
    }

    return supportedLanguages.filter((lang) => (props.languages ?? []).includes(lang.code))
  })

  const handleSelectValueChange = (value: LanguageOption | null): void => {
    if (value == null) {
      props.onChange('en')
      return
    }

    props.onChange(value.code)
  }

  return (
    <Select<LanguageOption>
      multiple={false}
      optionValue="code"
      options={shownLanguages()}
      value={selectedLanguage()}
      itemComponent={(props) => (
        <SelectItem item={props.item}>
          <div class="inline-flex items-center gap-2">
            <span>{props.item.rawValue.icon}</span>
            <span class="inline-flex flex-col gap-1">
              <span>{props.item.rawValue.nativeName}</span>
              <span class="text-(xs gray-500)">{props.item.rawValue.names.en}</span>
            </span>
          </div>
        </SelectItem>
      )}
      onChange={handleSelectValueChange}
    >
      <SelectTrigger>
        <SelectValue<LanguageOption> class="flex flex-1 justify-between">
          { (state) => state.selectedOption()?.nativeName ?? '' }
        </SelectValue>
      </SelectTrigger>
      <SelectContent class="*:my-1 max-h-xs overflow-y-auto hide-scrollbar" />
    </Select>
  )
}

export default LanguageSelect
