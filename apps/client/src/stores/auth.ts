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
  clearAuthModel: () => void
}

export function useAuthModel (): UseAuthModelReturnType {
  const authenticated = (): boolean => !(authModel.accessToken.length === 0)

  const clearAuthModel = (): void => {
    setAuthModel({
      accessToken: ''
    })
  }

  return {
    authModel,
    setAuthModel,
    authenticated,
    clearAuthModel
  }
}

interface AuthModel {
  accessToken: string
}
