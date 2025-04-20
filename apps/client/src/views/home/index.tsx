import type { RouteSectionProps } from '@solidjs/router'
import { createResource, Show } from 'solid-js'
import type { Component } from 'solid-js'

import { getRecentProjects } from '@/apis/user'
import { Card, CardContent } from '@/components/ui/card'

interface HomeProps extends RouteSectionProps {}

const HomeView: Component<HomeProps> = (props) => {
  const [recentProjects] = createResource(async () => {
    return await getRecentProjects()
  })

  return (
    <div class="flex size-full justify-center">
      <div class="size-full max-w-5xl pt-4 flex flex-col gap-8">
        <div class="text-3xl font-bold">Recent Projects</div>
        <Card class="shadow-xl">
          <CardContent>
            <Show when={(recentProjects()?.length ?? 0) > 0}
              fallback={(
                <div class="w-full h-xl text-(4xl gray) font-bold flex items-center justify-center">
                  No recently visited projects yet
                </div>
              )}
            >
              {JSON.stringify(recentProjects())}
            </Show>

          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default HomeView
