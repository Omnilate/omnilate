import type { ProjectDirectory, ProjectFile } from '@omnilate/schema'
import { A } from '@solidjs/router'
import type { Component } from 'solid-js'
import { For } from 'solid-js'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useProject } from '@/stores/project'
import { DocumentIcon, FolderIcon } from '@/assets/icons'
import Icon from '@/components/icon'

import { setSelectedPath } from './selected-path'

interface DirTreeProps {
  node: ProjectFile | ProjectDirectory
  name?: string
  path: string[]
}

const DirTree: Component<DirTreeProps> = (props) => {
  const { projectMeta } = useProject()
  const isRoot = (): boolean => props.path.length === 0
  const handleClick = (): void => {
    if (props.node.type === 'file') {
      setSelectedPath(props.path)
    } else {
      setSelectedPath([...props.path, props.name ?? ''])
    }
  }

  const paddingLeft = (): string => {
    return 8 + (props.path.length * 16) + 'px'
  }

  return (
    <>
      {
        props.node.type === 'file'
          ? (
              <A
                class="flex gap-1 items-center ml-2 pl-[--pl] mr-2 h-6 rounded-xl hover:bg-slate-100"
                href={`/groups/${projectMeta()?.groupId}/projects/${projectMeta()?.id}/files${props.path.join('/')}/${props.name}`}
                style={{ '--pl': paddingLeft() }}
                onClick={handleClick}
              >
                <Icon>
                  <DocumentIcon />
                </Icon>
                <span>{props.name}</span>
              </A>
            )
          : isRoot()
            ? (
                <Accordion multiple>
                  <For each={
                    Object
                      .entries(props.node.children)
                      .sort((a, b) => {
                        if (a[1].type === 'file' && b[1].type === 'directory') {
                          return 1
                        }
                        if (a[1].type === 'directory' && b[1].type === 'file') {
                          return -1
                        }

                        return a[0].localeCompare(b[0])
                      })
                  }
                  >
                    {(entry) => (
                      <DirTree
                        name={entry[0]}
                        node={entry[1]}
                        path={[...props.path, props.name ?? '']}
                      />
                    )}
                  </For>
                </Accordion>
              )
            : (
                <AccordionItem class="b-b-0" value={props.name ?? ''}>
                  <AccordionTrigger
                    class="h-6 py-0 ml-2 pl-[--pl] pr-4 mr-2 h-6 rounded-xl hover:(bg-slate-100 decoration-none)"
                    style={{ '--pl': paddingLeft() }}
                    onClick={handleClick}
                  >
                    <span class="inline-flex gap-1 items-center h-full font-normal">
                      <Icon>
                        <FolderIcon />
                      </Icon>
                      <span>{props.name}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent class="*:p-0!">
                    <Accordion multiple>
                      <For each={
                        Object
                          .entries(props.node.children)
                          .sort((a, b) => {
                            if (a[1].type === 'file' && b[1].type === 'directory') {
                              return 1
                            }
                            if (a[1].type === 'directory' && b[1].type === 'file') {
                              return -1
                            }

                            return a[0].localeCompare(b[0])
                          })
                      }
                      >
                        {(entry) => (
                          <DirTree
                            name={entry[0]}
                            node={entry[1]}
                            path={[...props.path, props.name ?? '']}
                          />
                        )}
                      </For>
                    </Accordion>
                  </AccordionContent>
                </AccordionItem>
              )
      }
    </>
  )
}

export default DirTree
