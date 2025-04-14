import { createSignal, onMount, Show } from 'solid-js'
import type { Component } from 'solid-js'

import { cn } from '@/utils/cn'

interface AvatarProps {
  class?: string
  uid: number | string
}

const Avatar: Component<AvatarProps> = (props) => {
  const [loaded, setLoaded] = createSignal(false)
  const handleLoaded = (): void => {
    setLoaded(true)
  }

  onMount(() => {
    const img = new Image()
    img.onload = handleLoaded
    img.src = 'https://picsum.photos/200'
  })

  return (
    <a href={`/user/${props.uid}`}
      class={
        cn(
          props.class,
          'flex items-center justify-center w-10 h-10 overflow-hidden rounded-full'
        )
      }
    >
      <Show fallback={<div>{props.uid}</div>} when={loaded()}>
        <img
          alt={props.uid.toString()}
          class="block object-cover size-full"
          src="https://picsum.photos/200"
          onLoad={handleLoaded}
        />
      </Show>
    </a>
  )
}

export default Avatar
