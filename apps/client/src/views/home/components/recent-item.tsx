import { createResource, Suspense } from 'solid-js'
import type { Component } from 'solid-js'
import { A } from '@solidjs/router'

import type { ProjectBaseResource } from '@/apis/project'
import GroupLogo from '@/components/group-logo'
import { getGroup } from '@/apis/groups'

interface RecentItemProps extends ProjectBaseResource {}

const RecentItem: Component<RecentItemProps> = (props) => {
  const [group] = createResource(
    () => props.groupId,
    async (gid) => {
      const group = await getGroup(gid)
      return group
    }
  )

  return (
    <A class="flex flex-col gap-1 rounded shadow p-(y-2 x-4) transition-(shadow) hover:(shadow-lg)" href={`/project/${props.groupId}/${props.id}`}>
      <div class="text-lg font-500">{props.name}</div>
      <div class="text-(sm gray-500) flex-1">
        {
          props.description === ''
            ? 'No description'
            : props.description
        }
      </div>
      <Suspense>
        <div class="flex items-center gap-2 self-end">
          <GroupLogo class="size-6" id={props.groupId} />
          <span class="text-(gray-500 sm)">
            {'owned by '}
            {group()?.name}
          </span>
        </div>
      </Suspense>
    </A>
  )
}

export default RecentItem
