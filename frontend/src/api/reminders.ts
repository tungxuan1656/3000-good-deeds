import type { ApiResponse, PushSubscriptionPayloadDTO } from '@/types/api'

import { client } from './client'
import { API_ENDPOINTS } from './endpoints'

export const getVapidPublicKey = async (): Promise<ApiResponse<{ publicKey: string }>> => {
  const response = await client.get<ApiResponse<{ publicKey: string }>>(
    API_ENDPOINTS.reminders.pushKey,
  )

  return response.data
}

export const subscribePush = async (
  payload: PushSubscriptionPayloadDTO,
): Promise<ApiResponse<{ success: boolean }>> => {
  const response = await client.post<ApiResponse<{ success: boolean }>>(
    API_ENDPOINTS.reminders.subscriptions,
    payload,
  )

  return response.data
}

export const unsubscribePush = async (payload: {
  endpoint: string
}): Promise<ApiResponse<{ success: boolean }>> => {
  const response = await client.delete<ApiResponse<{ success: boolean }>>(
    API_ENDPOINTS.reminders.subscriptions,
    { data: payload },
  )

  return response.data
}

export const testPushNotification = async (): Promise<
  ApiResponse<{ sent: number; total: number }>
> => {
  const response = await client.post<ApiResponse<{ sent: number; total: number }>>(
    API_ENDPOINTS.reminders.test,
  )

  return response.data
}
