import type { GroupJoinInvitationNotification, GroupJoinInvitationAcceptedNotification, GroupJoinInvitationRejectedNotification } from '@omnilate/schema/dist/users/notifications/groups'
import { Show, Suspense } from 'solid-js'
import type { Component } from 'solid-js'
import { createAsync } from '@solidjs/router'

import type { NotificationResource } from '@/apis/notification'
import { useI18n } from '@/utils/i18n'
import { getUser } from '@/apis/user'
import { getGroup } from '@/apis/groups'
import GroupLogo from '@/components/group-logo'
import { Button } from '@/components/ui/button'

import { NotificationItemBase } from './notification-item'

interface GroupJoinInvitationItemProps {
  notification: NotificationResource<GroupJoinInvitationNotification>
}

export const GroupJoinInvitationItem: Component<GroupJoinInvitationItemProps> = (props) => {
  const t = useI18n()
  const inviter = createAsync(async () => await getUser(props.notification.data.inviterId))
  const group = createAsync(async () => await getGroup(props.notification.data.groupId))

  return (
    <Suspense>
      <Show when={group() != null && inviter() != null}>
        <NotificationItemBase
          datetime={props.notification.createdAt}
          icon={<GroupLogo group={group()!} />}
          title={t.NOTIFICATION.GROUP_JOIN_INVITATION.TITLE()}
          action={(
            <div class="flex gap-1 items-center">
              <Button class="text-xs h-6 hover:bg-background" size="sm" variant="secondary">
                {t.NOTIFICATION.MISC.ACTIONS.ACCEPT()}
              </Button>
              <Button class="text-xs h-6 hover:bg-background" size="sm" variant="ghost">
                {t.NOTIFICATION.MISC.ACTIONS.REJECT()}
              </Button>
            </div>
          )}
          description={t.NOTIFICATION.GROUP_JOIN_INVITATION.DESC({
            inviter: inviter()!.name,
            group: group()!.name
          })}
        />
      </Show>
    </Suspense>
  )
}

interface GroupJoinInvitationAcceptedItemProps {
  notification: NotificationResource<GroupJoinInvitationAcceptedNotification>
}

export const GroupJoinInvitationAcceptedItem: Component<GroupJoinInvitationAcceptedItemProps> = (props) => {
  const t = useI18n()
  const group = createAsync(async () => await getGroup(props.notification.data.groupId))
  const invitee = createAsync(async () => await getUser(props.notification.data.inviteeId))

  return (
    <Suspense>
      <Show when={group() != null && invitee() != null}>
        <NotificationItemBase
          datetime={props.notification.createdAt}
          icon={<GroupLogo group={group()!} />}
          title={t.NOTIFICATION.GROUP_JOIN_INVITATION_ACCEPTED.TITLE()}
          description={t.NOTIFICATION.GROUP_JOIN_INVITATION_ACCEPTED.DESC({
            group: group()!.name,
            invitee: invitee()!.name
          })}
        />
      </Show>
    </Suspense>
  )
}

interface GroupJoinInvitationRejectedItemProps {
  notification: NotificationResource<GroupJoinInvitationRejectedNotification>
}

export const GroupJoinInvitationRejectedItem: Component<GroupJoinInvitationRejectedItemProps> = (props) => {
  const t = useI18n()
  const group = createAsync(async () => await getGroup(props.notification.data.groupId))
  const invitee = createAsync(async () => await getUser(props.notification.data.inviteeId))

  return (
    <Suspense>
      <Show when={group() != null && invitee() != null}>
        <NotificationItemBase
          datetime={props.notification.createdAt}
          icon={<GroupLogo group={group()!} />}
          title={t.NOTIFICATION.GROUP_JOIN_INVITATION_REJECTED.TITLE()}
          description={t.NOTIFICATION.GROUP_JOIN_INVITATION_REJECTED.DESC({
            group: group()!.name,
            invitee: invitee()!.name
          })}
        />
      </Show>
    </Suspense>
  )
}
