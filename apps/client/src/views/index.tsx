import type { Component } from 'solid-js'
import { createEffect } from 'solid-js'

import { getMe } from '@/apis/user'
import { Button } from '@/components/ui/button'
import { Resizable, ResizableHandle, ResizablePanel } from '@/components/ui/resizable'
import { useAuthModel } from '@/stores/auth'
import { useUserModel } from '@/stores/user'

import SideMenu from './components/side-menu'

const RootView: Component = () => {
  const { authModel } = useAuthModel()
  const { setUserModel } = useUserModel()

  // eslint-disable-next-line solid/reactivity
  createEffect(async () => {
    if (authModel.accessToken !== '') {
      const user = await getMe()
      setUserModel(user)
    }
  })

  return (
    <Resizable class="size-full rounded-lg border hide-scrollbar" orientation="horizontal">
      <ResizablePanel class="size-full" initialSize="300px" minSize="200px">
        <SideMenu />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <Button >Button</Button>
      </ResizablePanel>
    </Resizable>
  )
}

export default RootView
