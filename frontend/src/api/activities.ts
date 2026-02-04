import type { ApiResponse, WeeklyRhythmDayDTO } from '../types/api'
import { client } from './client'
import { API_ENDPOINTS } from './endpoints'

export const getWeeklyRhythm = async (
  from?: number,
  to?: number,
): Promise<ApiResponse<WeeklyRhythmDayDTO[]>> => {
  const response = await client.get<ApiResponse<WeeklyRhythmDayDTO[]>>(
    API_ENDPOINTS.activities.weeklyRhythm,
    {
      params: {
        from,
        to,
      },
    },
  )

  return response.data
}
