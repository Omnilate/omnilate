import { createStore } from 'solid-js/store'
import type { SetStoreFunction } from 'solid-js/store'

import type { UserBaseResource } from '@/apis/user'

const [userModel, setUserModel] = createStore<UserBaseResource>(
  {
    id: 0,
    avatarUrl: '',
    name: '',
    description: '',
    createdAt: new Date(),
    updatedAt: new Date()
  }
)

interface UserModelReturnType {
  userModel: UserBaseResource
  setUserModel: SetStoreFunction<UserBaseResource>
}

export const useUserModel = (): UserModelReturnType => {
  return {
    userModel,
    setUserModel
  }
}
