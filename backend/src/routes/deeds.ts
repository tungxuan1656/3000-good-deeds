import { Hono } from 'hono'

import { createDeed, DeedHandlerError, deleteDeed, getDeeds, updateDeed } from '../handlers/deeds'
import { authMiddleware } from '../middlewares/auth'
import type { CreateDeedRequest, UpdateDeedRequest, User } from '../types'
import { ErrorCodes, errorResponse, successResponse } from '../utils'

const deeds = new Hono<{ Bindings: Env; Variables: { user: User } }>()

deeds.use('/*', authMiddleware)

deeds.get('/', async (c) => {
  const currentUser = c.get('user')
  const limitRaw = c.req.query('limit')
  const limit = limitRaw ? Number(limitRaw) : 20
  if (!Number.isInteger(limit) || limit < 1) {
    return c.json(errorResponse(ErrorCodes.BAD_REQUEST, 'limit phải là số nguyên dương'), 400)
  }

  const cursor = c.req.query('cursor') || undefined
  const fromParam = c.req.query('from')
  const toParam = c.req.query('to')
  const from = fromParam ? Number(fromParam) : undefined
  const to = toParam ? Number(toParam) : undefined

  if (from !== undefined && !Number.isFinite(from)) {
    return c.json(errorResponse(ErrorCodes.BAD_REQUEST, 'from không hợp lệ'), 400)
  }
  if (to !== undefined && !Number.isFinite(to)) {
    return c.json(errorResponse(ErrorCodes.BAD_REQUEST, 'to không hợp lệ'), 400)
  }

  const result = await getDeeds(c.env.DB, currentUser, limit, cursor, from, to)

  return c.json(successResponse(result))
})

deeds.post('/', async (c) => {
  const currentUser = c.get('user')
  let body: CreateDeedRequest
  try {
    body = await c.req.json()
  } catch {
    return c.json(errorResponse(ErrorCodes.BAD_REQUEST, 'Thiếu thông tin bắt buộc'), 400)
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return c.json(errorResponse(ErrorCodes.BAD_REQUEST, 'Thiếu thông tin bắt buộc'), 400)
  }

  if (!body.categoryCode) {
    return c.json(errorResponse(ErrorCodes.BAD_REQUEST, 'categoryCode là bắt buộc'), 400)
  }

  if (body.performedAt !== undefined && !Number.isFinite(body.performedAt)) {
    return c.json(errorResponse(ErrorCodes.BAD_REQUEST, 'performedAt không hợp lệ'), 400)
  }

  try {
    const result = await createDeed(c.env.DB, currentUser, body)

    return c.json(successResponse(result), 201)
  } catch (e) {
    if (e instanceof DeedHandlerError) {
      return c.json(errorResponse(ErrorCodes.BAD_REQUEST, e.message), e.status)
    }

    console.error('Create deed failed', e)

    return c.json(errorResponse(ErrorCodes.INTERNAL_ERROR, 'Tạo việc thiện thất bại'), 500)
  }
})

deeds.put('/:id', async (c) => {
  const currentUser = c.get('user')
  const deedId = c.req.param('id')
  let body: UpdateDeedRequest
  try {
    body = await c.req.json()
  } catch {
    return c.json(errorResponse(ErrorCodes.BAD_REQUEST, 'Dữ liệu yêu cầu không hợp lệ'), 400)
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return c.json(errorResponse(ErrorCodes.BAD_REQUEST, 'Dữ liệu yêu cầu không hợp lệ'), 400)
  }
  if (body.performedAt !== undefined && !Number.isFinite(body.performedAt)) {
    return c.json(errorResponse(ErrorCodes.BAD_REQUEST, 'performedAt không hợp lệ'), 400)
  }

  try {
    const result = await updateDeed(c.env.DB, currentUser, deedId, body)

    return c.json(successResponse(result))
  } catch (e) {
    if (e instanceof DeedHandlerError && e.status === 404) {
      return c.json(
        errorResponse(ErrorCodes.NOT_FOUND, 'Không tìm thấy việc thiện để cập nhật'),
        404,
      )
    }

    if (e instanceof DeedHandlerError) {
      return c.json(errorResponse(ErrorCodes.BAD_REQUEST, e.message), e.status)
    }

    console.error('Update deed failed', e)

    return c.json(errorResponse(ErrorCodes.INTERNAL_ERROR, 'Sửa thất bại'), 500)
  }
})

deeds.delete('/:id', async (c) => {
  const currentUser = c.get('user')
  const deedId = c.req.param('id')

  try {
    await deleteDeed(c.env.DB, currentUser, deedId)

    return c.json(successResponse(true))
  } catch (e) {
    if (e instanceof DeedHandlerError && e.status === 404) {
      return c.json(errorResponse(ErrorCodes.NOT_FOUND, 'Không tìm thấy việc thiện để xoá'), 404)
    }

    console.error('Delete deed failed', e)

    return c.json(errorResponse(ErrorCodes.INTERNAL_ERROR, 'Xoá việc thiện thất bại'), 500)
  }
})

export default deeds
