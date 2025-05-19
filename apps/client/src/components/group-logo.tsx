import { A } from '@solidjs/router'
import type { Component } from 'solid-js'

import type { GroupBaseResource } from '@/apis/groups'
import { cn } from '@/utils/cn'
import { getUserColor } from '@/utils/user-color'
import { getContrastTextColor } from '@/utils/contrast-text-color'

import { ImageFallback, ImageRoot } from './ui/image'

type GroupLogoProps = {
  class?: string
} & ({
  id: number
} | {
  group: GroupBaseResource
})

const GroupLogo: Component<GroupLogoProps> = (props) => {
  const bgColor = (): string => getUserColor('id' in props ? props.id : props.group.id)

  return (
    <A class={cn('size-10 shrink-0', props.class)} href={`/groups/${'id' in props ? props.id : props.group.id}`}>
      <ImageRoot class="size-full">
        {/* <Image alt={'Group Logo'} class="size-full" src={user()?.avatarUrl} /> */}
        <ImageFallback
          class="bg-[--bg-color] text-[--text-color] size-full text-[75%]"
          style={{
            '--bg-color': bgColor(),
            '--text-color': getContrastTextColor(bgColor())
          }}
        >
          {('group' in props ? props.group.name[0] : 'G')}
        </ImageFallback>
      </ImageRoot>
    </A>
  )
}

export default GroupLogo
