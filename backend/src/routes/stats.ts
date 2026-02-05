import { Hono } from 'hono'

import { getStatsSummary } from '../handlers/stats'
import { authMiddleware } from '../middlewares/auth'
import { type User } from '../types'
import { successResponse } from '../utils'

const stats = new Hono<{ Bindings: Env; Variables: { user: User } }>()

stats.use('/*', authMiddleware)

stats.get('/summary', async (c) => {
  const currentUser = c.get('user')
  const result = await getStatsSummary(c.env.DB, currentUser)

  return c.json(successResponse(result))
})

export default stats
