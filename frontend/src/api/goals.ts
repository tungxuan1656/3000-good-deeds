import type {
  ApiResponse,
  GetGoalHistoryRequest,
  GoalDTO,
  GoalHistoryResponse,
  UpsertGoalRequest,
} from '../types/api'
import { client } from './client'
import { API_ENDPOINTS } from './endpoints'

export const getGoals = async (): Promise<ApiResponse<GoalDTO[]>> => {
  const response = await client.get<ApiResponse<GoalDTO[]>>(API_ENDPOINTS.goals.list)

  return response.data
}

export const upsertGoal = async (data: UpsertGoalRequest): Promise<ApiResponse<GoalDTO>> => {
  const response = await client.post<ApiResponse<GoalDTO>>(API_ENDPOINTS.goals.upsert, data)

  return response.data
}

export const getGoalHistory = async (
  goalId: string,
  params?: GetGoalHistoryRequest,
): Promise<ApiResponse<GoalHistoryResponse>> => {
  const response = await client.get<ApiResponse<GoalHistoryResponse>>(
    API_ENDPOINTS.goals.history(goalId),
    { params },
  )

  return response.data
}
