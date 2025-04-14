import { makePersisted } from '@solid-primitives/storage'
import type { Accessor } from 'solid-js'
import type { SetStoreFunction } from 'solid-js/store'
import { createStore } from 'solid-js/store'

const [authModel, setAuthModel] = makePersisted(
  // eslint-disable-next-line solid/reactivity
  createStore<AuthModel>({
    accessToken: ''
  })
)

interface UseAuthModelReturnType {
  authModel: AuthModel
  setAuthModel: SetStoreFunction<AuthModel>
  authenticated: Accessor<boolean>
}

export function useAuthModel (): UseAuthModelReturnType {
  const authenticated = (): boolean => !(authModel.accessToken.length === 0)

  return {
    authModel,
    setAuthModel,
    authenticated
  }
}

interface AuthModel {
  accessToken: string
}
