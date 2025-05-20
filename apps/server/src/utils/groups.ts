import type { GroupBaseResponse, GroupRoleResponse } from '@omnilate/schema'
import type { Group, GroupMembers } from '@prisma/client'

export function toBaseResponse (group: Group): GroupBaseResponse {
  return {
    id: group.id,
    name: group.name,
    description: group.description,
    userCount: group.userCount,
    projectCount: group.projectCount,
    createdAt: group.createdAt.toISOString(),
    updatedAt: group.updatedAt.toISOString()
  }
}

export interface GroupWithRole extends Group {
  users: GroupMembers[]
}

export function toRoleResponse (group: GroupWithRole): GroupRoleResponse {
  return {
    id: group.id,
    name: group.name,
    description: group.description,
    userCount: group.userCount,
    projectCount: group.projectCount,
    createdAt: group.createdAt.toISOString(),
    updatedAt: group.updatedAt.toISOString(),
    role: group.users[0]?.role
  }
}
