import type { ProjectBaseResponse } from '@omnilate/schema'
import type { Project } from '@prisma/client'

export function toBaseResponse (project: Project): ProjectBaseResponse {
  return {
    id: project.id,
    groupId: project.groupId,
    name: project.name,
    description: project.description,
    privateProject: project.privateProject,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString()
  }
}
