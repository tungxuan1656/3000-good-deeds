import { Hono } from 'hono'

import {
  acceptFriendRequest,
  createFriendRequest,
  getFriendRequests,
  getFriends,
  rejectFriendRequest,
  removeFriend,
} from '../handlers/friends'
import { authMiddleware } from '../middlewares/auth'
import { ErrorCodes, errorResponse, successResponse } from '../utils'

const friends = new Hono<{ Bindings: Env; Variables: { user: any } }>()

friends.use('/*', authMiddleware)

friends.get('/', async (c) => {
  const currentUser = c.get('user')
  const friendsList = await getFriends(c.env.DB, currentUser.id)
  return c.json(successResponse(friendsList))
})

friends.get('/requests', async (c) => {
  const currentUser = c.get('user')
  const requests = await getFriendRequests(c.env.DB, currentUser.id)
  return c.json(successResponse(requests))
})

friends.post('/requests', async (c) => {
  const currentUser = c.get('user')
  const body = await c.req.json<{ toUserId: number }>()
  if (!body || !body.toUserId) {
    return c.json(errorResponse(ErrorCodes.BAD_REQUEST, 'Thiếu toUserId'), 400)
  }
  const result = await createFriendRequest(
    c.env.DB,
    currentUser.id,
    body.toUserId,
  )
  if (!result.success) {
    const code =
      result.error === 'Already friends'
        ? ErrorCodes.ALREADY_FRIENDS
        : ErrorCodes.FRIEND_REQUEST_EXISTS
    return c.json(
      errorResponse(code, result.error || 'Tạo yêu cầu kết bạn thất bại'),
      400,
    )
  }
  return c.json(successResponse({ success: true }))
})

friends.post('/requests/:id/accept', async (c) => {
  const currentUser = c.get('user')
  const requestId = parseInt(c.req.param('id'))
  if (isNaN(requestId)) {
    return c.json(
      errorResponse(ErrorCodes.BAD_REQUEST, 'ID yêu cầu không hợp lệ'),
      400,
    )
  }
  const result = await acceptFriendRequest(c.env.DB, requestId, currentUser.id)
  if (!result.success) {
    return c.json(
      errorResponse(
        ErrorCodes.BAD_REQUEST,
        result.error || 'Chấp nhận yêu cầu thất bại',
      ),
      400,
    )
  }
  return c.json(successResponse({ success: true }))
})

friends.post('/requests/:id/reject', async (c) => {
  const currentUser = c.get('user')
  const requestId = parseInt(c.req.param('id'))
  if (isNaN(requestId)) {
    return c.json(
      errorResponse(ErrorCodes.BAD_REQUEST, 'ID yêu cầu không hợp lệ'),
      400,
    )
  }
  const result = await rejectFriendRequest(c.env.DB, requestId, currentUser.id)
  if (!result.success) {
    return c.json(
      errorResponse(
        ErrorCodes.BAD_REQUEST,
        result.error || 'Từ chối yêu cầu thất bại',
      ),
      400,
    )
  }
  return c.json(successResponse({ success: true }))
})

friends.delete('/:id', async (c) => {
  const currentUser = c.get('user')
  const friendId = parseInt(c.req.param('id'))
  if (isNaN(friendId)) {
    return c.json(
      errorResponse(ErrorCodes.BAD_REQUEST, 'ID bạn bè không hợp lệ'),
      400,
    )
  }
  const result = await removeFriend(c.env.DB, currentUser.id, friendId)
  if (!result.success) {
    return c.json(
      errorResponse(
        ErrorCodes.NOT_FOUND,
        result.error || 'Không tìm thấy bạn bè',
      ),
      404,
    )
  }
  return c.json(successResponse({ success: true }))
})

export default friends
