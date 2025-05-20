import type { Component } from 'solid-js'
import { createEffect, createSignal } from 'solid-js'

import type { LanguageSkillResource } from '@/apis/language-skills'
import { deleteLanguageSkill, putLanguageSkill } from '@/apis/language-skills'
import LanguageSelect from '@/components/new-node-dialog/language-select'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  NumberField,
  NumberFieldDecrementTrigger,
  NumberFieldGroup, NumberFieldIncrementTrigger,
  NumberFieldInput,
  NumberFieldLabel
} from '@/components/ui/number-field'
import { TextArea } from '@/components/ui/textarea'
import { TextFieldLabel, TextFieldRoot } from '@/components/ui/textfield'
import { useI18n } from '@/utils/i18n'
import { iv } from '@/utils/input-value'
import type { SupportedLanguageCode } from '@/utils/supported-languages'

interface LanguageSkillEditDialogProps {
  existing?: LanguageSkillResource
  show: boolean
  onSave: () => void
  onClose: () => void
}

const LanguageSkillEditDialog: Component<LanguageSkillEditDialogProps> = (props) => {
  const [lang, setLang] = createSignal<SupportedLanguageCode>('en')
  const [score, setScore] = createSignal<number>(0)
  const [description, setDescription] = createSignal<string>('')
  const t = useI18n()

  createEffect(() => {
    if (props.existing != null) {
      setLang(props.existing.language)
      setScore(props.existing.mastery * 100)
      setDescription(props.existing.description ?? '')
    } else {
      setLang('en')
      setScore(0)
      setDescription('')
    }
  })

  const handleSubmit = async (event: Event): Promise<void> => {
    event.preventDefault()
    await putLanguageSkill({
      language: lang(),
      mastery: score() / 100,
      description: description() === '' ? undefined : description()
    })

    if (props.existing != null && props.existing.language !== lang()) {
      await deleteLanguageSkill(props.existing.language)
    }

    props.onSave()
    props.onClose()
  }

  return (
    <Dialog open={props.show} onOpenChange={props.onClose}>
      <DialogContent>
        <form class="flex flex-col gap-4" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t.USERVIEW.LANG.EDITOR.TITLE()}</DialogTitle>
          </DialogHeader>
          <TextFieldRoot>
            <TextFieldLabel>{t.USERVIEW.LANG.EDITOR.LANG.TITLE()}</TextFieldLabel>
            <LanguageSelect value={lang()} onChange={setLang} />
          </TextFieldRoot>
          <NumberField maxValue={100}
            minValue={0}
            rawValue={score()}
            onRawValueChange={setScore}
          >
            <NumberFieldLabel>{t.USERVIEW.LANG.EDITOR.SCORE.TITLE()}</NumberFieldLabel>
            <NumberFieldGroup>
              <NumberFieldDecrementTrigger />
              <NumberFieldInput />
              <NumberFieldIncrementTrigger />
            </NumberFieldGroup>
          </NumberField>
          <TextFieldRoot>
            <TextFieldLabel>{t.USERVIEW.LANG.EDITOR.DESC.TITLE()}</TextFieldLabel>
            <TextArea autoResize
              class="resize-y"
              value={description()}
              onChange={iv(setDescription)}
            />
          </TextFieldRoot>
          <Button type="submit">{t.USERVIEW.LANG.EDITOR.SUBMIT()}</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default LanguageSkillEditDialog
