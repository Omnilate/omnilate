import type { HoverCardTriggerProps } from '@kobalte/core/hover-card'
import type { Component } from 'solid-js'
import { useNavigate } from '@solidjs/router'

import { ChevronRightIcon, LogoutIcon } from '@/assets/icons'
import Icon from '@/components/icon'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import UserAvatar from '@/components/user-avatar'
import { useAuthModel } from '@/stores/auth'
import { useUserModel } from '@/stores/user'
import { useI18n } from '@/utils/i18n'

const Me: Component = () => {
  const t = useI18n()
  const { userModel, resetUserModel } = useUserModel()
  const { clearAuthModel } = useAuthModel()
  const navigate = useNavigate()

  const handleLogout = (): void => {
    resetUserModel()
    clearAuthModel()
    navigate('/sign')
  }

  return (
    <div class="flex items-center justify-between gap-2 w-full h-16 p-2 self-end b-t b-t-solid b-t-border">
      <div class="flex flex-row items-center gap-2">
        <UserAvatar user={userModel} />
        <div class="flex flex-col justify-between">
          <div class="text-primary font-bold">{userModel.name}</div>
          <div class="text-sm">
            {
              userModel.description === ''
                ? t.ME.DESC_PLACEHOLDER()
                : userModel.description
            }
          </div>
        </div>
      </div>
      <HoverCard>
        <HoverCardTrigger as={(props: HoverCardTriggerProps) => (
          <Icon {...props} class="hover:rotate-[-90deg] transition-transform">
            <ChevronRightIcon />
          </Icon>
        )}
        />
        <HoverCardContent>
          <div
            class="flex w-full items-center justify-between rounded p-2 bg-background hover:bg-accent cursor-pointer"
            onClick={handleLogout}
          >
            <div><Icon class="block size-4 c-destructive"><LogoutIcon /></Icon></div>
            <div class="text-sm">{t.ME.LOGOUT()}</div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}

export default Me
