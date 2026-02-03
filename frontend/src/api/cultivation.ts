import type {
  ApiResponse,
  CreateJournalRequest,
  DailyQuoteDTO,
  GetJournalRequest,
  JournalEntryDTO,
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

export const getJournal = async (
  params: GetJournalRequest,
): Promise<ApiResponse<JournalEntryDTO[]>> => {
  const response = await client.get<ApiResponse<JournalEntryDTO[]>>(API_ENDPOINTS.journal.list, {
    params,
  })

  return response.data
}

export const createJournal = async (data: CreateJournalRequest): Promise<ApiResponse<void>> => {
  const response = await client.post<ApiResponse<void>>(API_ENDPOINTS.journal.create, data)

  return response.data
}
