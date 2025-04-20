import type { Component } from 'solid-js'
import { A } from '@solidjs/router'

import type { ProjectBaseResource } from '@/apis/project'

interface ProjectItemProps extends ProjectBaseResource {}

const ProjectItem: Component<ProjectItemProps> = (props) => {
  return (
    <A class="flex" href={`/groups/${props.groupId}/projects/${props.id}`}>
      {props.name}
    </A>
  )
}

export default ProjectItem
