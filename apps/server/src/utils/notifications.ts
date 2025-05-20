import type { NotificationResponse } from '@omnilate/schema'
import type { Notification } from '@prisma/client'

export function toResponse (notification: Notification): NotificationResponse {
  return {
    id: notification.id.toString(10),
    type: notification.type as NotificationResponse['type'],
    content: notification.content as unknown as NotificationResponse['content'],
    data: notification.data as NotificationResponse['data'],
    createdAt: notification.createdAt.toISOString(),
    read: notification.read,
    operated: notification.operated
  }
}
