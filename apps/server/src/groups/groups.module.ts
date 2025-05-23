import { Module } from '@nestjs/common'

import { PrismaService } from '@/prisma/prisma.service'
import { UsersService } from '@/users/users.service'
import { NotificationsService } from '@/users/notifications/notifications.service'

import { GroupsService } from './groups.service'
import { GroupsController } from './groups.controller'
import { ProjectsModule } from './projects/projects.module'

@Module({
  controllers: [GroupsController],
  providers: [GroupsService, UsersService, PrismaService, NotificationsService],
  imports: [ProjectsModule]
})
export class GroupsModule {}
