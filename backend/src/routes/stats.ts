import { Hono } from 'hono'

import { getStatsSummary } from '../handlers/stats'
import { authMiddleware } from '../middlewares/auth'
import { successResponse } from '../utils'

const stats = new Hono<{ Bindings: Env; Variables: { user: any } }>()

stats.use('/*', authMiddleware)

stats.get('/summary', async (c) => {
  const currentUser = c.get('user')
  const result = await getStatsSummary(c.env.DB, currentUser.id)

  return c.json(successResponse(result))
})

export default stats
