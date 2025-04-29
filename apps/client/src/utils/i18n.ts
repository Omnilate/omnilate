import { createMemo, createSignal } from 'solid-js'
import * as i18n from '@solid-primitives/i18n'

import zhCNDict from '@/i18n/zh-CN.json'
import enDict from '@/i18n/en.json'

type Locale = 'en' | 'zh-CN'

const initialLocale = navigator.language.startsWith('zh') ? 'zh-CN' : 'en'
export const [locale, setLocale] = createSignal<Locale>(initialLocale)
const activeDict = createMemo(() => (
  locale() === 'zh-CN' ? zhCNDict : enDict
))

export const useI18n = () => {
  const flatDict = createMemo(() => (i18n.flatten(activeDict())))

  const t = i18n.translator(flatDict, i18n.resolveTemplate)

  return i18n.chainedTranslator(activeDict(), t)
}
