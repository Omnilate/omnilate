import type { Component } from 'solid-js'
import { createResource, createSignal, For, onCleanup, onMount, Show } from 'solid-js'

import { getNotifications } from '@/apis/notification'
import { BellIcon } from '@/assets/icons'
import Icon from '@/components/icon'
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from '@/components/ui/popover'

import NotificationItem from './notification-item'

const Notification: Component = () => {
  const [refreshPaused, setRefreshPaused] = createSignal(false)
  const [timer, setTimer] = createSignal<ReturnType<typeof setInterval>>()
  const [notifications, { refetch: refetchNotifications }] = createResource(async () => await getNotifications(), { initialValue: [] })
  const unreadExists = (): boolean => {
    return notifications().some((notification) => !notification.read)
  }

  setTimer(setInterval(() => {
    if (refreshPaused()) return
    void refetchNotifications()
  }, 10000))

  onCleanup(() => {
    clearInterval(timer())
  })

  const handleOpenChange = (open: boolean): void => {
    setRefreshPaused(open)

    if (!open) {
      void refetchNotifications()
    }
  }

  return (
    <Popover placement="top" onOpenChange={handleOpenChange}>
      <PopoverTrigger class="size-4 bg-transparent">
        <div class="color-gray! hover:color-primary! transition-color relative">
          <Show when={unreadExists()}>
            <div class="absolute top-0 right-0 rounded-full size-1.5 bg-destructive" />
          </Show>
          <Icon>
            <BellIcon />
          </Icon>
        </div>
      </PopoverTrigger>
      <PopoverContent class="w-sm">
        <PopoverTitle>Notifications</PopoverTitle>
        <div class="flex flex-col h-sm overflow-y-auto hide-scrollbar">
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
