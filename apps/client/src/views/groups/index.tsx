import type { RouteSectionProps } from '@solidjs/router'
import { createAsync } from '@solidjs/router'
import type { Component } from 'solid-js'
import { For, Suspense } from 'solid-js'

import { getGroup, getGroupMembers } from '@/apis/groups'
import { getProjects } from '@/apis/project'
import GroupLogo from '@/components/group-logo'
import { Card, CardContent } from '@/components/ui/card'

import GroupMemberAvatar from './components/group-member-avatar'
import InviteDialog from './components/invite-dialog'
import MemberConfDialog from './components/member-conf-dialog'
import ProjectItem from './components/project-item'

interface GroupsProps extends RouteSectionProps {}

const GroupsView: Component<GroupsProps> = (props) => {
  const gid = (): number => parseInt(props.params.id)
  const group = createAsync(async () => { return await getGroup(gid()) })
  const projects = createAsync(
    async () => await getProjects(gid()),
    { initialValue: [] }
  )
  const members = createAsync(
    async () => await getGroupMembers(gid()),
    { initialValue: [] }
  )

  return (
    <Suspense fallback="loading">
      <div class="flex size-full justify-center py-4">
        <div class="size-full max-w-5xl flex flex-col gap-8">
          <div class="flex justify-end items-end gap-4">
            <div class="text-4xl font-bold">{group()?.name}</div>
            <GroupLogo class="size-32 text-28" id={gid()} />
          </div>
          <div class="flex flex-1 gap-4">
            <Card class="flex-grow-3">
              <CardContent class="flex flex-col gap-4">
                <div class="font-500 text-xl py-4">
                  Projects
                </div>
                <div class="flex flex-col gap-2">
                  <For each={projects()}>
                    {(project) => <ProjectItem {...project} />}
                  </For>
                </div>
              </CardContent>
            </Card>
            <Card class="flex-grow-1 flex-shrink-0">
              <CardContent class="flex-col gap-4">
                <div class="flex items-center gap-4 font-500 text-xl py-4">
                  <span>Members</span>
                  <InviteDialog gid={group()?.id ?? 0} members={members()} />
                  <MemberConfDialog gid={group()?.id ?? 0} />
                </div>
                <div>
                  <For each={members() ?? []}>
                    {GroupMemberAvatar}
                  </For>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Suspense>
  )
}

export default GroupsView
