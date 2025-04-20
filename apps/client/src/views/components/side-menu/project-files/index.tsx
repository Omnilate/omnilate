import { Show } from 'solid-js'
import type { Component } from 'solid-js'

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useProject } from '@/stores/project'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DocumentPlusIcon } from '@/assets/icons'
import Icon from '@/components/icon'

import { setSelectedPath } from './selected-path'
import DirTree from './dir-tree'

const ProjectFiles: Component = () => {
  const { projectReady, projectMeta, yProject } = useProject()

  const handleTriggerClick = (): void => {
    setSelectedPath([])
  }

  return (
    <Show when={projectReady()}>
      <AccordionItem value="project-files">
        <AccordionTrigger class="p-4" onClick={handleTriggerClick}>
          <div class="flex flex-1 pr-2 items-center justify-between">
            <div class="flex flex-1 items-center gap-2">
              <Badge>Project</Badge>
              <span>{projectMeta()?.name}</span>
            </div>
            <Button class="flex items-center gap-1 rounded-full px-2 h-6">
              <Icon>
                <DocumentPlusIcon />
              </Icon>
              <span class="text-xs">New</span>
            </Button>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <DirTree
            node={yProject()?.directoryRoot ?? { type: 'directory', children: {} }}
            path={[]}
          />
        </AccordionContent>
      </AccordionItem>
    </Show>
  )
}

export default ProjectFiles
