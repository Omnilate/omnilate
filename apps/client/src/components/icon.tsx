import type { Component, JSX } from 'solid-js'

import { cn } from '@/utils/cn'

interface IconProps {
  children: JSX.Element
  class?: string
}

const Icon: Component<IconProps> = (props) => {
  return (
    <span class={cn('size-1em color-inherit *:size-full *:color-inherit', props.class)}>
      {props.children}
    </span>
  )
}

export default Icon
