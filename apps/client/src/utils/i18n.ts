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

interface NestedI18nDict {
  [key: string]: string | NestedI18nDict;
}

const flattenI18nJson = (dict: NestedI18nDict): Record<string, string> => {
  const result: Record<string, string> = {}

  for (const [key, value] of Object.entries(dict)) {
    if (typeof value === 'string') {
      result[key] = value
    } else {
      const nestedResult = flattenI18nJson(value)
      for (const [nestedKey, nestedValue] of Object.entries(nestedResult)) {
        result[`${key}.${nestedKey}`] = nestedValue
      }
    }
  }

  return result
}

export type FileType = 'i18next' | 'plainKV' | 'natural'

export const fileParsers: Record<string, (textFile: File) => Promise<Record<string, string>>> = {
  i18next: async (textFile: File) => {
    const text = await textFile.text()
    try {
      const json = JSON.parse(text) as NestedI18nDict
      return flattenI18nJson(json)
    } catch {
      throw new Error('Invalid JSON format')
    }
  },
  plainKV: async (textFile: File) => {
    const text = await textFile.text()
    const lines = text.split('\n')
    const result: Record<string, string> = {}

    for (const line of lines) {
      const [key, value] = line.split('=')
      if ((key !== '') && (value !== '')) {
        result[key.trim()] = value.trim()
      }
    }

    return result
  },
  natural: async (textFile: File) => {
    const text = await textFile.text()
    const lines = text.split('\n')
    const result: Record<string, string> = {}

    let nonEmptyLinesCnt = 0
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (line === '') {
        continue
      }
      ++nonEmptyLinesCnt

      result[`Paragraph ${nonEmptyLinesCnt}`] = line
    }

    return result
  }
}

