import { Switch, Match } from 'solid-js'
import type { Component } from 'solid-js'
import type { TooltipTriggerProps } from '@kobalte/core/tooltip'

import type { UserGroupResource } from '@/apis/user'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import UserAvatar from '@/components/user-avatar'
import { Badge } from '@/components/ui/badge'

type GroupMemberAvatarProps = UserGroupResource

const GroupMemberAvatar: Component<GroupMemberAvatarProps> = (props) => {
  return (
    <Tooltip>
      <TooltipTrigger
        as={(p: TooltipTriggerProps) => (
          <UserAvatar {...p}
            ref={p.ref as HTMLAnchorElement}
            badge={<RoleBadge role={props.role} />}
            class="size-14"
            user={props}
          />
        )}
      />
      <TooltipContent>
        <p>content</p>
      </TooltipContent>
    </Tooltip>
  )
}

const RoleBadge: Component<{ role: UserGroupResource['role'] }> = (props) => {
  return (
    <Switch>
      <Match when={props.role === 'OWNER'}>
        <Badge class="px-1" variant="default">
          Owner
        </Badge>
      </Match>
      <Match when={props.role === 'ADMIN'}>
        <Badge class="px-1" variant="secondary">
          Admin
        </Badge>
      </Match>
      <Match when={props.role === 'MEMBER'}>
        <Badge class="px-1" variant="outline">
          Member
        </Badge>
      </Match>
      <Match when={props.role === 'OBSERVER'}>
        <Badge class="px-1" variant="outline">
          Observer
        </Badge>
      </Match>
    </Switch>
  )
}

export default GroupMemberAvatar
