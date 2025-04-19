import { createSignal } from 'solid-js'

import type { YDocI18NextBinding } from '@/y/i18next-binding'

export const [activeYDoc, setActiveYDoc] = createSignal<YDocI18NextBinding>()
