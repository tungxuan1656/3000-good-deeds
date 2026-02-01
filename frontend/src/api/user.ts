import type { ApiResponse, UserDTO } from '../types/api'
import { client } from './client'

export const getMe = async (): Promise<ApiResponse<UserDTO>> => {
  const response = await client.get<ApiResponse<UserDTO>>('/users/me')

  return response.data
}

export const updateMe = async (data: Partial<UserDTO>): Promise<ApiResponse<UserDTO>> => {
  const response = await client.put<ApiResponse<UserDTO>>('/users/me', data)

  return response.data
}
