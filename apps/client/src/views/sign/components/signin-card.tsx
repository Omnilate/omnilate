import type { Component } from 'solid-js'
import { createSignal } from 'solid-js'
import { toast } from 'solid-sonner'

import { getAccessToken } from '@/apis/auth'
import { Button } from '@/components/ui/button'
import { TextField, TextFieldLabel, TextFieldRoot } from '@/components/ui/textfield'
import { useAuthModel } from '@/stores/auth'
import { useI18n } from '@/utils/i18n'
import { iv } from '@/utils/input-value'
import { jumpTo } from '@/utils/jump-to'

const SigninCard: Component = () => {
  const [username, setUsername] = createSignal('')
  const [password, setPassword] = createSignal('')
  const { setAuthModel } = useAuthModel()
  const t = useI18n()
  const signInT = t.AUTHDIALOG.SIGNIN

  const handleSignin = async (e: Event): Promise<void> => {
    e.preventDefault()

    if (username() === '') {
      toast.error(t.AUTHDIALOG.SIGNIN.ERRORS.INVALID_EMAIL())
      return
    }

    if (password() === '') {
      toast.error(t.AUTHDIALOG.SIGNIN.ERRORS.INVALID_PASSWORD())
      return
    }

    try {
      const token = await getAccessToken(username(), password())
      setAuthModel({
        accessToken: token
      })

      setUsername('')
      setPassword('')
      jumpTo('/')
    } catch {
      toast.error(t.AUTHDIALOG.SIGNIN.ERRORS.UNKNOWN())
    }
  }

  return (
    <form class="flex flex-1 flex-col gap-4" onSubmit={handleSignin}>
      <TextFieldRoot>
        <TextFieldLabel>{signInT.USERNAME.TITLE()}</TextFieldLabel>
        <TextField placeholder={signInT.USERNAME.PLACEHOLDER()} value={username()} onChange={iv(setUsername)} />
      </TextFieldRoot>
      <TextFieldRoot>
        <TextFieldLabel>{signInT.PASSWORD.TITLE()}</TextFieldLabel>
        <TextField type="password" value={password()} onChange={iv(setPassword)} />
      </TextFieldRoot>
      <Button type="submit">{signInT.BUTTON()}</Button>
      <div class="text-secondary-foreground text-xs">{t.AUTHDIALOG.EULA_HINT()}</div>
    </form>
  )
}

export default SigninCard
