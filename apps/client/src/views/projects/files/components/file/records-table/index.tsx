import type { ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/solid-table'
import { createSolidTable, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel } from '@tanstack/solid-table'
import type { Component } from 'solid-js'
import { createMemo, createSignal, For, Show } from 'solid-js'
import type { ProjectRecord } from '@omnilate/schema'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { FileOnYjs } from '@/y/file-on-yjs'

import { columns } from './columns'
import type { FlattenedRecord } from './columns'
import PaginationBar from './pagination-bar'
import TableToolbar from './table-toolbar'

interface RecordsTableProps {
  file: FileOnYjs
}

const RecordsTable: Component<RecordsTableProps> = (props) => {
  const [rowSelection, setRowSelection] = createSignal({})
  const [columnVisibility, setColumnVisibility] = createSignal<VisibilityState>({})
  const [columnFilters, setColumnFilters] = createSignal<ColumnFiltersState>([])
  const [sorting, setSorting] = createSignal<SortingState>([])

  const data = createMemo<FlattenedRecord[]>(() => {
    const records = props.file.fileStore.records
    const result = Object.entries(records ?? {} satisfies Record<string, ProjectRecord>).map(([key, value]) => ({
      key,
      sourceLanguageValue: records[key].languages?.[props.file.sourceLanguage ?? 'en']?.value ?? '< EMPTY >',
      raw: value
    }))
    return result
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
    <div class="flex flex-col p-4 bg-background rounded-xl shadow">
      <TableToolbar table={table} />
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

      <PaginationBar table={table} />
    </div>
  )
}

export default RecordsTable
