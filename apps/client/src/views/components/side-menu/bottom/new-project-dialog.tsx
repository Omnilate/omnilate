import type { Component } from 'solid-js'
import { createMemo, createSignal } from 'solid-js'
import { toast } from 'solid-sonner'

import type { GroupRoleResource } from '@/apis/groups'
import { createProject } from '@/apis/project'
import GroupLogo from '@/components/group-logo'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch, SwitchControl, SwitchLabel, SwitchThumb } from '@/components/ui/switch'
import { TextArea } from '@/components/ui/textarea'
import { TextField, TextFieldLabel, TextFieldRoot } from '@/components/ui/textfield'
import { useGroupModel } from '@/stores/group'
import { useI18n } from '@/utils/i18n'
import { iv } from '@/utils/input-value'

interface NewProjectDialogProps {
  show: boolean
  onClose: () => void
}

const NewProjectDialog: Component<NewProjectDialogProps> = (props) => {
  const { groupModel } = useGroupModel()
  const [chosenGroup, setChosenGroup] = createSignal<GroupRoleResource>()
  const [projectName, setProjectName] = createSignal<string>('')
  const [projectDescription, setProjectDescription] = createSignal<string>('')
  const [privateProject, setPrivateProject] = createSignal(false)
  const t = useI18n()

  const ownedGroups = createMemo(() => groupModel.filter((group) => group.role === 'OWNER'))

  const handleSubmit = async (e: Event): Promise<void> => {
    e.preventDefault()
    const { id: groupId } = chosenGroup() ?? {}
    if (groupId == null) {
      toast.error(t.NEWPROJECT.ERROR.INVALID_GROUP())
      return
    }

    if (projectName().length < 1) {
      toast.error(t.NEWPROJECT.ERROR.INVALID_NAME())
      return
    }

    await createProject(groupId, {
      name: projectName(),
      description: projectDescription(),
      privateProject: privateProject()
    })

    toast.success(t.NEWPROJECT.SUCCESS_TOAST())
    props.onClose()
  }

  return (
    <Dialog open={props.show} onOpenChange={props.onClose}>
      <DialogContent>
        <DialogHeader>{t.NEWPROJECT.TITLE()}</DialogHeader>
        <form class="flex flex-col gap-2" onSubmit={handleSubmit}>
          <div class="text-sm font-500">{t.NEWPROJECT.BELONG.LABEL()}</div>
          <Select<GroupRoleResource>
            optionValue="id"
            options={ownedGroups()}
            placeholder={<span class="text-gray">{t.NEWPROJECT.BELONG.PLACEHOLDER()}</span>}
            itemComponent={(props) => (
              <SelectItem class="transition-colors" item={props.item}>
                <span class="inline-flex items-center gap-2">
                  <GroupLogo class="size-6" group={props.item.rawValue} />
                  <span>{props.item.rawValue.name}</span>
                </span>
              </SelectItem>
            )}
            onChange={setChosenGroup}
          >
            <SelectTrigger>
              <SelectValue<GroupRoleResource>>
                {(state) => (
                  <span class="inline-flex items-center gap-2">
                    <GroupLogo class="size-6" group={state.selectedOption()} />
                    <span>{state.selectedOption().name}</span>
                  </span>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent />
          </Select>
          <TextFieldRoot>
            <TextFieldLabel>{t.NEWPROJECT.NAME.LABEL()}</TextFieldLabel>
            <TextField
              placeholder={t.NEWPROJECT.NAME.PLACEHOLDER()}
              value={projectName()}
              onChange={iv(setProjectName)}
            />
          </TextFieldRoot>
          <TextFieldRoot>
            <TextFieldLabel>{t.NEWPROJECT.DESC.TITLE()}</TextFieldLabel>
            <TextArea
              class="resize-y"
              placeholder={t.NEWPROJECT.DESC.PLACEHOLDER()}
              value={projectDescription()}
              onChange={iv(setProjectDescription)}
            />
          </TextFieldRoot>
          <div class="w-full my-2">
            <Switch checked={privateProject()} class="flex w-full items-center justify-between text-sm font-500" onChange={setPrivateProject}>
              <SwitchLabel>{t.NEWPROJECT.PRIVATE()}</SwitchLabel>
              <SwitchControl>
                <SwitchThumb />
              </SwitchControl>
            </Switch>
          </div>
          <Button type="submit">{t.NEWPROJECT.SUBMIT()}</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default NewProjectDialog
