import type { Column } from '@tanstack/solid-table'
import { Match, Show, splitProps, Switch } from 'solid-js'
import type { JSX, VoidProps } from 'solid-js'
import type { DropdownMenuTriggerProps } from '@kobalte/core/dropdown-menu'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

const TableColumnHeader = <TData, TValue>(
  props: VoidProps<{ column: Column<TData, TValue>; title: string }>
): JSX.Element => {
  const [local] = splitProps(props, ['column', 'title'])

  return (
    <Show
      fallback={<span class="text-sm font-medium">{local.title}</span>}
      when={local.column.getCanSort() && local.column.getCanHide()}
    >
      <div class="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger
            as={(props: DropdownMenuTriggerProps) => (
              <Button
                class="-ml-4 h-8 data-[expanded]:bg-accent"
                variant="ghost"
                aria-label={
                  local.column.getIsSorted() === 'desc'
                    ? 'Sorted descending. Click to sort ascending.'
                    : local.column.getIsSorted() === 'asc'
                      ? 'Sorted ascending. Click to sort descending.'
                      : 'Not sorted. Click to sort ascending.'
                }
                {...props}
              >
                <span>{local.title}</span>
                <div class="ml-1">
                  <Switch
                    fallback={(
                      <svg
                        aria-hidden="true"
                        class="size-3.5"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="m8 9l4-4l4 4m0 6l-4 4l-4-4"
                          fill="none"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                        />
                      </svg>
                    )}
                  >
                    <Match when={local.column.getIsSorted() === 'asc'}>
                      <svg
                        aria-hidden="true"
                        class="size-3.5"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 5v14m4-10l-4-4M8 9l4-4"
                          fill="none"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                        />
                      </svg>
                    </Match>
                    <Match when={local.column.getIsSorted() === 'desc'}>
                      <svg
                        aria-hidden="true"
                        class="size-3.5"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 5v14m4-4l-4 4m-4-4l4 4"
                          fill="none"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                        />
                      </svg>
                    </Match>
                  </Switch>
                </div>
              </Button>
            )}
          />
          <DropdownMenuContent>
            <Show when={local.column.getCanSort()}>
              <DropdownMenuItem
                aria-label="Sort ascending"
                onClick={() => { local.column.toggleSorting(false, true) }}
              >
                <svg
                  aria-hidden="true"
                  class="mr-2 size-4 text-muted-foreground/70"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 5v14m4-10l-4-4M8 9l4-4"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                </svg>
                Asc
              </DropdownMenuItem>
              <DropdownMenuItem
                aria-label="Sort descending"
                onClick={() => { local.column.toggleSorting(true, true) }}
              >
                <svg
                  aria-hidden="true"
                  class="mr-2 size-4 text-muted-foreground/70"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 5v14m4-4l-4 4m-4-4l4 4"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                </svg>
                Desc
              </DropdownMenuItem>
            </Show>

            <Show when={local.column.getCanSort() && local.column.getCanHide()}>
              <DropdownMenuSeparator />
            </Show>

            <Show when={local.column.getCanHide()}>
              <DropdownMenuItem
                aria-label="Hide column"
                onClick={() => { local.column.toggleVisibility(false) }}
              >
                <svg
                  aria-hidden="true"
                  class="mr-2 size-4 text-muted-foreground/70"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 9c-2.4 2.667-5.4 4-9 4c-3.6 0-6.6-1.333-9-4m0 6l2.5-3.8M21 14.976L18.508 11.2M9 17l.5-4m5.5 4l-.5-4"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                </svg>
                Hide
              </DropdownMenuItem>
            </Show>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Show>
  )
}

export default TableColumnHeader
