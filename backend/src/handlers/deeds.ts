import type { CreateDeedRequest, GoodDeed, UpdateDeedRequest } from '../types'
import { getCurrentTimestamp } from '../utils'
import { checkAndUnlockAchievements } from './achievements'

// Get deeds list (with filters)
export async function getDeeds(
  db: D1Database,
  userId: string,
  limit = 20,
  offset = 0,
): Promise<GoodDeed[]> {
  const { results } = await db
    .prepare(
      `SELECT 
        d.id, d.user_id as userId, d.category_id as categoryId, d.description,
        d.performed_at as performedAt, d.created_at as createdAt, d.updated_at as updatedAt,
        c.id as c_id, c.name as c_name, c.icon_key as c_icon, c.description as c_desc,
        c.is_active as c_active, c.created_at as c_created
       FROM good_deeds d
       JOIN categories c ON d.category_id = c.id
       WHERE d.user_id = ?
       ORDER BY d.performed_at DESC, d.created_at DESC
       LIMIT ? OFFSET ?`,
    )
    .bind(userId, limit, offset)
    .all()

  // Map result to GoodDeed structure
  return results.map((row: any) => ({
    id: row.id,
    userId: row.userId,
    categoryId: row.categoryId,
    description: row.description,
    performedAt: row.performedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    category: {
      id: row.c_id,
      name: row.c_name,
      icon: row.c_icon,
      color: null, // Removed color from schema?
      description: row.c_desc,
      isActive: Boolean(row.c_active),
      createdAt: row.c_created,
    },
  }))
}

export async function createDeed(
  db: D1Database,
  userId: string,
  body: CreateDeedRequest,
): Promise<GoodDeed> {
  const now = getCurrentTimestamp()
  const performedAt = body.performedAt || now
  const newId = crypto.randomUUID()

  await db
    .prepare(
      `INSERT INTO good_deeds (id, user_id, category_id, description, is_private, performed_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(newId, userId, body.categoryId, body.description || null, 1, performedAt, now, now)
    .run()

  // Check achievements
  await checkAndUnlockAchievements(db, userId)

  return await getDeedById(db, newId)
}

export async function getDeedById(db: D1Database, deedId: string): Promise<GoodDeed> {
  const row = await db
    .prepare(
      `SELECT 
        d.id, d.user_id as userId, d.category_id as categoryId, d.description,
        d.performed_at as performedAt, d.created_at as createdAt, d.updated_at as updatedAt,
        c.id as c_id, c.name as c_name, c.icon_key as c_icon, c.description as c_desc,
        c.is_active as c_active, c.created_at as c_created
       FROM good_deeds d
       JOIN categories c ON d.category_id = c.id
       WHERE d.id = ?`,
    )
    .bind(deedId)
    .first<any>()

  if (!row) {
    throw new Error('Deed not found')
  }

  return {
    id: row.id,
    userId: row.userId,
    categoryId: row.categoryId,
    description: row.description,
    performedAt: row.performedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    category: {
      id: row.c_id,
      name: row.c_name,
      icon: row.c_icon,
      color: null,
      description: row.c_desc,
      isActive: Boolean(row.c_active),
      createdAt: row.c_created,
    },
  }
}

export async function updateDeed(
  db: D1Database,
  userId: string,
  deedId: string,
  body: UpdateDeedRequest,
): Promise<GoodDeed> {
  const now = getCurrentTimestamp()
  const updates: string[] = []
  const values: any[] = []

  // Security check: ensure user owns the deed
  const existing = await db
    .prepare('SELECT id FROM good_deeds WHERE id = ? AND user_id = ?')
    .bind(deedId, userId)
    .first()

  if (!existing) {
    throw new Error('Deed not found or unauthorized')
  }

  if (body.categoryId !== undefined) {
    updates.push('category_id = ?')
    values.push(body.categoryId)
  }

  if (body.description !== undefined) {
    updates.push('description = ?')
    values.push(body.description)
  }

  if (body.performedAt !== undefined) {
    updates.push('performed_at = ?')
    values.push(body.performedAt)
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
    throw new Error('Deed not found or unauthorized')
  }

  await db.prepare('DELETE FROM good_deeds WHERE id = ?').bind(deedId).run()

  return true
}
