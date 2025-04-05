import { ApiProperty } from '@nestjs/swagger'

export class UserCreateRequest {
  @ApiProperty()
  name!: string

  @ApiProperty()
  email!: string

  @ApiProperty()
  password!: string
}

export class UserUpdateRequest {
  @ApiProperty()
  name?: string

  @ApiProperty()
  email?: string

  @ApiProperty()
  password?: string

  @ApiProperty()
  avatarUrl?: string
}

export class UserResponse {
  @ApiProperty()
  id!: number

  @ApiProperty()
  name!: string

  @ApiProperty()
  avatarUrl!: string

  @ApiProperty()
  createdAt!: string

  @ApiProperty()
  updatedAt!: string
}

export class UserPersonalResponse {
  @ApiProperty()
  id!: number

  @ApiProperty()
  name!: string

  @ApiProperty()
  avatarUrl!: string

  @ApiProperty()
  email!: string

  @ApiProperty()
  createdAt!: string

  @ApiProperty()
  updatedAt!: string
}
