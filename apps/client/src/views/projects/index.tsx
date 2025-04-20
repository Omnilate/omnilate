import type { RouteSectionProps } from '@solidjs/router'
import { onMount, onCleanup, Show } from 'solid-js'
import type { Component } from 'solid-js'

import { useUserModel } from '@/stores/user'
import { ProjectOnYjs } from '@/y/project-on-yjs'
import { useProject } from '@/stores/project'
import { Button } from '@/components/ui/button'
import Icon from '@/components/icon'
import { CogIcon } from '@/assets/icons'

import Chat from './components/chat'

interface ProjectsProps extends RouteSectionProps {}

const ProjectsView: Component<ProjectsProps> = (props) => {
  const { userModel } = useUserModel()
  const { setProject, projectMeta, yProject, clearModel } = useProject()
  onMount(async () => {
    await setProject(+props.params.pid, +props.params.gid)
  })

  onCleanup(() => {
    clearModel()
  })

  return (
    <div class="flex flex-col size-full">
      <div class="fixed bottom-0 right-0 bg-gray-300">
        <div>Debug</div>
        <div>
          clientId
          {yProject()?.projectDoc.clientID}
        </div>
        <div>
          awareness:
          {JSON.stringify(yProject()?.awarenessMap)}
        </div>
        <div>
          files:
          {JSON.stringify(yProject()?.directoryRoot)}
        </div>
      </div>

      <div class="h-14 w-full b-t-(1px solid border) px-4 flex justify-between items-center">
        <div class="flex items-center gap-2">
          <span class="text-xl font-500">{projectMeta()?.name}</span>
          <Icon class="color-gray cursor-pointer hover:(color-black) transition-color">
            <CogIcon />
          </Icon>
        </div>
        <Button onClick={() => {
          yProject()?.addFile([], 'hello world')
        }}
        >
          New File
        </Button>
        <Chat />
      </div>
      <div class="flex flex-1">
        <Show when={props.location.pathname === `/projects/${props.params.pid}`}
          fallback={(
            <div class="w-full h-full text-(4xl gray) font-bold flex items-center justify-center">
              Select or create a file to start translating
            </div>
          )}
        >
          {props.children}
        </Show>
      </div>
    </div>
  )
}

export default ProjectsView
