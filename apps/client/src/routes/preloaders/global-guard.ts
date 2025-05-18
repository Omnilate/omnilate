import { useNavigate } from '@solidjs/router'
import { toast } from 'solid-sonner'

import { useAuthModel } from '@/stores/auth'
import { useI18n } from '@/utils/i18n'

export function globalGuard (): void {
  const { authenticated } = useAuthModel()
  const navigate = useNavigate()
  const t = useI18n()

  if (!authenticated()) {
    toast.error(t.GLOBAL_TOASTERS.NOT_LOGGED_IN())
    navigate('/sign')
  }
}
