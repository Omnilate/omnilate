import { createResource, For, Show } from 'solid-js'
import type { Component } from 'solid-js'
import { A } from '@solidjs/router'

import { getUserGroups } from '@/apis/user'
import GroupLogo from '@/components/group-logo'
import { Separator } from '@/components/ui/separator'

interface GroupsProps {
  userId: number
}

const Groups: Component<GroupsProps> = (props) => {
  const [groups] = createResource(
    () => props.userId,
    async (uid: number) => {
      return await getUserGroups(uid)
    }
  )

  return (
    <div class="flex flex-col gap-4">
      <div class="text-2xl font-900">Groups</div>
      <Separator />
      <div class="flex justify-between">
        <Show when={groups() != null || (groups() ?? []).length > 0}
          fallback={(
            <div class="flex flex-1 items-center justify-center w-full h-32 text-slate">
              No groups
            </div>
          )}
        >
          <For each={groups()}>
            {(group) => (
              <A
                class="flex gap-4 items-center rounded-xl shadow-md bg-background p-4 hover:(shadow-lg bg-accent) transition-shadow transition-colors"
                href={`/groups/${group.id}`}
              >
                <GroupLogo group={group} />
                <Separator orientation="vertical" />
                <div class="flex flex-col gap-1">
                  <div class="font-700">{group.name}</div>
                  <div class="text-slate text-xs">{group.description || 'No description'}</div>
                </div>
              </A>
            )}
          </For>
        </Show>
      </div>
    </div>
  )
}

export default Groups
