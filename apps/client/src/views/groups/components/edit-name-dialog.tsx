import type { Component } from 'solid-js'
import { createEffect, createSignal } from 'solid-js'

import { updateGroup } from '@/apis/groups'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { TextField, TextFieldLabel, TextFieldRoot } from '@/components/ui/textfield'
import { useI18n } from '@/utils/i18n'
import { iv } from '@/utils/input-value'

interface EditNameDialogProps {
  show: boolean
  onClose: () => void
  onSaved: () => void
  initialName: string
  gid: number
}

const EditNameDialog: Component<EditNameDialogProps> = (props) => {
  const [name, setName] = createSignal(props.initialName)
  const t = useI18n()

  const handleOpenChange = (v: boolean): void => {
    if (!v) {
      props.onClose()
    }
  }

  createEffect(() => { setName(props.initialName) })

  const handleSubmit = async (e: Event): Promise<void> => {
    e.preventDefault()
    await updateGroup(props.gid, { name: name() })
    props.onClose()
    props.onSaved()
  }

  return (
    <Dialog open={props.show} onOpenChange={handleOpenChange}>
      <DialogContent>
        <form class="flex flex-col gap-2" onSubmit={handleSubmit}>
          <TextFieldRoot>
            <TextFieldLabel>{t.GROUPVIEW.NAME.TITLE()}</TextFieldLabel>
            <TextField autoResize
              submitOnEnter
              value={name()}
              onInput={iv(setName)}
            />
          </TextFieldRoot>
          <Button class="w-fit self-end" size="sm" type="submit">
            {t.GROUPVIEW.NAME.SAVE()}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditNameDialog
