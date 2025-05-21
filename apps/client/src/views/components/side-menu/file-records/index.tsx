import type { DialogTriggerProps } from '@kobalte/core/dialog'
import type { ProjectRecord } from '@omnilate/schema'
import type { Component } from 'solid-js'
import { createMemo, createSignal, For, Show } from 'solid-js'
import { createStore } from 'solid-js/store'

import { ChevronRightIcon, FunnelIcon } from '@/assets/icons'
import Icon from '@/components/icon'
import LanguageSelect from '@/components/new-node-dialog/language-select'
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch, SwitchControl, SwitchLabel, SwitchThumb } from '@/components/ui/switch'
import { TextField, TextFieldLabel, TextFieldRoot } from '@/components/ui/textfield'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useGroupModel } from '@/stores/group'
import { useProject } from '@/stores/project'
import type { SupportedLanguageCode } from '@/utils/supported-languages'

const FileRecords: Component = () => {
  const [filterApplied, setFilterApplied] = createSignal(false)
  const [filterOptions, setFilterOptions] = createStore<{
    keywords: string
    language: SupportedLanguageCode | 'all'
    state: 'wip' | 'review-needed' | 'reviewed' | 'approved' | 'rejected' | 'all'
  }>({
    keywords: '',
    language: 'all',
    state: 'all'
  })
  const { currentFile, projectMeta } = useProject()
  const { currentGroup } = useGroupModel()
  const records = () => currentFile()?.fileStore?.records
  const availableLanguages = (): string[] => currentFile()?.languages.filter((lang) => lang !== currentFile()?.sourceLanguage) ?? []
  const baseUrl = (): string => `/groups/${currentGroup()?.id}/projects/${projectMeta()?.id}/files/${encodeURI(currentFile()?.path.join('/') ?? '')}?record=`

  const filter = ([key, record]: [string, ProjectRecord]): boolean => {
    if (filterOptions.keywords.length > 0) {
      if (!key.toLowerCase().includes(filterOptions.keywords.toLowerCase())) {
        return false
      }

      if (filterOptions.language !== 'all') {
        const lang = record.languages[filterOptions.language]
        if (filterOptions.state !== 'all' && lang.state !== filterOptions.state) {
          return false
        }
      }
    }

    return true
  }

  const filtered = createMemo(() => {
    if (records() == null) {
      return []
    }
    if (!filterApplied()) {
      return Object.entries(records() ?? {})
    }
    return Object.entries(records() ?? {}).filter(filter)
  })

  const handleKeywordChange = (e: Event): void => {
    const value = (e.target as HTMLInputElement).value
    setFilterOptions((prev) => ({ ...prev, keywords: value }))
  }

  const handleLanguageFilterChange = (lang?: SupportedLanguageCode): void => {
    setFilterOptions((prev) => ({ ...prev, language: lang ?? 'all' }))
  }

  const handleFilterStateChange = (state: string | null): void => {
    setFilterOptions((prev) => ({ ...prev, state: (state as 'wip' | 'review-needed' | 'reviewed' | 'approved' | 'rejected' | 'all' | null) ?? 'all' }))
  }

  return (
    <Show when={currentFile()}>
      <AccordionItem value="file-records">
        <AccordionTrigger class="p-4">
          <div class="flex flex-1 pr-2 items-center justify-between">
            <div class="flex flex-1 items-center gap-2">
              <Badge class="text-xs">Records</Badge>
              <div>{currentFile()?.name}</div>
            </div>
            <div>
              <Dialog>
                <DialogTrigger as={
                  (props: DialogTriggerProps) => (
                    <div onClick={(e) => { e.stopPropagation() }}>
                      <Button {...props}
                        class="size-6"
                        size="icon"
                        variant="ghost"
                        classList={{
                          'bg-accent!': filterApplied()
                        }}
                      >
                        <Icon><FunnelIcon /></Icon>
                      </Button>
                    </div>
                  )
                }
                />
                <DialogContent onClick={(e) => { e.stopPropagation() }}>
                  <DialogHeader>
                    <DialogTitle>Filter Settings</DialogTitle>
                  </DialogHeader>
                  <div class="flex flex-col gap-4">
                    <Switch checked={filterApplied()} class="flex items-center justify-between" onChange={setFilterApplied}>
                      <SwitchLabel>Filter Applied</SwitchLabel>
                      <SwitchControl>
                        <SwitchThumb />
                      </SwitchControl>
                    </Switch>
                    <Show when={filterApplied()}>
                      <TextFieldRoot>
                        <TextFieldLabel>Keyword</TextFieldLabel>
                        <TextField value={filterOptions.keywords} onInput={handleKeywordChange} />
                      </TextFieldRoot>
                      <TextFieldRoot>
                        <TextFieldLabel>Language</TextFieldLabel>
                        <LanguageSelect languages={availableLanguages()} value={filterOptions.language} onChange={handleLanguageFilterChange} />
                      </TextFieldRoot>
                      <div class="flex flex-col gap-2">
                        <div class="text-sm font-medium">Record State</div>
                        <ToggleGroup value={filterOptions.state} onChange={handleFilterStateChange}>
                          <ToggleGroupItem value="wip">In Progress</ToggleGroupItem>
                          <ToggleGroupItem value="review-needed">Need Review</ToggleGroupItem>
                          <ToggleGroupItem value="reviewed">Reviewed</ToggleGroupItem>
                          <ToggleGroupItem value="approved">Approved</ToggleGroupItem>
                          <ToggleGroupItem value="rejected">Rejected</ToggleGroupItem>
                          <ToggleGroupItem value="all">All</ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                    </Show>
                  </div>
                  <Show when={filterApplied()}>
                    <DialogFooter class="text-xs opacity-50">
                      <span>{filtered().length}</span>
                      <span>result(s) under current filter setting</span>
                    </DialogFooter>
                  </Show>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent class="max-h-xs overflow-y-auto hide-scrollbar">
          <For each={filtered()}>
            {([key]) => (
              <div class="p-2 w-full">
                <Tooltip>
                  <TooltipTrigger
                    as="a"
                    class="w-full p-(x-4 y-2) bg-background hover:bg-accent rounded-xl transition-colors flex justify-between items-center group"
                    href={baseUrl() + key}
                  >
                    <div class="max-w-[16em] text-ellipsis whitespace-nowrap overflow-hidden">{key}</div>
                    <Icon class="opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRightIcon /></Icon>
                  </TooltipTrigger>
                  <TooltipContent>
                    {key}
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
          </For>
        </AccordionContent>
      </AccordionItem>
    </Show>
  )
}

export default FileRecords
