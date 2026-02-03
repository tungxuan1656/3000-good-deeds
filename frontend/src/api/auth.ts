import type { ApiResponse, AuthResponse, LoginRequest } from '../types/api'
import { client } from './client'
import { API_ENDPOINTS } from './endpoints'

export const loginGoogle = async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
  const response = await client.post<ApiResponse<AuthResponse>>(API_ENDPOINTS.auth.google, data)

  return response.data
}

export const logout = async (refreshToken?: string): Promise<ApiResponse<boolean>> => {
  const response = await client.post<ApiResponse<boolean>>(API_ENDPOINTS.auth.logout, {
    refreshToken,
  })

  return response.data
}
