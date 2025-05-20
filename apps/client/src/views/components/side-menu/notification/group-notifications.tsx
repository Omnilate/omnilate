import type {
  GroupJoinInvitationAcceptedNotification,
  GroupJoinInvitationNotification,
  GroupJoinInvitationRejectedNotification,
  GroupJoinRequestAcceptedNotification,
  GroupJoinRequestNotification,
  GroupJoinRequestRejectedNotification,
  GroupNewMemberAnnouncementNotification
} from '@omnilate/schema/dist/users/notifications/groups'
import { createAsync } from '@solidjs/router'
import type { Component } from 'solid-js'
import { createSignal, Show, Suspense } from 'solid-js'
import { toast } from 'solid-sonner'

import { getGroup, reviewInvitation, reviewJoinRequest } from '@/apis/groups'
import type { NotificationResource } from '@/apis/notification'
import { markNotificationAsOperated } from '@/apis/notification'
import { getUser } from '@/apis/user'
import GroupLogo from '@/components/group-logo'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/utils/i18n'

import { NotificationItemBase } from './notification-item'

interface GroupJoinInvitationItemProps {
  notification: NotificationResource<GroupJoinInvitationNotification>
}

export const GroupJoinInvitationItem: Component<GroupJoinInvitationItemProps> = (props) => {
  const t = useI18n()
  const inviter = createAsync(async () => await getUser(props.notification.data.inviterId))
  const group = createAsync(async () => await getGroup(props.notification.data.groupId))
  const [operated, setOperated] = createSignal(props.notification.operated)

  const handleAccept = async (): Promise<void> => {
    setOperated(true)
    await reviewInvitation({
      gid: props.notification.data.groupId,
      inviteeId: props.notification.data.inviteeId,
      inviterId: props.notification.data.inviterId,
      status: 'ACCEPTED'
    })
    await markNotificationAsOperated(props.notification.id)
    toast.success(t.NOTIFICATION.MISC.TOAST.ACCEPT_SUCCESS())
  }

  const handleReject = async (): Promise<void> => {
    setOperated(true)
    await reviewInvitation({
      gid: props.notification.data.groupId,
      inviteeId: props.notification.data.inviteeId,
      inviterId: props.notification.data.inviterId,
      status: 'REJECTED'
    })
    await markNotificationAsOperated(props.notification.id)
    toast.success(t.NOTIFICATION.MISC.TOAST.REJECT_SUCCESS())
  }

  return (
    <Suspense>
      <Show when={group() != null && inviter() != null}>
        <NotificationItemBase
          datetime={props.notification.createdAt}
          icon={<GroupLogo group={group()!} />}
          id={props.notification.id}
          operated={operated()}
          read={props.notification.read}
          title={t.NOTIFICATION.GROUP_JOIN_INVITATION.TITLE()}
          action={
            (operated) => (
              <Suspense>
                <Show when={!operated}
                  fallback={(
                    <div class="text-xs text-muted-foreground">
                      {t.NOTIFICATION.MISC.ACTIONS.OPERATED()}
                    </div>
                  )}
                >
                  <div class="flex gap-1 items-center">
                    <Button class="text-xs h-6 hover:bg-background"
                      size="sm"
                      variant="secondary"
                      onClick={handleAccept}
                    >
                      {t.NOTIFICATION.MISC.ACTIONS.ACCEPT()}
                    </Button>
                    <Button class="text-xs h-6 hover:bg-background"
                      size="sm"
                      variant="ghost"
                      onClick={handleReject}
                    >
                      {t.NOTIFICATION.MISC.ACTIONS.REJECT()}
                    </Button>
                  </div>
                </Show>
              </Suspense>
            )
          }
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
          id={props.notification.id}
          read={props.notification.read}
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
          id={props.notification.id}
          read={props.notification.read}
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

interface GroupJoinRequestItemProps {
  notification: NotificationResource<GroupJoinRequestNotification>
}

export const GroupJoinRequestItem: Component<GroupJoinRequestItemProps> = (props) => {
  const t = useI18n()
  const group = createAsync(async () => await getGroup(props.notification.data.groupId))
  const user = createAsync(async () => await getUser(props.notification.data.userId))
  const [operated, setOperated] = createSignal(props.notification.operated)

  const handleAccept = async (): Promise<void> => {
    setOperated(true)
    await reviewJoinRequest({
      gid: props.notification.data.groupId,
      uid: props.notification.data.userId,
      status: 'ACCEPTED'
    })
    await markNotificationAsOperated(props.notification.id)
    toast.success(t.NOTIFICATION.MISC.TOAST.ACCEPT_SUCCESS())
  }

  const handleReject = async (): Promise<void> => {
    setOperated(true)
    await reviewJoinRequest({
      gid: props.notification.data.groupId,
      uid: props.notification.data.userId,
      status: 'REJECTED'
    })
    await markNotificationAsOperated(props.notification.id)
    toast.success(t.NOTIFICATION.MISC.TOAST.REJECT_SUCCESS())
  }

  return (
    <Suspense>
      <Show when={group() != null && user() != null}>
        <NotificationItemBase
          datetime={props.notification.createdAt}
          icon={<GroupLogo group={group()!} />}
          id={props.notification.id}
          operated={operated()}
          read={props.notification.read}
          title={t.NOTIFICATION.GROUP_JOIN_REQUEST.TITLE()}
          action={
            (operated) => (
              <Suspense>
                <Show when={!operated}
                  fallback={(
                    <div class="text-xs text-muted-foreground">
                      {t.NOTIFICATION.MISC.ACTIONS.OPERATED()}
                    </div>
                  )}
                >
                  <div class="flex gap-1 items-center">
                    <Button class="text-xs h-6 hover:bg-background"
                      size="sm"
                      variant="secondary"
                      onClick={handleAccept}
                    >
                      {t.NOTIFICATION.MISC.ACTIONS.ACCEPT()}
                    </Button>
                    <Button class="text-xs h-6 hover:bg-background"
                      size="sm"
                      variant="ghost"
                      onClick={handleReject}
                    >
                      {t.NOTIFICATION.MISC.ACTIONS.REJECT()}
                    </Button>
                  </div>
                </Show>
              </Suspense>
            )
          }
          description={t.NOTIFICATION.GROUP_JOIN_REQUEST.DESC({
            user: user()!.name,
            group: group()!.name
          })}
        />
      </Show>
    </Suspense>
  )
}

interface GroupJoinRequestAcceptedItemProps {
  notification: NotificationResource<GroupJoinRequestAcceptedNotification>
}

export const GroupJoinRequestAcceptedItem: Component<GroupJoinRequestAcceptedItemProps> = (props) => {
  const t = useI18n()
  const group = createAsync(async () => await getGroup(props.notification.data.groupId))

  return (
    <Suspense>
      <Show when={group() != null}>
        <NotificationItemBase
          datetime={props.notification.createdAt}
          icon={<GroupLogo group={group()!} />}
          id={props.notification.id}
          read={props.notification.read}
          title={t.NOTIFICATION.GROUP_JOIN_REQUEST_ACCEPTED.TITLE()}
          description={t.NOTIFICATION.GROUP_JOIN_REQUEST_ACCEPTED.DESC({
            group: group()!.name
          })}
        />
      </Show>
    </Suspense>
  )
}

interface GroupJoinRequestRejectedItemProps {
  notification: NotificationResource<GroupJoinRequestRejectedNotification>
}

export const GroupJoinRequestRejectedItem: Component<GroupJoinRequestRejectedItemProps> = (props) => {
  const t = useI18n()
  const group = createAsync(async () => await getGroup(props.notification.data.groupId))

  return (
    <Suspense>
      <Show when={group() != null}>
        <NotificationItemBase
          datetime={props.notification.createdAt}
          icon={<GroupLogo group={group()!} />}
          id={props.notification.id}
          read={props.notification.read}
          title={t.NOTIFICATION.GROUP_JOIN_REQUEST_REJECTED.TITLE()}
          description={t.NOTIFICATION.GROUP_JOIN_REQUEST_REJECTED.DESC({
            group: group()!.name
          })}
        />
      </Show>
    </Suspense>
  )
}

interface GroupNewMemberAnnouncementItemProps {
  notification: NotificationResource<GroupNewMemberAnnouncementNotification>
}

export const GroupNewMemberAnnouncementItem: Component<GroupNewMemberAnnouncementItemProps> = (props) => {
  const t = useI18n()
  const group = createAsync(async () => await getGroup(props.notification.data.groupId))
  const newMember = createAsync(async () => await getUser(props.notification.data.newMemberId))

  return (
    <Suspense>
      <Show when={group() != null && newMember() != null}>
        <NotificationItemBase
          datetime={props.notification.createdAt}
          icon={<GroupLogo group={group()!} />}
          id={props.notification.id}
          read={props.notification.read}
          title={t.NOTIFICATION.GROUP_NEW_MEMBER_ANNOUNCEMENT.TITLE()}
          description={t.NOTIFICATION.GROUP_NEW_MEMBER_ANNOUNCEMENT.DESC({
            group: group()!.name,
            newMember: newMember()!.name
          })}
        />
      </Show>
    </Suspense>
  )
}
