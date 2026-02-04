import { Hono } from 'hono'

import { getRandomAct, getRandomActs, getRandomQuote } from '../handlers/cultivation'
import { ErrorCodes, successResponse } from '../utils'

const app = new Hono<{ Bindings: Env }>()

// GET /api/v1/cultivation/quotes/random
app.get('/quotes/random', async (c) => {
  const quote = await getRandomQuote(c.env.DB)

  // Fallback if no quotes exist yet (though seed should provide them)
  if (!quote) {
    return c.json(
      {
        success: true,
        data: null,
        error: { code: ErrorCodes.NOT_FOUND, message: 'No quotes available' },
      },
      404,
    )
  }

  return c.json(successResponse(quote))
})

// GET /api/v1/cultivation/acts/random
app.get('/acts/random', async (c) => {
  const act = await getRandomAct(c.env.DB)

  // Fallback
  if (!act) {
    return c.json(
      {
        success: true,
        data: null,
        error: { code: ErrorCodes.NOT_FOUND, message: 'No random acts available' },
      },
      404,
    )
  }

  return c.json(
    successResponse({
      content: act.content,
    }),
  )
})

// GET /api/v1/cultivation/acts/random-list
app.get('/acts/random-list', async (c) => {
  const limitParam = c.req.query('limit')
  const limit = limitParam ? Math.max(1, Math.min(50, parseInt(limitParam))) : 10
  const acts = await getRandomActs(c.env.DB, limit)

  if (!acts.length) {
    return c.json(
      {
        success: true,
        data: null,
        error: { code: ErrorCodes.NOT_FOUND, message: 'No random acts available' },
      },
      404,
    )
  }

  return c.json(
    successResponse(
      acts.map((act) => ({
        content: act.content,
      })),
    ),
  )
})

export default app
