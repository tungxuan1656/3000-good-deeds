import type { ApiResponse, DeedCategoryDTO } from '../types/api'
import { client } from './client'
import { API_ENDPOINTS } from './endpoints'

export const getCategories = async (): Promise<ApiResponse<DeedCategoryDTO[]>> => {
  const response = await client.get<ApiResponse<DeedCategoryDTO[]>>(API_ENDPOINTS.categories.list)

  return response.data
}
