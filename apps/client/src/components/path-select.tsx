import { createResource, createSignal, For, Show } from 'solid-js'
import type { Component } from 'solid-js'

import type { ProjectOnYjs } from '@/y/project-on-yjs'
import { FolderIcon, XMarkIcon } from '@/assets/icons'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import Icon from './icon'
import { Button } from './ui/button'

interface PathSelectProps {
  project?: ProjectOnYjs
  value: string[]
  onChange: (value: string[]) => void
}

const PathSelect: Component<PathSelectProps> = (props) => {
  const [dirListUpdated, setDirListUpdated] = createSignal(false)
  const [dirListUnderCurrentPath] = createResource(
    () => ({ project: props.project, path: props.value }),
    async ({ project, path }) => {
      if (project == null) {
        return
      }

      const node = await project.getMappedNode(path)
      if (node.type !== 'directory') {
        throw new Error('Invalid path')
      }
      setDirListUpdated(true)
      return Object.entries(node.children).filter(
        ([, v]) => v.type === 'directory'
      ).map(([k]) => k)
    }
  )

  const handleSelectValueChange = (v: string[]): void => {
    if (v.length === props.value.length && v.every((item, index) => item === props.value[index])) {
      return
    }

    if (dirListUpdated() && v.length === 0) {
      setDirListUpdated(false)
      return
    }

    if (v.length !== 0) {
      props.onChange([...props.value, ...v])
    } else {
      props.onChange(v)
    }
  }

  return (
    <Select<string>
      multiple
      options={dirListUnderCurrentPath() ?? []}
      placeholder="Select a path, leave empty for root directory"
      value={props.value}
      itemComponent={(props) => (
        <SelectItem item={props.item}>
          <span class="inline-flex items-center gap-2">
            <Icon class="inline-block">
              <FolderIcon />
            </Icon>
            {props.item.rawValue}
          </span>
        </SelectItem>
      )}
      onChange={handleSelectValueChange}
    >
      <SelectTrigger>
        <SelectValue<string> class="flex flex-1 justify-between">
          {
            (state) => (
              <>
                <div class="flex gap-4 h-fit items-center">
                  <For each={props.value}>
                    {(item, index) => (
                      <>
                        <div class="flex items-center p-(y-0.5 x-2) rounded-xl shadow">
                          {item}
                        </div>
                        <Show when={index() !== props.value.length - 1}>
                          /
                        </Show>
                      </>
                    )}
                  </For>
                </div>
                <Button class="size-6"
                  size="icon"
                  variant="round"
                  onClick={(() => { state.clear() })}
                >
                  <Icon>
                    <XMarkIcon />
                  </Icon>
                </Button>
              </>
            )
          }
        </SelectValue>
      </SelectTrigger>
      <SelectContent class="*:my-1" />
    </Select>
  )
}

export default PathSelect
