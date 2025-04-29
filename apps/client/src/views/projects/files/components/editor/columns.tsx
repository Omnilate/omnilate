import type { LanguageRecord } from '@omnilate/schema'
import type { ColumnDef } from '@tanstack/solid-table'

import { Button } from '@/components/ui/button'

import TableColumnHeader from './table-column-header'

export interface FlattenedRecord {
  key: string
  raw: Record<string, LanguageRecord>
}

export const columns: Array<ColumnDef<FlattenedRecord>> = [
  {
    id: 'key',
    accessorKey: 'key',
    header: (props) => (
      <TableColumnHeader column={props.column} title="Key" />
    ),
    cell: (props) => (
      <div>
        {props.getValue()}
      </div>
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'actions',
    header: (props) => (
      <TableColumnHeader column={props.column} title="Actions" />
    ),
    cell: (props) => <Button>Edit</Button>
  }
]
