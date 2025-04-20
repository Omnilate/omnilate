import type { RouteSectionProps } from '@solidjs/router'
import type { Component } from 'solid-js'

import { useProject } from '@/stores/project'

interface FilesViewProps extends RouteSectionProps {}

const FilesView: Component<FilesViewProps> = (props) => {
  const { yProject } = useProject()

  return (
    <div class="flex">
      File
    </div>
  )
}

export default FilesView
