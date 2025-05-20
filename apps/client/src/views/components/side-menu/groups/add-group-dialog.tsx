import { createMemo, createResource, createSignal, For, Show } from 'solid-js'
import type { Component } from 'solid-js'
import { createAsync } from '@solidjs/router'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { TextField, TextFieldRoot } from '@/components/ui/textfield'
import { searchGroups } from '@/apis/groups'
import type { GroupBaseResource } from '@/apis/groups'
import { iv } from '@/utils/input-value'
import { Separator } from '@/components/ui/separator'
import { useI18n } from '@/utils/i18n'
import { getAppliedGroups } from '@/apis/user'

import GroupSearchItem from './group-search-item'

interface AddGroupDialogProps {
  show: boolean
  onCreateNewGroup: () => void
  onClose: () => void
}

const AddGroupDialog: Component<AddGroupDialogProps> = (props) => {
  const [searchKeyword, setSearchKeyword] = createSignal<string>('')
  const [groupSearchResult, setGroupSearchResult] = createSignal<GroupBaseResource[]>([])
  const [searched, setSearched] = createSignal<boolean>(false)
  const [appliedGroups, { refetch: refetchAppliedGroups }] = createResource(
    getAppliedGroups,
    { initialValue: [] }
  )

  const appliedGroupIds = createMemo(() => {
    return appliedGroups().map((group) => group.id)
  })

  const t = useI18n()

  const handleSearch = async (): Promise<void> => {
    const result = await searchGroups(searchKeyword())
    setGroupSearchResult(result)
    setSearched(true)
  }

  const handleOpenChange = (open: boolean): void => {
    if (!open) {
      props.onClose()
    }
  }

  const handleCreate = (): void => {
    props.onCreateNewGroup()
    props.onClose()
  }

  return (
    <Dialog open={props.show} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>{t.ADDGROUP.TITLE()}</DialogHeader>
        <div class="flex flex-col gap-4 w-full items-center">
          <div class="flex w-full items-center space-x-2">
            <TextFieldRoot class="flex-1">
              <TextField placeholder={t.ADDGROUP.SEARCH.PLACEHOLDER()} value={searchKeyword()} onChange={iv(setSearchKeyword)} />
            </TextFieldRoot>
            <Button type="button" onClick={handleSearch}>{t.ADDGROUP.SEARCH.BUTTON()}</Button>
          </div>
          <div class="w-full flex flex-col">
            <Separator />
            <Show when={groupSearchResult().length > 0}
              fallback={(
                <div class="text-gray text-xl my-10 mx-auto">
                  {
                    searched()
                      ? t.ADDGROUP.SEARCH.NORESULT()
                      : t.ADDGROUP.SEARCH.EMPTY()
                  }
                </div>
              )}
            >
              <For each={groupSearchResult()}>
                {(group) => (
                  <GroupSearchItem
                    appliedGroupIds={appliedGroupIds()}
                    group={group}
                    onApplied={refetchAppliedGroups}
                  />
                )}
              </For>
            </Show>
            <Separator />
          </div>
          <div class="text-gray text-xs">{t.ADDGROUP.OR()}</div>
          <Button onClick={handleCreate}>{t.ADDGROUP.CREATE_BUTTON()}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddGroupDialog
