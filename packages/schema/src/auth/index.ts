import { ApiProperty } from '@nestjs/swagger'

export class LoginRequest {
  @ApiProperty()
  username!: string

  @ApiProperty()
  password!: string
}

export class AccessTokenResponse {
  @ApiProperty()
  access_token!: string
}
