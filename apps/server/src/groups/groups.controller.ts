import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common'
import { GroupCreateRequest, GroupUpdateRequest } from '@omnilate/schema'
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger'

import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { CurrentUserId } from '@/auth/current-user-id.decorator'

import { GroupsService } from './groups.service'

@Controller('groups')
export class GroupsController {
  constructor (private readonly groupsService: GroupsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({ type: GroupCreateRequest })
  async create (@Body() payload: GroupCreateRequest, @CurrentUserId() uid: number) {
    return await this.groupsService.create(uid, payload.name, payload.description)
  }

  @Get(':id')
  @ApiResponse({ type: GroupCreateRequest })
  async findOne (@Param('id') id: string) {
    return await this.groupsService.findOne(+id)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({ type: GroupUpdateRequest })
  async update (@Param('id') id: string, @Body() payload: GroupUpdateRequest) {
    return await this.groupsService.update(+id, payload)
  }
}
