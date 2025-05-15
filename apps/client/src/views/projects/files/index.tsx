import type { RouteSectionProps } from '@solidjs/router'
import { createEffect, createSignal, Match, Switch } from 'solid-js'
import type { Component } from 'solid-js'
import type { ProjectDirectory } from '@omnilate/schema'

import { useProject } from '@/stores/project'

import FileView from './components/file'
import Path from './components/path'
import Directory from './components/directory'
import CoEditors from './components/co-editors'

interface FilesViewProps extends RouteSectionProps {}

const FilesView: Component<FilesViewProps> = (props) => {
  const [nodeType, setNodeType] = createSignal<'directory' | 'file'>()
  const { yProject, projectMeta } = useProject()
  const nodePath = (): string[] => props.params.path === ''
    ? []
    : props.params.path.split('/').map(decodeURI)
  const baseLocation = (): string => props.location.pathname.slice(0, -props.params.path.length - 1)
  const recordQuery = (): string => props.location.query.record as string
  const nodeName = (): string => nodePath().at(-1)!

  // eslint-disable-next-line solid/reactivity
  createEffect(async () => {
    try {
      const currentNode = nodePath().reduce<ProjectDirectory | ProjectFileInfo>(
        (prev, curr) => {
          if (prev.type !== 'directory') {
            throw new Error('Invalid path')
          }

          return prev.children[curr]
        }, yProject()?.directoryRoot ?? { type: 'file' /** invalid initial value type */ }
      )

      setNodeType(currentNode.type)
    } catch {}
  })

  return (
    <div class="flex flex-col w-full">
      <div class="flex items-center justify-between p-4">
        <Path baseLocation={baseLocation()} projectName={projectMeta()?.name ?? 'Project Root'} rawNodePath={props.params.path} />
        <CoEditors />
      </div>
      <div class="flex flex-col flex-1">
        <Switch>
          <Match when={nodeType() === 'directory'}>
            <Directory baseUrl={baseLocation()} dirPath={nodePath()} />
          </Match>
          <Match when={nodeType() === 'file'}>
            <FileView baseUrl={baseLocation()} filePath={nodePath()} recordName={recordQuery()} />
          </Match>
        </Switch>
      </div>
    </div>
  )
}

export default FilesView
