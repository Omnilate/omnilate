import type { Component } from 'solid-js'
import { createResource, For, Suspense } from 'solid-js'

import { getGroupMember } from '@/apis/groups'
import { useGroupModel } from '@/stores/group'
import { useProject } from '@/stores/project'
import GroupMemberAvatar from '@/views/groups/components/group-member-avatar'

const CoEditors: Component = () => {
  const { currentGroup } = useGroupModel()
  const { awareness } = useProject()

  const [coEditors] = createResource(
    () => ({ awareness: awareness(), group: currentGroup() }),
    async ({ awareness, group }) => {
      if (group == null || awareness == null) {
        return
      }

      const uidList = Array.from(
        new Set(
          Object.values(awareness).map((value) => value.uid)
        )
      )

      const users = await Promise.all(
        uidList.map(async (uid) => {
          return await getGroupMember(group.id, uid)
        })
      )

      return users
    }
  )

  return (
    <div class="flex">
      <Suspense fallback="loading">
        <div class="flex gap-2 items-center">
          <For each={coEditors()}>
            {(editor) => (<GroupMemberAvatar {...editor} />)}
          </For>
        </div>
      </Suspense>
    </div>
  )
}

export default CoEditors
