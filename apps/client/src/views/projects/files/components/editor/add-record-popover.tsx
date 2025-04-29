import type { PopoverTriggerProps } from '@kobalte/core/popover'
import { createSignal } from 'solid-js'
import type { Component } from 'solid-js'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { TextField, TextFieldRoot } from '@/components/ui/textfield'
import { useProject } from '@/stores/project'
import { iv } from '@/utils/input-value'

const AddRecordPopover: Component = () => {
  const { currentFile } = useProject()
  const [key, setKey] = createSignal<string>('')

  const handleAddRecord = (e: Event): void => {
    e.preventDefault()

    currentFile()?.upsertRecord(key(), 'en', '')
    setKey('')
  }

  return (
    <Popover>
      <PopoverTrigger
        as={(props: PopoverTriggerProps) => (
          <Button
            class="relative flex h-8 w-full gap-2 [&>svg]:hidden"
            variant="outline"
            {...props}
          >
            Add
          </Button>
        )}
      />
      <PopoverContent>
        <form onSubmit={handleAddRecord}>
          <TextFieldRoot>
            <TextField value={key()} onChange={iv(setKey)} />
          </TextFieldRoot>
          <Button type="submit">Create</Button>
        </form>
      </PopoverContent>
    </Popover>
  )
}

export default AddRecordPopover
