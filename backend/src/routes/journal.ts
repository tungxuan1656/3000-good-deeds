import { Hono } from 'hono'

import { authMiddleware } from '../middlewares/auth'
import type { CreateJournalRequest, JournalEntry, User } from '../types'
import { ErrorCodes, errorResponse, generateId } from '../utils'

const app = new Hono<{ Bindings: Env; Variables: { user: User } }>()

// Protected routes
app.use('/*', authMiddleware)

// GET /api/v1/journal
app.get('/', async (c) => {
  const user = c.get('user')
  const type = c.req.query('type') // 'repentance' | 'gratitude' | undefined

  let query = 'SELECT * FROM journal_entries WHERE user_id = ?'
  const params: string[] = [user.id]

  if (type) {
    query += ' AND type = ?'
    params.push(type)
  }

  query += ' ORDER BY created_at DESC LIMIT 50'

  const { results } = await c.env.DB.prepare(query)
    .bind(...params)
    .all<JournalEntry>()

  return c.json({
    success: true,
    data: results,
    error: null,
  })
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

  const newEntry: JournalEntry = {
    id: generateId('journal_'),
    userId: user.id,
    type: body.type,
    content: body.content,
    emotion: body.emotion || null,
    isPrivate: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }

  const { success } = await c.env.DB.prepare(
    `INSERT INTO journal_entries (id, user_id, type, content, emotion, is_private, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      newEntry.id,
      newEntry.userId,
      newEntry.type,
      newEntry.content,
      newEntry.emotion,
      newEntry.isPrivate ? 1 : 0,
      newEntry.createdAt,
      newEntry.updatedAt,
    )
    .run()

  if (!success) {
    return c.json(errorResponse(ErrorCodes.INTERNAL_ERROR, 'Failed to create journal entry'), 500)
  }

  return c.json(
    {
      success: true,
      data: newEntry,
      error: null,
    },
    201,
  )
})

export default app
