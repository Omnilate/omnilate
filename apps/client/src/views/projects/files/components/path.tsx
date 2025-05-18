import { A } from '@solidjs/router'
import { createMemo, For, Show } from 'solid-js'
import type { Component } from 'solid-js'

interface PathProps {
  projectName: string
  baseLocation: string
  rawNodePath: string
}

const Path: Component<PathProps> = (props) => {
  const nodesOnPath = createMemo(() => {
    const decodedNames =
      props.rawNodePath === ''
        ? []
        : props.rawNodePath.split('/').map(decodeURI)

    const root = {
      name: props.projectName,
      path: '',
      isLast: decodedNames.length === 0
    }

    return [root, ...decodedNames.map(
      (name, index, names) => {
        const path = names.slice(0, index + 1).join('/')
        return {
          name,
          path,
          isLast: index === names.length - 1
        }
      }
    )]
  })

  return (
    <div class="flex items-center w-full gap-2">
      <For each={nodesOnPath()}>
        {(node) => {
          return (
            <>
              <A
                class="p-(x-2 y-1) rounded-full bg-background shadow text-sm text-gray-500 hover:(text-gray-700 dark:text-gray-300) transition-color"
                href={`${props.baseLocation}/${node.path}`}
              >
                {node.name}
              </A>
              <Show when={!node.isLast}>
                <span>/</span>
              </Show>
            </>
          )
        }}
      </For>
    </div>
  )
}

export default Path
