import { createParamDecorator, HttpException, HttpStatus } from '@nestjs/common'
import type { ExecutionContext } from '@nestjs/common'
import type { Request } from 'express'

export const BigIntParam = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest()
    const param = request.params[data]

    try {
      return BigInt(param)
    } catch {
      throw new HttpException(`Invalid BigInt parameter: ${data} = ${param}`, HttpStatus.BAD_REQUEST)
    }
  }
)
