import type { Table } from '@tanstack/solid-table'
import type { Component } from 'solid-js'

import { TextField, TextFieldRoot } from '@/components/ui/textfield'

import type { FlattenedRecord } from './columns'
import FilterSelect from './filter-select'

interface TableToolbarProps {
  table: Table<FlattenedRecord>
}

const filteredStatusList = () => ['review-needed', 'approved', 'rejected'].map((e) => ({
  title: e,
  value: e
}))

const TableToolbar: Component<TableToolbarProps> = (props) => {
  const handleFilterChange = (values: string[]): void => {
    props.table
      .getColumn('status')
      ?.setFilterValue((values.length > 0) ? values : undefined)
  }

  const handleSearchKey = (e: Event): void => {
    const target = e.target as HTMLInputElement
    const value = target.value

    if (value.length > 0) {
      props.table.getColumn('key')?.setFilterValue(value)
    }
  }

  return (
    <div class="flex items-center justify-between gap-2 mb-4">
      <TextFieldRoot>
        <TextField
          class="h-8"
          placeholder="Filter keys"
          type="text"
          onChange={handleSearchKey}
        />
      </TextFieldRoot>
      <div class="flex items-center gap-2">
        {/* <AddRecordPopover /> */}
        <FilterSelect
          options={filteredStatusList()}
          onChange={handleFilterChange}
        />
      </div>
    </div>
  )
}

export default TableToolbar
