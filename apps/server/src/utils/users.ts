import type { UserResponse } from '@omnilate/schema'
import type { User } from '@prisma/client'

export function userEntityToResponse (user: User): UserResponse {
  return {
    id: user.id,
    name: user.name,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt.toUTCString(),
    updatedAt: user.updatedAt.toUTCString()
  }
}
