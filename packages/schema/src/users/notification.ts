import type { GroupRole } from '.'

export type GroupJoinNotificationType = {
  type: 'GROUP_JOIN_REQUEST'
  content: 'NOTIFICATION.GROUP_JOIN_REQUEST.RECEIVED',
  data: {
    groupId: number
    userId: number
  }
} | {
  type: 'GROUP_JOIN_REQUEST_ACCEPTED'
  content: 'NOTIFICATION.GROUP_JOIN_REQUEST.ACCEPTED',
  data: {
    groupId: number
  }
} | {
  type: 'GROUP_JOIN_REQUEST_REJECTED'
  content: 'NOTIFICATION.GROUP_JOIN_REQUEST.REJECTED',
  data: {
    groupId: number
  }
}

export interface AlterGroupRoleNotificationType {
  type: 'ALTER_GROUP_ROLE'
  content: 'NOTIFICATION.ALTER_GROUP_ROLE'
  data: {
    groupId: number
    newRole: GroupRole
  }
}

export type NotificationType = GroupJoinNotificationType

export abstract class NotificationResponse<T extends NotificationType> {
  id!: number
  type!: T['content']
  content!: [T['data']]
  data!: T['data']

  createdAt!: string
  read!: boolean
}

