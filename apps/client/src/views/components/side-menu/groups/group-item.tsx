import type { Component } from 'solid-js'

import type { GroupBaseResource } from '@/apis/groups'
import GroupLogo from '@/components/group-logo'

type GroupItemProps = GroupBaseResource

const GroupItem: Component<GroupItemProps> = (props) => {
  return (
    <div class="flex items-center gap-2 py-1 px-2 b-rounded-xl hover:bg-gray-200 transition-[background-color] cursor-pointer">
      <GroupLogo class="size-8" group={props} />
      <div>
        <div>{props.name}</div>
        <div class="text-gray text-xs">{props.description}</div>
      </div>
    </div>
  )
}

export default GroupItem
