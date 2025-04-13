import { createParamDecorator } from '@nestjs/common'
import type { ExecutionContext } from '@nestjs/common'
import type { Request } from 'express'

export const CurrentUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest()
    const userObj = request.user as { id: number } | undefined
    if (userObj == null) {
      throw new Error('User not found in request')
    }
    return userObj.id
  }
)
