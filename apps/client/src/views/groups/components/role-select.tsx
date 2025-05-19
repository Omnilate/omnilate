import type { GroupRole } from '@omnilate/schema'
import type { Component } from 'solid-js'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useI18n } from '@/utils/i18n'

interface RoleSelectProps {
  initialValue: GroupRole
  onChange: (value: GroupRole) => void
}

const RoleSelect: Component<RoleSelectProps> = (props) => {
  const t = useI18n()
  return (
    <div class="flex">
      <Select<GroupRole>
        defaultValue={props.initialValue}
        options={['OWNER', 'ADMIN', 'MEMBER', 'OBSERVER']}
        itemComponent={(props) => (
          <SelectItem item={props.item}>
            {t.GROUPROLE[props.item.rawValue]()}
          </SelectItem>
        )}
        onChange={(v) => {
          props.onChange(v!)
        }}
      >
        <SelectTrigger>
          <SelectValue<GroupRole>>
            {(state) => t.GROUPROLE[state.selectedOption()]()}
          </SelectValue>
        </SelectTrigger>
        <SelectContent />
      </Select>
    </div>
  )
}

export default RoleSelect
