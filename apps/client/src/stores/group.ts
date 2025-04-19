import { createStore } from 'solid-js/store'
import { createSignal } from 'solid-js'
import type { Accessor } from 'solid-js'

import type { GroupBaseResource } from '@/apis/groups'
import { getUserGroups } from '@/apis/user'

import { useUserModel } from './user'

interface GroupModelReturnType {
  groupModel: GroupBaseResource[]
  currentGroup: Accessor<GroupBaseResource | undefined>
  setCurrentGroupId: (id: number) => void
  fetchGroups: () => Promise<void>
}

const [groupModel, setGroupModel] = createStore<GroupBaseResource[]>([])
const [currentGroup, setCurrentGroup] = createSignal<GroupBaseResource>()

export function useGroupModel (): GroupModelReturnType {
  const { userModel } = useUserModel()

  const fetchGroups = async (): Promise<void> => {
    const groups = await getUserGroups(userModel.id)
    setGroupModel(groups)
  }

  const setCurrentGroupId = (id: number): void => {
    const group = groupModel.find((g) => g.id === id)
    if (group != null) {
      setCurrentGroup(group)
    }
  }

  return {
    currentGroup,
    setCurrentGroupId,
    groupModel,
    fetchGroups
  }
}
