import type { Component } from 'solid-js'
import { createEffect, createSignal, For } from 'solid-js'

import { PlusIcon } from '@/assets/icons'
import Icon from '@/components/icon'
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { useGroupModel } from '@/stores/group'
import { useUserModel } from '@/stores/user'
import { useI18n } from '@/utils/i18n'

import AddGroupDialog from './add-group-dialog'
import CreateGroupDialog from './create-group-dialog'
import GroupItem from './group-item'

const Groups: Component = () => {
  const [addDialogShown, setAddDialogShown] = createSignal<boolean>(false)
  const [createDialogShown, setCreateDialogShown] = createSignal<boolean>(false)
  const { userModel } = useUserModel()
  const { groupModel, fetchGroups } = useGroupModel()
  const t = useI18n()

  createEffect(() => {
    if (userModel.id !== 0) {
      void fetchGroups()
    }
  })

  const handleAddDialogOpen = (e: Event): void => {
    e.stopImmediatePropagation()
    setAddDialogShown(true)
  }

  const handleAddDialogClose = (): void => {
    setAddDialogShown(false)
  }

  const handleCreateDialogOpen = (): void => {
    setCreateDialogShown(true)
  }

  const handleCreateDialogClose = (): void => {
    setCreateDialogShown(false)
  }

  return (
    <AccordionItem value="groups">
      <AddGroupDialog show={addDialogShown()} onClose={handleAddDialogClose} onCreateNewGroup={handleCreateDialogOpen} />
      <CreateGroupDialog show={createDialogShown()} onClose={handleCreateDialogClose} />
      <AccordionTrigger class="p-4">
        <div class="flex flex-1 justify-between pr-4 gap-4 items-center">
          <div>{t.SIDE.GROUPS.TITLE()}</div>
          <Button class="text-xs flex gap-1 h-6 px-2" variant="round" onClick={handleAddDialogOpen}>
            <Icon stroke="2">
              <PlusIcon />
            </Icon>
            {t.SIDE.GROUPS.ADD()}
          </Button>
        </div>
      </AccordionTrigger>
      <AccordionContent class="px-1">
        <For each={groupModel}>
          {(group) => <GroupItem {...group} />}
        </For>
      </AccordionContent>
    </AccordionItem>
  )
}

export default Groups
