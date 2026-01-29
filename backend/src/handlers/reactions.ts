import type { CreateReactionRequest, Reaction } from '../types'
import { getCurrentTimestamp } from '../utils'

// Thêm reaction cho post
export async function addReaction(
  db: D1Database,
  postId: number,
  userId: number,
  body: CreateReactionRequest,
): Promise<{ success: boolean; error?: string }> {
  const now = getCurrentTimestamp()

  // Kiểm tra xem post có tồn tại không
  const post = await db
    .prepare('SELECT id FROM posts WHERE id = ? AND deleted_at IS NULL')
    .bind(postId)
    .first()

  if (!post) {
    return { success: false, error: 'Không tìm thấy bài đăng' }
  }

  // Xoá reaction cũ nếu có (user chỉ được react 1 loại cho 1 post)
  await db
    .prepare('DELETE FROM reactions WHERE post_id = ? AND user_id = ?')
    .bind(postId, userId)
    .run()

  // Thêm reaction mới
  await db
    .prepare(
      `INSERT INTO reactions (post_id, user_id, reaction_type, created_at)
       VALUES (?, ?, ?, ?)`,
    )
    .bind(postId, userId, body.reactionType, now)
    .run()

  return { success: true }
}

// Lấy tất cả reactions của một post
export async function getPostReactions(
  db: D1Database,
  postId: number,
): Promise<{ reactions: Reaction[]; summary: Record<string, number> }> {
  const reactions = await db
    .prepare(
      `SELECT id, post_id as postId, user_id as userId, reaction_type as reactionType, created_at as createdAt
       FROM reactions
       WHERE post_id = ?
       ORDER BY created_at DESC`,
    )
    .bind(postId)
    .all<Reaction>()

  // Tính tổng số reaction theo type
  const summary: Record<string, number> = {}
  for (const reaction of reactions.results) {
    summary[reaction.reactionType] = (summary[reaction.reactionType] || 0) + 1
  }

  return {
    reactions: reactions.results,
    summary,
  }
}

// Xoá reaction của user khỏi post
export async function removeReaction(
  db: D1Database,
  postId: number,
  userId: number,
): Promise<{ success: boolean }> {
  await db
    .prepare('DELETE FROM reactions WHERE post_id = ? AND user_id = ?')
    .bind(postId, userId)
    .run()

  return { success: true }
}
