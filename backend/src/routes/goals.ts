import { Hono } from 'hono'

import { getGoalHistoryPage } from '../handlers/goal-history'
import { getGoals, upsertGoal, upsertGoals } from '../handlers/goals'
import { authMiddleware } from '../middlewares/auth'
import type { User } from '../types'
import { ErrorCodes, errorResponse, successResponse } from '../utils'

const goals = new Hono<{ Bindings: Env; Variables: { user: User } }>()

goals.use('/*', authMiddleware)

goals.get('/', async (c) => {
  const currentUser = c.get('user')
  const result = await getGoals(c.env.DB, currentUser)

  return c.json(successResponse(result))
})

goals.post('/', async (c) => {
  const currentUser = c.get('user')
  const body = await c.req.json<
    | { type: string; targetCount: number; isEnabled: boolean }
    | { goals: Array<{ type: string; targetCount: number; isEnabled: boolean }> }
  >()

  const isBatch = 'goals' in body

  if (!isBatch && (!body.type || !body.targetCount || body.isEnabled === undefined)) {
    return c.json(errorResponse(ErrorCodes.BAD_REQUEST, 'Thiếu thông tin bắt buộc'), 400)
  }

  if (isBatch && (!body.goals || body.goals.length === 0)) {
    return c.json(errorResponse(ErrorCodes.BAD_REQUEST, 'Thiếu thông tin bắt buộc'), 400)
  }

  try {
    const result = isBatch
      ? await upsertGoals(c.env.DB, currentUser, body.goals)
      : await upsertGoal(c.env.DB, currentUser, body)

    return c.json(successResponse(result))
  } catch (e) {
    console.error('Upsert goal failed', e)

    return c.json(errorResponse(ErrorCodes.BAD_REQUEST, 'Tạo mục tiêu thất bại'), 400)
  }
})

goals.get('/history', async (c) => {
  const currentUser = c.get('user')
  const limit = Number(c.req.query('limit') || 20)
  const cursor = c.req.query('cursor') ? Number(c.req.query('cursor')) : undefined
  const type = c.req.query('type') as 'weekly' | 'monthly' | 'yearly' | undefined

  try {
    const result = await getGoalHistoryPage(c.env.DB, currentUser.id, limit, cursor, type)

    return c.json(successResponse(result))
  } catch (e) {
    console.error('Get goal history failed', e)

    return c.json(errorResponse(ErrorCodes.INTERNAL_ERROR, 'Không thể lấy lịch sử mục tiêu'), 500)
  }
})

export default goals
