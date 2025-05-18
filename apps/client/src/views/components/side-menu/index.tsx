import type { Component } from 'solid-js'
import { Show } from 'solid-js'

import { Accordion } from '@/components/ui/accordion'
import { useAuthModel } from '@/stores/auth'

import Bottom from './bottom'
import FileRecords from './file-records'
import Groups from './groups'
import ProjectFiles from './project-files'

const SideMenu: Component = () => {
  const { authenticated } = useAuthModel()

  return (
    <div class="flex size-full flex-col justify-between">
      <div class="flex size-full flex-col">
        <Show when={authenticated()}>
          <Accordion collapsible
            multiple
            class="w-full"
            defaultValue={['groups', 'project-files']}
          >
            <Groups />
            <ProjectFiles />
            <FileRecords />
          </Accordion>
        </Show>
      </div>
      <Bottom />
    </div>
  )
}

export default SideMenu
