import type { Table } from '@tanstack/solid-table'
import type { JSX } from 'solid-js'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface PaginationBarProps<TData> {
  table: Table<TData>
}

// eslint-disable-next-line @stylistic/comma-dangle
const PaginationBar = <TData,>(props: PaginationBarProps<TData>): JSX.Element => {
  return (
    <div class="flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto px-2 py-1 sm:flex-row mt-2">
      <div class="flex flex-col-reverse items-center gap-4 sm:flex-row">
        <div class="flex items-center space-x-2">
          <p class="whitespace-nowrap text-sm font-medium">Rows per page</p>
          <Select
            options={[10, 20, 30, 40, 50]}
            value={props.table.getState().pagination.pageSize}
            itemComponent={(props) => (
              <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
            )}
            onChange={(value) => { (value != null) && props.table.setPageSize(value) }}
          >
            <SelectTrigger class="h-8 w-[4.5rem]">
              <SelectValue<string>>
                {(state) => state.selectedOption()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent />
          </Select>
        </div>
        <div class="flex items-center justify-center whitespace-nowrap text-sm font-medium">
          Page
          {' '}
          {props.table.getState().pagination.pageIndex + 1}
          {' '}
          of
          {' '}
          {props.table.getPageCount()}
        </div>
        <div class="flex items-center space-x-2">
          <Button
            aria-label="Go to first page"
            class="flex size-8 p-0"
            disabled={!props.table.getCanPreviousPage()}
            variant="outline"
            onClick={() => { props.table.setPageIndex(0) }}
          >
            <svg
              aria-hidden="true"
              class="size-4"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m11 7l-5 5l5 5m6-10l-5 5l5 5"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </Button>
          <Button
            aria-label="Go to previous page"
            class="size-8"
            disabled={!props.table.getCanPreviousPage()}
            size="icon"
            variant="outline"
            onClick={() => { props.table.previousPage() }}
          >
            <svg
              aria-hidden="true"
              class="size-4"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m15 6l-6 6l6 6"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </Button>
          <Button
            aria-label="Go to next page"
            class="size-8"
            disabled={!props.table.getCanNextPage()}
            size="icon"
            variant="outline"
            onClick={() => { props.table.nextPage() }}
          >
            <svg
              aria-hidden="true"
              class="size-4"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m9 6l6 6l-6 6"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </Button>
          <Button
            aria-label="Go to last page"
            class="flex size-8"
            disabled={!props.table.getCanNextPage()}
            size="icon"
            variant="outline"
            onClick={() => { props.table.setPageIndex(props.table.getPageCount() - 1) }}
          >
            <svg
              aria-hidden="true"
              class="size-4"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m7 7l5 5l-5 5m6-10l5 5l-5 5"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PaginationBar
