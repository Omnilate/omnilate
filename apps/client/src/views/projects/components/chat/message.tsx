import type { ProjectChatMessage } from '@omnilate/schema'
import type { Component } from 'solid-js'

import { useUserModel } from '@/stores/user'
import UserAvatar from '@/components/user-avatar'
import { serializeDateTime } from '@/utils/serialize-datetime'

interface MessageProps extends ProjectChatMessage {}

const Message: Component<MessageProps> = (props) => {
  const { userModel } = useUserModel()
  const isFromMe = (): boolean => props.authorId === userModel.id

  return (
    <div class="flex w-full items-end gap-2"
      classList={{ 'flex-row-reverse': isFromMe() }}
    >
      <UserAvatar uid={props.authorId} />
      <div class="hyphens-auto bg-primary text-primary-foreground py-2 px-4 rounded-xl">
        {props.content}
      </div>
      <div class="text-(xs gray)">{serializeDateTime(new Date(props.createdAt))}</div>
    </div>
  )
}

export default Message
