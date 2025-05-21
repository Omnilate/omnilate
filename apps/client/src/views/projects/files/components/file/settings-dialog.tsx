import type { DialogTriggerProps } from '@kobalte/core/dialog'
import type { PopoverTriggerProps } from '@kobalte/core/popover'
import type { Component } from 'solid-js'
import { createSignal, For } from 'solid-js'
import { toast } from 'solid-sonner'

import { CogIcon, EditIcon, PlusIcon } from '@/assets/icons'
import Icon from '@/components/icon'
import LanguageSelect from '@/components/new-node-dialog/language-select'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { ToggleButton } from '@/components/ui/toggle'
import { useProject } from '@/stores/project'
import type { SupportedLanguageCode } from '@/utils/supported-languages'
import { supportedLanguageCodeList, supportedLanguageMap } from '@/utils/supported-languages'

const SettingsDialog: Component = () => {
  const [langToAdd, setLangToAdd] = createSignal<SupportedLanguageCode>()

  const { currentFile } = useProject()
  const languages = () => currentFile()?.fileStore?.languages ?? {}
  const availableLanguages = (): string[] => supportedLanguageCodeList.filter((code) => !(code in languages()))

  const handleAddLanguage = (): void => {
    if (langToAdd() == null) {
      toast.error('Please select a language')
      return
    }

    toast.success(`Added language ${langToAdd()}`)
    currentFile()?.addLanguage(langToAdd()!)
    setLangToAdd(undefined)
  }

  return (
    <Dialog>
      <DialogTrigger as={
        (props: DialogTriggerProps) => (
          <Button {...props} class="gap-1">
            <Icon><CogIcon /></Icon>
            <span>Settings</span>
          </Button>
        )
      }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>File Settings</DialogTitle>
        </DialogHeader>
        <div class="flex flex-col gap-2">
          <div class="flex justify-between items-center">
            <div class="font-700">Name</div>
            <div class="flex items-center gap-1">
              <div>{currentFile()?.name}</div>
              <div>
                <ToggleButton size="sm">
                  <Icon><EditIcon /></Icon>
                </ToggleButton>
              </div>
            </div>
          </div>
          <Separator />
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <div class="font-700">Languages</div>
              <Popover>
                <PopoverTrigger
                  as={(props: PopoverTriggerProps) => (
                    <Button {...props} class="h-6" size="sm">
                      <Icon><PlusIcon /></Icon>
                      <span>Add</span>
                    </Button>
                  )}
                />
                <PopoverContent class="flex flex-col gap-2">
                  <div class="font-700">Select Language</div>
                  <div class="flex items-center gap-2">
                    <div class="flex-1">
                      <LanguageSelect languages={availableLanguages()} value={langToAdd()} onChange={setLangToAdd} />
                    </div>
                    <Button variant="outline" onClick={handleAddLanguage}>Add</Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div class="flex gap-2 flex-wrap">
              <For each={Object.keys(languages())}>
                {(code) => (
                  <div class="flex rounded b-(1px solid border) p-(x-2 y-1) gap-1 items-center bg-background hover:bg-accent transition-colors">
                    <div>{supportedLanguageMap[code].icon}</div>
                    <div>{code}</div>
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SettingsDialog
