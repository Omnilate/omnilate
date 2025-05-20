import type { Component } from 'solid-js'
import { createEffect, createMemo, createSignal } from 'solid-js'
import { toast } from 'solid-sonner'

import { requestJoinGroup } from '@/apis/groups'
import type { GroupBaseResource } from '@/apis/groups'
import GroupLogo from '@/components/group-logo'
import { Button } from '@/components/ui/button'
import { useGroupModel } from '@/stores/group'
import { useI18n } from '@/utils/i18n'

interface GroupItemProps {
  group: GroupBaseResource
  appliedGroupIds: number[]
  onApplied: (groupId: number) => void
}

const GroupSearchItem: Component<GroupItemProps> = (props) => {
  const t = useI18n()
  const { groupModel } = useGroupModel()

  const joined = createMemo(() => {
    const joinedIds = groupModel.map((group) => group.id)
    return joinedIds.includes(props.group.id)
  })

  const applied = createMemo(() => {
    return props.appliedGroupIds.includes(props.group.id)
  })

  const handleSubmitJoinRequest = async (): Promise<void> => {
    await requestJoinGroup(props.group.id)
    props.onApplied(props.group.id)
    toast.success(t.ADDGROUP.APPLIED_TOAST())
  }

  return (
    <div class="flex justify-between items-center gap-4 w-full not-last-of-type:b-b not-last-of-type:b-b-solid b-border py-2">
      <div class="flex flex-1 gap-4 items-center">
        <GroupLogo group={props.group} />
        <div class="flex flex-col flex-1">
          <div class="text-primary font-500">{props.group.name}</div>
          <div class="text-gray text-xs">{props.group.description}</div>
          <div class="flex w-full justify-between text-xs text-gray mt-1">
            {/* <div>
              {t.ADDGROUP.PROJECT_COUNT({ count: props.projectCount })}
            </div> */}
            <div>
              {t.ADDGROUP.MEMBER_COUNT({ count: props.group.userCount })}
            </div>
          </div>
        </div>
      </div>

      <Button disabled={joined() || applied()}
        onClick={handleSubmitJoinRequest}
      >
        {t.ADDGROUP.JOIN_BUTTON()}
      </Button>
    </div>
  )
}

export default GroupSearchItem
