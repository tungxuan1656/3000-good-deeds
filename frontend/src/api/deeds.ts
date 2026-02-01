import type { ApiResponse, CreateDeedRequest, DeedDTO, GetDeedsRequest } from '../types/api'
import { client } from './client'

export const getDeeds = async (params: GetDeedsRequest): Promise<ApiResponse<DeedDTO[]>> => {
  const response = await client.get<ApiResponse<DeedDTO[]>>('/deeds', { params })

  return response.data
}

export const createDeed = async (data: CreateDeedRequest): Promise<ApiResponse<DeedDTO>> => {
  const response = await client.post<ApiResponse<DeedDTO>>('/deeds', data)

  return response.data
}

export const deleteDeed = async (id: string): Promise<ApiResponse<{ deleted: boolean }>> => {
  const response = await client.delete<ApiResponse<{ deleted: boolean }>>(`/deeds/${id}`)

  return response.data
}
