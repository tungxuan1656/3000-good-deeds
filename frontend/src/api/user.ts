import type { ApiResponse, UserDTO } from '../types/api'
import { client } from './client'
import { API_ENDPOINTS } from './endpoints'

export const getMe = async (): Promise<ApiResponse<UserDTO>> => {
  const response = await client.get<ApiResponse<UserDTO>>(API_ENDPOINTS.users.me)

  return response.data
}

export const updateMe = async (data: Partial<UserDTO>): Promise<ApiResponse<UserDTO>> => {
  const response = await client.patch<ApiResponse<UserDTO>>(API_ENDPOINTS.users.me, data)

  return response.data
}
