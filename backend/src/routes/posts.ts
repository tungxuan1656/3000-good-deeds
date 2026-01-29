import { Hono } from 'hono'

import {
  createPost,
  deletePost,
  getPostById,
  getUserPosts,
  updatePost,
} from '../handlers/posts'
import {
  addReaction,
  getPostReactions,
  removeReaction,
} from '../handlers/reactions'
import { authMiddleware } from '../middlewares/auth'
import type {
  CreatePostRequest,
  CreateReactionRequest,
  UpdatePostRequest,
} from '../types'
import { ErrorCodes, errorResponse, successResponse } from '../utils'

const posts = new Hono<{ Bindings: Env; Variables: { user: any } }>()

posts.use('/*', authMiddleware)

posts.post('/', async (c) => {
  const currentUser = c.get('user')
  const body = await c.req.json<CreatePostRequest>()
  if (!body || !body.mediaPublicId || !body.mediaUrl || !body.mediaType) {
    return c.json(
      errorResponse(ErrorCodes.BAD_REQUEST, 'Thiếu thông tin bắt buộc'),
      400,
    )
  }
  const post = await createPost(c.env.DB, currentUser.id, body)
  return c.json(successResponse(post))
})

posts.get('/me', async (c) => {
  const currentUser = c.get('user')
  const limit = parseInt(c.req.query('limit') || '50')
  const cursor = c.req.query('cursor') || undefined
  const posts = await getUserPosts(c.env.DB, currentUser.id, limit, cursor)
  return c.json(successResponse(posts))
})

posts.get('/:id', async (c) => {
  const postId = parseInt(c.req.param('id'))
  if (isNaN(postId)) {
    return c.json(
      errorResponse(ErrorCodes.BAD_REQUEST, 'ID bài đăng không hợp lệ'),
      400,
    )
  }
  try {
    const post = await getPostById(c.env.DB, postId)
    return c.json(successResponse(post))
  } catch (_error) {
    return c.json(
      errorResponse(ErrorCodes.POST_NOT_FOUND, 'Không tìm thấy bài đăng'),
      404,
    )
  }
})

posts.delete('/:id', async (c) => {
  const currentUser = c.get('user')
  const postId = parseInt(c.req.param('id'))
  if (isNaN(postId)) {
    return c.json(
      errorResponse(ErrorCodes.BAD_REQUEST, 'ID bài đăng không hợp lệ'),
      400,
    )
  }
  const result = await deletePost(c.env.DB, postId, currentUser.id)
  if (!result.success) {
    return c.json(
      errorResponse(
        ErrorCodes.FORBIDDEN,
        result.error || 'Xoá bài đăng thất bại',
      ),
      403,
    )
  }
  return c.json(successResponse({ success: true }))
})

posts.patch('/:id', async (c) => {
  const currentUser = c.get('user')
  const postId = parseInt(c.req.param('id'))
  if (isNaN(postId)) {
    return c.json(
      errorResponse(ErrorCodes.BAD_REQUEST, 'ID bài đăng không hợp lệ'),
      400,
    )
  }
  const body = await c.req.json<UpdatePostRequest>()
  if (!body) {
    return c.json(
      errorResponse(ErrorCodes.BAD_REQUEST, 'Body request không hợp lệ'),
      400,
    )
  }
  const result = await updatePost(c.env.DB, postId, currentUser.id, body)
  if (!result.success) {
    return c.json(
      errorResponse(
        ErrorCodes.FORBIDDEN,
        result.error || 'Cập nhật bài đăng thất bại',
      ),
      403,
    )
  }
  return c.json(successResponse(result.data))
})

// Reactions routes nested under posts
posts.get('/:id/reactions', async (c) => {
  const postId = parseInt(c.req.param('id'))
  if (isNaN(postId)) {
    return c.json(
      errorResponse(ErrorCodes.BAD_REQUEST, 'ID bài đăng không hợp lệ'),
      400,
    )
  }
  const reactions = await getPostReactions(c.env.DB, postId)
  return c.json(successResponse(reactions))
})

posts.post('/:id/reactions', async (c) => {
  const currentUser = c.get('user')
  const postId = parseInt(c.req.param('id'))
  if (isNaN(postId)) {
    return c.json(
      errorResponse(ErrorCodes.BAD_REQUEST, 'ID bài đăng không hợp lệ'),
      400,
    )
  }
  const body = await c.req.json<CreateReactionRequest>()
  if (!body || !body.reactionType) {
    return c.json(
      errorResponse(ErrorCodes.BAD_REQUEST, 'Thiếu loại reaction'),
      400,
    )
  }
  const result = await addReaction(c.env.DB, postId, currentUser.id, body)
  if (!result.success) {
    return c.json(
      errorResponse(
        ErrorCodes.POST_NOT_FOUND,
        result.error || 'Thêm reaction thất bại',
      ),
      404,
    )
  }
  return c.json(successResponse({ success: true }))
})

posts.delete('/:id/reactions', async (c) => {
  const currentUser = c.get('user')
  const postId = parseInt(c.req.param('id'))
  if (isNaN(postId)) {
    return c.json(
      errorResponse(ErrorCodes.BAD_REQUEST, 'ID bài đăng không hợp lệ'),
      400,
    )
  }
  const result = await removeReaction(c.env.DB, postId, currentUser.id)
  return c.json(successResponse(result))
})

export default posts
