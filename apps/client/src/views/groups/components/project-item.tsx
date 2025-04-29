import type { Component } from 'solid-js'
import { A } from '@solidjs/router'

import type { ProjectBaseResource } from '@/apis/project'
import { Badge } from '@/components/ui/badge'
import { serializeDateTime } from '@/utils/serialize-datetime'

interface ProjectItemProps extends ProjectBaseResource {}

const ProjectItem: Component<ProjectItemProps> = (props) => {
  return (
    <A class="flex justify-between items-center rounded-xl transition-colors hover:(bg-slate-100) py-2 px-4" href={`/groups/${props.groupId}/projects/${props.id}`}>
      <div class="flex gap-4 items-center">
        <div>{props.name}</div>
        <Badge>
          {
            props.privateProject
              ? 'Private'
              : 'Public'
          }
        </Badge>
      </div>
      <div class="text-(xs gray)">
        <span>{'Updated on '}</span>
        <span>{serializeDateTime(props.updatedAt)}</span>
      </div>
    </A>
  )
}

export default ProjectItem
