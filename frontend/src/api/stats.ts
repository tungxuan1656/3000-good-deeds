import type { ApiResponse, StatsSummaryDTO } from '../types/api'
import { client } from './client'
import { API_ENDPOINTS } from './endpoints'

export const getStatsSummary = async (): Promise<
  ApiResponse<StatsSummaryDTO>
> => {
  const response = await client.get<ApiResponse<StatsSummaryDTO>>(
    API_ENDPOINTS.stats.summary,
  )

  return response.data
}
