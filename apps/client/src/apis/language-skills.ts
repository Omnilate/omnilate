import type { LanguageSkillCreateRequest, LanguageSkillResponse } from '@omnilate/schema'

import { convertDatetime } from '@/utils/convert-datetime'
import type { ConvertDatetime } from '@/utils/convert-datetime'
import type { SupportedLanguageCode } from '@/utils/supported-languages'

import { makeHttpRequest } from './http-request'

export type LanguageSkillResource = ConvertDatetime<LanguageSkillResponse, 'updatedAt'>

export const putLanguageSkill = async (payload: LanguageSkillCreateRequest): Promise<void> => {
  const httpRequest = makeHttpRequest()

  const response = await httpRequest.put('users/me/language-skills', {
    json: payload
  })

  if (!response.ok) {
    throw new Error('Failed to create language skill')
  }
}

export const getLanguageSkills = async (uid: number): Promise<LanguageSkillResource[]> => {
  const httpRequest = makeHttpRequest()

  const response = await httpRequest.get(`users/${uid}/language-skills`)

  if (!response.ok) {
    throw new Error('Failed to get language skills')
  }

  const data = await response.json<LanguageSkillResource[]>()
  return data.map((lang) => convertDatetime(lang, ['updatedAt']))
}

export const deleteLanguageSkill = async (lang: SupportedLanguageCode): Promise<void> => {
  const httpRequest = makeHttpRequest()

  const response = await httpRequest.delete(`users/me/language-skills/${lang}`)

  if (!response.ok) {
    throw new Error('Failed to delete language skill')
  }
}
