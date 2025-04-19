import { Controller, Get, Post, Body, Patch, Param, UseGuards, Query } from '@nestjs/common'
import { GroupBaseResponse, GroupCreateRequest, GroupUpdateRequest } from '@omnilate/schema'
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger'

import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { CurrentUserId } from '@/auth/current-user-id.decorator'
import * as groupsUtils from '@/utils/groups'

import { GroupsService } from './groups.service'

@Controller('groups')
export class GroupsController {
  constructor (private readonly groupsService: GroupsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({ type: GroupCreateRequest })
  @ApiResponse({ type: GroupBaseResponse })
  async create (@Body() payload: GroupCreateRequest, @CurrentUserId() uid: number): Promise<GroupBaseResponse> {
    const group = await this.groupsService.create(uid, payload.name, payload.description)
    return groupsUtils.toBaseResponse(group)
  }

  @Get(':id')
  @ApiResponse({ type: GroupBaseResponse })
  async findOne (@Param('id') id: string): Promise<GroupBaseResponse> {
    const group = await this.groupsService.findOne(+id)
    return groupsUtils.toBaseResponse(group)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({ type: GroupUpdateRequest })
  @ApiResponse({ type: GroupBaseResponse })
  async update (@Param('id') id: string, @Body() payload: GroupUpdateRequest): Promise<GroupBaseResponse> {
    const group = await this.groupsService.update(+id, payload)
    return groupsUtils.toBaseResponse(group)
  }

  @Get()
  @ApiResponse({ type: GroupCreateRequest, isArray: true })
  async searchGroups (@Query('keyword') keyword: string): Promise<GroupBaseResponse[]> {
    const result = await this.groupsService.searchByName({ keyword, page: 1, pageSize: 10 })
    return result.map((g) => groupsUtils.toBaseResponse(g))
  }
}
