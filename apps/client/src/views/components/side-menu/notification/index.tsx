import { createAsync } from '@solidjs/router'
import type { Component } from 'solid-js'
import { For } from 'solid-js'

import { getNotifications } from '@/apis/notification'
import { BellIcon } from '@/assets/icons'
import Icon from '@/components/icon'
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from '@/components/ui/popover'

import NotificationItem from './notification-item'

const Notification: Component = () => {
  const notifications = createAsync(
    async () => await getNotifications(),
    { initialValue: [] }
  )

  return (
    <Popover placement="top">
      <PopoverTrigger class="size-4 bg-transparent">
        <div class="color-gray! hover:color-primary! transition-color">
          <Icon>
            <BellIcon />
          </Icon>
        </div>
      </PopoverTrigger>
      <PopoverContent class="w-sm">
        <PopoverTitle>Notifications</PopoverTitle>
        <div class="flex">
          <For each={notifications()}>
            {(notification) => (
              <NotificationItem notification={notification} />
            )}
          </For>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default Notification
