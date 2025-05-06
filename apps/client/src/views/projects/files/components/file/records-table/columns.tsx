import type { ProjectRecord } from '@omnilate/schema'
import type { ColumnDef } from '@tanstack/solid-table'

import { Button } from '@/components/ui/button'

import TableColumnHeader from './table-column-header'

export interface FlattenedRecord {
  key: string
  sourceLanguageValue: string
  raw: ProjectRecord
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
        {props.getValue() as string}
      </div>
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'srcLang',
    accessorKey: 'sourceLanguageValue',
    header: (props) => (
      <TableColumnHeader column={props.column} title="Source" />
    )
  },
  {
    id: 'targetLang',
    header: (props) => (
      <TableColumnHeader column={props.column} title="Target" />
    )
  },
  {
    id: 'actions',
    header: (props) => (
      <TableColumnHeader column={props.column} title="Actions" />
    ),
    cell: (props) => <Button>Edit</Button>
  }
]
