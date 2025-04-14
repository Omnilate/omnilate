import type { Setter } from 'solid-js'

export function iv (setter: Setter<string>) {
  return (e: Event) => {
    const target = e.target as HTMLInputElement
    setter(target.value)
  }
}
