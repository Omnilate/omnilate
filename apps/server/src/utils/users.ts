import type { UserBaseResponse, UserGroupResponse } from '@omnilate/schema'
import type { GroupMembers, User } from '@prisma/client'

export function toBaseResponse (user: User): UserBaseResponse {
  return {
    id: user.id,
    name: user.name,
    avatarUrl: user.avatarUrl,
    description: user.description,
    createdAt: user.createdAt.toUTCString(),
    updatedAt: user.updatedAt.toUTCString()
  }
}

export interface UserWithGroups extends User {
  groups: GroupMembers[]
}

export function toGroupResponse (user: UserWithGroups): UserGroupResponse {
  return {
    id: user.id,
    name: user.name,
    avatarUrl: user.avatarUrl,
    description: user.description,
    role: user.groups[0].role,
    joinedAt: user.groups[0].createdAt.toUTCString(),

    createdAt: user.createdAt.toUTCString(),
    updatedAt: user.updatedAt.toUTCString()
  }
}
