import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards, Put, Query } from '@nestjs/common'
import { UserCreateRequest, UserPasswordUpdateRequest, UserBaseResponse, UserUpdateRequest, GroupBaseResponse, ProjectBaseResponse, RecentProjectPutRequest, LanguageSkillResponse, GroupRoleResponse } from '@omnilate/schema'
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger'

import * as userUtils from '@/utils/users'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { CurrentUserId } from '@/auth/current-user-id.decorator'
import { GroupsService } from '@/groups/groups.service'
import * as groupUtils from '@/utils/groups'
import * as projectUtils from '@/utils/projects'

import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor (
    private readonly usersService: UsersService,
    private readonly groupsService: GroupsService
  ) {}

  @Post()
  @ApiBody({
    type: UserCreateRequest
  })
  async create (@Body() request: UserCreateRequest): Promise<UserBaseResponse> {
    const userEntity = await this.usersService.create(request)
    return userUtils.toBaseResponse(userEntity)
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findMe (@CurrentUserId() id: number): Promise<UserBaseResponse> {
    const entity = await this.usersService.findOneById(id)
    if (entity == null) {
      throw new Error('User not found')
    }
    return userUtils.toBaseResponse(entity)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findOne (@Param('id') id: string): Promise<UserBaseResponse> {
    const entity = await this.usersService.findOneById(+id)
    if (entity == null) {
      throw new Error('User not found')
    }
    return userUtils.toBaseResponse(entity)
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async searchUsers (@Query('keyword') keyword: string): Promise<UserBaseResponse[]> {
    const result = await this.usersService.search({ keyword })
    return result.map((user) => userUtils.toBaseResponse(user))
  }

  @Get(':id/groups')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getGroups (@Param('id') id: string): Promise<GroupRoleResponse[]> {
    const groups = await this.groupsService.getUserGroups(+id)
    return groups.map((group) => groupUtils.toRoleResponse(group))
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update (@CurrentUserId() id: number, @Body() request: UserUpdateRequest): Promise<UserBaseResponse> {
    const entity = await this.usersService.update(id, request)
    return userUtils.toBaseResponse(entity)
  }

  @Patch('me/password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({ type: UserPasswordUpdateRequest })
  async updatePassword (@CurrentUserId() id: number, @Body() request: { oldPassword: string, newPassword: string }): Promise<void> {
    await this.usersService.updatePassword(id, request.oldPassword, request.newPassword)
  }

  @Get('me/applied-groups')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getAppliedGroups (@CurrentUserId() uid: number): Promise<GroupBaseResponse[]> {
    const groups = await this.usersService.getAppliedGroups(uid)
    return groups.map((group) => groupUtils.toBaseResponse(group))
  }

  // #region recent-proj
  @Get('me/recent-projects')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getRecentProjects (@CurrentUserId() uid: number): Promise<ProjectBaseResponse[]> {
    const projects = await this.usersService.findRecentProjects(uid)
    return projects.map((project) => projectUtils.toBaseResponse(project))
  }

  @Put('me/recent-projects')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateRecentProjects (
    @CurrentUserId() uid: number,
    @Body() payload: RecentProjectPutRequest
  ): Promise<void> {
    await this.usersService.upsertRecentProject(uid, payload.projectId)
  }
  // #endregion

  // #region lang-skill
  @Get(':id/language-skills')
  async getKnownLanguages (@Param('id') id: string): Promise<LanguageSkillResponse[]> {
    const data = await this.usersService.findKnownLanguages(+id)
    return data.map(userUtils.langSkillToResponse)
  }

  @Put('me/language-skills')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateKnownLanguages (
    @CurrentUserId() uid: number,
    @Body() payload: LanguageSkillResponse
  ): Promise<void> {
    await this.usersService.upsertKnownlanguage(uid, payload.language, payload.mastery, payload.description)
  }

  @Delete('me/language-skills/:lang')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(204)
  async deleteKnownLanguage (
    @CurrentUserId() uid: number,
    @Param('lang') lang: string
  ): Promise<void> {
    await this.usersService.deleteKnownLanguage(uid, lang)
  }
  // #endregion
}
