import type { DropdownMenuTriggerProps } from '@kobalte/core/dropdown-menu'
import type { SelectTriggerProps } from '@kobalte/core/select'
import type { ProjectRecord } from '@omnilate/schema'
import type { ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/solid-table'
import { createSolidTable, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel } from '@tanstack/solid-table'
import type { Component } from 'solid-js'
import { For, Show, createMemo, createSignal, onCleanup, onMount } from 'solid-js'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup,
  DropdownMenuGroupLabel,
  DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TextField, TextFieldRoot } from '@/components/ui/textfield'
import { useProject } from '@/stores/project'

import AddRecordPopover from './add-record-popover'
import type { FlattenedRecord } from './columns'
import { columns } from './columns'

interface EditorProps {
  filePath: string[]
}

export const filteredStatusList = () => ['review-needed', 'approved', 'rejected'].map((e) => ({
  title: e,
  value: e
}))

const Editor: Component<EditorProps> = (props) => {
  const { yProject } = useProject()
  const data = createMemo<FlattenedRecord[]>(() => {
    const records = yProject()?.currentFileDoc()?.fileStore?.records
    const result = Object.entries(records ?? {} satisfies Record<string, ProjectRecord>).map(([key, value]) => ({
      key,
      raw: value
    }))
    console.log(result)
    return result
  })
  const [rowSelection, setRowSelection] = createSignal({})
  const [columnVisibility, setColumnVisibility] = createSignal<VisibilityState>({})
  const [columnFilters, setColumnFilters] = createSignal<ColumnFiltersState>([])
  const [sorting, setSorting] = createSignal<SortingState>([])

  onMount(async () => {
    await yProject()?.workOnFile(props.filePath)
  })

  onCleanup(() => {
    yProject()?.leaveFile()
  })

  const table = createSolidTable({
    get data () {
      return data()
    },
    columns,
    state: {
      get sorting () {
        return sorting()
      },
      get columnVisibility () {
        return columnVisibility()
      },
      get rowSelection () {
        return rowSelection()
      },
      get columnFilters () {
        return columnFilters()
      }
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel()
  })

  return (
    <div class="w-full space-y-2.5">
      {/* top controller bar */}
      <div class="flex items-center justify-between gap-2">
        <TextFieldRoot>
          <TextField
            class="h-8"
            placeholder="Filter keys..."
            type="text"
            // value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
            // onInput={(e) => table.getColumn('title')?.setFilterValue(e.currentTarget.value)}
          />
        </TextFieldRoot>
        <div class="flex items-center gap-2">
          <AddRecordPopover />
          <Select
            multiple
            optionTextValue="title"
            optionValue="value"
            options={filteredStatusList()}
            placement="bottom-end"
            sameWidth={false}
            itemComponent={(props) => (
              <SelectItem class="capitalize" item={props.item}>
                {props.item.rawValue.title}
              </SelectItem>
            )}
            onChange={(e) => {
              table
                .getColumn('status')
                ?.setFilterValue((e.length > 0) ? e.map((v) => v.value) : undefined)
            }}
          >
            <SelectTrigger
              as={(props: SelectTriggerProps) => (
                <Button
                  {...props}
                  aria-label="Filter status"
                  class="relative flex h-8 w-full gap-2 [&>svg]:hidden"
                  variant="outline"
                >
                  <div class="flex items-center">
                    {/* Filter */}
                    <svg
                      class="mr-2 size-4"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="m12 20l-3 1v-8.5L4.52 7.572A2 2 0 0 1 4 6.227V4h16v2.172a2 2 0 0 1-.586 1.414L15 12v1.5m2.001 5.5a2 2 0 1 0 4 0a2 2 0 1 0-4 0m2-3.5V17m0 4v1.5m3.031-5.25l-1.299.75m-3.463 2l-1.3.75m0-3.5l1.3.75m3.463 2l1.3.75"
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                      />
                      <title>Status</title>
                    </svg>
                    Status
                  </div>
                  <SelectValue<
                    ReturnType<typeof filteredStatusList>[0]
                  > class="flex h-full items-center gap-1"
                  >
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
          <DropdownMenu placement="bottom-end">
            <DropdownMenuTrigger
              as={(props: DropdownMenuTriggerProps) => (
                <Button
                  {...props}
                  aria-label="Toggle columns"
                  class="flex h-8"
                  variant="outline"
                >
                  {/* Eye */}
                  <svg
                    class="mr-2 size-4"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                    >
                      <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0-4 0" />
                      <path d="M12 18c-3.6 0-6.6-2-9-6c2.4-4 5.4-6 9-6c3.6 0 6.6 2 9 6m-3.999 7a2 2 0 1 0 4 0a2 2 0 1 0-4 0m2-3.5V17m0 4v1.5m3.031-5.25l-1.299.75m-3.463 2l-1.3.75m0-3.5l1.3.75m3.463 2l1.3.75" />
                    </g>
                    <title>View</title>
                  </svg>
                  View
                </Button>
              )}
            />
            <DropdownMenuContent class="w-40">
              <DropdownMenuGroup>
                <DropdownMenuGroupLabel>Toggle columns</DropdownMenuGroupLabel>
                <DropdownMenuSeparator />
                <For
                  each={table
                    .getAllColumns()
                    .filter(
                      (column) => typeof column.accessorFn !== 'undefined' &&
                        column.getCanHide()
                    )}
                >
                  {(column) => (
                    <DropdownMenuCheckboxItem
                      checked={column.getIsVisible()}
                      class="capitalize"
                      onChange={(value) => { column.toggleVisibility(value) }}
                    >
                      <span class="truncate">{column.id}</span>
                    </DropdownMenuCheckboxItem>
                  )}
                </For>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div class="rounded-md border">
        <Table>
          <TableHeader>
            <For each={table.getHeaderGroups()}>
              {(headerGroup) => (
                <TableRow>
                  <For each={headerGroup.headers}>
                    {(header) => {
                      return (
                        <TableHead>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    }}
                  </For>
                </TableRow>
              )}
            </For>
          </TableHeader>
          <TableBody>
            <Show
              when={table.getRowModel().rows?.length}
              fallback={(
                <TableRow>
                  <TableCell class="h-24 text-center" colSpan={columns.length}>
                    No results.
                  </TableCell>
                </TableRow>
              )}
            >
              <For each={table.getRowModel().rows}>
                {(row) => (
                  <TableRow data-state={row.getIsSelected() && 'selected'}>
                    <For each={row.getVisibleCells()}>
                      {(cell) => (
                        <TableCell>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      )}
                    </For>
                  </TableRow>
                )}
              </For>
            </Show>
          </TableBody>
        </Table>
      </div>
      {/* bottom controller bar */}
      <div class="flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto px-2 py-1 sm:flex-row">
        <div class="flex-1 whitespace-nowrap text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length}
          {' '}
          of
          {' '}
          {table.getFilteredRowModel().rows.length}
          {' '}
          row(s) selected.
        </div>
        <div class="flex flex-col-reverse items-center gap-4 sm:flex-row">
          <div class="flex items-center space-x-2">
            <p class="whitespace-nowrap text-sm font-medium">Rows per page</p>
            <Select
              options={[10, 20, 30, 40, 50]}
              value={table.getState().pagination.pageSize}
              itemComponent={(props) => (
                <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
              )}
              onChange={(value) => { (value != null) && table.setPageSize(value) }}
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
            {table.getState().pagination.pageIndex + 1}
            {' '}
            of
            {' '}
            {table.getPageCount()}
          </div>
          <div class="flex items-center space-x-2">
            <Button
              aria-label="Go to first page"
              class="flex size-8 p-0"
              disabled={!table.getCanPreviousPage()}
              variant="outline"
              onClick={() => { table.setPageIndex(0) }}
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
              disabled={!table.getCanPreviousPage()}
              size="icon"
              variant="outline"
              onClick={() => { table.previousPage() }}
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
              disabled={!table.getCanNextPage()}
              size="icon"
              variant="outline"
              onClick={() => { table.nextPage() }}
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
              disabled={!table.getCanNextPage()}
              size="icon"
              variant="outline"
              onClick={() => { table.setPageIndex(table.getPageCount() - 1) }}
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
    </div>
  )
}

export default Editor
