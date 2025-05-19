import type { NotificationResponse, NotificationType } from '@omnilate/schema'

import { convertDatetime } from '@/utils/convert-datetime'
import type { ConvertDatetime } from '@/utils/convert-datetime'

import { makeHttpRequest } from './http-request'

export type NotificationResource<T extends NotificationType = NotificationType> = ConvertDatetime<NotificationResponse<T>, 'createdAt'>

export const getNotifications = async (): Promise<NotificationResource[]> => {
  const httpRequest = makeHttpRequest

  const response = await httpRequest().get('users/me/notifications')
  const data = await response.json<NotificationResponse[]>()

  return data.map((n) => convertDatetime(n, ['createdAt']))
}

export const markNotificationAsRead = async (id: string): Promise<NotificationResource> => {
  const httpRequest = makeHttpRequest

  const response = await httpRequest().patch(`users/me/notifications/${id}/read`)
  const data = await response.json<NotificationResponse>()

  return convertDatetime(data, ['createdAt'])
}
