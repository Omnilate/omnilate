import type { GroupRole } from '..'

export interface GroupJoinRequestNotification {
  type: 'GROUP_JOIN_REQUEST'
  content: 'NOTIFICATION.GROUP_JOIN_REQUEST'
  data: {
    groupId: number
    userId: number
  }
}

export interface GroupJoinRequestAcceptedNotification {
  type: 'GROUP_JOIN_REQUEST_ACCEPTED'
  content: 'NOTIFICATION.GROUP_JOIN_REQUEST_ACCEPTED'
  data: {
    groupId: number
  }
}

export interface GroupJoinRequestRejectedNotification {
  type: 'GROUP_JOIN_REQUEST_REJECTED'
  content: 'NOTIFICATION.GROUP_JOIN_REQUEST_REJECTED'
  data: {
    groupId: number
  }
}

export interface GroupJoinInvitationNotification {
  type: 'GROUP_JOIN_INVITATION'
  content: 'NOTIFICATION.GROUP_JOIN_INVITATION'
  data: {
    inviterId: number
    groupId: number
    inviteeId: number
  }
}

export interface GroupJoinInvitationAcceptedNotification {
  type: 'GROUP_JOIN_INVITATION_ACCEPTED'
  content: 'NOTIFICATION.GROUP_JOIN_INVITATION_ACCEPTED'
  data: {
    groupId: number
    inviteeId: number
  }
}

export interface GroupJoinInvitationRejectedNotification {
  type: 'GROUP_JOIN_INVITATION_REJECTED'
  content: 'NOTIFICATION.GROUP_JOIN_INVITATION_REJECTED'
  data: {
    groupId: number
    inviteeId: number
  }
}

export interface GroupNewMemberAnnouncementNotification {
  type: 'GROUP_NEW_MEMBER_ANNOUNCEMENT'
  content: 'NOTIFICATION.GROUP_NEW_MEMBER_ANNOUNCEMENT'
  data: {
    groupId: number
    newMemberId: number
  }
}

export type GroupJoinNotificationUnion =
  | GroupJoinRequestNotification
  | GroupJoinRequestAcceptedNotification
  | GroupJoinRequestRejectedNotification
  | GroupJoinInvitationNotification
  | GroupJoinInvitationAcceptedNotification
  | GroupJoinInvitationRejectedNotification
  | GroupNewMemberAnnouncementNotification

export interface AlterGroupRoleNotificationType {
  type: 'ALTER_GROUP_ROLE'
  content: 'NOTIFICATION.ALTER_GROUP_ROLE'
  data: {
    groupId: number
    newRole: GroupRole
  }
}
