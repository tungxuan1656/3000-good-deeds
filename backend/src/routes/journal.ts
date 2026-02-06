import { Hono } from 'hono'

import {
  createJournalEntry,
  deleteJournalEntry,
  getJournalEntries,
  getJournalEntriesPaged,
  getJournalEntryById,
  getJournalEntryCreatedAt,
} from '../handlers/journal'
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

// GET /api/v1/journal/entries (cursor paging)
app.get('/entries', async (c) => {
  const user = c.get('user')
  const limit = parseInt(c.req.query('limit') || '20')
  const cursor = c.req.query('cursor') || undefined
  const type = c.req.query('type') as 'repentance' | 'gratitude' | undefined

  if (type && !['repentance', 'gratitude'].includes(type)) {
    return c.json(errorResponse(ErrorCodes.VALIDATION_ERROR, 'Invalid journal type'), 400)
  }

  const result = await getJournalEntriesPaged(c.env.DB, user.id, {
    limit,
    cursor,
    type,
  })

  return c.json(successResponse(result))
})

// GET /api/v1/journal/entries/:id
app.get('/entries/:id', async (c) => {
  const user = c.get('user')
  const entryId = c.req.param('id')

  try {
    const entry = await getJournalEntryById(c.env.DB, user.id, entryId)

    return c.json(successResponse(entry))
  } catch (_e) {
    return c.json(errorResponse(ErrorCodes.NOT_FOUND, 'Không tìm thấy bài viết'), 404)
  }
})

// POST /api/v1/journal/entries
app.post('/entries', async (c) => {
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

  const newEntry = await createJournalEntry(c.env.DB, user.id, body)

  return c.json(successResponse(newEntry), 201)
})

// DELETE /api/v1/journal/entries/:id (only within 15 minutes)
app.delete('/entries/:id', async (c) => {
  const user = c.get('user')
  const entryId = c.req.param('id')
  const createdAt = await getJournalEntryCreatedAt(c.env.DB, user.id, entryId)

  if (!createdAt) {
    return c.json(errorResponse(ErrorCodes.NOT_FOUND, 'Không tìm thấy bài viết'), 404)
  }

  const now = Date.now()
  const fifteenMinutes = 15 * 60 * 1000
  if (now - createdAt > fifteenMinutes) {
    return c.json(
      errorResponse(
        ErrorCodes.FORBIDDEN,
        'Bài viết đã được giữ nguyên; bạn chỉ có thể xoá trong vòng 15 phút sau khi lưu.',
      ),
      403,
    )
  }

  await deleteJournalEntry(c.env.DB, user.id, entryId)

  return c.json(successResponse({ deleted: true }))
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

  const newEntry = await createJournalEntry(c.env.DB, user.id, body)

  return c.json(successResponse(newEntry), 201)
})

export default app
