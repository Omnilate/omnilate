import type { Component } from 'solid-js'
import { createMemo } from 'solid-js'

import type { GroupBaseResource } from '@/apis/groups'
import GroupLogo from '@/components/group-logo'
import { Button } from '@/components/ui/button'
import { useGroupModel } from '@/stores/group'
import { useI18n } from '@/utils/i18n'
import { showToaster } from '@/utils/toaster'

type GroupItemProps = GroupBaseResource

const GroupSearchItem: Component<GroupItemProps> = (props) => {
  const t = useI18n()
  const { groupModel } = useGroupModel()

  const joinedGroupsIds = createMemo(() => {
    return groupModel.map((group) => group.id)
  })

  const handleSubmitJoinRequest = async (): Promise<void> => {
    showToaster('Join request submitted')
  }

  return (
    <div class="flex justify-between items-center gap-4 w-full not-last-of-type:b-b not-last-of-type:b-b-solid b-border py-2">
      <div class="flex flex-1 gap-4 items-center">
        <GroupLogo group={props} />
        <div class="flex flex-col flex-1">
          <div class="text-primary font-500">{props.name}</div>
          <div class="text-gray text-xs">{props.description}</div>
          <div class="flex w-full justify-between text-xs text-gray mt-1">
            <div>
              {t.ADDGROUP.PROJECT_COUNT({ count: props.projectCount })}
            </div>
            <div>
              {t.ADDGROUP.MEMBER_COUNT({ count: props.userCount })}
            </div>
          </div>
        </div>
      </div>

      <Button disabled={joinedGroupsIds().includes(props.id)} onClick={handleSubmitJoinRequest}>{t.ADDGROUP.JOIN_BUTTON()}</Button>
    </div>
  )
}

export default GroupSearchItem
