import type {
  ApiResponse,
  CreateDeedRequest,
  DeedDTO,
  DeedsResponse,
  GetDeedsRequest,
  UpdateDeedRequest,
} from '../types/api'
import { client } from './client'
import { API_ENDPOINTS } from './endpoints'

export const getDeeds = async (params: GetDeedsRequest): Promise<ApiResponse<DeedsResponse>> => {
  const response = await client.get<ApiResponse<DeedsResponse>>(API_ENDPOINTS.deeds.list, {
    params,
  })

  return response.data
}

export const createDeed = async (data: CreateDeedRequest): Promise<ApiResponse<DeedDTO>> => {
  const response = await client.post<ApiResponse<DeedDTO>>(API_ENDPOINTS.deeds.list, data)

  return response.data
}

export const updateDeed = async (
  id: string,
  data: UpdateDeedRequest,
): Promise<ApiResponse<DeedDTO>> => {
  const response = await client.put<ApiResponse<DeedDTO>>(API_ENDPOINTS.deeds.update(id), data)

  return response.data
}

export const deleteDeed = async (id: string): Promise<ApiResponse<{ deleted: boolean }>> => {
  const response = await client.delete<ApiResponse<{ deleted: boolean }>>(
    API_ENDPOINTS.deeds.detail(id),
  )

  return response.data
}
