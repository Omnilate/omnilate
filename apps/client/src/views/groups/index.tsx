import type { RouteSectionProps } from '@solidjs/router'
import { createResource, For, Suspense } from 'solid-js'
import type { Component } from 'solid-js'

import { getGroup } from '@/apis/groups'
import { getProjects } from '@/apis/project'
import GroupLogo from '@/components/group-logo'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'

import ProjectItem from './components/project-item'

interface GroupsProps extends RouteSectionProps {}

const GroupsView: Component<GroupsProps> = (props) => {
  const gid = (): number => parseInt(props.params.id)
  const [group] = createResource(gid, async (id) => {
    return await getGroup(id)
  })

  const [projects] = createResource(gid, async (id) => {
    return await getProjects(id)
  })

  return (
    <Suspense fallback="loading">
      <div class="flex size-full justify-center">
        <div class="size-full max-w-5xl pt-4 flex flex-col gap-8">
          <div class="flex justify-end items-end gap-4">
            <div class="text-4xl font-bold">{group()?.name}</div>
            <GroupLogo class="size-32 text-28" id={gid()} />
          </div>
          <Card>
            <CardContent class="p-4 flex flex-col gap-4">
              <div class="text-2xl font-500">Projects</div>
              <For each={projects() ?? []}>
                {
                  (project) => <ProjectItem {...project} />
                }
              </For>
            </CardContent>
          </Card>

        </div>
      </div>
    </Suspense>
  )
}

export default GroupsView
