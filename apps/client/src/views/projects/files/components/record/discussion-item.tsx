import type { Discussion } from '@omnilate/schema'
import type { Component } from 'solid-js'
import { createResource } from 'solid-js'

import { getGroupMember } from '@/apis/groups'
import { Badge } from '@/components/ui/badge'
import { useGroupModel } from '@/stores/group'
import { serializeDateTime } from '@/utils/serialize-datetime'
import GroupMemberAvatar from '@/views/groups/components/group-member-avatar'

interface DiscussionItemProps {
  discussion: Discussion
}

const DiscussionItem: Component<DiscussionItemProps> = (props) => {
  const { currentGroup } = useGroupModel()
  const [user] = createResource(
    () => ({ uid: props.discussion.authorId, gid: currentGroup()?.id }),
    async ({ uid, gid }) => {
      if (gid == null) {
        return
      }

      return await getGroupMember(gid, uid)
    }
  )

  return (
    <div class="flex gap-8 items-start px-4">
      {user() != null && (
        <div class="flex flex-col items-center gap-1">
          <GroupMemberAvatar {...user()!} class="size-16!" />
          <Badge>{user()!.role}</Badge>
          <div class="font-500">{user()!.name}</div>
        </div>
      )}
      <div class="flex flex-1 h-full flex-col gap-4">
        <div class="flex-1">{props.discussion.content}</div>
        <div class="self-end text-(sm slate)">
          {
            serializeDateTime(props.discussion.createdAt)
          }
        </div>
      </div>
    </div>
  )
}

export default DiscussionItem
