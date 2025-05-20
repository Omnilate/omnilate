import { Switch, Match, Show } from 'solid-js'
import type { Component } from 'solid-js'
import type { TooltipTriggerProps } from '@kobalte/core/tooltip'

import type { UserGroupResource } from '@/apis/user'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import UserAvatar from '@/components/user-avatar'
import { Badge } from '@/components/ui/badge'
import { useProject } from '@/stores/project'
import { cn } from '@/utils/cn'
import { useI18n } from '@/utils/i18n'

interface GroupMemberAvatarProps extends UserGroupResource {
  class?: string
}

const GroupMemberAvatar: Component<GroupMemberAvatarProps> = (props) => {
  const { awareness } = useProject()
  const userAwarenessInfo = () => {
    if (awareness() == null) {
      return
    }
    return Object.values(awareness()!).find((value) => value.uid === props.id)
  }
  const t = useI18n()

  return (
    <Tooltip>
      <TooltipTrigger
        as={(p: TooltipTriggerProps) => (
          <UserAvatar {...p}
            ref={p.ref as HTMLAnchorElement}
            class={cn(props.class, 'size-12')}
            user={props}
          />
        )}
      />
      <TooltipContent class="flex flex-col items-center gap-2 p-4">
        <UserAvatar class="size-20" user={props} />
        <Badge variant="secondary">{t.GROUPROLE[props.role]()}</Badge>
        <div class="text-4 font-700">{props.name}</div>
        <div>{props.description}</div>
        <Show when={awareness()}>
          <div>
            {
              userAwarenessInfo()!.active
                ? t.MEMBER_AVATAR.WORKING_ON({ filePath: userAwarenessInfo()!.workingOn.filePath.join('/') })
                : t.MEMBER_AVATAR.IDLE()
            }
          </div>
        </Show>
      </TooltipContent>
    </Tooltip>
  )
}

export default GroupMemberAvatar
