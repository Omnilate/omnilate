import { createSignal } from 'solid-js'
import type { Component } from 'solid-js'

import { PlusIcon } from '@/assets/icons'
import Icon from '@/components/icon'
import { Button } from '@/components/ui/button'

import NewProjectDialog from './new-project-dialog'

interface CreateNewProjectProps {
  foo: string
}

const CreateNewProject: Component<CreateNewProjectProps> = (props) => {
  const [dialogShown, setDialogShown] = createSignal(false)

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
        <span>Start a New Project</span>
      </Button>
    </div>
  )
}

export default CreateNewProject
