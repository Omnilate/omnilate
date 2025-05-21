export const supportedLanguages = [
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
]

export interface LanguageOption {
  code: string
  nativeName: string
  names: Record<string, string>
  icon: string
}

export const supportedLanguageMap = supportedLanguages.reduce<Record<SupportedLanguageCode, typeof supportedLanguages[number]>>((acc, lang) => {
  acc[lang.code] = lang
  return acc
}, {})
export const supportedLanguageCodeList = supportedLanguages.map((lang) => lang.code)

export type SupportedLanguageCode = typeof supportedLanguages[number]['code']
