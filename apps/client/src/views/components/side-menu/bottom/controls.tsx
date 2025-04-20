import type { Component } from 'solid-js'

import { BellIcon, CogIcon, LanguageIcon } from '@/assets/icons'
import Icon from '@/components/icon'
import { PopoverTrigger, PopoverContent, Popover } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { setLocale } from '@/utils/i18n'

interface ControlsProps {
  // foo: string
}

const Controls: Component<ControlsProps> = (props) => {
  const handleSetZHCN = (): void => {
    setLocale('zh-CN')
  }

  const handleSetEN = (): void => {
    setLocale('en')
  }

  return (
    <div class="flex items-center justify-around h-8 b-t-(1px solid border)">
      <Icon class="color-gray! hover:color-primary! transition-color">
        <BellIcon />
      </Icon>
      <Icon class="color-gray! hover:color-primary! transition-color">
        <CogIcon />
      </Icon>
      <Popover placement="top">
        <PopoverTrigger class="size-4 bg-transparent">
          <Icon class="color-gray! hover:color-primary! transition-color">
            <LanguageIcon />
          </Icon>
        </PopoverTrigger>
        <PopoverContent>
          <Button onClick={handleSetZHCN}>简体中文</Button>
          <Button onClick={handleSetEN}>English</Button>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default Controls
