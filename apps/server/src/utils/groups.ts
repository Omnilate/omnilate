import type { GroupBaseResponse } from '@omnilate/schema'
import type { Group } from '@prisma/client'

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
