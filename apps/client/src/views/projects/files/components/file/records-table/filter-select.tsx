import type { SelectTriggerProps } from '@kobalte/core/select'
import { Show, For } from 'solid-js'
import type { Component } from 'solid-js'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Icon from '@/components/icon'
import { FunnelIcon } from '@/assets/icons'

interface OptionType { title: string; value: string }

interface FilterSelectProps {
  options: OptionType[]
  onChange: (value: string[]) => void
}

const FilterSelect: Component<FilterSelectProps> = (props) => {
  const handleChange = (value: OptionType[]): void => {
    props.onChange(value.map((item) => item.value))
  }

  return (
    <Select<OptionType>
      multiple
      optionTextValue="title"
      optionValue="value"
      options={props.options}
      placement="bottom-end"
      sameWidth={false}
      itemComponent={(props) => (
        <SelectItem class="capitalize" item={props.item}>
          {props.item.rawValue.title}
        </SelectItem>
      )}
      onChange={handleChange}
    >
      <SelectTrigger
        as={(props: SelectTriggerProps) => (
          <Button
            {...props}
            aria-label="Filter status"
            class="relative flex h-8 w-full gap-2 [&>svg]:hidden"
            variant="outline"
          >
            <div class="flex items-center gap-1">
              <Icon>
                <FunnelIcon />
              </Icon>
              Status
            </div>
            <SelectValue<OptionType> class="flex h-full items-center gap-1">
              {(state) => (
                <Show
                  when={state.selectedOptions().length <= 2}
                  fallback={(
                    <>
                      <Badge class="absolute -top-2 right-0 block size-4 rounded-full p-0 capitalize md:hidden">
                        {state.selectedOptions().length}
                      </Badge>
                      <Badge class="hidden capitalize md:inline-flex py-0 px-1">
                        {state.selectedOptions().length}
                        {' '}
                        selected
                      </Badge>
                    </>
                  )}
                >
                  <For each={state.selectedOptions()}>
                    {(item) => (
                      <>
                        <Badge class="absolute -top-2 right-0 block size-4 rounded-full p-0 capitalize md:hidden">
                          {state.selectedOptions().length}
                        </Badge>
                        <Badge class="hidden capitalize md:inline-flex py-0 px-1">
                          {item.title}
                        </Badge>
                      </>
                    )}
                  </For>
                </Show>
              )}
            </SelectValue>
          </Button>
        )}
      />
      <SelectContent />
    </Select>
  )
}

export default FilterSelect
