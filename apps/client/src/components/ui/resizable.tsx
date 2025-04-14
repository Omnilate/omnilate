import type { DynamicProps, HandleProps, RootProps } from '@corvu/resizable'
import ResizablePrimitive from '@corvu/resizable'
import { Show, splitProps } from 'solid-js'
import type { ValidComponent, VoidProps, JSX } from 'solid-js'

import { cn } from '@/utils/cn'

export const ResizablePanel = ResizablePrimitive.Panel

type resizableProps<T extends ValidComponent = 'div'> = RootProps<T> & {
  class?: string;
}

export const Resizable = <T extends ValidComponent = 'div'>(
  props: DynamicProps<T, resizableProps<T>>
): JSX.Element => {
  const [local, rest] = splitProps(props as resizableProps, ['class'])

  return <ResizablePrimitive class={cn('size-full', local.class)} {...rest} />
}

type resizableHandleProps<T extends ValidComponent = 'button'> = VoidProps<
  HandleProps<T> & {
    class?: string;
    withHandle?: boolean;
  }
>

export const ResizableHandle = <T extends ValidComponent = 'button'>(
  props: DynamicProps<T, resizableHandleProps<T>>
): JSX.Element => {
  const [local, rest] = splitProps(props as resizableHandleProps, [
    'class',
    'withHandle'
  ])

  return (
    <ResizablePrimitive.Handle
      class={cn(
        'flex border-0 p-0 w-px items-center justify-center bg-border focus-visible:(outline-none ring-1.5 ring-ring ring-offset-1) data-[orientation=vertical]:(h-px w-full) transition-shadow',
        local.class
      )}
      {...rest}
    >
      <Show when={local.withHandle}>
        <div class="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
          <svg
            class="h-2.5 w-2.5"
            viewBox="0 0 15 15"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clip-rule="evenodd"
              d="M5.5 4.625a1.125 1.125 0 1 0 0-2.25a1.125 1.125 0 0 0 0 2.25m4 0a1.125 1.125 0 1 0 0-2.25a1.125 1.125 0 0 0 0 2.25M10.625 7.5a1.125 1.125 0 1 1-2.25 0a1.125 1.125 0 0 1 2.25 0M5.5 8.625a1.125 1.125 0 1 0 0-2.25a1.125 1.125 0 0 0 0 2.25m5.125 2.875a1.125 1.125 0 1 1-2.25 0a1.125 1.125 0 0 1 2.25 0M5.5 12.625a1.125 1.125 0 1 0 0-2.25a1.125 1.125 0 0 0 0 2.25"
              fill="currentColor"
              fill-rule="evenodd"
            />
            <title>Resize handle</title>
          </svg>
        </div>
      </Show>
    </ResizablePrimitive.Handle>
  )
}
