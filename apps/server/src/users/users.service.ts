import { createHash } from 'node:crypto'

import { Injectable } from '@nestjs/common'
import type { UserCreateRequest, UserUpdateRequest } from '@omnilate/schema'
import { User } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { hash } from 'bcrypt'

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

  async findOneById (id: number): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        id
      }
    })
  }

  async findOneByEmail (email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        email
      }
    })
  }

  async update (id: number, update: UserUpdateRequest): Promise<User> {
    const newPassword = update.password != null
      ? await hash(update.password, 10)
      : undefined

    return await this.prisma.user.update({
      where: {
        id
      },
      data: {
        name: update.name,
        email: update.email,
        passwordHash: newPassword,
        avatarUrl: update.avatarUrl
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
