import { Hono } from 'hono'

import { createDeed, deleteDeed, getDeeds, updateDeed } from '../handlers/deeds'
import { authMiddleware } from '../middlewares/auth'
import type { CreateDeedRequest, UpdateDeedRequest } from '../types'
import { ErrorCodes, errorResponse, successResponse } from '../utils'

const deeds = new Hono<{ Bindings: Env; Variables: { user: any } }>()

deeds.use('/*', authMiddleware)

deeds.get('/', async (c) => {
  const currentUser = c.get('user')
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '20')
  const offset = (page - 1) * limit

  const result = await getDeeds(c.env.DB, currentUser.id, limit, offset)

  return c.json(successResponse(result))
})

deeds.post('/', async (c) => {
  const currentUser = c.get('user')
  const body = await c.req.json<CreateDeedRequest>()

  if (!body || !body.categoryCode) {
    return c.json(errorResponse(ErrorCodes.BAD_REQUEST, 'Thiếu thông tin bắt buộc'), 400)
  }

  const result = await createDeed(c.env.DB, currentUser.id, body)

  return c.json(successResponse(result))
})

deeds.put('/:id', async (c) => {
  const currentUser = c.get('user')
  const deedId = c.req.param('id')
  const body = await c.req.json<UpdateDeedRequest>()

  try {
    const result = await updateDeed(c.env.DB, currentUser.id, deedId, body)

    return c.json(successResponse(result))
  } catch (_e) {
    return c.json(errorResponse(ErrorCodes.NOT_MODIFIED, 'Sửa thất bại'), 400)
  }
})

deeds.delete('/:id', async (c) => {
  const currentUser = c.get('user')
  const deedId = c.req.param('id')

  try {
    await deleteDeed(c.env.DB, currentUser.id, deedId)

    return c.json(successResponse(true))
  } catch (_e) {
    return c.json(errorResponse(ErrorCodes.NOT_FOUND, 'Không tìm thấy việc thiện để xoá'), 400)
  }
})

export default deeds
