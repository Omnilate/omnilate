import ky from 'ky'
import type { Hooks, KyInstance } from 'ky'

import { useAuthModel } from '@/stores/auth'

const API_ROOT = '/api/v1'

export const makeHttpRequest = (): KyInstance => {
  const { authModel } = useAuthModel()

  const requestHooks: Hooks = {
    beforeRequest: [
      async (req) => {
        if (authModel.accessToken === '') {
          return
        }

        req.headers.set('Authorization', `Bearer ${authModel.accessToken}`)
      }
    ]
  }

  return ky.extend({
    prefixUrl: API_ROOT,
    timeout: 10000,
    hooks: requestHooks
  })
}
