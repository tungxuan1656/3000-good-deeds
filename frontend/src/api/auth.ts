import type { ApiResponse, AuthResponse, LoginRequest } from '../types/api'
import { client } from './client'

export const loginGoogle = async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
  const response = await client.post<ApiResponse<AuthResponse>>('/auth/google', data)

  return response.data
}
