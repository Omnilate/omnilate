import { A } from '@solidjs/router'
import type { AnchorProps } from '@solidjs/router'
import type { Component, JSX } from 'solid-js'
import { createResource, Show } from 'solid-js'

import { getUser } from '@/apis/user'
import type { UserBaseResource } from '@/apis/user'
import { cn } from '@/utils/cn'
import { getUserColor } from '@/utils/user-color'
import { getContrastTextColor } from '@/utils/contrast-text-color'

import { Image, ImageFallback, ImageRoot } from './ui/image'

type UserAvatarUnion = {
  badge?: JSX.Element
} & ({
  uid: number
} | {
  user: UserBaseResource
})

type UserAvatarProps = Omit<AnchorProps, 'href'> & UserAvatarUnion

const UserAvatar: Component<UserAvatarProps> = (props) => {
  const [user] = createResource(async () => {
    if ('user' in props) {
      return props.user
    }
    return await getUser(props.uid)
  })
  const bgColor = (): string => getUserColor(user()?.id ?? 0)

  return (
    <A {...props} class={cn('size-10 relative inline-block', props.class)} href={`/users/${user()?.id ?? 0}`}>
      <ImageRoot class="size-full">
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
      <Show when={props.badge}>
        <div class="absolute bottom-0 left-[50%] transform-translate-x-[-50%]">{props.badge}</div>
      </Show>
    </A>
  )
}

export default UserAvatar
