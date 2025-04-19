import { toaster } from '@kobalte/core'

import { Toast, ToastContent, ToastTitle } from '@/components/ui/toast'

export const showToaster = (content: string): void => {
  toaster.show((props) => (
    <Toast toastId={props.toastId}>
      <ToastContent>
        <ToastTitle>{content}</ToastTitle>
      </ToastContent>
    </Toast>
  ))
}
