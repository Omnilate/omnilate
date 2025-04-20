import type { ProjectBaseResponse, ProjectCreateRequest, ProjectUpdateRequest } from '@omnilate/schema'
import { query } from '@solidjs/router'

import { convertDatetime } from '@/utils/convert-datetime'
import type { ConvertDatetime } from '@/utils/convert-datetime'

import { makeHttpRequest } from './http-request'

export type ProjectBaseResource = ConvertDatetime<ProjectBaseResponse, 'createdAt' | 'updatedAt'>

export async function getProject (gid: number, pid: number): Promise<ProjectBaseResource> {
  const httpRequest = makeHttpRequest()

  const response = await httpRequest.get(`groups/${gid}/projects/${pid}`)

  if (!response.ok) {
    throw new Error('Failed to get project')
  }

  const project = await response.json<ProjectBaseResponse>()
  return convertDatetime(project, ['createdAt', 'updatedAt'])
}

export async function createProject (
  gid: number, payload: ProjectCreateRequest
): Promise<ProjectBaseResource> {
  const httpRequest = makeHttpRequest()

  const response = await httpRequest.post(`groups/${gid}/projects`, {
    json: payload
  })

  if (!response.ok) {
    throw new Error('Failed to create project')
  }

  const project = await response.json<ProjectBaseResponse>()
  return convertDatetime(project, ['createdAt', 'updatedAt'])
}

export const getProjects = query(async (gid: number): Promise<ProjectBaseResource[]> => {
  const httpRequest = makeHttpRequest()

  const response = await httpRequest.get(`groups/${gid}/projects`)

  if (!response.ok) {
    throw new Error('Failed to get projects')
  }

  const projects = await response.json<ProjectBaseResponse[]>()
  return projects.map((project) => convertDatetime(project, ['createdAt', 'updatedAt']))
}, 'get-projects-by-group-id')

export async function updateProject (
  gid: number, pid: number,
  payload: ProjectUpdateRequest
): Promise<ProjectBaseResource> {
  const httpRequest = makeHttpRequest()

  const response = await httpRequest.patch(`groups/${gid}/projects/${pid}`, {
    json: payload
  })

  if (!response.ok) {
    throw new Error('Failed to update project')
  }

  const project = await response.json<ProjectBaseResponse>()
  return convertDatetime(project, ['createdAt', 'updatedAt'])
}
