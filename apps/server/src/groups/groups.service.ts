import { Injectable } from '@nestjs/common'
import { GroupUpdateRequest } from '@omnilate/schema'
import { Group, GroupInvitation, GroupRole, User } from '@prisma/client'

import { PrismaService } from '@/prisma/prisma.service'
import { UserWithGroups } from '@/utils/users'
import { GroupWithRole } from '@/utils/groups'

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
        OR: [
          {
            name: {
              contains: keyword,
              mode: 'insensitive'
            }
          },
          {
            description: {
              contains: keyword,
              mode: 'insensitive'
            }
          }
        ]

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

  async findOneWithRole (id: number, uid: number): Promise<GroupWithRole> {
    const group = await this.prisma.group.findUnique({
      where: {
        id
      },
      include: {
        users: {
          where: {
            userId: uid
          }
        }
      }
    })
    if (group == null) {
      throw new Error('Group not found')
    }

    return group
  }

  async getUserGroups (uid: number): Promise<GroupWithRole[]> {
    const groups = await this.prisma.group.findMany({
      where: {
        users: {
          some: {
            userId: uid
          }
        }
      },
      include: {
        users: {
          where: {
            userId: uid
          }
        }
      }
    })

    return groups
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

  async getMember (gid: number, uid: number): Promise<UserWithGroups | null> {
    const member = await this.prisma.user.findUnique({
      where: {
        id: uid
      },
      include: {
        groups: {
          where: {
            groupId: gid
          }
        }
      }
    })

    return member
  }

  async getMembers (id: number): Promise<UserWithGroups[]> {
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

  async addMember (gid: number, uid: number, role: GroupRole): Promise<UserWithGroups[]> {
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

  async updateMemberRole (gid: number, uid: number, role: GroupRole): Promise<UserWithGroups[]> {
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

  async getMembersOfRole (gid: number, role: GroupRole): Promise<User[]> {
    const members = await this.prisma.user.findMany({
      where: {
        groups: {
          some: {
            groupId: gid,
            role
          }
        }
      }
    })
    return members
  }

  async createJoinRequest (gid: number, uid: number): Promise<void> {
    await this.prisma.groupJoinRequest.create({
      data: {
        groupId: gid,
        userId: uid
      }
    })
  }

  async getJoinRequests (gid: number): Promise<UserWithGroups[]> {
    const requests = await this.prisma.groupJoinRequest.findMany({
      where: {
        groupId: gid
      },
      include: {
        user: {
          include: {
            groups: true
          }
        }
      }
    })

    return requests.map((r) => r.user)
  }

  async acceptJoinRequest (gid: number, uid: number): Promise<UserWithGroups[]> {
    await this.prisma.$transaction(async (prisma) => {
      await prisma.groupJoinRequest.delete({
        where: {
          userId_groupId: {
            userId: uid,
            groupId: gid
          }
        }
      })

      await prisma.groupMembers.create({
        data: {
          groupId: gid,
          userId: uid,
          role: 'MEMBER'
        }
      })
    })

    return await this.getMembers(gid)
  }

  async rejectJoinRequest (gid: number, uid: number): Promise<void> {
    await this.prisma.groupJoinRequest.delete({
      where: {
        userId_groupId: {
          userId: uid,
          groupId: gid
        }
      }
    })
  }

  async getInvitedUsers (gid: number): Promise<User[]> {
    const invitations = await this.prisma.groupInvitation.findMany({
      where: {
        groupId: gid,
        NOT: {
          status: 'REJECTED'
        }
      },
      include: {
        invitee: true
      }
    })

    return invitations.map((i) => i.invitee)
  }

  async createInvitation (gid: number, inviterId: number, inviteeId: number): Promise<GroupInvitation> {
    const existingInvitation = await this.getInvitation(gid, inviterId, inviteeId)
    if (existingInvitation != null) {
      if (existingInvitation.status === 'REJECTED') {
        return await this.prisma.groupInvitation.update({
          where: {
            inviterId_groupId_inviteeId: {
              groupId: gid,
              inviterId,
              inviteeId
            }
          },
          data: {
            status: 'PENDING'
          }
        })
      }
    }

    return await this.prisma.groupInvitation.create({
      data: {
        groupId: gid,
        inviterId,
        inviteeId
      }
    })
  }

  async getInvitation (gid: number, inviterId: number, inviteeId: number): Promise<GroupInvitation | null> {
    return await this.prisma.groupInvitation.findUnique({
      where: {
        inviterId_groupId_inviteeId: {
          groupId: gid,
          inviterId,
          inviteeId
        }
      }
    })
  }

  async acceptInvitation (gid: number, inviterId: number, inviteeId: number): Promise<void> {
    await this.prisma.$transaction(async (prisma) => {
      await prisma.groupInvitation.delete({
        where: {
          inviterId_groupId_inviteeId: {
            groupId: gid,
            inviterId,
            inviteeId
          }
        }
      })

      await this.addMember(gid, inviteeId, 'MEMBER')
    })
  }

  async rejectInvitation (gid: number, inviterId: number, inviteeId: number): Promise<void> {
    await this.prisma.groupInvitation.delete({
      where: {
        inviterId_groupId_inviteeId: {
          groupId: gid,
          inviterId,
          inviteeId
        }
      }
    })
  }

  async getGroupRole (gid: number, uid: number): Promise<GroupRole | null> {
    const group = await this.prisma.groupMembers.findUnique({
      where: {
        groupId_userId: {
          groupId: gid,
          userId: uid
        }
      }
    })

    return group?.role ?? null
  }

  async isMember (gid: number, uid: number): Promise<boolean> {
    const group = await this.prisma.groupMembers.findUnique({
      where: {
        groupId_userId: {
          groupId: gid,
          userId: uid
        }
      }
    })

    return group != null
  }
}
