import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'

import { getConfigs } from '@/utils/configs'

interface JwtPayload {
  sub: string
  username: string
}

interface UserAbstract {
  id: number
}

const jwtConfig = getConfigs().accessToken

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor () {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret
    })
  }

  async validate (payload: JwtPayload): Promise<UserAbstract> {
    return { id: +payload.sub }
  }
}
