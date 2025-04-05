import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards } from '@nestjs/common'
import { UserCreateRequest, UserResponse, UserUpdateRequest } from '@omnilate/schema'
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger'

import { userEntityToResponse } from '@/utils/users'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'

import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor (private readonly usersService: UsersService) {}

  @Post()
  @ApiBody({
    type: UserCreateRequest
  })
  async create (@Body() request: UserCreateRequest): Promise<UserResponse> {
    const userEntity = await this.usersService.create(request)
    return userEntityToResponse(userEntity)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findOne (@Param('id') id: string): Promise<UserResponse> {
    const entity = await this.usersService.findOneById(+id)
    if (entity == null) {
      throw new Error('User not found')
    }
    return userEntityToResponse(entity)
  }

  @Patch(':id')
  async update (@Param('id') id: string, @Body() request: UserUpdateRequest): Promise<UserResponse> {
    const entity = await this.usersService.update(+id, request)
    return userEntityToResponse(entity)
  }

  @Delete(':id')
  @HttpCode(204)
  async remove (@Param('id') id: string): Promise<void> {
    await this.usersService.remove(+id)
  }
}
