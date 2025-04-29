import type { GroupBaseResponse, GroupCreateRequest } from '@omnilate/schema'
import { query } from '@solidjs/router'

import { convertDatetime } from '@/utils/convert-datetime'
import type { ConvertDatetime } from '@/utils/convert-datetime'

import { makeHttpRequest } from './http-request'
import type { UserGroupResource } from './user'

export type GroupBaseResource = ConvertDatetime<GroupBaseResponse, 'createdAt' | 'updatedAt'>

export async function searchGroups (keyword: string): Promise<GroupBaseResource[]> {
  const httpRequest = makeHttpRequest()

  const response = await httpRequest.get('groups', {
    searchParams: {
      keyword
    }
  })

  if (!response.ok) {
    throw new Error('Failed to get groups')
  }

  const groups = await response.json<GroupBaseResponse[]>()
  return groups.map((group) => convertDatetime(group, ['createdAt', 'updatedAt']))
}

export async function createGroup (name: string, desc: string): Promise<GroupBaseResource> {
  const httpRequest = makeHttpRequest()

  const response = await httpRequest.post('groups', {
    json: {
      name,
      description: desc
    } satisfies GroupCreateRequest
  })

  if (!response.ok) {
    throw new Error('Failed to create group')
  }

  const group = await response.json<GroupBaseResponse>()
  return convertDatetime(group, ['createdAt', 'updatedAt'])
}

export const getGroup = query(async (id: number): Promise<GroupBaseResource> => {
  const httpRequest = makeHttpRequest()

  const response = await httpRequest.get(`groups/${id}`)

  if (!response.ok) {
    throw new Error('Failed to get group')
  }

  const group = await response.json<GroupBaseResponse>()
  return convertDatetime(group, ['createdAt', 'updatedAt'])
}, 'get-group-base-by-id')

export const getGroupMembers = query(async (id: number): Promise<UserGroupResource[]> => {
  const httpRequest = makeHttpRequest()

  const response = await httpRequest.get(`groups/${id}/members`)

  if (!response.ok) {
    throw new Error('Failed to get group members')
  }

  const members = await response.json<UserGroupResource[]>()
  return members.map((member) => convertDatetime(member, ['createdAt', 'updatedAt', 'joinedAt']))
}, 'get-group-members')

export const getGroupMember = query(async (gid: number, uid: number): Promise<UserGroupResource> => {
  const httpRequest = makeHttpRequest()

  const response = await httpRequest.get(`groups/${gid}/members/${uid}`)

  if (!response.ok) {
    throw new Error('Failed to get group member')
  }

  const member = await response.json<UserGroupResource>()
  return convertDatetime(member, ['createdAt', 'updatedAt', 'joinedAt'])
}, 'get-group-member')
