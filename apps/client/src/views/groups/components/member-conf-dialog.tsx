import { createAsync } from '@solidjs/router'
import type { Component } from 'solid-js'
import { createSignal, For, Show } from 'solid-js'
import type { DialogTriggerProps } from '@kobalte/core/dialog'
import type { GroupRole } from '@omnilate/schema'

import { deleteMember, getGroupMembers, updateMemberRole } from '@/apis/groups'
import { CogIcon, EditIcon, XMarkIcon } from '@/assets/icons'
import Icon from '@/components/icon'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ToggleButton } from '@/components/ui/toggle'
import UserAvatar from '@/components/user-avatar'
import { Badge } from '@/components/ui/badge'
import { useUserModel } from '@/stores/user'

import RoleSelect from './role-select'

interface MemberConfDialogProps {
  gid: number
}

const MemberConfDialog: Component<MemberConfDialogProps> = (props) => {
  const [editing, setEditing] = createSignal(false)
  const { userModel } = useUserModel()
  const members = createAsync(
    async () => await getGroupMembers(props.gid),
    { initialValue: [] }
  )

  const handleMemberRoleChange = async (memberId: number, newRole: GroupRole) => {
    await updateMemberRole(props.gid, memberId, newRole)
  }

  const handelDeleteMember = async (memberId: number) => {
    await deleteMember(props.gid, memberId)
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
          <DialogTitle>Manage Members</DialogTitle>
        </DialogHeader>
        <div class="w-full">
          <For each={members()}>
            {(member) => (
              <div class="flex items-center gap-2 justify-between">
                <div class="flex items-center gap-2">
                  <UserAvatar user={member} />
                  <div class="font-700">{member.name}</div>
                </div>
                <div>
                  <Show when={!editing()}
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
                    <Badge>{member.role.toUpperCase()}</Badge>
                  </Show>
                </div>
              </div>
            )}
          </For>
        </div>
        <DialogFooter>
          <ToggleButton pressed={editing()} size="sm" onChange={setEditing}>
            <Icon><EditIcon /></Icon>
            <span>Edit</span>
          </ToggleButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default MemberConfDialog
