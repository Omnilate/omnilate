import type { Accessor, Resource } from 'solid-js'
import { createEffect, createMemo, createResource, createSignal, on } from 'solid-js'
import type { AwarenessInfo } from '@omnilate/schema'

import { getProject } from '@/apis/project'
import type { ProjectBaseResource } from '@/apis/project'
import { ProjectOnYjs } from '@/y/project-on-yjs'
import type { FileOnYjs } from '@/y/file-on-yjs'
import { getGroupMember } from '@/apis/groups'
import { putRecentProject } from '@/apis/user'
import type { UserGroupResource } from '@/apis/user'

import { useUserModel } from './user'

const [projectMeta, setProjectMeta] = createSignal<ProjectBaseResource>()
const [yProject, setYProject] = createSignal<ProjectOnYjs>()

interface ProjectStoreReturnType {
  yProject: Accessor<ProjectOnYjs | undefined>
  projectMeta: Accessor<ProjectBaseResource | undefined>
  setProject: (pid: number, gid: number) => Promise<void>
  clearModel: () => void
  projectReady: Accessor<boolean>
  currentFile: Accessor<FileOnYjs | undefined>,
  awareness: Accessor<Record<number, AwarenessInfo> | undefined>
  myGroupInfo: Resource<UserGroupResource | undefined>
}

export const useProject = (): ProjectStoreReturnType => {
  const { userModel } = useUserModel()

  const setProject = async (pid: number, gid: number): Promise<void> => {
    const project = await getProject(gid, pid)
    setYProject(new ProjectOnYjs('/api/v1/yjs', pid, userModel.id))
    setProjectMeta(project)
  }

  const awareness = createMemo(() => {
    return yProject()?.awarenessMap
  })

  const clearModel = (): void => {
    yProject()?.projectDoc?.destroy()
    yProject()?.provider?.disconnect()
    setProjectMeta(undefined)
    setYProject(undefined)
  }

  const projectReady = (): boolean => {
    return (yProject() != null) && (projectMeta() != null)
  }

  const currentFile = createMemo(() => {
    return yProject()?.currentFileDoc()
  })

  const [myGroupInfo] = createResource(
    () => ({ user: userModel, project: projectMeta(), ready: projectReady() }),
    async ({ user, project, ready }) => {
      if (!ready || user.id === 0 || (project == null)) {
        return
      }

      return await getGroupMember(project.groupId, user.id)
    }
  )

  createEffect(
    on(
      projectMeta,
      async (meta, prev) => {
        if ((meta != null) && meta.id !== prev?.id) {
          await putRecentProject(meta.id)
        }
      }
    )
  )

  return {
    yProject,
    projectMeta,
    setProject,
    clearModel,
    projectReady,
    currentFile,
    myGroupInfo,
    awareness
  }
}
