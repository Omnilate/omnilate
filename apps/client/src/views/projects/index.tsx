import type { RouteSectionProps } from '@solidjs/router'
import type { Component } from 'solid-js'
import { onCleanup, onMount } from 'solid-js'

import { CogIcon } from '@/assets/icons'
import Icon from '@/components/icon'
import { useGroupModel } from '@/stores/group'
import { useProject } from '@/stores/project'

import Chat from './components/chat'

interface ProjectsProps extends RouteSectionProps {}

const ProjectsView: Component<ProjectsProps> = (props) => {
  const { setCurrentGroupId, fetchGroups } = useGroupModel()
  const { setProject, projectMeta, yProject, clearModel } = useProject()
  onMount(async () => {
    await fetchGroups()
    setCurrentGroupId(+props.params.gid)
    await setProject(+props.params.pid, +props.params.gid)
  })

  onCleanup(() => {
    clearModel()
  })

  return (
    <div class="flex flex-col size-full">
      <div class="fixed bottom-0 right-0 bg-gray-300 pointer-events-none opacity-50">
        <div>Debug</div>
        <div>
          clientId:
          {yProject()?.projectDoc.clientID}
        </div>
        <div>
          awareness:
          {JSON.stringify(yProject()?.awarenessMap)}
        </div>
      </div>
      <div class="h-14 w-full b-b-(1px solid border) px-4 flex justify-between items-center bg-background shadow-sm">
        <div class="flex items-center gap-2">
          <span class="text-xl font-500">{projectMeta()?.name}</span>
          <Icon class="color-gray cursor-pointer hover:(color-black) transition-color">
            <CogIcon />
          </Icon>
        </div>
        <Chat />
      </div>
      <div class="flex flex-1">
        {props.children}
      </div>
    </div>
  )
}

export default ProjectsView
