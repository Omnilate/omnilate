import { A } from '@solidjs/router'
import type { Component } from 'solid-js'
import { createEffect, createMemo, Match, onCleanup, Show, Switch } from 'solid-js'

import { ChevronRightIcon } from '@/assets/icons'
import Icon from '@/components/icon'
import LanguageSelect from '@/components/new-node-dialog/language-select'
import { Badge } from '@/components/ui/badge'
import { useGroupModel } from '@/stores/group'
import { useProject } from '@/stores/project'

import RecordView from '../record'
import LanguageProgress from './language-progress'
import LanguageStateCounts from './language-state-counts'
import RecordsTable from './records-table'
import SettingsDialog from './settings-dialog'

export interface FileViewProps {
  filePath: string[]
  recordName?: string
  baseUrl: string
}

const FileView: Component<FileViewProps> = (props) => {
  const { yProject } = useProject()
  const file = createMemo(() => yProject()?.currentFileDoc())
  const fileName = (): string => props.filePath.at(-1)!
  const { currentGroup } = useGroupModel()

  createEffect(() => {
    console.log('FileView: filePath', props.filePath)
    void yProject()?.workOnFile(props.filePath)
  })

  onCleanup(() => {
    yProject()?.leaveFile()
  })

  return (
    <div class="flex-1 space-y-2.5 px-4 flex flex-col gap-4">
      <div class="flex items-center gap-4">
        <div class="flex items-center justify-between w-full">
          <div class="flex gap-2 items-center">
            <A class="flex gap-2" href={`${props.baseUrl}/${props.filePath.join('/')}`}>
              <div class="text-3xl font-900">{fileName()}</div>
              <Badge class="h-fit">File</Badge>
            </A>
            <Show when={props.recordName}>
              <Icon>
                <ChevronRightIcon />
              </Icon>
              <div class="flex gap-2">
                <div class="text-3xl font-900">{props.recordName}</div>
                <Badge class="h-fit">Record</Badge>
              </div>
            </Show>
          </div>
          <div>
            <Show when={currentGroup()?.role === 'OWNER'}>
              <SettingsDialog />
            </Show>
          </div>
        </div>
      </div>
      <Switch>
        <Match when={props.recordName}>
          <RecordView
            key={props.recordName ?? 'never'}
            awareness={yProject()?.awarenessMap ?? {}}
            clientId={yProject()?.projectDoc.clientID ?? ''}
            file={file()}
            filePath={props.filePath}
          />
        </Match>
        <Match when={file()}>
          <div class="flex gap-4">
            <RecordsTable file={file()!} />
            <div class="flex flex-col gap-4 flex-1">
              <div class="flex-1 flex flex-col rounded bg-background shadow">
                <div class="flex items-center justify-between p-4">
                  <div class="text-lg font-500">Currently Working on</div>
                  <LanguageSelect languages={['zh-CN']} value="zh-CN" onChange={() => {}} />
                </div>
                <div class="flex-1 w-80% m-auto">
                  <LanguageStateCounts
                    approved={19}
                    class="w-80%"
                    language="zh-CN"
                    rejected={19}
                    reviewNeeded={45}
                    reviewed={14}
                    wip={11}
                  />
                </div>
              </div>

              <div class="flex-1 rounded bg-background shadow flex flex-col p-4 gap-4">
                <div class="text-lg font-500">Completeness</div>
                <div class="w-80% m-auto">
                  <LanguageProgress
                    class="w-full"
                    languages={[
                      { language: 'en', progress: 100, state: 'source' },
                      { language: 'zh-CN', progress: 95, state: 'target' }
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </Match>
      </Switch>
    </div>
  )
}

export default FileView
