import type { Component } from 'solid-js'

import { useI18n } from '@/utils/i18n'
import Icon from '@/components/icon'
import ChevronRight from '@/assets/icons/chevron-right.svg'
import { useUserModel } from '@/stores/user'

import Avatar from './avatar'

const Me: Component = () => {
  const t = useI18n()
  const { userModel } = useUserModel()

  return (
    <div class="flex items-center justify-between gap-2 w-full h-16 p-2 self-end b-t b-t-solid b-t-border">
      <div class="flex flex-row items-center gap-2">
        <Avatar uid={userModel.id} />
        <div class="flex flex-col justify-between">
          <div class="text-primary font-bold">{userModel.name}</div>
          <div class="text-sm">{t('FREETIER_USER')}</div>
        </div>
      </div>
      <Icon>
        <ChevronRight />
      </Icon>
    </div>
  )
}

export default Me
