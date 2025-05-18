import type { Component } from 'solid-js'
import { A } from '@solidjs/router'

import type { GroupBaseResource } from '@/apis/groups'
import GroupLogo from '@/components/group-logo'

type GroupItemProps = GroupBaseResource

const GroupItem: Component<GroupItemProps> = (props) => {
  return (
    <A class="flex items-center gap-2 py-1 px-2 b-rounded-xl hover:bg-accent transition-[background-color] cursor-pointer" href={`/groups/${props.id}`}>
      <GroupLogo class="size-8" group={props} />
      <div>
        <div>{props.name}</div>
        <div class="text-gray text-xs">{props.description}</div>
      </div>
    </A>
  )
}

export default GroupItem
