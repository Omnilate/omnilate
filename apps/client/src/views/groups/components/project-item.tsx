import type { Component } from 'solid-js'
import { A } from '@solidjs/router'

import type { ProjectBaseResource } from '@/apis/project'
import { Badge } from '@/components/ui/badge'
import { serializeDateTime } from '@/utils/serialize-datetime'
import { useI18n } from '@/utils/i18n'

interface ProjectItemProps extends ProjectBaseResource {}

const ProjectItem: Component<ProjectItemProps> = (props) => {
  const t = useI18n()

  return (
    <A class="flex justify-between items-center rounded-xl transition-colors hover:(bg-accent) py-2 px-4" href={`/groups/${props.groupId}/projects/${props.id}`}>
      <div class="flex gap-4 items-center">
        <div>{props.name}</div>
        <Badge>
          {
            props.privateProject
              ? t.GROUPVIEW.PROJECTS.ITEM.PRIVATE()
              : t.GROUPVIEW.PROJECTS.ITEM.PUBLIC()
          }
        </Badge>
      </div>
      <div class="text-(xs gray)">
        <span>
          {
            t.GROUPVIEW.PROJECTS.ITEM.UPDATED_ON(
              { datetime: serializeDateTime(props.updatedAt) }
            )
          }
        </span>
      </div>
    </A>
  )
}

export default ProjectItem
