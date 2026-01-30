import { Hono } from 'hono'

import { createGoal, deleteGoal, getGoals, updateGoal } from '../handlers/goals'
import { authMiddleware } from '../middlewares/auth'
import type { UpdateGoalRequest } from '../types'
import { ErrorCodes, errorResponse, successResponse } from '../utils'

const goals = new Hono<{ Bindings: Env; Variables: { user: any } }>()

goals.use('/*', authMiddleware)

goals.get('/', async (c) => {
  const currentUser = c.get('user')
  const result = await getGoals(c.env.DB, currentUser.id)

  return c.json(successResponse(result))
})

goals.post('/', async (c) => {
  const currentUser = c.get('user')
  const body = await c.req.json<{ type: string; targetCount: number }>()

  if (!body.type || !body.targetCount) {
    return c.json(errorResponse(ErrorCodes.BAD_REQUEST, 'Thiếu thông tin bắt buộc'), 400)
  }

  const result = await createGoal(c.env.DB, currentUser.id, body.type, body.targetCount)

  return c.json(successResponse(result))
})

goals.put('/:id', async (c) => {
  const currentUser = c.get('user')
  const goalId = c.req.param('id')
  const body = await c.req.json<UpdateGoalRequest>()

  try {
    const result = await updateGoal(c.env.DB, currentUser.id, goalId, body)

    return c.json(successResponse(result))
  } catch (e) {
    console.error('Update failed or Goal not found', e)

    return c.json(
      errorResponse(ErrorCodes.BAD_REQUEST, 'Cập nhật thất bại hoặc không tìm thấy mục tiêu'),
      400,
    )
  }
})

goals.delete('/:id', async (c) => {
  const currentUser = c.get('user')
  const goalId = c.req.param('id')

  try {
    const success = await deleteGoal(c.env.DB, currentUser.id, goalId)
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
