import type {
  ApiResponse,
  CreateJournalRequest,
  GetJournalEntriesRequest,
  JournalEntriesResponse,
  JournalEntryDTO,
} from '../types/api'
import { client } from './client'
import { API_ENDPOINTS } from './endpoints'

export const getJournalEntriesPaged = async (
  params: GetJournalEntriesRequest,
): Promise<ApiResponse<JournalEntriesResponse>> => {
  const response = await client.get<ApiResponse<JournalEntriesResponse>>(
    API_ENDPOINTS.journal.entries,
    {
      params,
    },
  )

  return response.data
}

export const getJournalEntryDetail = async (id: string): Promise<ApiResponse<JournalEntryDTO>> => {
  const response = await client.get<ApiResponse<JournalEntryDTO>>(
    API_ENDPOINTS.journal.entryDetail(id),
  )

  return response.data
}

export const createJournalEntry = async (
  data: CreateJournalRequest,
): Promise<ApiResponse<JournalEntryDTO>> => {
  const response = await client.post<ApiResponse<JournalEntryDTO>>(
    API_ENDPOINTS.journal.entries,
    data,
  )

  return response.data
}

export const deleteJournalEntry = async (
  id: string,
): Promise<ApiResponse<{ deleted: boolean }>> => {
  const response = await client.delete<ApiResponse<{ deleted: boolean }>>(
    API_ENDPOINTS.journal.entryDetail(id),
  )

  return response.data
}
