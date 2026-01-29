import type {
  CreatePostRequest,
  PostWithDetails,
  TagItemDTO,
  UpdatePostRequest,
} from '../types'
import { getCurrentTimestamp } from '../utils'

// Tạo post mới
export async function createPost(
  db: D1Database,
  userId: number,
  body: CreatePostRequest,
): Promise<PostWithDetails> {
  const now = body.createdAt || getCurrentTimestamp()

  // Insert post
  const postResult = await db
    .prepare(
      `INSERT INTO posts (user_id, media_public_id, media_url, media_type, width, height, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      userId,
      body.mediaPublicId,
      body.mediaUrl,
      body.mediaType,
      body.width || null,
      body.height || null,
      now,
      now,
    )
    .run()

  const postId = postResult.meta.last_row_id as number

  // Insert post attributes nếu có tags
  if (body.tags && body.tags.length > 0) {
    await db
      .prepare(`INSERT INTO post_attributes (post_id, tags) VALUES (?, ?)`)
      .bind(postId, JSON.stringify(body.tags))
      .run()
  }

  return await getPostById(db, postId)
}

// Lấy post theo ID
export async function getPostById(
  db: D1Database,
  postId: number,
): Promise<PostWithDetails> {
  const post = await db
    .prepare(
      `SELECT 
        p.id, p.user_id as userId, p.media_public_id as mediaPublicId,
        p.media_url as mediaUrl, p.media_type as mediaType,
        p.width, p.height, p.created_at as createdAt, p.updated_at as updatedAt,
        u.id as user_userId, u.display_name as user_displayName, u.avatar_url as user_avatarUrl,
        pa.tags
      FROM posts p
      INNER JOIN users u ON p.user_id = u.id
      LEFT JOIN post_attributes pa ON p.id = pa.post_id
      WHERE p.id = ? AND p.deleted_at IS NULL`,
    )
    .bind(postId)
    .first<any>()

  if (!post) {
    throw new Error('Không tìm thấy bài đăng')
  }

  return formatPostWithDetails(post)
}

// Lấy feed (posts của user và bạn bè)
export async function getFeed(
  db: D1Database,
  userId: number,
  limit: number = 20,
  cursor?: string,
): Promise<{ items: PostWithDetails[]; nextCursor: string | null }> {
  // Lấy danh sách friend IDs
  const friendIds = await getFriendIds(db, userId)
  const userIds = [userId, ...friendIds]

  // Build query
  let query = `
    SELECT 
      p.id, p.user_id as userId, p.media_public_id as mediaPublicId,
      p.media_url as mediaUrl, p.media_type as mediaType,
      p.width, p.height, p.created_at as createdAt, p.updated_at as updatedAt,
      u.id as user_userId, u.display_name as user_displayName, u.avatar_url as user_avatarUrl,
      pa.tags
    FROM posts p
    INNER JOIN users u ON p.user_id = u.id
    LEFT JOIN post_attributes pa ON p.id = pa.post_id
    WHERE p.user_id IN (${userIds.map(() => '?').join(',')})
      AND p.deleted_at IS NULL
  `

  const params: any[] = [...userIds]

  // Cursor pagination
  if (cursor) {
    const [cursorCreatedAt, cursorId] = cursor.split(':')
    query += ` AND (p.created_at < ? OR (p.created_at = ? AND p.id < ?))`
    params.push(
      parseInt(cursorCreatedAt),
      parseInt(cursorCreatedAt),
      parseInt(cursorId),
    )
  }

  query += ` ORDER BY p.created_at DESC, p.id DESC LIMIT ?`
  params.push(limit + 1)

  const results = await db
    .prepare(query)
    .bind(...params)
    .all<any>()

  const hasMore = results.results.length > limit
  const items = results.results.slice(0, limit).map(formatPostWithDetails)

  let nextCursor: string | null = null
  if (hasMore) {
    const lastItem = items[items.length - 1]
    nextCursor = `${lastItem.createdAt}:${lastItem.id}`
  }

  return { items, nextCursor }
}

// Lấy posts của user
export async function getUserPosts(
  db: D1Database,
  userId: number,
  limit: number = 50,
  cursor?: string,
): Promise<{ items: PostWithDetails[]; nextCursor: string | null }> {
  let query = `
    SELECT 
      p.id, p.user_id as userId, p.media_public_id as mediaPublicId,
      p.media_url as mediaUrl, p.media_type as mediaType,
      p.width, p.height, p.created_at as createdAt, p.updated_at as updatedAt,
      u.id as user_userId, u.display_name as user_displayName, u.avatar_url as user_avatarUrl,
      pa.tags
    FROM posts p
    INNER JOIN users u ON p.user_id = u.id
    LEFT JOIN post_attributes pa ON p.id = pa.post_id
    WHERE p.user_id = ? AND p.deleted_at IS NULL
  `

  const params: any[] = [userId]

  if (cursor) {
    const [cursorCreatedAt, cursorId] = cursor.split(':')
    query += ` AND (p.created_at < ? OR (p.created_at = ? AND p.id < ?))`
    params.push(
      parseInt(cursorCreatedAt),
      parseInt(cursorCreatedAt),
      parseInt(cursorId),
    )
  }

  query += ` ORDER BY p.created_at DESC, p.id DESC LIMIT ?`
  params.push(limit + 1)

  const results = await db
    .prepare(query)
    .bind(...params)
    .all<any>()

  const hasMore = results.results.length > limit
  const items = results.results.slice(0, limit).map(formatPostWithDetails)

  let nextCursor: string | null = null
  if (hasMore) {
    const lastItem = items[items.length - 1]
    nextCursor = `${lastItem.createdAt}:${lastItem.id}`
  }

  return { items, nextCursor }
}

// Xoá post (soft delete)
export async function deletePost(
  db: D1Database,
  postId: number,
  userId: number,
): Promise<{ success: boolean; error?: string }> {
  const now = getCurrentTimestamp()

  // Kiểm tra quyền sở hữu
  const post = await db
    .prepare('SELECT user_id FROM posts WHERE id = ? AND deleted_at IS NULL')
    .bind(postId)
    .first<{ user_id: number }>()

  if (!post) {
    return { success: false, error: 'Không tìm thấy bài đăng' }
  }

  if (post.user_id !== userId) {
    return { success: false, error: 'Không có quyền thực hiện' }
  }

  // Soft delete
  await db
    .prepare('UPDATE posts SET deleted_at = ? WHERE id = ?')
    .bind(now, postId)
    .run()

  return { success: true }
}

// Update post
export async function updatePost(
  db: D1Database,
  postId: number,
  userId: number,
  body: UpdatePostRequest,
): Promise<{ success: boolean; data?: PostWithDetails; error?: string }> {
  // Kiểm tra quyền sở hữu
  const post = await db
    .prepare('SELECT user_id FROM posts WHERE id = ? AND deleted_at IS NULL')
    .bind(postId)
    .first<{ user_id: number }>()

  if (!post) {
    return { success: false, error: 'Không tìm thấy bài đăng' }
  }

  if (post.user_id !== userId) {
    return { success: false, error: 'Không có quyền thực hiện' }
  }

  if (body.tags !== undefined) {
    const tagsJson =
      body.tags && body.tags.length > 0 ? JSON.stringify(body.tags) : null

    // Check if attributes exist
    const existingAttrs = await db
      .prepare('SELECT post_id FROM post_attributes WHERE post_id = ?')
      .bind(postId)
      .first()

    if (existingAttrs) {
      await db
        .prepare('UPDATE post_attributes SET tags = ? WHERE post_id = ?')
        .bind(tagsJson, postId)
        .run()
    } else if (tagsJson) {
      // Insert if not exists and tags is not null
      await db
        .prepare('INSERT INTO post_attributes (post_id, tags) VALUES (?, ?)')
        .bind(postId, tagsJson)
        .run()
    }
  }

  const updatedPost = await getPostById(db, postId)
  return { success: true, data: updatedPost }
}

// Helper: Lấy friend IDs
async function getFriendIds(db: D1Database, userId: number): Promise<number[]> {
  const results = await db
    .prepare(
      `SELECT 
        CASE 
          WHEN requester_id = ? THEN receiver_id 
          ELSE requester_id 
        END as friendId
      FROM friends
      WHERE (requester_id = ? OR receiver_id = ?) AND status = 1`,
    )
    .bind(userId, userId, userId)
    .all<{ friendId: number }>()

  return results.results.map((r) => r.friendId)
}

// Helper: Format post với details
function formatPostWithDetails(row: any): PostWithDetails {
  const tags: TagItemDTO[] | undefined = row.tags
    ? JSON.parse(row.tags)
    : undefined

  return {
    id: row.id,
    userId: row.userId,
    mediaPublicId: row.mediaPublicId,
    mediaUrl: row.mediaUrl,
    mediaType: row.mediaType,
    width: row.width,
    height: row.height,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: null,
    user: {
      id: row.user_userId,
      displayName: row.user_displayName || 'Unknown',
      avatarUrl: row.user_avatarUrl,
    },
    tags,
  }
}
