import type { Component } from 'solid-js'
import { createSignal } from 'solid-js'
import { toast } from 'solid-sonner'

import { createUser } from '@/apis/user'
import { Button } from '@/components/ui/button'
import { TextField, TextFieldDescription, TextFieldLabel, TextFieldRoot } from '@/components/ui/textfield'
import { useI18n } from '@/utils/i18n'
import { iv } from '@/utils/input-value'

const SignupCard: Component = () => {
  const [username, setUsername] = createSignal('')
  const [email, setEmail] = createSignal('')
  const [password, setPassword] = createSignal('')
  const [passwordRepeat, setPasswordRepeat] = createSignal('')
  const t = useI18n()
  const signupT = t.AUTHDIALOG.SIGNUP

  const handleSignup = async (e: Event): Promise<void> => {
    e.preventDefault()
    if (password() !== passwordRepeat()) {
      toast.error(signupT.ERRORS.PWD_NOT_MATCH())
      return
    }

    if (email() === '') {
      toast.error(signupT.ERRORS.INVALID_EMAIL())
      return
    }

    if (username() === '') {
      toast.error(signupT.ERRORS.INVALID_NAME())
      return
    }

    if (password() === '' || passwordRepeat() === '') {
      toast.error(signupT.ERRORS.INVALID_PASSWORD())
      return
    }

    try {
      await createUser({
        email: email(),
        name: username(),
        password: password()
      })
      toast.success(signupT.SUCCESS())

      setUsername('')
      setEmail('')
      setPassword('')
      setPasswordRepeat('')
    } catch {
      toast.error(signupT.ERRORS.UNKNOWN())
    }
  }

  return (
    <form class="flex flex-1 flex-col gap-4" onSubmit={handleSignup}>
      <TextFieldRoot>
        <TextFieldLabel>{signupT.USERNAME.TITLE()}</TextFieldLabel>
        <TextField placeholder={signupT.USERNAME.PLACEHOLDER()} value={username()} onChange={iv(setUsername)} />
      </TextFieldRoot>

      <TextFieldRoot>
        <TextFieldLabel>{signupT.EMAIL.TITLE()}</TextFieldLabel>
        <TextField type="email" value={email()} onChange={iv(setEmail)} />
        <TextFieldDescription>{signupT.EMAIL.DESC()}</TextFieldDescription>
      </TextFieldRoot>

      <TextFieldRoot>
        <TextFieldLabel>{signupT.PASSWORD.TITLE()}</TextFieldLabel>
        <TextField type="password" value={password()} onChange={iv(setPassword)} />
        <TextFieldDescription>{signupT.PASSWORD.DESC()}</TextFieldDescription>
      </TextFieldRoot>

      <TextFieldRoot>
        <TextFieldLabel>{signupT.PASSWORD_REPEAT.TITLE()}</TextFieldLabel>
        <TextField type="password" value={passwordRepeat()} onChange={iv(setPasswordRepeat)} />
      </TextFieldRoot>
      <Button type="submit">{signupT.BUTTON()}</Button>
      <div class="text-secondary-foreground text-xs">{t.AUTHDIALOG.EULA_HINT()}</div>
    </form>
  )
}

export default SignupCard
