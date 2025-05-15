import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common'
import { ProjectBaseResponse, ProjectCreateRequest, ProjectUpdateRequest } from '@omnilate/schema'

import * as projectUtils from '@/utils/projects'
import { CurrentUserId } from '@/auth/current-user-id.decorator'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'

import { ProjectsService } from './projects.service'

@Controller('groups/:groupId/projects')
export class ProjectsController {
  constructor (private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create (@Param('groupId') gid: string, @Body() payload: ProjectCreateRequest): Promise<ProjectBaseResponse> {
    const project = await this.projectsService.create(+gid, payload)
    return projectUtils.toBaseResponse(project)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll (@Param('groupId') gid: string, @CurrentUserId() uid: number): Promise<ProjectBaseResponse[]> {
    const projects = await this.projectsService.findAll(uid, +gid)
    return projects.map((p) => projectUtils.toBaseResponse(p))
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne (@Param('groupId') gid: string, @Param('id') pid: string, @CurrentUserId() uid: number): Promise<ProjectBaseResponse> {
    const project = await this.projectsService.findOne(uid, +gid, +pid)
    if (project == null) {
      throw new Error('Project not found')
    }
    return projectUtils.toBaseResponse(project)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update (@Param('id') id: string, @Body() payload: ProjectUpdateRequest): Promise<ProjectBaseResponse> {
    const project = await this.projectsService.update(+id, payload)
    return projectUtils.toBaseResponse(project)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove (@Param('id') id: string): Promise<void> {
    await this.projectsService.delete(+id)
  }
}
