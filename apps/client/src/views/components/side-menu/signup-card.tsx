import type { Component } from 'solid-js'
import { createSignal } from 'solid-js'

import { createUser } from '@/apis/user'
import { Button } from '@/components/ui/button'
import { TextField, TextFieldDescription, TextFieldLabel, TextFieldRoot } from '@/components/ui/textfield'
import { useI18n } from '@/utils/i18n'
import { iv } from '@/utils/input-value'

interface SignupCardProps {
  onFinish: () => void
}

const SignupCard: Component<SignupCardProps> = (props) => {
  const [username, setUsername] = createSignal('')
  const [email, setEmail] = createSignal('')
  const [password, setPassword] = createSignal('')
  const [passwordRepeat, setPasswordRepeat] = createSignal('')
  const t = useI18n()
  const signupT = t('AUTHDIALOG').SIGNUP

  const handlesignup = async (): Promise<void> => {
    await createUser({
      email: email(),
      name: username(),
      password: password()
    })

    props.onFinish()
  }

  return (
    <div>
      <TextFieldRoot>
        <TextFieldLabel>{signupT.USERNAME.TITLE}</TextFieldLabel>
        <TextField placeholder={signupT.USERNAME.PLACEHOLDER} value={username()} onChange={iv(setUsername)} />
      </TextFieldRoot>

      <TextFieldRoot>
        <TextFieldLabel>{signupT.EMAIL.TITLE}</TextFieldLabel>
        <TextField type="email" value={email()} onChange={iv(setEmail)} />
        <TextFieldDescription>{signupT.EMAIL.DESC}</TextFieldDescription>
      </TextFieldRoot>

      <TextFieldRoot>
        <TextFieldLabel>{signupT.PASSWORD.TITLE}</TextFieldLabel>
        <TextField type="password" value={password()} onChange={iv(setPassword)} />
        <TextFieldDescription>{signupT.PASSWORD.DESC}</TextFieldDescription>
      </TextFieldRoot>

      <TextFieldRoot>
        <TextFieldLabel>{signupT.PASSWORD_REPEAT.TITLE}</TextFieldLabel>
        <TextField type="password" value={passwordRepeat()} onChange={iv(setPasswordRepeat)} />
      </TextFieldRoot>
      <div>
        <Button onClick={handlesignup}>{signupT.BUTTON}</Button>
        <div>{t('AUTHDIALOG').EULA_HINT}</div>
      </div>
    </div>
  )
}

export default SignupCard
