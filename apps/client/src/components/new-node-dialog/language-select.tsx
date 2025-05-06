import type { Component } from 'solid-js'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

interface LanguageOption {
  code: string
  nativeName: string
  names: Record<string, string>
  icon: string
}

export const supportedLanguages: LanguageOption[] = [
  {
    code: 'en',
    nativeName: 'English',
    names: {
      en: 'English'
    },
    icon: '🇺🇸'
  },
  {
    code: 'zh-CN',
    nativeName: '简体中文',
    names: {
      en: 'Chinese (Simplified)'
    },
    icon: '🇨🇳'
  },
  {
    code: 'zh-TW',
    nativeName: '繁體中文',
    names: {
      en: 'Chinese (Traditional)'
    },
    icon: '🇨🇳'
  },
  {
    code: 'ja',
    nativeName: '日本語',
    names: {
      en: 'Japanese'
    },
    icon: '🇯🇵'
  },
  {
    code: 'fr',
    nativeName: 'Français',
    names: {
      en: 'French'
    },
    icon: '🇫🇷'
  },
  {
    code: 'de',
    nativeName: 'Deutsch',
    names: {
      en: 'German'
    },
    icon: '🇩🇪'
  },
  {
    code: 'es',
    nativeName: 'Español',
    names: {
      en: 'Spanish'
    },
    icon: '🇪🇸'
  },
  {
    code: 'ru',
    nativeName: 'Русский',
    names: {
      en: 'Russian'
    },
    icon: '🇷🇺'
  },
  {
    code: 'ko',
    nativeName: '한국어',
    names: {
      en: 'Korean'
    },
    icon: '🇰🇷'
  }
] as const

export type SupportedLanguageCode = typeof supportedLanguages[number]['code']

interface LanguageSelectProps {
  value: SupportedLanguageCode
  onChange: (value: SupportedLanguageCode) => void
}

const LanguageSelect: Component<LanguageSelectProps> = (props) => {
  const selectedLanguage = (): LanguageOption => {
    return supportedLanguages.find((lang) => lang.code === props.value)!
  }

  const handleSelectValueChange = (value: LanguageOption | null): void => {
    if (value == null) {
      props.onChange('en')
      return
    }

    if (value.code === props.value) {
      return
    }

    props.onChange(value.code)
  }

  return (
    <Select<LanguageOption>
      multiple={false}
      options={supportedLanguages}
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
          {
            (state) => state.selectedOption().nativeName
          }
        </SelectValue>
      </SelectTrigger>
      <SelectContent class="*:my-1" />
    </Select>
  )
}

export default LanguageSelect
