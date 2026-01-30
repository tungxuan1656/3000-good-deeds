import { Hono } from 'hono'

import { getAchievementDefinitions, getUserAchievements } from '../handlers/achievements'
import { authMiddleware } from '../middlewares/auth'
import { successResponse } from '../utils'

const achievements = new Hono<{ Bindings: Env; Variables: { user: any } }>()

achievements.use('/*', authMiddleware)

achievements.get('/', async (c) => {
  const currentUser = c.get('user')
  const result = await getUserAchievements(c.env.DB, currentUser.id)

  return c.json(successResponse(result))
})

achievements.get('/definitions', async (c) => {
  const result = await getAchievementDefinitions(c.env.DB)

  return c.json(successResponse(result))
})

export default achievements
