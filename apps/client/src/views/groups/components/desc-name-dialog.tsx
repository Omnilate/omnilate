import type { Component } from 'solid-js'
import { createEffect, createSignal } from 'solid-js'

import { updateGroup } from '@/apis/groups'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { TextFieldLabel, TextFieldRoot } from '@/components/ui/textfield'
import { useI18n } from '@/utils/i18n'
import { iv } from '@/utils/input-value'
import { TextArea } from '@/components/ui/textarea'

interface EditDescDialogProps {
  show: boolean
  onClose: () => void
  onSaved: () => void
  initialDesc: string
  gid: number
}

const EditDescDialog: Component<EditDescDialogProps> = (props) => {
  const [desc, setDesc] = createSignal(props.initialDesc)
  const t = useI18n()

  const handleOpenChange = (v: boolean): void => {
    if (!v) {
      props.onClose()
    }
  }

  createEffect(() => { setDesc(props.initialDesc) })

  const handleSubmit = async (e: Event): Promise<void> => {
    e.preventDefault()
    await updateGroup(props.gid, { description: desc() })
    props.onClose()
    props.onSaved()
  }

  return (
    <Dialog open={props.show} onOpenChange={handleOpenChange}>
      <DialogContent>
        <form class="flex flex-col gap-2" onSubmit={handleSubmit}>
          <TextFieldRoot>
            <TextFieldLabel>{t.GROUPVIEW.DESC.TITLE()}</TextFieldLabel>
            <TextArea autoResize
              submitOnEnter
              class="resize-y"
              value={desc()}
              onInput={iv(setDesc)}
            />
          </TextFieldRoot>
          <Button class="w-fit self-end" size="sm" type="submit">
            {t.GROUPVIEW.DESC.SAVE()}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditDescDialog
