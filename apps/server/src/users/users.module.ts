import { Module } from '@nestjs/common'

import { PrismaService } from '@/prisma/prisma.service'
import { GroupsService } from '@/groups/groups.service'

import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, GroupsService],
  imports: [NotificationsModule]
})
export class UsersModule {}
