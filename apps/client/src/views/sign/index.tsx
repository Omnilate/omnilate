import { useColorMode } from '@kobalte/core'
import type { PopoverTriggerProps } from '@kobalte/core/popover'
import type { RouteSectionProps } from '@solidjs/router'
import { useNavigate } from '@solidjs/router'
import type { Component } from 'solid-js'
import { createEffect } from 'solid-js'

import { LanguageIcon, MoonIcon } from '@/assets/icons'
import Icon from '@/components/icon'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ToggleButton } from '@/components/ui/toggle'
import { useAuthModel } from '@/stores/auth'
import { setLocale, useI18n } from '@/utils/i18n'

import SigninCard from './components/signin-card'
import SignupCard from './components/signup-card'

interface SignViewProps extends RouteSectionProps {}

const SignView: Component<SignViewProps> = () => {
  const t = useI18n()
  const { colorMode, setColorMode } = useColorMode()
  const { authenticated } = useAuthModel()
  const navigate = useNavigate()

  const handleSetZHCN = (): void => {
    setLocale('zh-CN')
  }

  const handleSetEN = (): void => {
    setLocale('en')
  }

  createEffect(() => {
    if (authenticated()) {
      navigate('/')
    }
  })

  return (
    <div class="size-full flex">
      <div class="flex-1 b-r-(1px solid border) flex items-center justify-center">
        <div>
          <div class="text-8xl font-900">
            <span>Omni</span>
            <span>late</span>
          </div>
          <div class="c-accent-foreground">
            <span>Translate</span>
            {' '}
            <span>Everything</span>
          </div>
        </div>
      </div>
      <div class="h-full w-md flex items-center justify-center relative p-(x-8 y-4)">
        <div class="flex flex-1">
          <Tabs class="flex-1 flex flex-col gap-4" defaultValue="signin">
            <TabsList>
              <TabsTrigger value="signin">{t.AUTHDIALOG.TABS.SIGNIN()}</TabsTrigger>
              <TabsTrigger value="signup">{t.AUTHDIALOG.TABS.SIGNUP()}</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <SigninCard />
            </TabsContent>

            <TabsContent value="signup">
              <SignupCard />
            </TabsContent>
          </Tabs>
        </div>
        <div class="absolute right-4 bottom-4 flex items-center gap-2">

          <Popover placement="top">
            <PopoverTrigger
              as={(props: PopoverTriggerProps) => (
                <Button {...props} size="sm" variant="secondary">
                  <Icon><LanguageIcon /></Icon>
                </Button>
              )}
            />
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
          <ToggleButton
            pressed={colorMode() === 'dark'}
            size="sm"
            onChange={(p) => {
              setColorMode(p ? 'dark' : 'light')
            }}
          >
            <Icon><MoonIcon /></Icon>
          </ToggleButton>
        </div>
      </div>
    </div>
  )
}

export default SignView
