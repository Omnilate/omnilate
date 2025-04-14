import { createSignal } from 'solid-js'
import type { Component } from 'solid-js'

import Me from './me'
import AuthDialog from './auth-dialog'

const SideMenu: Component = () => {
  const [authDialogShown, setAuthDialogShown] = createSignal<boolean>(true)
  const handleAuthDialogOpen = (): void => { setAuthDialogShown(true) }
  const handleAuthDialogClose = (): void => { setAuthDialogShown(false) }

  return (
    <div class="flex size-full flex-col justify-between">
      <AuthDialog show={authDialogShown()} onClose={handleAuthDialogClose} />

      <div>Groups</div>
      <Me />
    </div>
  )
}

export default SideMenu
