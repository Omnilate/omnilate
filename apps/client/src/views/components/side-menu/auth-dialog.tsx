import type { Component } from 'solid-js'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useI18n } from '@/utils/i18n'

import SigninCard from './signin-card'
import SignupCard from './signup-card'

interface AuthDialogProps {
  show: boolean
  onClose: () => void
}

const AuthDialog: Component<AuthDialogProps> = (props) => {
  const t = useI18n()
  const handleOpenChange = (open: boolean): void => {
    if (!open) {
      props.onClose()
    }
  }

  return (
    <Dialog open={props.show} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.AUTHDIALOG.TITLE()}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="signin">
          <TabsList>
            <TabsTrigger value="signin">{t.AUTHDIALOG.TABS.SIGNIN()}</TabsTrigger>
            <TabsTrigger value="signup">{t.AUTHDIALOG.TABS.SIGNUP()}</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <SigninCard onFinish={props.onClose} />
          </TabsContent>

          <TabsContent value="signup">
            <SignupCard onFinish={props.onClose} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default AuthDialog
