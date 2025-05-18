import { createEffect, createSignal } from 'solid-js'
import type { Component } from 'solid-js'
import { reload } from '@solidjs/router'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { TextArea } from '@/components/ui/textarea'
import { TextFieldLabel, TextFieldRoot } from '@/components/ui/textfield'
import { iv } from '@/utils/input-value'
import { Button } from '@/components/ui/button'
import { useUserModel } from '@/stores/user'
import { getMe, patchMe } from '@/apis/user'

interface EditDescriptionDialogProps {
  show: boolean
  onClose: () => void
  onSaved: () => void
  initialDescription: string
}

const EditDescriptionDialog: Component<EditDescriptionDialogProps> = (props) => {
  const [description, setDescription] = createSignal(props.initialDescription)

  const { setUserModel } = useUserModel()

  const handleOpenChange = (v: boolean): void => {
    if (!v) {
      props.onClose()
    }
  }

  createEffect(() => { setDescription(props.initialDescription) })

  const handleSubmit = async (e: Event): Promise<void> => {
    e.preventDefault()
    await patchMe({ description: description() })
    const user = await getMe()
    setUserModel(user)
    props.onClose()
    props.onSaved()
  }

  return (
    <Dialog open={props.show} onOpenChange={handleOpenChange}>
      <DialogContent>
        <form class="flex flex-col gap-2" onSubmit={handleSubmit}>
          <TextFieldRoot>
            <TextFieldLabel>Edit Your Description</TextFieldLabel>
            <TextArea autoResize
              submitOnEnter
              class="resize-y"
              value={description()}
              onInput={iv(setDescription)}
            />
          </TextFieldRoot>
          <Button class="w-fit self-end" size="sm" type="submit">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditDescriptionDialog
