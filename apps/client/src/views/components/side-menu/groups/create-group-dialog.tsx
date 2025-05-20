import type { Component } from 'solid-js'
import { createSignal } from 'solid-js'
import { toast } from 'solid-sonner'

import { createGroup } from '@/apis/groups'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { TextArea } from '@/components/ui/textarea'
import { TextField, TextFieldDescription, TextFieldLabel, TextFieldRoot } from '@/components/ui/textfield'
import { useGroupModel } from '@/stores/group'
import { useI18n } from '@/utils/i18n'
import { iv } from '@/utils/input-value'

interface CreateGroupDialogProps {
  show: boolean
  onClose: () => void
}

const CreateGroupDialog: Component<CreateGroupDialogProps> = (props) => {
  const [groupName, setGroupName] = createSignal<string>('')
  const [groupDescription, setGroupDescription] = createSignal<string>('')
  const { fetchGroups } = useGroupModel()
  const t = useI18n()

  const handleSubmit = async (e: Event): Promise<void> => {
    e.preventDefault()
    await createGroup(groupName(), groupDescription())
    toast.success(t.CREATEGROUP.SUCCESS_TOAST({ name: groupName() }))
    await fetchGroups()
    props.onClose()
  }

  const handleOpenChange = (open: boolean): void => {
    if (!open) {
      props.onClose()
    }
  }

  return (
    <Dialog open={props.show} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>{t.CREATEGROUP.TITLE()}</DialogHeader>
        <form class="flex flex-col gap-4 w-full items-center" onSubmit={handleSubmit}>
          <TextFieldRoot class="w-full">
            <TextFieldLabel>{t.CREATEGROUP.NAME.LABEL()}</TextFieldLabel>
            <TextField placeholder={t.CREATEGROUP.NAME.PLACEHOLDER()} value={groupName()} onChange={iv(setGroupName)} />
            <TextFieldDescription>{t.CREATEGROUP.NAME.DESC()}</TextFieldDescription>
          </TextFieldRoot>
          <TextFieldRoot class="w-full">
            <TextFieldLabel>{t.CREATEGROUP.DESCRIPTION.LABEL()}</TextFieldLabel>
            <TextArea placeholder={t.CREATEGROUP.DESCRIPTION.PLACEHOLDER()} value={groupDescription()} onChange={iv(setGroupDescription)} />
          </TextFieldRoot>
          <Button class="w-full" type="submit">{t.CREATEGROUP.SUBMIT()}</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateGroupDialog
