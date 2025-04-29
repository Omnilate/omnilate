import { Injectable } from '@nestjs/common'
import { NotificationCreatePayload, NotificationType } from '@omnilate/schema'
import { Notification } from '@prisma/client'

import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class NotificationsService {
  constructor (
    private readonly prisma: PrismaService
  ) {}

  async create<T extends NotificationType> (uid: number, payload: NotificationCreatePayload<T>): Promise<Notification> {
    return await this.prisma.notification.create({
      data: {
        type: payload.type,
        content: payload.content,
        data: payload.data,
        read: false,
        userId: uid
      }
    })
  }

  async findAll (uid: number): Promise<Notification[]> {
    const notifications = await this.prisma.notification.findMany({
      where: {
        userId: uid
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return notifications
  }

  async findOne (id: bigint): Promise<Notification> {
    const notification = await this.prisma.notification.findUnique({
      where: {
        id
      }
    })

    if (notification == null) {
      throw new Error('Notification not found')
    }

    return notification
  }

  async markAsRead (id: bigint): Promise<Notification> {
    const notification = await this.prisma.notification.update({
      where: {
        id
      },
      data: {
        read: true
      }
    })

    return notification
  }

  async remove (id: bigint): Promise<void> {
    await this.prisma.notification.delete({
      where: {
        id
      }
    })
  }
}
