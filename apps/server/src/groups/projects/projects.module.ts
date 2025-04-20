import { Module } from '@nestjs/common'

import { PrismaService } from '@/prisma/prisma.service'

import { ProjectsService } from './projects.service'
import { ProjectsController } from './projects.controller'

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, PrismaService]
})
export class ProjectsModule {}
