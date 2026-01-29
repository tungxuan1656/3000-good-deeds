import { Hono } from 'hono'

import { getFeed } from '../handlers/posts'
import { authMiddleware } from '../middlewares/auth'
import { successResponse } from '../utils'

const feed = new Hono<{ Bindings: Env; Variables: { user: any } }>()

feed.use('/*', authMiddleware)

feed.get('/', async (c) => {
  const currentUser = c.get('user')
  const limit = parseInt(c.req.query('limit') || '20')
  const cursor = c.req.query('cursor') || undefined
  const feedData = await getFeed(c.env.DB, currentUser.id, limit, cursor)
  return c.json(successResponse(feedData))
})

export default feed
