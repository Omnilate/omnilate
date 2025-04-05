import { Controller, Post, UseGuards, Req } from '@nestjs/common'
import { AccessTokenResponse, LoginRequest } from '@omnilate/schema'
import { ApiBody } from '@nestjs/swagger'
import { Request } from 'express'
import { User } from '@prisma/client'

import { LocalAuthGuard } from './local-auth.guard'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor (private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginRequest })
  async login (@Req() req: Request): Promise<AccessTokenResponse> {
    return this.authService.login(req.user as User)
  }
}
