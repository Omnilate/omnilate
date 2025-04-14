import { createMemo, createSignal } from 'solid-js'
import * as i18n from '@solid-primitives/i18n'

import zhCNDict from '@/i18n/zh-CN.json'
import enDict from '@/i18n/en.json'

type Locale = 'en' | 'zh-CN'

const initialLocale = navigator.language.startsWith('zh') ? 'zh-CN' : 'en'
export const [locale, setLocale] = createSignal<Locale>(initialLocale)

export const useI18n = () => {
  const activeDict = createMemo(() => (
    locale() === 'zh-CN' ? zhCNDict : enDict
  ))

  const t = i18n.translator(activeDict)

  return t
}
