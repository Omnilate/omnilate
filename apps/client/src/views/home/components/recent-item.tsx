import { createResource, Suspense } from 'solid-js'
import type { Component } from 'solid-js'
import { A } from '@solidjs/router'

import type { ProjectBaseResource } from '@/apis/project'
import GroupLogo from '@/components/group-logo'
import { getGroup } from '@/apis/groups'
import { useI18n } from '@/utils/i18n'

interface RecentItemProps extends ProjectBaseResource {}

const RecentItem: Component<RecentItemProps> = (props) => {
  const t = useI18n()
  const [group] = createResource(
    () => props.groupId,
    async (gid) => {
      const group = await getGroup(gid)
      return group
    }
  )

  return (
    <A class="flex flex-col gap-1 rounded shadow p-(y-2 x-4) transition-(shadow) hover:(shadow-lg)" href={`/groups/${props.groupId}/projects/${props.id}`}>
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
            {t.RECENTPROJ.ITEM.OWNED_BY({ groupName: group()?.name ?? '...' })}
          </span>
        </div>
      </Suspense>
    </A>
  )
}

export default RecentItem
