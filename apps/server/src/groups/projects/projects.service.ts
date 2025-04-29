import { Injectable } from '@nestjs/common'
import { ProjectCreateRequest, ProjectUpdateRequest } from '@omnilate/schema'
import { Project } from '@prisma/client'

import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class ProjectsService {
  constructor (private readonly prisma: PrismaService) {}

  async create (gid: number, payload: ProjectCreateRequest): Promise<Project> {
    return await this.prisma.project.create({
      data: {
        name: payload.name,
        description: payload.description,
        groupId: gid,
        privateProject: payload.privateProject
      }
    })
  }

  async findAll (uid: number, gid: number): Promise<Project[]> {
    return await this.prisma.project.findMany({
      where: {
        groupId: gid,
        OR: [
          {
            privateProject: false
          },
          {
            group: {
              users: {
                some: {
                  userId: uid
                }
              }
            }
          }
        ]

      }
    })
  }

  async findOne (uid: number, gid: number, pid: number): Promise<Project | null> {
    return await this.prisma.project.findUnique({
      where: {
        id: pid,
        OR: [
          {
            privateProject: false
          },
          {
            group: {
              id: gid,
              users: {
                some: {
                  userId: uid
                }
              }
            }
          }
        ]
      }
    })
  }

  async update (id: number, payload: ProjectUpdateRequest): Promise<Project> {
    return await this.prisma.project.update({
      where: {
        id
      },
      data: {
        name: payload.name,
        description: payload.description,
        privateProject: payload.privateProject
      }
    })
  }

  async delete (id: number): Promise<void> {
    await this.prisma.project.delete({
      where: {
        id
      }
    })
  }
}
