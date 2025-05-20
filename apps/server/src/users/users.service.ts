import { createHash } from 'node:crypto'

import { Injectable } from '@nestjs/common'
import type { UserCreateRequest, UserUpdateRequest } from '@omnilate/schema'
import { Group, Project, User, UserKnownLanguage } from '@prisma/client'
import { compare, hash } from 'bcrypt'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class UsersService {
  constructor (private readonly prisma: PrismaService) {}

  async create (req: UserCreateRequest): Promise<User> {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        email: req.email
      }
    })

    if (existingUser != null) {
      throw new Error('Email already been used')
    }
    const passwordHash = await hash(req.password, 10)

    const md5 = createHash('md5')
    md5.update(req.email)
    const emailHash = md5.digest('hex')

    return await this.prisma.user.create({
      data: {
        name: req.name,
        email: req.email,
        passwordHash,
        avatarUrl: 'https://gravatar.com/avatar/' + emailHash
      }
    })
  }

  async findOneWithAllRelations (id: number) {
    return await this.prisma.user.findUnique({
      where: {
        id
      },
      include: {
        groups: {
          include: {
            group: true
          }
        },
        knownLanguages: true
      }
    })
  }

  async findOneWIthGroupInfo (id: number, gid: number) {
    return await this.prisma.user.findUnique({
      where: {
        id
      },
      include: {
        groups: {
          where: {
            groupId: gid
          },
          include: {
            group: true
          }
        }
      }
    })
  }

  async findOneById (id: number): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        id
      }
    })
  }

  async findOneByEmail (email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email
      }
    })

    return user
  }

  async search (
    { keyword }: { keyword: string }
  ): Promise<User[]> {
    const trimmedKeyword = keyword.trim()
    if (trimmedKeyword.length === 0) {
      return []
    }

    const numberKeyword = Number(trimmedKeyword)
    if (!isNaN(numberKeyword)) {
      return await this.prisma.user.findMany({
        where: {
          OR: [
            {
              name: {
                contains: keyword,
                mode: 'insensitive'
              }
            },
            {
              id: {
                equals: numberKeyword
              }
            }
          ]
        },
        orderBy: {
          updatedAt: 'desc'
        }
      })
    }

    return await this.prisma.user.findMany({
      where: {
        name: {
          contains: keyword,
          mode: 'insensitive'
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })
  }

  async updatePassword (uid: number, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: uid
      }
    })

    if (user == null) {
      throw new Error('User not found')
    }

    const isPasswordValid = await compare(oldPassword, user.passwordHash)
    if (!isPasswordValid) {
      throw new Error('Invalid password')
    }

    const passwordHash = await hash(newPassword, 10)
    await this.prisma.user.update({
      where: {
        id: uid
      },
      data: {
        passwordHash
      }
    })
  }

  async update (id: number, update: UserUpdateRequest): Promise<User> {
    return await this.prisma.user.update({
      where: {
        id
      },
      data: {
        name: update.name,
        email: update.email,
        description: update.description,
        avatarUrl: update.avatarUrl
      }
    })
  }

  async upsertRecentProject (uid: number, pid: number): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: uid
      },
      data: {
        recentProjects: {
          upsert: {
            where: {
              userId_projectId: {
                userId: uid,
                projectId: pid
              }
            },
            create: {
              projectId: pid
            },
            update: {}
          }
        }
      }
    })
  }

  async findRecentProjects (uid: number): Promise<Project[]> {
    return await this.prisma.project.findMany({
      where: {
        recentVisitors: {
          some: {
            userId: uid
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })
  }

  async upsertKnownlanguage (uid: number, language: string, mastery: number, description?: string): Promise<UserKnownLanguage> {
    return await this.prisma.userKnownLanguage.upsert({
      where: {
        userId_language: {
          userId: uid,
          language
        }
      },
      create: {
        userId: uid,
        language,
        mastery,
        description: description ?? ''
      },
      update: {
        mastery,
        description: description ?? ''
      }
    })
  }

  async findKnownLanguages (uid: number): Promise<UserKnownLanguage[]> {
    return await this.prisma.userKnownLanguage.findMany({
      where: {
        userId: uid
      },
      orderBy: {
        mastery: 'desc'
      }
    })
  }

  async deleteKnownLanguage (uid: number, language: string): Promise<void> {
    await this.prisma.userKnownLanguage.delete({
      where: {
        userId_language: {
          userId: uid,
          language
        }
      }
    })
  }

  async getAppliedGroups (uid: number): Promise<Group[]> {
    return await this.prisma.group.findMany({
      where: {
        joinRequests: {
          some: {
            userId: uid,
            status: 'PENDING'
          }
        }
      }
    })
  }

  async remove (id: number): Promise<User> {
    return await this.prisma.user.delete({
      where: {
        id
      }
    })
  }
}
