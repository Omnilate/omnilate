import { reload } from '@solidjs/router'
import type { RouteSectionProps } from '@solidjs/router'
import { createResource, createSignal, Show } from 'solid-js'
import type { Component } from 'solid-js'

import { getMe, getUser } from '@/apis/user'
import { Image, ImageFallback, ImageRoot } from '@/components/ui/image'
import { getContrastTextColor } from '@/utils/contrast-text-color'
import { getUserColor } from '@/utils/user-color'
import { jumpTo } from '@/utils/jump-to'
import { EditIcon } from '@/assets/icons'
import Icon from '@/components/icon'
import { useUserModel } from '@/stores/user'

import EditDescriptionDialog from './components/edit-description-dialog'
import EditNameDialog from './components/edit-name-dialog'
import Groups from './components/groups'
import LanguageMastery from './components/language-mastery'

interface UsersViewProps extends RouteSectionProps {}

const UsersView: Component<UsersViewProps> = (props) => {
  const [descEditShown, setDescEditShown] = createSignal(false)
  const [nameEditShown, setNameEditShown] = createSignal(false)

  const userId = (): 'me' | number => {
    const id = props.params.id
    if (id === 'me') {
      return 'me'
    } else if (Number.isNaN(Number(id))) {
      jumpTo('/')
      return 0
    } else {
      return Number(id)
    }
  }

  const { userModel } = useUserModel()
  const isMe = (): boolean => userId() === 'me' || userModel?.id === userId()

  const bgColor = (): string => getUserColor(userBase()?.id ?? 0)

  const [userBase, { refetch: refetchUser }] = createResource(
    userId,
    async (id) => {
      try {
        if (isMe()) {
          return await getMe()
        } else {
          return await getUser(id as number)
        }
      } catch {
        jumpTo('/')
      }
    }
  )

  const handleDescEditClose = (): void => {
    setDescEditShown(false)
  }

  const handleNameEditClose = (): void => {
    setNameEditShown(false)
  }

  return (
    <div class="flex flex-col flex-1 overflow-y-auto hide-scrollbar">
      <EditDescriptionDialog
        initialDescription={userBase()?.description ?? ''}
        show={descEditShown()}
        onClose={handleDescEditClose}
        onSaved={refetchUser}
      />
      <EditNameDialog
        initialName={userBase()?.name ?? ''}
        show={nameEditShown()}
        onClose={handleNameEditClose}
        onSaved={refetchUser}
      />
      <div class="h-[200px] shrink-0 flex p-4 justify-between items-end">
        <div class="flex gap-2 items-end">
          <ImageRoot class="size-32">
            <Image alt="avatar" src={userBase()?.avatarUrl} />
            <ImageFallback
              class="bg-[--bg-color] text-[--text-color] size-full"
              style={{
                '--bg-color': bgColor(),
                '--text-color': getContrastTextColor(bgColor())
              }}
            >
              {(userBase()?.name?.[0] ?? 'User')}
            </ImageFallback>
          </ImageRoot>
          <div class="flex flex-col gap-1">
            <div class="text-3xl font-900">
              {userBase()?.name}
              <Show when={isMe()}>
                <Icon class="inline-block size-3! ml-1 c-slate hover:(c-slate-500) transition-color cursor-pointer"
                  onClick={() => setNameEditShown(true)}
                >
                  <EditIcon />
                </Icon>
              </Show>
            </div>
            <div class="text-sm text-slate">
              {
                userBase()?.description
                  ? userBase()?.description
                  : 'No description'
              }
              <Show when={isMe()}>
                <Icon class="inline-block ml-1 size-3 hover:(c-slate-500) transition-color cursor-pointer"
                  onClick={() => setDescEditShown(true)}
                >
                  <EditIcon />
                </Icon>
              </Show>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-1 bg-background flex">
        <div class="p-8 flex-1 flex flex-col gap-8">
          <Groups userId={isMe() ? userModel.id : userId() as number} />
          <LanguageMastery allowEdit={isMe()} userId={isMe() ? userModel.id : userId() as number} />
        </div>
      </div>
    </div>
  )
}

export default UsersView
