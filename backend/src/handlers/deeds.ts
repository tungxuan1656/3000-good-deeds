import type { CreateDeedRequest, GoodDeed, UpdateDeedRequest } from '../types'
import { getCurrentTimestamp } from '../utils'

// Get deeds list (with filters)
export async function getDeeds(
  db: D1Database,
  userId: number,
  limit = 20,
  offset = 0,
): Promise<GoodDeed[]> {
  const { results } = await db
    .prepare(
      `SELECT 
        d.id, d.user_id as userId, d.category_id as categoryId, d.description,
        d.performed_at as performedAt, d.created_at as createdAt, d.updated_at as updatedAt,
        c.id as c_id, c.name as c_name, c.icon as c_icon, c.color as c_color
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
      color: row.c_color,
      description: null, // Minimal info
      isActive: true,
      createdAt: 0,
    },
  }))
}

export async function createDeed(
  db: D1Database,
  userId: number,
  body: CreateDeedRequest,
): Promise<GoodDeed> {
  const now = getCurrentTimestamp()
  const performedAt = body.performedAt || now

  const result = await db
    .prepare(
      `INSERT INTO good_deeds (user_id, category_id, description, performed_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .bind(userId, body.categoryId, body.description || null, performedAt, now, now)
    .run()

  const id = result.meta.last_row_id as number

  return await getDeedById(db, id)
}

export async function getDeedById(db: D1Database, deedId: number): Promise<GoodDeed> {
  const row = await db
    .prepare(
      `SELECT 
        d.id, d.user_id as userId, d.category_id as categoryId, d.description,
        d.performed_at as performedAt, d.created_at as createdAt, d.updated_at as updatedAt,
        c.id as c_id, c.name as c_name, c.icon as c_icon, c.color as c_color
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
      color: row.c_color,
      description: null,
      isActive: true,
      createdAt: 0,
    },
  }
}

export async function updateDeed(
  db: D1Database,
  userId: number,
  deedId: number,
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

export async function deleteDeed(db: D1Database, userId: number, deedId: number): Promise<boolean> {
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
