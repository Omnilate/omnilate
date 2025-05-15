import type { Component } from 'solid-js'
import { createSignal, Show } from 'solid-js'

import { Accordion } from '@/components/ui/accordion'
import { useAuthModel } from '@/stores/auth'

import AuthDialog from './auth-dialog'
import Groups from './groups'
import Bottom from './bottom'
import ProjectFiles from './project-files'
import FileRecords from './file-records'

const SideMenu: Component = () => {
  const { authenticated } = useAuthModel()
  const [authDialogShown, setAuthDialogShown] = createSignal<boolean>(!authenticated())
  const handleAuthDialogOpen = (): void => { setAuthDialogShown(true) }
  const handleAuthDialogClose = (): void => { setAuthDialogShown(false) }

  return (
    <div class="flex size-full flex-col justify-between">
      <AuthDialog show={authDialogShown()} onClose={handleAuthDialogClose} />
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
