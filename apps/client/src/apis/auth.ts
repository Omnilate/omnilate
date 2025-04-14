import ky from 'ky'
import type { AccessTokenResponse } from '@omnilate/schema'

export async function getAccessToken (username: string, password: string): Promise<string> {
  const resp = await ky.post<AccessTokenResponse>('/api/v1/auth/login', {
    json: {
      username,
      password
    }
  })

  if (!resp.ok) {
    throw new Error('Invalid username or password')
  }
  const data = await resp.json()
  return data.access_token
}
