import type { RouteSectionProps } from '@solidjs/router'
import { createEffect, createSignal, Match, Switch } from 'solid-js'
import type { Component } from 'solid-js'
import type { ProjectDirectory, ProjectFileInfo } from '@omnilate/schema'

import { useProject } from '@/stores/project'

import Editor from './components/editor'
import Path from './components/path'

interface FilesViewProps extends RouteSectionProps {}

const FilesView: Component<FilesViewProps> = (props) => {
  const [nodeType, setNodeType] = createSignal<'directory' | 'file'>()
  const { yProject, projectMeta, projectReady } = useProject()
  const nodePath = (): string[] => props.params.path === ''
    ? []
    : props.params.path.split('/').map(decodeURI)
  const baseLocation = (): string => props.location.pathname.slice(0, -props.params.path.length - 1)
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
    <div class="flex flex-col">
      <Path baseLocation={baseLocation()} projectName={projectMeta()?.name ?? 'Project Root'} rawNodePath={props.params.path} />
      <div>
        <Switch>
          <Match when={nodeType() === 'directory'}>
            dir
          </Match>
          <Match when={nodeType() === 'file'}>
            <Editor filePath={nodePath()} />
          </Match>
        </Switch>
      </div>
    </div>
  )
}

export default FilesView
