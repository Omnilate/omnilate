import { A } from '@solidjs/router'
import { Show } from 'solid-js'
import type { Component } from 'solid-js'
import { useColorMode } from '@kobalte/core'

import { BellIcon, CogIcon, HomeIcon, LanguageIcon, MoonIcon, SunIcon } from '@/assets/icons'
import Icon from '@/components/icon'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { setLocale } from '@/utils/i18n'

const Controls: Component = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const handleSetZHCN = (): void => {
    setLocale('zh-CN')
  }

  const handleSetEN = (): void => {
    setLocale('en')
  }

  return (
    <div class="flex items-center justify-around h-8 b-t-(1px solid border)">
      <A class="color-gray! hover:color-primary! transition-color h-4" href="/">
        <Icon>
          <HomeIcon />
        </Icon>
      </A>
      <Icon class="color-gray! hover:color-primary! transition-color">
        <BellIcon />
      </Icon>
      <Icon class="color-gray! hover:color-primary! transition-color"
        onClick={toggleColorMode}
      >
        <Show fallback={<MoonIcon />} when={colorMode() === 'light'}>
          <SunIcon />
        </Show>
      </Icon>
      <Popover placement="top">
        <PopoverTrigger class="size-4 bg-transparent">
          <Icon class="color-gray! hover:color-primary! transition-color">
            <LanguageIcon />
          </Icon>
        </PopoverTrigger>
        <PopoverContent>
          <div class="flex items-center gap-2 p-2 cursor-pointer bg-background hover:bg-accent rounded-xl mt-5" onClick={handleSetZHCN}>
            <div>🇨🇳</div>
            <div>
              <div class="font-500">简体中文</div>
              <div class="text-xs">Chinese(simplified)</div>
            </div>
          </div>
          <div class="flex items-center gap-2 p-2 cursor-pointer bg-background hover:bg-accent rounded-xl" onClick={handleSetEN}>
            <div>🇺🇸</div>
            <div>
              <div class="font-500">English</div>
              <div class="text-xs">English</div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default Controls
