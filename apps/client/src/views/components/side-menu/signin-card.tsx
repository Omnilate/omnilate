import { createSignal } from 'solid-js'
import type { Component } from 'solid-js'

import { useI18n } from '@/utils/i18n'
import { TextField, TextFieldLabel, TextFieldRoot } from '@/components/ui/textfield'
import { Button } from '@/components/ui/button'
import { iv } from '@/utils/input-value'
import { getAccessToken } from '@/apis/auth'
import { useAuthModel } from '@/stores/auth'

interface SigninCardProps {
  onFinish: () => void
}

const SigninCard: Component<SigninCardProps> = (props) => {
  const [username, setUsername] = createSignal('')
  const [password, setPassword] = createSignal('')
  const { setAuthModel } = useAuthModel()
  const t = useI18n()
  const signInT = t('AUTHDIALOG').SIGNIN

  const handleSignin = async (): Promise<void> => {
    const token = await getAccessToken(username(), password())
    setAuthModel({
      accessToken: token
    })

    props.onFinish()
  }

  return (
    <div>
      <TextFieldRoot>
        <TextFieldLabel>{signInT.USERNAME.TITLE}</TextFieldLabel>
        <TextField placeholder={signInT.USERNAME.PLACEHOLDER} value={username()} onChange={iv(setUsername)} />
      </TextFieldRoot>

      <TextFieldRoot>
        <TextFieldLabel>{signInT.PASSWORD.TITLE}</TextFieldLabel>
        <TextField type="password" value={password()} onChange={iv(setPassword)} />
      </TextFieldRoot>

      <div>
        <Button onClick={handleSignin}>{signInT.BUTTON}</Button>
        <div>{t('AUTHDIALOG').EULA_HINT}</div>
      </div>
    </div>
  )
}

export default SigninCard
