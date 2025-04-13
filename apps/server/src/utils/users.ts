import type { UserBaseResponse } from '@omnilate/schema'
import type { User } from '@prisma/client'

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
