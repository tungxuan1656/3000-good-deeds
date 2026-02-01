import type { ApiResponse, CreateGoalRequest, GoalDTO, StatsSummaryDTO } from '../types/api'
import { client } from './client'

export const getStatsSummary = async (): Promise<ApiResponse<StatsSummaryDTO>> => {
  const response = await client.get<ApiResponse<StatsSummaryDTO>>('/stats/summary')

  return response.data
}

export const getGoals = async (): Promise<ApiResponse<GoalDTO[]>> => {
  const response = await client.get<ApiResponse<GoalDTO[]>>('/goals')

  return response.data
}

export const createGoal = async (data: CreateGoalRequest): Promise<ApiResponse<GoalDTO>> => {
  const response = await client.post<ApiResponse<GoalDTO>>('/goals', data)

  return response.data
}
