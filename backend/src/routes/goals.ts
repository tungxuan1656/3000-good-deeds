import { Hono } from 'hono'

import { getGoalHistoryPage } from '../handlers/goal-history'
import { createGoal, deleteGoal, getGoals, updateGoal } from '../handlers/goals'
import { authMiddleware } from '../middlewares/auth'
import type { UpdateGoalRequest, User } from '../types'
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
  const body = await c.req.json<{ type: string; targetCount: number }>()

  if (!body.type || !body.targetCount) {
    return c.json(errorResponse(ErrorCodes.BAD_REQUEST, 'Thiếu thông tin bắt buộc'), 400)
  }

  try {
    const result = await createGoal(c.env.DB, currentUser, body.type, body.targetCount)

    return c.json(successResponse(result))
  } catch (e) {
    console.error('Create goal failed', e)

    return c.json(errorResponse(ErrorCodes.BAD_REQUEST, 'Tạo mục tiêu thất bại'), 400)
  }
})

goals.patch('/:id', async (c) => {
  const currentUser = c.get('user')
  const goalId = c.req.param('id')
  const body = await c.req.json<UpdateGoalRequest>()

  try {
    const result = await updateGoal(c.env.DB, currentUser, goalId, body)

    return c.json(successResponse(result))
  } catch (e) {
    console.error('Update failed or Goal not found', e)

    return c.json(
      errorResponse(ErrorCodes.BAD_REQUEST, 'Cập nhật thất bại hoặc không tìm thấy mục tiêu'),
      400,
    )
  }
})

goals.put('/:id', async (c) => {
  const currentUser = c.get('user')
  const goalId = c.req.param('id')
  const body = await c.req.json<UpdateGoalRequest>()

  try {
    const result = await updateGoal(c.env.DB, currentUser, goalId, body)

    return c.json(successResponse(result))
  } catch (e) {
    console.error('Update failed or Goal not found', e)

    return c.json(
      errorResponse(ErrorCodes.BAD_REQUEST, 'Cập nhật thất bại hoặc không tìm thấy mục tiêu'),
      400,
    )
  }
})

goals.get('/:id/history', async (c) => {
  const currentUser = c.get('user')
  const goalId = c.req.param('id')
  const limit = Number(c.req.query('limit') || 20)
  const cursor = c.req.query('cursor') ? Number(c.req.query('cursor')) : undefined

  try {
    const result = await getGoalHistoryPage(c.env.DB, currentUser.id, goalId, limit, cursor)

    return c.json(successResponse(result))
  } catch (e) {
    console.error('Get goal history failed', e)

    return c.json(errorResponse(ErrorCodes.INTERNAL_ERROR, 'Không thể lấy lịch sử mục tiêu'), 500)
  }
})

goals.delete('/:id', async (c) => {
  const currentUser = c.get('user')
  const goalId = c.req.param('id')

  try {
    const success = await deleteGoal(c.env.DB, currentUser, goalId)
    if (!success) {
      return c.json(errorResponse(ErrorCodes.NOT_FOUND, 'Không tìm thấy mục tiêu'), 404)
    }

    return c.json(successResponse({ success: true }))
  } catch (e) {
    console.error('Delete failed', e)

    return c.json(errorResponse(ErrorCodes.INTERNAL_ERROR, 'Xoá thất bại'), 500)
  }
})

export default goals
