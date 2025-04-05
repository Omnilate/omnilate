import { Module } from '@nestjs/common'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { UsersModule } from '@/users/users.module'
import { UsersService } from '@/users/users.service'
import { PrismaService } from '@/prisma/prisma.service'
import { getConfigs } from '@/utils/configs'

import { AuthService } from './auth.service'
import { LocalStrategy } from './local.strategy'
import { AuthController } from './auth.controller'
import { JwtStrategy } from './jwt.strategy'

const jwtConfig = getConfigs().accessToken
console.log(jwtConfig)

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secretOrPrivateKey: jwtConfig.secret,
      signOptions: {
        expiresIn: jwtConfig.expiresIn
      }
    })
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, UsersService, PrismaService, JwtService],
  controllers: [AuthController]
})
export class AuthModule {}
