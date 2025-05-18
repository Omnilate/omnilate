import type { RoutePreloadFunc } from '@solidjs/router'

import { getGroup } from '@/apis/groups'
import { getProjects } from '@/apis/project'

export const preloadGroups: RoutePreloadFunc = async ({ params }) => {
  const { id } = params
  await getGroup(+id)
  await getProjects(+id)
}
