import { createEffect, createSignal } from 'solid-js'
import type { Component } from 'solid-js'
import type { LanguageSkillResponse } from '@omnilate/schema'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { TextFieldLabel, TextFieldRoot } from '@/components/ui/textfield'
import LanguageSelect from '@/components/new-node-dialog/language-select'
import type { SupportedLanguageCode } from '@/utils/supported-languages'
import {
  NumberField, NumberFieldGroup, NumberFieldIncrementTrigger,
  NumberFieldLabel, NumberFieldDecrementTrigger, NumberFieldInput
} from '@/components/ui/number-field'
import { TextArea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { iv } from '@/utils/input-value'
import { deleteLanguageSkill, putLanguageSkill } from '@/apis/language-skills'
import type { LanguageSkillResource } from '@/apis/language-skills'

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
            <DialogTitle>Edit Language Skill</DialogTitle>
          </DialogHeader>
          <TextFieldRoot>
            <TextFieldLabel>Language</TextFieldLabel>
            <LanguageSelect value={lang()} onChange={setLang} />
          </TextFieldRoot>
          <NumberField maxValue={100}
            minValue={0}
            rawValue={score()}
            onRawValueChange={setScore}
          >
            <NumberFieldLabel>Score Your Mastery (0 - 100)</NumberFieldLabel>
            <NumberFieldGroup>
              <NumberFieldDecrementTrigger />
              <NumberFieldInput />
              <NumberFieldIncrementTrigger />
            </NumberFieldGroup>
          </NumberField>
          <TextFieldRoot>
            <TextFieldLabel>Additional Description (Optional)</TextFieldLabel>
            <TextArea autoResize
              class="resize-y"
              value={description()}
              onChange={iv(setDescription)}
            />
          </TextFieldRoot>
          <Button type="submit">Submit</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default LanguageSkillEditDialog
