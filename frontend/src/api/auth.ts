import axios from 'axios'

import type { ApiResponse, AuthResponse, LoginRequest } from '../types/api'
import { API_URL, client } from './client'
import { API_ENDPOINTS } from './endpoints'

export const loginGoogle = async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
  const response = await axios.post<ApiResponse<AuthResponse>>(
    `${API_URL}${API_ENDPOINTS.auth.google}`,
    data,
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )

  return response.data
}

export const restoreSession = async (): Promise<ApiResponse<AuthResponse>> => {
  const response = await client.get<ApiResponse<AuthResponse>>(API_ENDPOINTS.auth.session)

  return response.data
}

export const logout = async (): Promise<ApiResponse<boolean>> => {
  const response = await client.post<ApiResponse<boolean>>(API_ENDPOINTS.auth.logout)

  return response.data
}
