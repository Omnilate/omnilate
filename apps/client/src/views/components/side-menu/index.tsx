import { createSignal, Show } from 'solid-js'
import type { Component } from 'solid-js'

import { useAuthModel } from '@/stores/auth'
import { Accordion } from '@/components/ui/accordion'

import Me from './me'
import AuthDialog from './auth-dialog'
import Groups from './groups'

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
          <Accordion collapsible class="w-full">
            <Groups />
          </Accordion>
        </Show>
      </div>
      <Me />
    </div>
  )
}

export default SideMenu
