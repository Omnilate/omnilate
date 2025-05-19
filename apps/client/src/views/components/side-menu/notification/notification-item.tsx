import { Show } from 'solid-js'
import type { Component, JSX } from 'solid-js'
import type { GroupJoinInvitationAcceptedNotification, GroupJoinInvitationNotification } from '@omnilate/schema/dist/users/notifications/groups'

import type { NotificationResource } from '@/apis/notification'
import { useI18n } from '@/utils/i18n'
import { serializeDateTime } from '@/utils/serialize-datetime'

import { GroupJoinInvitationAcceptedItem, GroupJoinInvitationItem } from './group-notifications'

interface NotificationItemBaseProps {
  title: JSX.Element
  description: JSX.Element
  icon?: JSX.Element
  action?: JSX.Element
  datetime: Date
}

export const NotificationItemBase: Component<NotificationItemBaseProps> = (props) => {
  return (
    <div class="flex items-center gap-2 p-(y-2 x-4) bg-background rounded-lg hover:bg-accent transition-colors w-full">
      <div class="size-10 shrink-0">{props.icon}</div>
      <div class="flex flex-col gap-1 flex-1">
        <div class="font-700 text-sm">{props.title}</div>
        <div class="flex flex-1 flex-col justify-between items-end gap-1">
          <div class="text-xs self-start">{props.description}</div>
          <Show when={props.action}>{props.action}</Show>
        </div>
        <div class="text-xs opacity-70">{serializeDateTime(props.datetime)}</div>
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
