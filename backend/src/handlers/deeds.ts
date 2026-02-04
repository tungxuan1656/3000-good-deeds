import type { CreateDeedRequest, GoodDeed, UpdateDeedRequest } from '../types'
import { generateId, getCurrentTimestamp } from '../utils'
import { getLocalDateStringByTimeZone } from '../utils'
import { checkAndUnlockAchievements } from './achievements'

// Get deeds list (with filters)
export async function getDeeds(
  db: D1Database,
  userId: string,
  limit = 20,
  offset = 0,
  from?: number,
  to?: number,
): Promise<GoodDeed[]> {
  const whereClauses: string[] = ['d.user_id = ?']
  const bindings: Array<string | number> = [userId]

  if (from !== undefined) {
    whereClauses.push('d.performed_at >= ?')
    bindings.push(from)
  }

  if (to !== undefined) {
    whereClauses.push('d.performed_at <= ?')
    bindings.push(to)
  }

  const { results } = await db
    .prepare(
      `SELECT 
        d.id, d.user_id as userId, d.category_code as categoryCode, d.description, d.labels,
        d.performed_at as performedAt, d.created_at as createdAt, d.updated_at as updatedAt,
        c.code as c_code, c.name as c_name, c.icon as c_icon, c.description as c_desc, c.style as c_style,
        c.is_active as c_active, c.created_at as c_created
       FROM good_deeds d
       JOIN categories c ON d.category_code = c.code
       WHERE ${whereClauses.join(' AND ')}
       ORDER BY d.performed_at DESC, d.created_at DESC
       LIMIT ? OFFSET ?`,
    )
    .bind(...bindings, limit, offset)
    .all()

  // Map result to GoodDeed structure
  return results.map((row: any) => {
    return {
      id: row.id,
      userId: row.userId,
      categoryCode: row.categoryCode,
      description: row.description,
      labels: row.labels,
      performedAt: row.performedAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
  })
}

export async function createDeed(
  db: D1Database,
  userId: string,
  body: CreateDeedRequest,
): Promise<GoodDeed> {
  const userRow = await db
    .prepare('SELECT timezone FROM users WHERE id = ?')
    .bind(userId)
    .first<{ timezone?: string }>()
  const timeZone = userRow?.timezone || 'Asia/Ho_Chi_Minh'

  const now = getCurrentTimestamp()
  const performedAt = body.performedAt || now
  const newId = generateId()
  const localDate = getLocalDateStringByTimeZone(timeZone, performedAt)

  await db
    .prepare(
      `INSERT INTO good_deeds (id, user_id, category_code, description, labels, local_date, is_private, performed_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      newId,
      userId,
      body.categoryCode,
      body.description || null,
      body.labels || null,
      localDate,
      1,
      performedAt,
      now,
      now,
    )
    .run()

  // Check achievements
  await checkAndUnlockAchievements(db, userId)

  return await getDeedById(db, newId)
}

export async function getDeedById(db: D1Database, deedId: string): Promise<GoodDeed> {
  const row = await db
    .prepare(
      `SELECT 
        d.id, d.user_id as userId, d.category_code as categoryCode, d.description, d.labels,
        d.performed_at as performedAt, d.created_at as createdAt, d.updated_at as updatedAt,
        c.code as c_code, c.name as c_name, c.icon as c_icon, c.description as c_desc, c.style as c_style,
        c.is_active as c_active, c.created_at as c_created
       FROM good_deeds d
       JOIN categories c ON d.category_code = c.code
       WHERE d.id = ?`,
    )
    .bind(deedId)
    .first<any>()

  if (!row) {
    throw new Error('Không tìm thấy việc thiện')
  }

  return {
    id: row.id,
    userId: row.userId,
    categoryCode: row.categoryCode,
    description: row.description,
    labels: row.labels,
    performedAt: row.performedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}

export async function updateDeed(
  db: D1Database,
  userId: string,
  deedId: string,
  body: UpdateDeedRequest,
): Promise<GoodDeed> {
  const userRow = await db
    .prepare('SELECT timezone FROM users WHERE id = ?')
    .bind(userId)
    .first<{ timezone?: string }>()
  const timeZone = userRow?.timezone || 'Asia/Ho_Chi_Minh'

  const now = getCurrentTimestamp()
  const updates: string[] = []
  const values: any[] = []

  // Security check: ensure user owns the deed
  const existing = await db
    .prepare('SELECT id FROM good_deeds WHERE id = ? AND user_id = ?')
    .bind(deedId, userId)
    .first()

  if (!existing) {
    throw new Error('Không tìm thấy việc thiện hoặc không có quyền truy cập')
  }

  if (body.categoryCode !== undefined) {
    updates.push('category_code = ?')
    values.push(body.categoryCode)
  }

  if (body.description !== undefined) {
    updates.push('description = ?')
    values.push(body.description)
  }

  if (body.labels !== undefined) {
    updates.push('labels = ?')
    values.push(body.labels)
  }

  if (body.performedAt !== undefined) {
    updates.push('performed_at = ?')
    values.push(body.performedAt)

    updates.push('local_date = ?')
    values.push(getLocalDateStringByTimeZone(timeZone, body.performedAt))
  }

  if (updates.length > 0) {
    updates.push('updated_at = ?')
    values.push(now)
    values.push(deedId)

    await db
      .prepare(`UPDATE good_deeds SET ${updates.join(', ')} WHERE id = ?`)
      .bind(...values)
      .run()
  }

  return await getDeedById(db, deedId)
}

export async function deleteDeed(db: D1Database, userId: string, deedId: string): Promise<boolean> {
  // Security check: ensure user owns the deed
  const existing = await db
    .prepare('SELECT id FROM good_deeds WHERE id = ? AND user_id = ?')
    .bind(deedId, userId)
    .first()

  if (!existing) {
    throw new Error('Không tìm thấy việc thiện hoặc không có quyền truy cập')
  }

  await db.prepare('DELETE FROM good_deeds WHERE id = ?').bind(deedId).run()

  return true
}
