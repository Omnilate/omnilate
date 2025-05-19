import type { GroupJoinInvitationAcceptedNotification, GroupJoinInvitationNotification } from '@omnilate/schema/dist/users/notifications/groups'
import type { Component, JSX } from 'solid-js'
import { onCleanup, Show } from 'solid-js'

import type { NotificationResource } from '@/apis/notification'
import { markNotificationAsRead } from '@/apis/notification'
import { serializeDateTime } from '@/utils/serialize-datetime'

import { GroupJoinInvitationAcceptedItem, GroupJoinInvitationItem } from './group-notifications'

interface NotificationItemBaseProps {
  id: string
  read: boolean
  title: JSX.Element
  description: JSX.Element
  icon?: JSX.Element
  action?: JSX.Element
  datetime: Date
}

export const NotificationItemBase: Component<NotificationItemBaseProps> = (props) => {
  onCleanup(async () => {
    if (props.read) return
    await markNotificationAsRead(props.id)
  })

  return (
    <div class="flex items-center gap-3 p-(y-2 x-4) bg-background rounded-lg hover:bg-accent transition-colors w-full">
      <div class="size-10 shrink-0">{props.icon}</div>
      <div class="flex flex-col gap-1 flex-1">
        <div class="flex justify-between items-center">
          <div class="font-700 text-sm">{props.title}</div>
          <Show when={!props.read}>
            <div class="rounded-full size-2 bg-destructive" />
          </Show>
        </div>
        <div class="text-xs">{props.description}</div>
        <div class="flex justify-between items-center">
          <div class="text-xs opacity-70">{serializeDateTime(props.datetime)}</div>
          <Show when={props.action}>{props.action}</Show>
        </div>
      </div>
    </div>
  )
}

interface NotificationItemProps {
  notification: NotificationResource
}

const NotificationItem: Component<NotificationItemProps> = (props) => {
  return (
    <>
      {
        props.notification.type === 'GROUP_JOIN_INVITATION'
          ? (
              <GroupJoinInvitationItem
                notification={props.notification as NotificationResource<GroupJoinInvitationNotification>}
              />
            )
          : props.notification.type === 'GROUP_JOIN_INVITATION_ACCEPTED'
            ? (
                <GroupJoinInvitationAcceptedItem
                  notification={props.notification as NotificationResource<GroupJoinInvitationAcceptedNotification>}
                />
              )
            : ('')
      }
    </>
  )
}

export default NotificationItem
