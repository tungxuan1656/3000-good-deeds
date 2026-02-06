import { Hono } from 'hono'

import { createDeed, deleteDeed, getDeeds, updateDeed } from '../handlers/deeds'
import { authMiddleware } from '../middlewares/auth'
import type { CreateDeedRequest, UpdateDeedRequest, User } from '../types'
import { ErrorCodes, errorResponse, successResponse } from '../utils'

const deeds = new Hono<{ Bindings: Env; Variables: { user: User } }>()

deeds.use('/*', authMiddleware)

deeds.get('/', async (c) => {
  const currentUser = c.get('user')
  const limit = parseInt(c.req.query('limit') || '20')
  const cursor = c.req.query('cursor') || undefined
  const fromParam = c.req.query('from')
  const toParam = c.req.query('to')
  const from = fromParam ? parseInt(fromParam) : undefined
  const to = toParam ? parseInt(toParam) : undefined

  const result = await getDeeds(c.env.DB, currentUser, limit, cursor, from, to)

  return c.json(successResponse(result))
})

deeds.post('/', async (c) => {
  const currentUser = c.get('user')
  const body = await c.req.json<CreateDeedRequest>()

  if (!body) {
    return c.json(errorResponse(ErrorCodes.BAD_REQUEST, 'Thiếu thông tin bắt buộc'), 400)
  }

  if (!body.categoryCode) {
    body.categoryCode = 'body'
  }

  const result = await createDeed(c.env.DB, currentUser, body)

  return c.json(successResponse(result))
})

deeds.put('/:id', async (c) => {
  const currentUser = c.get('user')
  const deedId = c.req.param('id')
  const body = await c.req.json<UpdateDeedRequest>()

  try {
    const result = await updateDeed(c.env.DB, currentUser, deedId, body)

    return c.json(successResponse(result))
  } catch (_e) {
    return c.json(errorResponse(ErrorCodes.NOT_MODIFIED, 'Sửa thất bại'), 400)
  }
})

deeds.delete('/:id', async (c) => {
  const currentUser = c.get('user')
  const deedId = c.req.param('id')

  try {
    await deleteDeed(c.env.DB, currentUser, deedId)

    return c.json(successResponse(true))
  } catch (_e) {
    return c.json(errorResponse(ErrorCodes.NOT_FOUND, 'Không tìm thấy việc thiện để xoá'), 400)
  }
})

export default deeds
