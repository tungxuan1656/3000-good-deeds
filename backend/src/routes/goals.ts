import { Hono } from 'hono'

import { createGoal, getGoals } from '../handlers/goals'
import { authMiddleware } from '../middlewares/auth'
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

export default goals
