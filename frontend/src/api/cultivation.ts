import type {
  ApiResponse,
  CreateJournalRequest,
  DailyQuoteDTO,
  GetJournalRequest,
  JournalEntryDTO,
  RandomActDTO,
} from '../types/api'
import { client } from './client'

export const getDailyQuote = async (): Promise<ApiResponse<DailyQuoteDTO>> => {
  const response = await client.get<ApiResponse<DailyQuoteDTO>>('/cultivation/quotes/daily')

  return response.data
}

export const getRandomAct = async (): Promise<ApiResponse<RandomActDTO>> => {
  const response = await client.get<ApiResponse<RandomActDTO>>('/cultivation/acts/random')

  return response.data
}

export const getJournal = async (
  params: GetJournalRequest,
): Promise<ApiResponse<JournalEntryDTO[]>> => {
  const response = await client.get<ApiResponse<JournalEntryDTO[]>>('/journal', { params })

  return response.data
}

export const createJournal = async (data: CreateJournalRequest): Promise<ApiResponse<void>> => {
  const response = await client.post<ApiResponse<void>>('/journal', data)

  return response.data
}
