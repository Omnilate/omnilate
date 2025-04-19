import type { UserBaseResponse, UserCreateRequest } from '@omnilate/schema'
import { query } from '@solidjs/router'

import { convertDatetime } from '@/utils/convert-datetime'
import type { ConvertDatetime } from '@/utils/convert-datetime'

import { makeHttpRequest } from './http-request'
import type { GroupBaseResource } from './groups'

export type UserBaseResource = ConvertDatetime<UserBaseResponse, 'createdAt' | 'updatedAt'>

export async function createUser (req: UserCreateRequest): Promise<UserBaseResource> {
  const httpRequest = makeHttpRequest()

  const response = await httpRequest.post('users', {
    json: req
  })

  if (!response.ok) {
    throw new Error('Failed to create user')
  }

  const user = await response.json<UserBaseResponse>()
  return convertDatetime(user, ['createdAt', 'updatedAt'])
}

export const getUser = query(async (id: number): Promise<UserBaseResource> => {
  const httpRequest = makeHttpRequest()

  const response = await httpRequest.get(`users/${id}`)

  if (!response.ok) {
    throw new Error('Failed to get user')
  }

  const user = await response.json<UserBaseResponse>()
  return convertDatetime(user, ['createdAt', 'updatedAt'])
}, 'get-user-by-id')

export async function getMe (): Promise<UserBaseResource> {
  const httpRequest = makeHttpRequest()

  const response = await httpRequest.get('users/me')

  if (!response.ok) {
    throw new Error('Failed to get user')
  }

  const user = await response.json<UserBaseResponse>()
  return convertDatetime(user, ['createdAt', 'updatedAt'])
}

export async function getUserGroups (id: number): Promise<GroupBaseResource[]> {
  const httpRequest = makeHttpRequest()

  const response = await httpRequest.get(`users/${id}/groups`)

  if (!response.ok) {
    throw new Error('Failed to get user groups')
  }

  const groups = await response.json<GroupBaseResource[]>()
  return groups.map((group) => convertDatetime(group, ['createdAt', 'updatedAt']))
}
