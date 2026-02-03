import type { ApiResponse, CreateGoalRequest, GoalDTO, StatsSummaryDTO } from '../types/api'
import { client } from './client'
import { API_ENDPOINTS } from './endpoints'

export const getStatsSummary = async (): Promise<ApiResponse<StatsSummaryDTO>> => {
  const response = await client.get<ApiResponse<StatsSummaryDTO>>(API_ENDPOINTS.stats.summary)

  return response.data
}

export const getGoals = async (): Promise<ApiResponse<GoalDTO[]>> => {
  const response = await client.get<ApiResponse<GoalDTO[]>>(API_ENDPOINTS.goals.list)

  return response.data
}

export const createGoal = async (data: CreateGoalRequest): Promise<ApiResponse<GoalDTO>> => {
  const response = await client.post<ApiResponse<GoalDTO>>(API_ENDPOINTS.goals.list, data)

  return response.data
}
