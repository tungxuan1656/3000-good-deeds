import { Hono } from 'hono'

import { getDailyQuote, getRandomAct } from '../handlers/cultivation'
import { ErrorCodes, successResponse } from '../utils'

const app = new Hono<{ Bindings: Env }>()

// GET /api/v1/cultivation/quotes/daily
app.get('/quotes/daily', async (c) => {
  const quote = await getDailyQuote(c.env.DB)

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

export default app
