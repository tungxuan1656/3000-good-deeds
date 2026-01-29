import type {
  FriendRequestWithDetails,
  FriendWithDetails,
  UserWithFriendStatus,
} from '../types'
import { getCurrentTimestamp } from '../utils'

// Tìm user theo email
export async function searchUserByEmail(
  db: D1Database,
  email: string,
  currentUserId: number,
): Promise<UserWithFriendStatus | null> {
  const user = await db
    .prepare(
      `SELECT id, display_name as displayName, email, avatar_url as avatarUrl
       FROM users
       WHERE email = ?`,
    )
    .bind(email)
    .first<{
      id: number
      displayName: string
      email: string
      avatarUrl: string | null
    }>()

  if (!user) {
    return null
  }

  // Kiểm tra friend status
  const friendStatus = await db
    .prepare(
      `SELECT status FROM friends
       WHERE (requester_id = ? AND receiver_id = ?)
          OR (requester_id = ? AND receiver_id = ?)`,
    )
    .bind(currentUserId, user.id, user.id, currentUserId)
    .first<{ status: number }>()

  return {
    ...user,
    status: friendStatus ? friendStatus.status : null,
  }
}

// Lấy danh sách bạn bè (status = 1)
export async function getFriends(
  db: D1Database,
  userId: number,
): Promise<FriendWithDetails[]> {
  const friends = await db
    .prepare(
      `SELECT 
        u.id, u.display_name as displayName, u.email, u.avatar_url as avatarUrl
      FROM friends f
      INNER JOIN users u ON (
        CASE 
          WHEN f.requester_id = ? THEN u.id = f.receiver_id
          ELSE u.id = f.requester_id
        END
      )
      WHERE (f.requester_id = ? OR f.receiver_id = ?) AND f.status = 1`,
    )
    .bind(userId, userId, userId)
    .all<FriendWithDetails>()

  return friends.results
}

// Kiểm tra xem 2 user đã là bạn bè chưa (status = 1)
export async function areFriends(
  db: D1Database,
  userId1: number,
  userId2: number,
): Promise<boolean> {
  const friend = await db
    .prepare(
      `SELECT id FROM friends 
       WHERE (requester_id = ? AND receiver_id = ?) 
          OR (requester_id = ? AND receiver_id = ?)
       AND status = 1`,
    )
    .bind(userId1, userId2, userId2, userId1)
    .first()

  return !!friend
}

// Kiểm tra xem đã có friend request pending chưa (status = 0)
export async function hasPendingRequest(
  db: D1Database,
  fromUserId: number,
  toUserId: number,
): Promise<boolean> {
  const request = await db
    .prepare(
      `SELECT id FROM friends 
       WHERE requester_id = ? AND receiver_id = ? AND status = 0`,
    )
    .bind(fromUserId, toUserId)
    .first()

  return !!request
}

// Tạo friend request (status = 0)
export async function createFriendRequest(
  db: D1Database,
  fromUserId: number,
  toUserId: number,
): Promise<{ success: boolean; error?: string }> {
  // Kiểm tra đã là bạn bè
  if (await areFriends(db, fromUserId, toUserId)) {
    return { success: false, error: 'Đã là bạn bè' }
  }

  // Kiểm tra đã có request pending
  if (await hasPendingRequest(db, fromUserId, toUserId)) {
    return { success: false, error: 'Yêu cầu kết bạn đã tồn tại' }
  }

  const now = getCurrentTimestamp()

  await db
    .prepare(
      `INSERT INTO friends (requester_id, receiver_id, status, created_at, updated_at)
       VALUES (?, ?, 0, ?, ?)`,
    )
    .bind(fromUserId, toUserId, now, now)
    .run()

  return { success: true }
}

// Lấy danh sách friend requests đến user (status = 0, receiver_id = ?)
export async function getFriendRequests(
  db: D1Database,
  userId: number,
): Promise<FriendRequestWithDetails[]> {
  const requests = await db
    .prepare(
      `SELECT 
        f.id, f.created_at as createdAt,
        u.id as requesterId, u.display_name as requesterDisplayName,
        u.email as requesterEmail, u.avatar_url as requesterAvatarUrl
      FROM friends f
      INNER JOIN users u ON f.requester_id = u.id
      WHERE f.receiver_id = ? AND f.status = 0
      ORDER BY f.created_at DESC`,
    )
    .bind(userId)
    .all<any>()

  return requests.results.map((r) => ({
    id: r.id,
    createdAt: r.createdAt,
    requester: {
      id: r.requesterId,
      displayName: r.requesterDisplayName || 'Unknown',
      email: r.requesterEmail,
      avatarUrl: r.requesterAvatarUrl,
    },
  }))
}

// Accept friend request (update status 0 -> 1)
export async function acceptFriendRequest(
  db: D1Database,
  friendRequestId: number,
  currentUserId: number,
): Promise<{ success: boolean; error?: string }> {
  // Lấy thông tin request
  const request = await db
    .prepare(
      `SELECT requester_id as requesterId, receiver_id as receiverId, status
       FROM friends
       WHERE id = ?`,
    )
    .bind(friendRequestId)
    .first<{ requesterId: number; receiverId: number; status: number }>()

  if (!request) {
    return { success: false, error: 'Không tìm thấy yêu cầu kết bạn' }
  }

  if (request.receiverId !== currentUserId) {
    return { success: false, error: 'Không có quyền thực hiện' }
  }

  if (request.status !== 0) {
    return { success: false, error: 'Yêu cầu kết bạn đã được xử lý' }
  }

  const now = getCurrentTimestamp()

  // Update request status from 0 (pending) to 1 (accepted)
  await db
    .prepare(`UPDATE friends SET status = 1, updated_at = ? WHERE id = ?`)
    .bind(now, friendRequestId)
    .run()

  return { success: true }
}

// Reject friend request (set status = 2)
export async function rejectFriendRequest(
  db: D1Database,
  friendRequestId: number,
  currentUserId: number,
): Promise<{ success: boolean; error?: string }> {
  // Lấy thông tin request
  const request = await db
    .prepare(
      `SELECT receiver_id as receiverId, status
       FROM friends
       WHERE id = ?`,
    )
    .bind(friendRequestId)
    .first<{ receiverId: number; status: number }>()

  if (!request) {
    return { success: false, error: 'Không tìm thấy yêu cầu kết bạn' }
  }

  if (request.receiverId !== currentUserId) {
    return { success: false, error: 'Không có quyền thực hiện' }
  }

  if (request.status !== 0) {
    return { success: false, error: 'Yêu cầu kết bạn đã được xử lý' }
  }

  const now = getCurrentTimestamp()

  // Update status to 2 (rejected) instead of deleting
  const result = await db
    .prepare(`UPDATE friends SET status = 2, updated_at = ? WHERE id = ?`)
    .bind(now, friendRequestId)
    .run()

  if (result.meta.changes === 0) {
    return { success: false, error: 'Không tìm thấy yêu cầu kết bạn' }
  }

  return { success: true }
}

// Xoá bạn bè (hard delete)
export async function removeFriend(
  db: D1Database,
  userId: number,
  friendId: number,
): Promise<{ success: boolean; error?: string }> {
  const result = await db
    .prepare(
      `DELETE FROM friends 
       WHERE (requester_id = ? AND receiver_id = ?) 
          OR (requester_id = ? AND receiver_id = ?)
       AND status = 1`,
    )
    .bind(userId, friendId, friendId, userId)
    .run()

  if (result.meta.changes === 0) {
    return { success: false, error: 'Không tìm thấy mối quan hệ bạn bè' }
  }

  return { success: true }
}
