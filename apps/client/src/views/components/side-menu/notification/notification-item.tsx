import type { Component, JSX } from 'solid-js'
import { createSignal, onMount, Show } from 'solid-js'
import { Dynamic } from 'solid-js/web'

import type { NotificationResource } from '@/apis/notification'
import { markNotificationAsRead } from '@/apis/notification'
import { serializeDateTime } from '@/utils/serialize-datetime'

import { GroupJoinInvitationAcceptedItem, GroupJoinInvitationItem, GroupJoinInvitationRejectedItem, GroupJoinRequestAcceptedItem, GroupJoinRequestItem, GroupJoinRequestRejectedItem, GroupNewMemberAnnouncementItem } from './group-notifications'

interface NotificationItemBaseProps {
  id: string
  read: boolean
  title: JSX.Element
  description: JSX.Element
  icon?: JSX.Element
  operated?: boolean
  action?: (operated: boolean) => JSX.Element
  datetime: Date
}

export const NotificationItemBase: Component<NotificationItemBaseProps> = (props) => {
  const [newNotification] = createSignal(!props.read)

  onMount(async () => {
    if (props.read) return
    await markNotificationAsRead(props.id)
  })

  return (
    <div class="flex items-center gap-3 p-(y-2 x-4) bg-background rounded-lg hover:bg-accent transition-colors w-full">
      <div class="size-10 shrink-0">{props.icon}</div>
      <div class="flex flex-col gap-1 flex-1">
        <div class="flex justify-between items-center">
          <div class="font-700 text-sm">{props.title}</div>
          <Show when={newNotification()}>
            <div class="rounded-full size-2 bg-destructive" />
          </Show>
        </div>
        <div class="text-xs">{props.description}</div>
        <div class="flex justify-between items-center">
          <div class="text-xs opacity-70">{serializeDateTime(props.datetime)}</div>
          <Show when={props.action}>{props.action?.(props.operated ?? false)}</Show>
        </div>
      </div>
    </div>
  )
}

interface NotificationItemProps {
  notification: NotificationResource
}

const itemMap = {
  GROUP_JOIN_INVITATION: GroupJoinInvitationItem,
  GROUP_JOIN_INVITATION_ACCEPTED: GroupJoinInvitationAcceptedItem,
  GROUP_JOIN_INVITATION_REJECTED: GroupJoinInvitationRejectedItem,
  GROUP_JOIN_REQUEST: GroupJoinRequestItem,
  GROUP_JOIN_REQUEST_ACCEPTED: GroupJoinRequestAcceptedItem,
  GROUP_JOIN_REQUEST_REJECTED: GroupJoinRequestRejectedItem,
  GROUP_NEW_MEMBER_ANNOUNCEMENT: GroupNewMemberAnnouncementItem
} as const

const NotificationItem: Component<NotificationItemProps> = (props) => {
  return (
    // @ts-expect-error Can't we just forget about the type
    <Dynamic component={itemMap[props.notification.type]} notification={props.notification} />
  )
}

export default NotificationItem
