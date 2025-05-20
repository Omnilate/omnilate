import type { GroupJoinNotificationUnion } from './groups'

export type NotificationType =
  | GroupJoinNotificationUnion

export abstract class NotificationResponse<T extends NotificationType = NotificationType> {
  id!: string
  type!: T['type']
  content!: [T['content']]
  data!: T['data']

  createdAt!: string
  read!: boolean
  operated!: boolean
}

export interface NotificationCreatePayload<T extends NotificationType = NotificationType> {
  type: T['type']
  content: T['content']
  data: T['data']
}
