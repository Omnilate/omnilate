import { Module } from '@nestjs/common'

import { PrismaService } from '@/prisma/prisma.service'
import { UsersService } from '@/users/users.service'

import { GroupsService } from './groups.service'
import { GroupsController } from './groups.controller'

@Module({
  controllers: [GroupsController],
  providers: [GroupsService, UsersService, PrismaService]
})
export class GroupsModule {}
