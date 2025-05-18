import type { Component, JSX } from 'solid-js'

import { cn } from '@/utils/cn'

interface IconProps extends JSX.HTMLAttributes<HTMLSpanElement> {
  stroke?: string | number
}

const Icon: Component<IconProps> = (props) => {
  return (
    <span {...props} class={cn('size-1em *:size-full *:color-inherit', props.class)} >
      {props.children}
    </span>
  )
}

export default Icon
