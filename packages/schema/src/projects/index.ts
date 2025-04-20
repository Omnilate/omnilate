import { ApiProperty } from '@nestjs/swagger'

export abstract class ProjectCreateRequest {
  @ApiProperty()
  name!: string

  @ApiProperty()
  description?: string

  @ApiProperty()
  privateProject!: boolean
}

export abstract class ProjectUpdateRequest {
  @ApiProperty()
  name?: string

  @ApiProperty()
  description?: string

  @ApiProperty()
  privateProject?: boolean
}

export abstract class RecentProjectPutRequest {
  @ApiProperty()
  projectId!: number
}

export abstract class ProjectBaseResponse {
  @ApiProperty()
  id!: number

  @ApiProperty()
  groupId!: number

  @ApiProperty()
  name!: string

  @ApiProperty()
  description?: string

  @ApiProperty()
  privateProject!: boolean

  @ApiProperty()
  createdAt!: string

  @ApiProperty()
  updatedAt!: string
}
