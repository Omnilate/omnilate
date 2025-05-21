import type { ProjectDirectory, ProjectFile } from '@omnilate/schema'
import { A } from '@solidjs/router'
import type { Component } from 'solid-js'
import { createMemo, createResource, createSignal, For, Suspense, Show } from 'solid-js'

import { ChevronUpDownIcon, DocumentIcon, FolderIcon, PlusIcon } from '@/assets/icons'
import Icon from '@/components/icon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ToggleButton } from '@/components/ui/toggle'
import { useProject } from '@/stores/project'
import NewNodeDialog from '@/components/new-node-dialog'
import { serializeDateTime } from '@/utils/serialize-datetime'

interface DirectoryProps {
  dirPath: string[]
  baseUrl?: string
}

const Directory: Component<DirectoryProps> = (props) => {
  const [dialogShown, setDialogShown] = createSignal(false)
  const { yProject } = useProject()
  const [directory, { refetch: refetchDir }] = createResource(
    () => ({ project: yProject(), path: props.dirPath }),
    async ({ project, path }) => {
      if (project == null) {
        return
      }

      const node = await project.getMappedNode(path)
      if (node.type !== 'directory') {
        throw new Error('Invalid path')
      }
      return node
    }
  )
  const [asc, setAsc] = createSignal(true)
  const dirName = (): string => props.dirPath.at(-1) ?? 'Root Directory'

  const subnodeList = createMemo((): Array<
    [string, ProjectDirectory | ProjectFile]
  > => Object.entries(directory()?.children ?? {}).sort(
    (a, b) => {
      if (a[1].type === 'file' && b[1].type === 'directory') {
        return 1
      }
      if (a[1].type === 'directory' && b[1].type === 'file') {
        return -1
      }

      if (asc()) {
        return a[0].localeCompare(b[0])
      } else {
        return b[0].localeCompare(a[0])
      }
    }
  ))

  const handleNewNodeClick = (): void => {
    setDialogShown(true)
  }

  const handleDialogClose = async (): Promise<void> => {
    setDialogShown(false)
    await refetchDir()
  }

  return (
    <div class="flex-1 flex w-full flex-col gap-4 px-4">
      <NewNodeDialog initialPath={props.dirPath} show={dialogShown()} onClose={handleDialogClose} />
      <div class="flex w-full justify-between items-center">
        <div class="flex gap-2">
          <div class="text-3xl font-900">{dirName()}</div>
          <Badge class="h-fit">Directory</Badge>
        </div>
        <div class="flex gap-2">
          <ToggleButton class="transition-width"
            pressed={asc()}
            variant="outline"
            onChange={setAsc}
          >
            <Icon>
              <ChevronUpDownIcon />
            </Icon>
            {asc() ? 'Ascending' : 'Descending'}
          </ToggleButton>
          <Button class="gap-1" onClick={handleNewNodeClick}>
            <Icon>
              <PlusIcon />
            </Icon>
            New
          </Button>
        </div>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <Show when={subnodeList().length > 0}
          fallback={(
            <div flex-1 class="flex-1 font-700 opacity-50 flex justify-center items-center text-xl">
              Empty
            </div>
          )}
        >
          <For each={subnodeList()}>
            {([name, node]) => {
              return (
                <A
                  class="flex items-center justify-between ml-2 py-2 px-4 mr-2 rounded-xl bg-background hover:(shadow) transition-shadow"
                  href={`${props.baseUrl ?? ''}${props.dirPath.length > 0 ? `/${props.dirPath.join('/')}` : ''}/${name}`}
                >
                  <div class="flex gap-2 items-center">
                    <Icon>
                      <Show fallback={<DocumentIcon />} when={node.type === 'directory'}>
                        <FolderIcon />
                      </Show>
                    </Icon>
                    <span>{name}</span>
                  </div>
                  <Show when={node.type === 'file'}>
                    <span class="text-xs text-gray-500">
                      {'Updated on '}
                      {serializeDateTime(new Date((node as ProjectFile).updatedAt))}
                    </span>
                  </Show>
                </A>
              )
            }}
          </For>
        </Show>
      </Suspense>
    </div>
  )
}

export default Directory
