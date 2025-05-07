import { createSignal } from 'solid-js'
import type { Component } from 'solid-js'

import { PlusIcon } from '@/assets/icons'
import Icon from '@/components/icon'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/utils/i18n'

import NewProjectDialog from './new-project-dialog'

const CreateNewProject: Component = () => {
  const [dialogShown, setDialogShown] = createSignal(false)
  const t = useI18n()

  const handleOpenDialog = (): void => {
    setDialogShown(true)
  }
  const handleCloseDialog = (): void => {
    setDialogShown(false)
  }

  return (
    <div class="flex w-full px-2 my-4">
      <NewProjectDialog show={dialogShown()} onClose={handleCloseDialog} />
      <Button class="flex gap-2 items-center flex-1" onClick={handleOpenDialog}>
        <Icon>
          <PlusIcon />
        </Icon>
        <span>{t.SIDE.NEWPROJ()}</span>
      </Button>
    </div>
  )
}

export default CreateNewProject
