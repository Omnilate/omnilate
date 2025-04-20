import { createSignal } from 'solid-js'

export const [selectedPath, setSelectedPath] = createSignal<string[]>([])
