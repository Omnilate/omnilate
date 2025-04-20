import type { RoutePreloadFunc } from '@solidjs/router'

import { getRecentProjects } from '@/apis/user'

export const preloadRecentProjects: RoutePreloadFunc = async () => {
  await getRecentProjects()
}
