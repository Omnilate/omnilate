import type { DialogTriggerProps } from '@kobalte/core/dialog'
import { createSignal, For, Show, Suspense } from 'solid-js'
import type { Component } from 'solid-js'
import { createAsync, reload, revalidate } from '@solidjs/router'
import { toast } from 'solid-sonner'

import { PlusIcon } from '@/assets/icons'
import Icon from '@/components/icon'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { searchUsers } from '@/apis/user'
import type { UserGroupResource } from '@/apis/user'
import { TextField, TextFieldRoot } from '@/components/ui/textfield'
import { iv } from '@/utils/input-value'
import UserAvatar from '@/components/user-avatar'
import { getInvitedUsers, inviteUser } from '@/apis/groups'

interface InviteDialogProps {
  gid: number
  members: UserGroupResource[]
}

const InviteDialog: Component<InviteDialogProps> = (props) => {
  const [keyword, setKeyword] = createSignal('')
  const result = createAsync(
    async () => await searchUsers({ keyword: keyword() }),
    { initialValue: [] }
  )
  const invited = createAsync(
    async () => await getInvitedUsers(props.gid),
    { initialValue: [] }
  )

  const handleInvite = async (userId: number): Promise<void> => {
    await inviteUser(props.gid, userId)
    await revalidate('invited-users')
    toast.success('Invitation sent')
  }

  return (
    <Dialog>
      <DialogTrigger as={(props: DialogTriggerProps) => (
        <Button {...props} class="flex items-center gap-2 text-xs px-2 h-6">
          <Icon>
            <PlusIcon />
          </Icon>
          <span>Invite</span>
        </Button>
      )}
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
        </DialogHeader>
        <div class="flex flex-col gap-4 w-full">
          <TextFieldRoot>
            <TextField
              placeholder="Search user by name or id"
              value={keyword()}
              onInput={iv(setKeyword)}
            />
          </TextFieldRoot>
          <div class="w-full flex flex-col gap-2">

            <Suspense fallback={(
              <div class="w-full h-20 lh-20 text-center opacity-70 font-900">
                Loading...
              </div>
            )}
            >
              <Show when={result().length > 0}
                fallback={(
                  <div class="w-full h-20 lh-20 text-center opacity-70 font-900">
                    {
                      keyword() === ''
                        ? 'Type to Search'
                        : 'No Result'
                    }
                  </div>
                )}
              >
                <For each={result()}>
                  {(user) => (
                    <div class="flex justify-between rounded-xl items-center p-(x-4 y-2) bg-background hover:bg-accent transition-colors">
                      <div class="flex items-center gap-2">
                        <UserAvatar user={user} />
                        <div>
                          <div class="font-700">{user.name}</div>
                          <div class="text-xs opacity-70">
                            <span>id: </span>
                            <span>{user.id}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Button class="h-6"
                          size="sm"
                          disabled={
                            props.members.some((member) => member.id === user.id) ||
                            invited().some((member) => member.id === user.id)
                          }
                          onClick={() => { void handleInvite(user.id) }}
                        >
                          {
                            props.members.some((member) => member.id === user.id)
                              ? 'Member'
                              : invited().some((member) => member.id === user.id)
                                ? 'Invited'
                                : 'Invite'
                          }
                        </Button>
                      </div>
                    </div>
                  )}
                </For>
              </Show>
            </Suspense>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default InviteDialog
