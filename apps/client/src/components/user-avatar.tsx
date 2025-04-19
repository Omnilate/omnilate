import { A } from '@solidjs/router'
import type { Component } from 'solid-js'
import { createResource } from 'solid-js'

import { getUser } from '@/apis/user'
import type { UserBaseResource } from '@/apis/user'
import { cn } from '@/utils/cn'
import { getUserColor } from '@/utils/user-color'
import { getContrastTextColor } from '@/utils/contrast-text-color'

import { Image, ImageFallback, ImageRoot } from './ui/image'

type UserAvatarProps = {
  class?: string
} & ({
  id: number
} | {
  user: UserBaseResource
})

const UserAvatar: Component<UserAvatarProps> = (props) => {
  const [user] = createResource(async () => {
    if ('user' in props) {
      return props.user
    }
    return await getUser(props.id)
  })
  const bgColor = (): string => getUserColor(user()?.id ?? 0)

  return (
    <A class={cn('size-10', props.class)} href={`/user/${user()?.id ?? 0}`}>
      <ImageRoot >
        <Image alt={user()?.name ?? 'User Avatar'} class="size-full" src={user()?.avatarUrl} />
        <ImageFallback
          class="bg-[--bg-color] text-[--text-color] size-full"
          style={{
            '--bg-color': bgColor(),
            '--text-color': getContrastTextColor(bgColor())
          }}
        >
          {(user()?.name?.[0] ?? 'User')}
        </ImageFallback>
      </ImageRoot>
    </A>
  )
}

export default UserAvatar
