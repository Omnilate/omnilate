import type { Component, JSX } from 'solid-js'
import { createEffect } from 'solid-js'

import { getMe } from '@/apis/user'
import { Resizable, ResizableHandle, ResizablePanel } from '@/components/ui/resizable'
import { useAuthModel } from '@/stores/auth'
import { useUserModel } from '@/stores/user'
import { ToastList, ToastRegion } from '@/components/ui/toast'

import SideMenu from './components/side-menu'

interface RootProps {
  children?: JSX.Element
}

const RootView: Component<RootProps> = (props) => {
  const { authenticated } = useAuthModel()
  const { setUserModel } = useUserModel()

  // eslint-disable-next-line solid/reactivity
  createEffect(async () => {
    if (authenticated()) {
      const user = await getMe()
      setUserModel(user)
    }
  })

  return (
    <Resizable class="size-full rounded-lg border hide-scrollbar" orientation="horizontal">
      <ResizablePanel initialSize="300px" minSize="300px">
        <SideMenu />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel class="flex-1 bg-accent">
        <ToastRegion>
          <ToastList />
        </ToastRegion>
        {props.children}
      </ResizablePanel>
    </Resizable>
  )
}

export default RootView
