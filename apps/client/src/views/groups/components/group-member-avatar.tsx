import { Switch, Match, Show } from 'solid-js'
import type { Component } from 'solid-js'
import type { TooltipTriggerProps } from '@kobalte/core/tooltip'

import type { UserGroupResource } from '@/apis/user'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import UserAvatar from '@/components/user-avatar'
import { Badge } from '@/components/ui/badge'
import { useProject } from '@/stores/project'

type GroupMemberAvatarProps = UserGroupResource

const GroupMemberAvatar: Component<GroupMemberAvatarProps> = (props) => {
  const { awareness } = useProject()
  const userAwarenessInfo = () => {
    if (awareness() == null) {
      return
    }
    return Object.values(awareness()!).find((value) => value.uid === props.id)
  }

  return (
    <Tooltip>
      <TooltipTrigger
        as={(p: TooltipTriggerProps) => (
          <UserAvatar {...p}
            ref={p.ref as HTMLAnchorElement}
            user={props}
          />
        )}
      />
      <TooltipContent class="flex flex-col items-center gap-2">
        <UserAvatar class="size-20" user={props} />
        <Badge variant="secondary">{props.role}</Badge>
        <div class="text-4 font-700">{props.name}</div>
        <div>{props.description}</div>
        <Show when={awareness()}>
          <div>
            {
              userAwarenessInfo()!.active
                ? `Working on /${userAwarenessInfo()!.workingOn.filePath.join('/')}`
                : 'Idle'
            }
          </div>
        </Show>
      </TooltipContent>
    </Tooltip>
  )
}

export default GroupMemberAvatar
