import { Hono } from 'hono'

import { createJournalEntry, getJournalEntries } from '../handlers/journal'
import { authMiddleware } from '../middlewares/auth'
import type { CreateJournalRequest, User } from '../types'
import { ErrorCodes, errorResponse, successResponse } from '../utils'

const app = new Hono<{ Bindings: Env; Variables: { user: User } }>()

// Protected routes
app.use('/*', authMiddleware)

// GET /api/v1/journal
app.get('/', async (c) => {
  const user = c.get('user')
  const type = c.req.query('type') // 'repentance' | 'gratitude' | undefined

  const entries = await getJournalEntries(c.env.DB, user.id, type)

  return c.json(successResponse(entries))
})

// POST /api/v1/journal
app.post('/', async (c) => {
  const user = c.get('user')

  let body: CreateJournalRequest
  try {
    body = await c.req.json()
  } catch (_e) {
    return c.json(errorResponse(ErrorCodes.INVALID_REQUEST, 'Invalid JSON body'), 400)
  }

  if (!body.content || !body.type) {
    return c.json(errorResponse(ErrorCodes.VALIDATION_ERROR, 'Content and type are required'), 400)
  }

  if (!['repentance', 'gratitude'].includes(body.type)) {
    return c.json(errorResponse(ErrorCodes.VALIDATION_ERROR, 'Invalid journal type'), 400)
  }

  try {
    const newEntry = await createJournalEntry(c.env.DB, user.id, body)

    return c.json(successResponse(newEntry), 201)
  } catch (e) {
    return c.json(
      errorResponse(
        ErrorCodes.INTERNAL_ERROR,
        e instanceof Error ? e.message : 'Failed to create journal entry',
      ),
      500,
    )
  }
})

export default app
