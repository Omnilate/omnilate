import { Injectable } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import { compare } from 'bcrypt'
import { AccessTokenResponse, UserResponse } from '@omnilate/schema'
import { User } from '@prisma/client'
import { JwtService } from '@nestjs/jwt'

import { userEntityToResponse } from '@/utils/users'
import { getConfigs } from '@/utils/configs'

@Injectable()
export class AuthService {
  constructor (
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser (credential: string, pass: string): Promise<UserResponse | null> {
    const user = await this.usersService.findOneByEmail(credential)
    if (user == null) {
      return null
    }

    const isPasswordValid = await compare(pass, String(user.passwordHash))
    if (!isPasswordValid) {
      return null
    } else {
      return userEntityToResponse(user)
    }
  }

  login (user: User): AccessTokenResponse {
    const payload = { username: user.email, sub: user.id.toString() }
    return {
      access_token: this.jwtService.sign(payload, { secret: getConfigs().accessToken.secret })
    }
  }
}
