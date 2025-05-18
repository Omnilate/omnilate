import { ApiProperty } from '@nestjs/swagger'

import { GroupBaseResponse } from '@/groups'

export * from './notifications'

export abstract class UserCreateRequest {
  @ApiProperty()
  name!: string

  @ApiProperty()
  email!: string

  @ApiProperty()
  password!: string
}

export abstract class UserPasswordUpdateRequest {
  @ApiProperty()
  oldPassword!: string

  @ApiProperty()
  newPassword!: string
}

export abstract class UserUpdateRequest {
  @ApiProperty()
  name?: string

  @ApiProperty()
  email?: string

  @ApiProperty()
  avatarUrl?: string

  @ApiProperty()
  description?: string
}

export abstract class UserKnownLanguage {
  @ApiProperty()
  language!: string

  @ApiProperty({ description: '0-1' })
  mastery!: number

  @ApiProperty()
  description?: string
}

export abstract class UserBaseResponse {
  @ApiProperty()
  id!: number

  @ApiProperty()
  name!: string

  @ApiProperty()
  avatarUrl!: string

  @ApiProperty()
  description!: string

  @ApiProperty()
  createdAt!: string

  @ApiProperty()
  updatedAt!: string
}

export abstract class UserDetailResponse extends UserBaseResponse {
  @ApiProperty()
  groups!: GroupBaseResponse[]

  @ApiProperty()
  knownLanguages!: UserKnownLanguage[]
}

export abstract class UserPersonalResponse extends UserDetailResponse {
  @ApiProperty()
  email!: string
}

export type GroupRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'OBSERVER'

export abstract class UserGroupResponse extends UserBaseResponse {
  @ApiProperty()
  role!: GroupRole

  @ApiProperty()
  joinedAt!: string
}

export abstract class LanguageSkillCreateRequest {
  @ApiProperty()
  language!: string

  @ApiProperty({ description: '0-1' })
  mastery!: number

  @ApiProperty()
  description?: string
}

export abstract class LanguageSkillResponse {
  @ApiProperty()
  language!: string

  @ApiProperty({ description: '0-1' })
  mastery!: number

  @ApiProperty()
  description?: string

  @ApiProperty()
  updatedAt!: string
}
