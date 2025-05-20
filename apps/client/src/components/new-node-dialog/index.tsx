import type { Component } from 'solid-js'
import { createSignal, Show } from 'solid-js'
import { toast } from 'solid-sonner'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { TextField, TextFieldErrorMessage, TextFieldLabel, TextFieldRoot } from '@/components/ui/textfield'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useProject } from '@/stores/project'
import type { FileType } from '@/utils/i18n'
import { fileParsers } from '@/utils/i18n'
import { iv } from '@/utils/input-value'
import type { SupportedLanguageCode } from '@/utils/supported-languages'

import PathSelect from '../path-select'
import { Switch, SwitchControl, SwitchLabel, SwitchThumb } from '../ui/switch'
import LanguageSelect from './language-select'

interface NewNodeDialogProps {
  show: boolean
  onClose: () => void
  initialPath?: string[]
}

const NewNodeDialog: Component<NewNodeDialogProps> = (props) => {
  const [nodeType, setNodeType] = createSignal<'file' | 'directory'>('file')
  const [path, setPath] = createSignal<string[]>(props.initialPath ?? [])
  const [importFromLocal, setImportFromLocal] = createSignal(false)
  const [srcLang, setSrcLang] = createSignal<SupportedLanguageCode>('en')
  const [localFileType, setLocalFileType] = createSignal<FileType>('i18next')
  const [kvData, setKvData] = createSignal<Record<string, string>>({})
  const [parseError, setParseError] = createSignal(false)

  const [name, setName] = createSignal<string>('')

  const { yProject } = useProject()

  const handleReset = (): void => {
    setNodeType('file')
    setPath(props.initialPath ?? [])
    setName('')
    setSrcLang('en')
    setImportFromLocal(false)
    setLocalFileType('i18next')
    setKvData({})
    setParseError(false)
  }

  const handleSubmit = async (e: Event): Promise<void> => {
    e.preventDefault()

    // validate
    if (name().length === 0) {
      toast.error('Name cannot be empty')
      return
    }
    if (nodeType() === 'file' && importFromLocal()) {
      if (parseError()) {
        toast.error('Cannot parse the file')
        return
      }
    }

    if (nodeType() === 'file') {
      await yProject()?.addFile(path(), name(), srcLang(), kvData())
    } else {
      await yProject()?.addDirectory(path(), name())
    }

    handleReset()
    props.onClose()
  }

  const handleFileChange = async (e: Event): Promise<void> => {
    const target = e.target as HTMLInputElement
    if (target.files == null || target.files.length === 0) {
      return
    }
    const file = target.files[0]
    const parse = fileParsers[localFileType()]

    try {
      const data = await parse(file)
      setKvData(data)
      toast.success(`${file.name} has been parsed`)
    } catch {
      setParseError(true)
    }
  }

  const handleOpenChange = (open: boolean): void => {
    if (!open) {
      handleReset()
      props.onClose()
    }
  }

  return (
    <Dialog open={props.show} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>Create a New…</DialogHeader>
        <form class="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
          <ToggleGroup value={nodeType()} onChange={setNodeType}>
            <ToggleGroupItem value="file">
              File
            </ToggleGroupItem>
            <ToggleGroupItem value="directory">
              Directory
            </ToggleGroupItem>
          </ToggleGroup>
          <TextFieldRoot>
            <TextFieldLabel>At…</TextFieldLabel>
            <PathSelect
              project={yProject()}
              value={path()}
              onChange={setPath}
            />
          </TextFieldRoot>
          <TextFieldRoot class="w-full">
            <TextFieldLabel>Named as…</TextFieldLabel>
            <TextField value={name()} onChange={iv(setName)} />
          </TextFieldRoot>
          <Show when={nodeType() === 'file'}>
            <TextFieldRoot>
              <TextFieldLabel>And the language to be translated from would be…</TextFieldLabel>
              <LanguageSelect value={srcLang()} onChange={setSrcLang} />
            </TextFieldRoot>
            <Switch
              checked={importFromLocal()}
              class="flex items-center justify-between"
              onChange={setImportFromLocal}
            >
              <SwitchLabel class="text-sm font-medium">Import a local file?</SwitchLabel>
              <SwitchControl>
                <SwitchThumb />
              </SwitchControl>
            </Switch>
            <Show when={importFromLocal()}>
              <TextFieldRoot>
                <TextFieldLabel>File type</TextFieldLabel>
                <ToggleGroup value={localFileType()} onChange={setLocalFileType}>
                  <ToggleGroupItem value="i18next">I18Next JSON</ToggleGroupItem>
                  <ToggleGroupItem value="plainKV">Key-Value</ToggleGroupItem>
                  <ToggleGroupItem value="natural">Plain Text</ToggleGroupItem>
                </ToggleGroup>
              </TextFieldRoot>
              <TextFieldRoot
                validationState={parseError() ? 'invalid' : 'valid'}
              >
                <TextFieldLabel>Select the local file</TextFieldLabel>
                <TextField
                  type="file"
                  accept={
                    localFileType() === 'i18next'
                      ? 'application/json'
                      : localFileType() === 'plainKV'
                        ? 'text/plain'
                        : 'text/plain'
                  }
                  onChange={handleFileChange}
                />
                <TextFieldErrorMessage>Cannot resolve this file</TextFieldErrorMessage>
              </TextFieldRoot>
            </Show>
          </Show>
          <Button type="submit">Submit</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default NewNodeDialog
