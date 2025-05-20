import type { DialogTriggerProps } from '@kobalte/core/dialog'
import type { GroupRole } from '@omnilate/schema'
import { createAsync, revalidate } from '@solidjs/router'
import type { Component } from 'solid-js'
import { createSignal, For, Show } from 'solid-js'

import { deleteMember, getGroupMembers, updateMemberRole } from '@/apis/groups'
import { CogIcon, EditIcon, XMarkIcon } from '@/assets/icons'
import Icon from '@/components/icon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ToggleButton } from '@/components/ui/toggle'
import UserAvatar from '@/components/user-avatar'
import { useUserModel } from '@/stores/user'
import { useI18n } from '@/utils/i18n'

import RoleSelect from './role-select'

interface MemberConfDialogProps {
  gid: number
}

const MemberConfDialog: Component<MemberConfDialogProps> = (props) => {
  const [editing, setEditing] = createSignal(false)
  const { userModel } = useUserModel()
  const t = useI18n()
  const members = createAsync(
    async () => await getGroupMembers(props.gid),
    { initialValue: [] }
  )

  const handleMemberRoleChange = async (memberId: number, newRole: GroupRole): Promise<void> => {
    await updateMemberRole(props.gid, memberId, newRole)
    await revalidate('get-group-members')
  }

  const handelDeleteMember = async (memberId: number): Promise<void> => {
    await deleteMember(props.gid, memberId)
    await revalidate('get-group-members')
  }

  return (
    <Dialog defaultOpen={false}>
      <DialogTrigger
        as={(props: DialogTriggerProps) => (
          <Button {...props} class="text-xs p-0 size-6 rounded-full">
            <Icon>
              <CogIcon />
            </Icon>
          </Button>
        )}
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.GROUPVIEW.MANAGE_MEMBERS.TITLE()}</DialogTitle>
        </DialogHeader>
        <div class="w-full flex flex-col gap-2">
          <For each={members()}>
            {(member) => (
              <div class="flex items-center gap-2 justify-between bg-background p-(x-4 y-2) rounded-xl hover:bg-accent transition-colors">
                <div class="flex items-center gap-2">
                  <UserAvatar user={member} />
                  <div class="font-700">{member.name}</div>
                </div>
                <div>
                  <Show when={!editing() || userModel.id === member.id}
                    fallback={(
                      <div class="flex items-center gap-2">
                        <RoleSelect
                          initialValue={member.role}
                          onChange={(value) => { void handleMemberRoleChange(member.id, value) }}
                        />
                        <Button size="sm"
                          variant="destructive"
                          onClick={() => { void handelDeleteMember(member.id) }}
                        >
                          <Icon><XMarkIcon /></Icon>
                        </Button>
                      </div>
                    )}
                  >
                    <Badge>{t.GROUPROLE[member.role]()}</Badge>
                  </Show>
                </div>
              </div>
            )}
          </For>
        </div>
        <DialogFooter>
          <ToggleButton class="items-center gap-1"
            pressed={editing()}
            size="sm"
            variant="outline"
            onChange={setEditing}
          >
            <Icon><EditIcon /></Icon>
            <span>{t.GROUPVIEW.MANAGE_MEMBERS.EDIT()}</span>
          </ToggleButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default MemberConfDialog
