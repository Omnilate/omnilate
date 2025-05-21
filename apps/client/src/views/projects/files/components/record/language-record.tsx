import type { AwarenessInfo, LanguageRecord, LanguageRecordY } from '@omnilate/schema'
import type { Component } from 'solid-js'
import { createMemo, createSignal, For, Show } from 'solid-js'
import type * as Y from 'yjs'

import { DiscussionIcon, EditIcon } from '@/assets/icons'
import Icon from '@/components/icon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { TextArea } from '@/components/ui/textarea'
import { TextFieldRoot } from '@/components/ui/textfield'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useGroupModel } from '@/stores/group'
import { iv } from '@/utils/input-value'
import { supportedLanguageMap } from '@/utils/supported-languages'
import type { FileOnYjs } from '@/y/file-on-yjs'

import DiscussionItem from './discussion-item'
import QuillEditor from './quill-editor'

interface LanguageRecordProps {
  key: string
  lang: string
  record: LanguageRecord
  filePath: string[]
  file: FileOnYjs
  clientId: string | number
  awareness: Record<string | number, AwarenessInfo>
}

const LanguageRecordItem: Component<LanguageRecordProps> = (props) => {
  const [openedSections, setOpenedSections] = createSignal<Array<'edit' | 'discussion'>>([])
  const [discussionContent, setDiscussionContent] = createSignal('')
  const { currentGroup } = useGroupModel()

  const text = createMemo(() => {
    const record = props.file?.rawRecords.get(props.key)
    if (record == null) {
      return
    }

    const languages = record.get('languages') as Y.Map<LanguageRecordY>
    const lang = languages.get(props.lang)
    if (lang == null) {
      throw new Error(`Language ${props.lang} not found`)
    }
    return lang.get('value') as Y.Text
  })

  const handleCursorChange = (range?: { index: number, length: number }): void => {
    props.file?.moveCursor(
      props.filePath,
      props.key,
      props.lang,
      range
    )
  }

  const handleDiscussionSend = (): void => {
    props.file?.addDiscussion(props.key, props.lang, discussionContent())
    setDiscussionContent('')
  }

  const handleCommit = (): void => {

  }

  return (
    <div class="flex flex-col gap-4 p-4 bg-background rounded-xl b-(1px solid border)">
      <div class="flex gap-2 items-center">
        <div class="flex flex-col gap-2 items-center w-24">
          <div class="font-600">{supportedLanguageMap[props.lang].nativeName}</div>
          <Badge class="flex items-center gap-1 text-sm" variant="secondary">
            <div>{supportedLanguageMap[props.lang].icon}</div>
            <span>{props.lang}</span>
          </Badge>
        </div>
        <Badge class="w-18 flex justify-center">
          {props.record.state.toUpperCase()}
        </Badge>
        <div class="flex-1">{props.record.value}</div>
        <div class="flex gap-2 items-center">
          <ToggleGroup multiple value={openedSections()} onChange={setOpenedSections}>
            <Show when={
              (currentGroup()?.role !== 'OBSERVER' && props.record.state === 'wip') ||
              (['OWNER', 'ADMIN'].includes(currentGroup()?.role) && props.record.state === 'source')
            }
            >
              <ToggleGroupItem value="edit">
                <Icon><EditIcon /></Icon>
              </ToggleGroupItem>
            </Show>
            <ToggleGroupItem value="discussion">
              <Icon><DiscussionIcon /></Icon>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      <Show when={openedSections().includes('edit')}>
        <Separator />
        <div class="flex gap-2 flex-col items-end w-full">
          <QuillEditor
            key={props.key}
            awarenessMap={props.awareness}
            file={props.file}
            filePath={props.filePath}
            language={props.lang}
            localClientId={props.clientId}
            text={text()}
            onLocalCursorChange={handleCursorChange}
          />
          <Button onClick={handleCommit}>Commit</Button>
        </div>
      </Show>
      <Show when={openedSections().includes('discussion')}>
        <Separator />
        <div class="flex flex-col gap-4">
          <Show
            fallback={<div class="h-[100px] lh-[100px] text-center text-slate">Empty</div>}
            when={props.record.discussions.length > 0}
          >
            <For each={props.record.discussions}>
              {(discussion, index) => (
                <>
                  <DiscussionItem discussion={discussion} />
                  <Show when={index() !== props.record.discussions.length - 1}>
                    <Separator />
                  </Show>
                </>
              )}
            </For>
          </Show>
        </div>
        <div>
          <TextFieldRoot class="flex gap-2 items-end">
            <TextArea
              autoResize
              class="resize-y"
              value={discussionContent()}
              onInput={(iv(setDiscussionContent))}
            />
            <Button onClick={handleDiscussionSend}>Send</Button>
          </TextFieldRoot>
        </div>
      </Show>
    </div>
  )
}

export default LanguageRecordItem
