import { createResource, createSignal, For, Show } from 'solid-js'
import type { Component } from 'solid-js'

import { Separator } from '@/components/ui/separator'
import Icon from '@/components/icon'
import { EditIcon, PlusIcon } from '@/assets/icons'
import { Button } from '@/components/ui/button'
import { getLanguageSkills } from '@/apis/language-skills'
import type { LanguageSkillResource } from '@/apis/language-skills'
import { supportedLanguageMap } from '@/utils/supported-languages'
import { useI18n } from '@/utils/i18n'

import LanguageSkillEditDialog from './language-skill-edit-dialog'

interface LanguageMasteryProps {
  userId: number
  allowEdit: boolean
}

const LanguageMastery: Component<LanguageMasteryProps> = (props) => {
  const [editDialogShown, setEditDialogShown] = createSignal(false)
  const [editingSkill, setEditingSkill] = createSignal<LanguageSkillResource>()
  const [skills, { refetch: refetchSkills }] = createResource(
    () => props.userId,
    getLanguageSkills
  )
  const t = useI18n()

  const handleEditDialogClose = (): void => {
    setEditingSkill(undefined)
    setEditDialogShown(false)
  }

  const handleNewSkillClick = (): void => {
    setEditingSkill(undefined)
    setEditDialogShown(true)
  }

  return (
    <div class="flex flex-col gap-4">
      <LanguageSkillEditDialog
        existing={editingSkill()}
        show={editDialogShown()}
        onClose={handleEditDialogClose}
        onSave={refetchSkills}
      />
      <div class="flex">
        <span class="text-2xl font-900">{t.USERVIEW.LANG.TITLE()}</span>
        <Show when={props.allowEdit}>
          <Button class="size-6"
            size="icon"
            variant="ghost"
            onClick={handleNewSkillClick}
          >
            <Icon><PlusIcon /></Icon>
          </Button>
        </Show>
      </div>
      <Separator />
      <div class="flex gap-4 flex-wrap">
        <Show when={skills() != null || (skills() ?? []).length > 0}
          fallback={(
            <div class="flex flex-1 items-center justify-center w-full h-32 text-slate">
              {t.USERVIEW.LANG.EMPTY()}
            </div>
          )}
        >
          <For each={skills() ?? []}>
            {(skill) => (
              <div class="flex flex-col gap-2 p-4 rounded-xl b-(2px solid border) transition-shadow w-[250px]">
                <div class="flex items-center justify-between">
                  <div class="flex items-start">
                    <div class="text-xl font-700">{supportedLanguageMap[skill.language]?.nativeName ?? 'Error Lang'}</div>
                    <div class="text-xs text-slate">
                      {(skill.mastery * 100).toFixed(0)}
                      {' '}
                      / 100
                    </div>
                  </div>
                  <div>
                    <Show when={props.allowEdit}>
                      <Button class="size-6 text-slate"
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setEditingSkill(skill)
                          setEditDialogShown(true)
                        }}
                      >
                        <Icon><EditIcon /></Icon>
                      </Button>
                    </Show>
                  </div>
                </div>
                <div class="text-xs">{skill.description ?? 'No description'}</div>
              </div>
            )}
          </For>
        </Show>
      </div>
    </div>
  )
}

export default LanguageMastery
