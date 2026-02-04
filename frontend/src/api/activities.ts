import type { ApiResponse, CalendarDayDTO } from '../types/api'
import { client } from './client'
import { API_ENDPOINTS } from './endpoints'

export const getCalendar = async (
  from?: string,
  to?: string,
): Promise<ApiResponse<CalendarDayDTO[]>> => {
  const response = await client.get<ApiResponse<CalendarDayDTO[]>>(
    API_ENDPOINTS.activities.calendar,
    { params: { from, to } },
  )

  return response.data
}
