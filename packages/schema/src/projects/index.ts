import { ApiProperty } from '@nestjs/swagger'

import { GroupBaseResponse } from '@/groups'

export abstract class ProjectCreateRequest {
  @ApiProperty()
  name!: string

  @ApiProperty()
  description?: string
}

export abstract class ProjectBaseResponse {
  @ApiProperty()
  id!: number

  @ApiProperty()
  name!: string

  @ApiProperty()
  description?: string

  @ApiProperty()
  group!: GroupBaseResponse

  @ApiProperty()
  createdAt!: string

  @ApiProperty()
  updatedAt!: string
}
