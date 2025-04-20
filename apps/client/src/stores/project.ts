import type { Accessor } from 'solid-js'
import { createSignal } from 'solid-js'

import { getProject } from '@/apis/project'
import type { ProjectBaseResource } from '@/apis/project'
import { ProjectOnYjs } from '@/y/project-on-yjs'

const [projectMeta, setProjectMeta] = createSignal<ProjectBaseResource>()
const [yProject, setYProject] = createSignal<ProjectOnYjs>()

interface ProjectStoreReturnType {
  yProject: Accessor<ProjectOnYjs | undefined>
  projectMeta: Accessor<ProjectBaseResource | undefined>
  setProject: (pid: number, gid: number) => Promise<void>
  clearModel: () => void
  projectReady: Accessor<boolean>
}

export const useProject = (): ProjectStoreReturnType => {
  const setProject = async (pid: number, gid: number): Promise<void> => {
    const project = await getProject(pid, gid)
    setYProject(new ProjectOnYjs('/api/v1/yjs', pid, gid))
    setProjectMeta(project)
  }

  const clearModel = (): void => {
    yProject()?.projectDoc?.destroy()
    yProject()?.provider?.disconnect()
    setProjectMeta(undefined)
    setYProject(undefined)
  }

  const projectReady = (): boolean => {
    return (yProject() != null) && (projectMeta() != null)
  }

  return {
    yProject,
    projectMeta,
    setProject,
    clearModel,
    projectReady
  }
}
