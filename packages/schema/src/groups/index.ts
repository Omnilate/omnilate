import { ApiProperty } from '@nestjs/swagger'

import { GroupRole, UserGroupResponse } from '@/users'

export abstract class GroupCreateRequest {
  @ApiProperty()
  name!: string

  @ApiProperty()
  description?: string
}

export abstract class GroupUpdateRequest {
  @ApiProperty()
  name?: string

  @ApiProperty()
  description?: string
}

export abstract class GroupBaseResponse {
  @ApiProperty()
  id!: number

  @ApiProperty()
  name!: string

  @ApiProperty()
  description?: string

  @ApiProperty()
  projectCount!: number

  @ApiProperty()
  userCount!: number

  @ApiProperty()
  createdAt!: string

  @ApiProperty()
  updatedAt!: string
}

export abstract class GroupDetailResponse extends GroupBaseResponse {
  @ApiProperty()
  // TODO: add project response type
  projects!: unknown[]

  @ApiProperty()
  users!: UserGroupResponse[]
}

export abstract class GroupJoinRequestReviewRequest {
  @ApiProperty()
  status!: 'ACCEPTED' | 'REJECTED'
}

export abstract class GroupInvitationCreateRequest {
  @ApiProperty()
  userId!: number
}

export abstract class GroupRoleUpdateRequest {
  @ApiProperty()
  role!: GroupRole
}
