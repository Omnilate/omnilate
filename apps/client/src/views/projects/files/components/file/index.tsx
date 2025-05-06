import type { Component } from 'solid-js'
import { createEffect, createMemo, onCleanup, onMount, Show } from 'solid-js'

import { Badge } from '@/components/ui/badge'
import { useProject } from '@/stores/project'

import RecordsTable from './records-table'
import CoEditors from './co-editors'

export interface FileViewProps {
  filePath: string[]
}

const FileView: Component<FileViewProps> = (props) => {
  const { yProject } = useProject()
  const file = createMemo(() => yProject()?.currentFileDoc())
  const fileName = (): string => props.filePath.at(-1)!

  createEffect(async () => {
    await yProject()?.workOnFile(props.filePath)
  })

  onCleanup(() => {
    yProject()?.leaveFile()
  })

  return (
    <div class="w-full space-y-2.5 px-4">
      <div class="flex items-center justify-between">
        <div class="flex gap-2">
          <div class="text-3xl font-900">{fileName()}</div>
          <Badge class="h-fit">File</Badge>
        </div>
        <CoEditors />
      </div>
      <Show when={file()}>
        <RecordsTable file={file()!} />
      </Show>
    </div>
  )
}

export default FileView
