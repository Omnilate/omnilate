import type { GroupBaseResponse, GroupCreateRequest, GroupInvitationCreateRequest, GroupJoinRequestReviewRequest, GroupRole, GroupRoleResponse, GroupUpdateRequest } from '@omnilate/schema'
import { query } from '@solidjs/router'

import { convertDatetime } from '@/utils/convert-datetime'
import type { ConvertDatetime } from '@/utils/convert-datetime'

import { makeHttpRequest } from './http-request'
import type { UserGroupResource } from './user'

export type GroupBaseResource = ConvertDatetime<GroupBaseResponse, 'createdAt' | 'updatedAt'>
export type GroupRoleResource = ConvertDatetime<GroupRoleResponse, 'createdAt' | 'updatedAt'>

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

export async function updateGroup (
  gid: number,
  { description, name } : GroupUpdateRequest
): Promise<void> {
  const httpRequest = makeHttpRequest()

  await httpRequest.patch(`groups/${gid}`, {
    json: {
      name,
      description
    } satisfies GroupUpdateRequest
  })
}

export const getGroup = query(async (id: number): Promise<GroupRoleResource> => {
  const httpRequest = makeHttpRequest()

  const response = await httpRequest.get(`groups/${id}`)

  if (!response.ok) {
    throw new Error('Failed to get group')
  }

  const group = await response.json<GroupRoleResponse>()
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

export const updateMemberRole = async (gid: number, uid: number, role: GroupRole): Promise<UserGroupResource[]> => {
  const httpRequest = makeHttpRequest()

  const response = await httpRequest.put(`groups/${gid}/members/${uid}/role`, {
    json: {
      role
    }
  })

  if (!response.ok) {
    throw new Error('Failed to update group member role')
  }

  const members = await response.json<UserGroupResource[]>()
  return members.map((member) => convertDatetime(member, ['createdAt', 'updatedAt', 'joinedAt']))
}

export const deleteMember = async (gid: number, uid: number): Promise<UserGroupResource[]> => {
  const httpRequest = makeHttpRequest()

  const response = await httpRequest.delete(`groups/${gid}/members/${uid}`)

  if (!response.ok) {
    throw new Error('Failed to delete group member')
  }

  const members = await response.json<UserGroupResource[]>()
  return members.map((member) => convertDatetime(member, ['createdAt', 'updatedAt', 'joinedAt']))
}

export const inviteUser = async (gid: number, uid: number): Promise<void> => {
  const httpRequest = makeHttpRequest()

  await httpRequest.post(
    `groups/${gid}/invitations`,
    {
      json: {
        userId: uid
      } satisfies GroupInvitationCreateRequest
    }
  )
}

export const reviewInvitation = async (
  { gid, inviterId, inviteeId, status }: {
    gid: number
    inviterId: number
    inviteeId: number
    status: 'ACCEPTED' | 'REJECTED'
  }
): Promise<void> => {
  const httpRequest = makeHttpRequest()

  await httpRequest.patch(
    `groups/${gid}/invitations/${inviterId}/to/${inviteeId}`,
    {
      json: {
        status
      } satisfies GroupJoinRequestReviewRequest
    }
  )
}

export const getInvitationStatus = async (
  { gid, inviterId, inviteeId }: {
    gid: number
    inviterId: number
    inviteeId: number
  }
): Promise<'ACCEPTED' | 'REJECTED' | 'PENDING'> => {
  const httpRequest = makeHttpRequest()

  const response = await httpRequest.get(
    `groups/${gid}/invitations/${inviterId}/to/${inviteeId}/status`
  )
  if (!response.ok) {
    throw new Error('Failed to get invitation status')
  }
  const data = await response.text() as 'ACCEPTED' | 'REJECTED' | 'PENDING'
  return data
}

export const requestJoinGroup = async (gid: number): Promise<void> => {
  const httpRequest = makeHttpRequest()

  await httpRequest.post(
    `groups/${gid}/join-requests`
  )
}

export const reviewJoinRequest = async (
  { gid, uid, status }: {
    gid: number
    uid: number
    status: 'ACCEPTED' | 'REJECTED'
  }
): Promise<void> => {
  const httpRequest = makeHttpRequest()

  await httpRequest.patch(
    `groups/${gid}/join-requests/${uid}`,
    {
      json: {
        status
      } satisfies GroupJoinRequestReviewRequest
    }
  )
}

export const getInvitedUsers = query(async (gid: number): Promise<UserGroupResource[]> => {
  const httpRequest = makeHttpRequest()

  const response = await httpRequest.get(`groups/${gid}/invited-users`)

  if (!response.ok) {
    throw new Error('Failed to get invited users')
  }

  const users = await response.json<UserGroupResource[]>()
  return users.map((user) => convertDatetime(user, ['createdAt', 'updatedAt', 'joinedAt']))
}, 'invited-users')
