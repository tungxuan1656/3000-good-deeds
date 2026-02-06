import type { CreateDeedRequest, GoodDeed, UpdateDeedRequest, User } from '../types'
import { generateId, getCurrentTimestamp } from '../utils'
import { computeLocalPeriods } from '../utils'
import { checkAndUnlockAchievements } from './achievements'
import { handleDeedCreate, handleDeedDelete } from './goal-history'

// Get deeds list (with filters)
export async function getDeeds(
  db: D1Database,
  user: User,
  limit = 20,
  cursor?: string,
  from?: number,
  to?: number,
) {
  const pageLimit = Math.min(Math.max(limit, 1), 50)
  const whereClauses: string[] = ['d.user_id = ?']
  const bindings: Array<string | number> = [user.id]

  if (from !== undefined) {
    whereClauses.push('d.performed_at >= ?')
    bindings.push(from)
  }

  if (to !== undefined) {
    whereClauses.push('d.performed_at <= ?')
    bindings.push(to)
  }

  if (cursor) {
    // Parse composite cursor: "performedAt_id"
    const [cursorPerformedAt, cursorId] = cursor.split('_')
    whereClauses.push('(d.performed_at < ? OR (d.performed_at = ? AND d.id < ?))')
    bindings.push(Number(cursorPerformedAt), Number(cursorPerformedAt), cursorId)
  }

  const { results } = await db
    .prepare(
      `SELECT 
        d.id, d.user_id as userId, d.category_code as categoryCode, d.description, d.labels,
        d.performed_at as performedAt, d.created_at as createdAt, d.updated_at as updatedAt
       FROM good_deeds d
       WHERE ${whereClauses.join(' AND ')}
       ORDER BY d.performed_at DESC, d.id DESC
       LIMIT ?`,
    )
    .bind(...bindings, pageLimit + 1)
    .all()

  // Map result to GoodDeed structure
  const deeds = results.map((row: any) => {
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

  const sliced = deeds.slice(0, pageLimit)
  const hasMore = deeds.length > pageLimit
  const lastItem = sliced[sliced.length - 1]
  const nextCursor = hasMore && lastItem ? `${lastItem.performedAt}_${lastItem.id}` : null

  return {
    data: sliced,
    pagination: {
      hasMore,
      nextCursor,
      limit: pageLimit,
    },
  }
}

export async function createDeed(
  db: D1Database,
  user: User,
  body: CreateDeedRequest,
): Promise<GoodDeed> {
  const now = getCurrentTimestamp()
  const performedAt = body.performedAt || now
  const newId = generateId()
  const { localDate, localWeek, localMonth, localYear } = computeLocalPeriods(
    user.timezone,
    performedAt,
  )

  await db
    .prepare(
      `INSERT INTO good_deeds (
         id, user_id, category_code, description, labels,
         local_date, local_week, local_month, local_year,
         is_private, performed_at, created_at, updated_at
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      newId,
      user.id,
      body.categoryCode,
      body.description || null,
      body.labels || null,
      localDate,
      localWeek,
      localMonth,
      localYear,
      1,
      performedAt,
      now,
      now,
    )
    .run()

  await handleDeedCreate(db, user, { localWeek, localMonth, localYear })

  // Check achievements
  await checkAndUnlockAchievements(db, user.id)

  return await getDeedById(db, newId)
}

export async function getDeedById(db: D1Database, deedId: string): Promise<GoodDeed> {
  const row = await db
    .prepare(
      `SELECT 
        d.id, d.user_id as userId, d.category_code as categoryCode, d.description, d.labels,
        d.performed_at as performedAt, d.created_at as createdAt, d.updated_at as updatedAt
       FROM good_deeds d
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
  user: User,
  deedId: string,
  body: UpdateDeedRequest,
): Promise<GoodDeed> {
  const now = getCurrentTimestamp()
  const updates: string[] = []
  const values: any[] = []

  // Security check: ensure user owns the deed
  const existing = await db
    .prepare(
      'SELECT id, local_week, local_month, local_year, performed_at FROM good_deeds WHERE id = ? AND user_id = ?',
    )
    .bind(deedId, user.id)
    .first<any>()

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

    const { localDate, localWeek, localMonth, localYear } = computeLocalPeriods(
      user.timezone,
      body.performedAt,
    )

    updates.push('local_date = ?')
    values.push(localDate)

    updates.push('local_week = ?')
    values.push(localWeek)

    updates.push('local_month = ?')
    values.push(localMonth)

    updates.push('local_year = ?')
    values.push(localYear)
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

  if (body.performedAt !== undefined) {
    const previousPeriods = {
      localWeek: existing.local_week,
      localMonth: existing.local_month,
      localYear: existing.local_year,
    }

    const newPeriods = computeLocalPeriods(user.timezone, body.performedAt)
    const newPeriodValues = {
      localWeek: newPeriods.localWeek,
      localMonth: newPeriods.localMonth,
      localYear: newPeriods.localYear,
    }

    const isSamePeriod =
      previousPeriods.localWeek === newPeriodValues.localWeek &&
      previousPeriods.localMonth === newPeriodValues.localMonth &&
      previousPeriods.localYear === newPeriodValues.localYear

    if (!isSamePeriod) {
      await handleDeedDelete(db, user, previousPeriods)
      await handleDeedCreate(db, user, newPeriodValues)
    }
  }

  return await getDeedById(db, deedId)
}

export async function deleteDeed(db: D1Database, user: User, deedId: string): Promise<boolean> {
  // Security check: ensure user owns the deed
  const existing = await db
    .prepare(
      'SELECT id, local_week, local_month, local_year FROM good_deeds WHERE id = ? AND user_id = ?',
    )
    .bind(deedId, user.id)
    .first<any>()

  if (!existing) {
    throw new Error('Không tìm thấy việc thiện hoặc không có quyền truy cập')
  }

  await db.prepare('DELETE FROM good_deeds WHERE id = ?').bind(deedId).run()

  await handleDeedDelete(db, user, {
    localWeek: existing.local_week,
    localMonth: existing.local_month,
    localYear: existing.local_year,
  })

  return true
}
