import type { RouteSectionProps } from '@solidjs/router'
import { createResource, For, Show } from 'solid-js'
import type { Component } from 'solid-js'

import { getRecentProjects } from '@/apis/user'
import { Card, CardContent } from '@/components/ui/card'
import { useI18n } from '@/utils/i18n'

import RecentItem from './components/recent-item'

interface HomeProps extends RouteSectionProps {}

const HomeView: Component<HomeProps> = (props) => {
  const [recentProjects] = createResource(async () => {
    return await getRecentProjects()
  })
  const t = useI18n()

  return (
    <div class="flex size-full justify-center">
      <div class="size-full max-w-5xl pt-8 flex flex-col gap-8">
        <div class="text-3xl font-bold">{t.RECENTPROJ.TITLE()}</div>
        <div class="shadow bg-background rounded-xl p-4">
          <Show when={(recentProjects()?.length ?? 0) > 0}
            fallback={(
              <div class="w-full h-xl text-(4xl gray) font-bold flex items-center justify-center">
                {t.RECENTPROJ.EMPTY()}
              </div>
            )}
          >
            <div class="grid grid-cols-2 gap-4 grid-auto-rows-28">
              <For each={recentProjects()}>
                {RecentItem}
              </For>
            </div>
          </Show>
        </div>
      </div>
    </div>
  )
}

export default HomeView
