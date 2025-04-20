import type { DialogTriggerProps } from '@kobalte/core/dialog'
import type { Component } from 'solid-js'
import { createSignal, For } from 'solid-js'

import { ChatIcon } from '@/assets/icons'
import Icon from '@/components/icon'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { TextField, TextFieldRoot } from '@/components/ui/textfield'
import { useProject } from '@/stores/project'
import { iv } from '@/utils/input-value'

import Message from './message'

const Chat: Component = () => {
  const { yProject, projectMeta } = useProject()
  const [editingMessage, setEditingMessage] = createSignal('')

  const handleSendMessage = (e: Event): void => {
    e.preventDefault()
    yProject()?.sendChatMessage(editingMessage())
    setEditingMessage('')
  }

  return (
    <Sheet>
      <SheetTrigger
        as={(props: DialogTriggerProps) => (
          <Button class="flex items-center gap-2" variant="round" {...props}>
            <Icon>
              <ChatIcon />
            </Icon>
            <span>Chat</span>
          </Button>
        )}
      />
      <SheetContent class="flex flex-col flex-1" side="right">
        <SheetHeader>
          <SheetTitle>
            <span>Project Chat of </span>
            <span>{projectMeta()?.name}</span>
          </SheetTitle>
        </SheetHeader>
        <div class="flex-1 flex flex-col gap-4 overflow-y-auto hide-scrollbar">
          <For each={yProject()?.chatMessages ?? []}>
            {Message}
          </For>
        </div>
        <form class="flex gap-2 items-end" onSubmit={handleSendMessage}>
          <TextFieldRoot class="flex-1 flex">
            <TextField class="flex-1 resize-none text-(xs primary) h-8 px-2 shadow rounded-xl" value={editingMessage()} onChange={iv(setEditingMessage)} />
          </TextFieldRoot>
          <Button class="text-xs h-8" type="submit" variant="default">Send</Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}

export default Chat
