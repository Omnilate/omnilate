import type { Component } from 'solid-js'
import { createMemo } from 'solid-js'

import type { SupportedLanguageCode } from '@/components/new-node-dialog/language-select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface LanguageStateCountsProps {
  language: SupportedLanguageCode
  wip: number
  reviewNeeded: number
  reviewed: number
  approved: number
  rejected: number
  class?: string
}

const LanguageStateCounts: Component<LanguageStateCountsProps> = (props) => {
  const total = createMemo(() => {
    return props.wip + props.reviewNeeded + props.reviewed + props.approved + props.rejected
  })

  return (
    <table class={props.class}>
      <tbody>
        <tr>
          <td class="whitespace-nowrap px-1"><Badge class="w-full flex justify-center">Work in Progress</Badge></td>
          <td class="whitespace-nowrap px-1">{props.wip}</td>
          <td class="whitespace-nowrap px-1 w-full"><Progress value={props.wip / total() * 100} /></td>
          <td>{`${(props.wip / total() * 100).toFixed(1)}%`}</td>
        </tr>
        <tr>
          <td class="whitespace-nowrap px-1"><Badge class="w-full flex justify-center">Review Needed</Badge></td>
          <td class="whitespace-nowrap px-1">{props.reviewNeeded}</td>
          <td class="whitespace-nowrap px-1 w-full"><Progress value={props.reviewNeeded / total() * 100} /></td>
          <td>{`${(props.reviewNeeded / total() * 100).toFixed(1)}%`}</td>
        </tr>
        <tr>
          <td class="whitespace-nowrap px-1"><Badge class="w-full flex justify-center">Reviewed</Badge></td>
          <td class="whitespace-nowrap px-1">{props.reviewed}</td>
          <td class="whitespace-nowrap px-1 w-full"><Progress value={props.reviewed / total() * 100} /></td>
          <td>{`${(props.reviewed / total() * 100).toFixed(1)}%`}</td>
        </tr>
        <tr>
          <td class="whitespace-nowrap px-1"><Badge class="w-full flex justify-center">Approved</Badge></td>
          <td class="whitespace-nowrap px-1">{props.approved}</td>
          <td class="whitespace-nowrap px-1 w-full"><Progress value={props.approved / total() * 100} /></td>
          <td>{`${(props.approved / total() * 100).toFixed(1)}%`}</td>
        </tr>
        <tr>
          <td class="whitespace-nowrap px-1"><Badge class="w-full flex justify-center">Rejected</Badge></td>
          <td class="whitespace-nowrap px-1">{props.rejected}</td>
          <td class="whitespace-nowrap px-1 w-full"><Progress value={props.rejected / total() * 100} /></td>
          <td>{`${(props.rejected / total() * 100).toFixed(1)}%`}</td>
        </tr>
      </tbody>
    </table>
  )
}

export default LanguageStateCounts
