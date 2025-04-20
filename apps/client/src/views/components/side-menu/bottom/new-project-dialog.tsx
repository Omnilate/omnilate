import { createSignal } from 'solid-js'
import type { Component } from 'solid-js'

import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useGroupModel } from '@/stores/group'
import type { GroupBaseResource } from '@/apis/groups'
import GroupLogo from '@/components/group-logo'
import { TextField, TextFieldLabel, TextFieldRoot } from '@/components/ui/textfield'
import { TextArea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch, SwitchControl, SwitchLabel, SwitchThumb } from '@/components/ui/switch'
import { iv } from '@/utils/input-value'
import { createProject } from '@/apis/project'
import { showToaster } from '@/utils/toaster'

interface NewProjectDialogProps {
  show: boolean
  onClose: () => void
}

// TODO: form validation
const NewProjectDialog: Component<NewProjectDialogProps> = (props) => {
  const { groupModel } = useGroupModel()
  const [chosenGroup, setChosenGroup] = createSignal<GroupBaseResource>()
  const [projectName, setProjectName] = createSignal<string>('')
  const [projectDescription, setProjectDescription] = createSignal<string>('')
  const [privateProject, setPrivateProject] = createSignal(false)

  const handleSubmit = async (e: Event): Promise<void> => {
    e.preventDefault()
    const { id: groupId } = chosenGroup() ?? {}
    if (groupId == null) {
      return
    }

    await createProject(groupId, {
      name: projectName(),
      description: projectDescription(),
      privateProject: privateProject()
    })

    showToaster('Project created successfully')
    props.onClose()
  }

  return (
    <Dialog open={props.show} onOpenChange={props.onClose}>
      <DialogContent>
        <DialogHeader>New Project</DialogHeader>
        <form class="flex flex-col gap-2" onSubmit={handleSubmit}>
          <div class="text-sm font-500">This project will belong to……</div>
          <Select<GroupBaseResource>
            optionValue="id"
            options={groupModel}
            placeholder={<span class="text-gray">Select a group you've joined</span>}
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
              <SelectValue<GroupBaseResource>>
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
            <TextFieldLabel>Name</TextFieldLabel>
            <TextField
              placeholder="Name of the project"
              value={projectName()}
              onChange={iv(setProjectName)}
            />
          </TextFieldRoot>
          <TextFieldRoot>
            <TextFieldLabel>Description</TextFieldLabel>
            <TextArea
              class="resize-y"
              placeholder="Describe the project"
              value={projectDescription()}
              onChange={iv(setProjectDescription)}
            />
          </TextFieldRoot>
          <div class="w-full my-2">
            <Switch checked={privateProject()} class="flex w-full items-center justify-between text-sm font-500" onChange={setPrivateProject}>
              <SwitchLabel>Make this project private</SwitchLabel>
              <SwitchControl>
                <SwitchThumb />
              </SwitchControl>
            </Switch>
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default NewProjectDialog
