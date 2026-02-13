import type { ApiResponse, AuthResponse, LoginRequest, SessionResponse } from '../types/api'
import { client } from './client'
import { API_ENDPOINTS } from './endpoints'

export const loginGoogle = async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
  const response = await client.post<ApiResponse<AuthResponse>>(API_ENDPOINTS.auth.google, data)

  return response.data
}

export const restoreSession = async (): Promise<ApiResponse<SessionResponse>> => {
  const response = await client.get<ApiResponse<SessionResponse>>(API_ENDPOINTS.auth.session)

  return response.data
}

export const logout = async (): Promise<ApiResponse<boolean>> => {
  const response = await client.post<ApiResponse<boolean>>(API_ENDPOINTS.auth.logout)

  return response.data
}
