import type { RouteSectionProps } from '@solidjs/router'
import { onMount } from 'solid-js'
import type { Component } from 'solid-js'

import { useProject } from '@/stores/project'

interface FilesViewProps extends RouteSectionProps {}

const FilesView: Component<FilesViewProps> = (props) => {
  const { yProject } = useProject()
  // eslint-disable-next-line solid/reactivity
  const path = decodeURI(props.params.path).split('/')

  onMount(() => {
    yProject()?.workOnFile(path)
  })

  return (
    <div class="flex">
      {decodeURI(props.params.path)}
    </div>
  )
}

export default FilesView
