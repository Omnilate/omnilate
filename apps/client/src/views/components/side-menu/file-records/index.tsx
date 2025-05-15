import { For, Show } from 'solid-js'
import type { Component } from 'solid-js'

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { useProject } from '@/stores/project'

const FileRecords: Component = () => {
  const { currentFile } = useProject()

  return (
    <Show when={currentFile()}>
      <AccordionItem value="file-records">
        <AccordionTrigger class="p-4">
          {/* <For each={currentFile()?.reco}></For> */}
        </AccordionTrigger>
        <AccordionContent>Content</AccordionContent>
      </AccordionItem>
    </Show>
  )
}

export default FileRecords
