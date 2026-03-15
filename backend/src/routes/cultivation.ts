import { Hono } from 'hono'

import { getRandomAct, getRandomActs, getRandomQuote } from '../handlers/cultivation'
import { authMiddleware } from '../middlewares/auth'
import { ErrorCodes, errorResponse, successResponse } from '../utils'

const app = new Hono<{ Bindings: Env }>()

app.use('/*', authMiddleware)

// GET /api/v1/cultivation/quotes/random
app.get('/quotes/random', async (c) => {
  const quote = await getRandomQuote(c.env.DB)

  // Fallback if no quotes exist yet (though seed should provide them)
  if (!quote) {
    return c.json(errorResponse(ErrorCodes.NOT_FOUND, 'No quotes available'), 404)
  }

  return c.json(successResponse(quote))
})

// GET /api/v1/cultivation/acts/random
app.get('/acts/random', async (c) => {
  const act = await getRandomAct(c.env.DB)

  // Fallback
  if (!act) {
    return c.json(errorResponse(ErrorCodes.NOT_FOUND, 'No random acts available'), 404)
  }

  return c.json(
    successResponse({
      id: act.id,
      name: act.name,
      detail: act.detail,
      note: act.note,
    }),
  )
})

// GET /api/v1/cultivation/acts/random-list
app.get('/acts/random-list', async (c) => {
  const limitParam = c.req.query('limit')
  const parsedLimit = limitParam ? Number(limitParam) : 10
  if (!Number.isInteger(parsedLimit) || parsedLimit < 1) {
    return c.json(errorResponse(ErrorCodes.BAD_REQUEST, 'limit must be a positive integer'), 400)
  }

  const limit = Math.min(parsedLimit, 50)
  const acts = await getRandomActs(c.env.DB, limit)

  if (!acts.length) {
    return c.json(errorResponse(ErrorCodes.NOT_FOUND, 'No random acts available'), 404)
  }

  return c.json(
    successResponse(
      acts.map((act) => ({
        id: act.id,
        name: act.name,
        detail: act.detail,
        note: act.note,
      })),
    ),
  )
})

export default app
