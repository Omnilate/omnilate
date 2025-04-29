import type { Component } from 'solid-js'
import { createSignal } from 'solid-js'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TextField, TextFieldLabel, TextFieldRoot } from '@/components/ui/textfield'
import { iv } from '@/utils/input-value'
import { useProject } from '@/stores/project'

import { selectedPath } from './selected-path'

interface NewNodeDialogProps {
  show: boolean
  onClose: () => void
}

const NewNodeDialog: Component<NewNodeDialogProps> = (props) => {
  const [nodeType, setNodeType] = createSignal<'file' | 'directory'>('file')
  const [path, setPath] = createSignal<string[]>(selectedPath())
  const [name, setName] = createSignal<string>('')

  const { yProject } = useProject()

  const handleSubmit = async (e: Event): Promise<void> => {
    e.preventDefault()

    if (nodeType() === 'file') {
      await yProject()?.addFile(path(), name())
    } else {
      await yProject()?.addDirectory(path(), name())
    }

    props.onClose()
  }

  const handleOpenChange = (open: boolean): void => {
    if (!open) {
      props.onClose()
    }
  }

  const handlePathChange = (e: Event): void => {
    const target = e.target as HTMLInputElement
    const value = target.value
    setPath(value.split('/').filter(Boolean))
  }

  return (
    <Dialog open={props.show} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>New File / Directory</DialogHeader>
        <form onSubmit={handleSubmit}>
          <Tabs value={nodeType()} onChange={setNodeType}>
            <TabsList>
              <TabsTrigger value="file">File</TabsTrigger>
              <TabsTrigger value="directory">Directory</TabsTrigger>
            </TabsList>
          </Tabs>
          <TextFieldRoot class="w-full">
            <TextFieldLabel>Path</TextFieldLabel>
            <TextField value={path().join('/')} onChange={handlePathChange} />
          </TextFieldRoot>
          <TextFieldRoot class="w-full">
            <TextFieldLabel>Name</TextFieldLabel>
            <TextField value={name()} onChange={iv(setName)} />
          </TextFieldRoot>
          <Button type="submit">Submit</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default NewNodeDialog
