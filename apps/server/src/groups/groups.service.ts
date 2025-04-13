import { Injectable } from '@nestjs/common'
import { Group, GroupRole, User } from '@prisma/client'
import { GroupUpdateRequest } from '@omnilate/schema'

import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class GroupsService {
  constructor (private readonly prisma: PrismaService) {}

  async create (uid: number, groupName: string, description?: string): Promise<Group> {
    return await this.prisma.group.create({
      data: {
        name: groupName,
        description: description ?? '',
        userCount: 1,
        users: {
          create: {
            user: {
              connect: {
                id: uid
              }
            },
            role: 'OWNER'
          }
        }
      }
    })
  }

  async searchByName ({ keyword, page, pageSize }: { keyword: string, page: number, pageSize: number }): Promise<Group[]> {
    return await this.prisma.group.findMany({
      where: {
        name: {
          contains: keyword
        }
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  async findOne (id: number): Promise<Group> {
    const group = await this.prisma.group.findUnique({
      where: {
        id
      }
    })

    if (group == null) {
      throw new Error('Group not found')
    }

    return group
  }

  async update (id: number, { description, name }: GroupUpdateRequest): Promise<Group> {
    return await this.prisma.group.update({
      where: {
        id
      },
      data: {
        description,
        name
      }
    })
  }

  async getMembers (id: number): Promise<User[]> {
    const members = await this.prisma.user.findMany({
      where: {
        groups: {
          some: {
            groupId: id
          }
        }
      },
      include: {
        groups: {
          where: {
            groupId: id
          }
        }
      }
    })

    return members
  }

  async addMember (gid: number, uid: number, role: GroupRole) {
    await this.prisma.$transaction(async (prisma) => {
      await prisma.groupMembers.create({
        data: {
          groupId: gid,
          userId: uid,
          role
        }
      })

      await prisma.group.update({
        where: {
          id: gid
        },
        data: {
          userCount: { increment: 1 }
        }
      })
    })

    return await this.getMembers(gid)
  }

  async updateMemberRole (gid: number, uid: number, role: GroupRole) {
    await this.prisma.groupMembers.update({
      where: {
        groupId_userId: {
          groupId: gid,
          userId: uid
        }
      },
      data: {
        role
      }
    })

    return await this.getMembers(gid)
  }

  async removeMember (gid: number, uid: number): Promise<void> {
    await this.prisma.$transaction(async (prisma) => {
      await prisma.groupMembers.delete({
        where: {
          groupId_userId: {
            groupId: gid,
            userId: uid
          }
        }
      })

      await prisma.group.update({
        where: {
          id: gid
        },
        data: {
          userCount: { decrement: 1 }
        }
      })
    })
  }
}
