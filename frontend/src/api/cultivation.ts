import type {
  ApiResponse,
  DailyQuoteDTO,
  RandomActDTO,
} from '../types/api'
import { client } from './client'
import { API_ENDPOINTS } from './endpoints'

export const getRandomQuote = async (): Promise<ApiResponse<DailyQuoteDTO>> => {
  const response = await client.get<ApiResponse<DailyQuoteDTO>>(
    API_ENDPOINTS.cultivation.randomQuote,
  )

  return response.data
}

export const getRandomAct = async (): Promise<ApiResponse<RandomActDTO>> => {
  const response = await client.get<ApiResponse<RandomActDTO>>(API_ENDPOINTS.cultivation.randomAct)

  return response.data
}

export const getRandomActs = async (limit = 10): Promise<ApiResponse<RandomActDTO[]>> => {
  const response = await client.get<ApiResponse<RandomActDTO[]>>(
    API_ENDPOINTS.cultivation.randomActsList,
    {
      params: { limit },
    },
  )

  return response.data
}
