import { createEffect, createSignal } from 'solid-js'
import type { Component } from 'solid-js'
import { reload } from '@solidjs/router'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { TextArea } from '@/components/ui/textarea'
import { TextField, TextFieldLabel, TextFieldRoot } from '@/components/ui/textfield'
import { iv } from '@/utils/input-value'
import { Button } from '@/components/ui/button'
import { useUserModel } from '@/stores/user'
import { getMe, patchMe } from '@/apis/user'

interface EditNameDialogProps {
  show: boolean
  onClose: () => void
  onSaved: () => void
  initialName: string
}

const EditNameDialog: Component<EditNameDialogProps> = (props) => {
  const [name, setName] = createSignal(props.initialName)

  const { setUserModel } = useUserModel()

  const handleOpenChange = (v: boolean): void => {
    if (!v) {
      props.onClose()
    }
  }

  createEffect(() => { setName(props.initialName) })

  const handleSubmit = async (e: Event): Promise<void> => {
    e.preventDefault()
    await patchMe({ name: name() })
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
            <TextFieldLabel>New Name for Your Account</TextFieldLabel>
            <TextField autoResize
              submitOnEnter
              value={name()}
              onInput={iv(setName)}
            />
          </TextFieldRoot>
          <Button class="w-fit self-end" size="sm" type="submit">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditNameDialog
