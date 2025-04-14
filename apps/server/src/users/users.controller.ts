import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards } from '@nestjs/common'
import { UserCreateRequest, UserPasswordUpdateRequest, UserBaseResponse, UserUpdateRequest } from '@omnilate/schema'
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger'

import * as userUtils from '@/utils/users'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { CurrentUserId } from '@/auth/current-user-id.decorator'

import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor (private readonly usersService: UsersService) {}

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

  @Patch(':id')
  async update (@Param('id') id: string, @Body() request: UserUpdateRequest): Promise<UserBaseResponse> {
    const entity = await this.usersService.update(+id, request)
    return userUtils.toBaseResponse(entity)
  }

  @Patch(':id/password')
  @ApiBody({ type: UserPasswordUpdateRequest })
  async updatePassword (@Param('id') id: string, @Body() request: { oldPassword: string, newPassword: string }): Promise<void> {
    await this.usersService.updatePassword(+id, request.oldPassword, request.newPassword)
  }

  @Delete(':id')
  @HttpCode(204)
  async remove (@Param('id') id: string): Promise<void> {
    await this.usersService.remove(+id)
  }
}
