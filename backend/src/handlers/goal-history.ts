import type { DeedPeriods, Goal, GoalHistory, GoalType, User } from '../types'
import { generateId, getCurrentTimestamp } from '../utils'
import { getPeriodStartEnd } from '../utils'
import { getCurrentPeriod, getDeedPeriodForGoal } from '../utils/goals'

const mapGoalHistory = (row: any): GoalHistory => {
  return {
    id: row.id,
    goalId: row.goal_id,
    userId: row.user_id,
    type: row.type,
    periodTime: row.period_time,
    targetCount: row.target_count,
    actualCount: row.actual_count,
    startDate: row.start_date,
    endDate: row.end_date ?? null,
    completed: Boolean(row.completed),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

const countDeedsForPeriod = async (
  db: D1Database,
  userId: string,
  type: GoalType,
  periodTime: string,
): Promise<number> => {
  const column =
    type === 'weekly' ? 'local_week' : type === 'monthly' ? 'local_month' : 'local_year'

  const result = await db
    .prepare(`SELECT COUNT(*) as count FROM good_deeds WHERE user_id = ? AND ${column} = ?`)
    .bind(userId, periodTime)
    .first<{ count: number }>()

  return result?.count || 0
}

const getGoalHistoryByPeriod = async (
  db: D1Database,
  userId: string,
  type: GoalType,
  periodTime: string,
): Promise<GoalHistory | null> => {
  const row = await db
    .prepare('SELECT * FROM goal_history WHERE user_id = ? AND type = ? AND period_time = ?')
    .bind(userId, type, periodTime)
    .first<any>()

  return row ? mapGoalHistory(row) : null
}

export const ensureGoalHistoryForCurrentPeriod = async (
  db: D1Database,
  goal: Goal,
  timezone: string,
): Promise<boolean> => {
  const periodTime = getCurrentPeriod(goal.type, timezone)
  const existing = await getGoalHistoryByPeriod(db, goal.userId, goal.type, periodTime)

  if (existing) {
    return true
  }

  await createGoalHistoryForPeriod(db, goal, periodTime, timezone)

  return true
}

export const createGoalHistoryForPeriod = async (
  db: D1Database,
  goal: Goal,
  periodTime: string,
  timezone: string,
): Promise<void> => {
  const existing = await getGoalHistoryByPeriod(db, goal.userId, goal.type, periodTime)
  if (existing) {
    return
  }

  const now = getCurrentTimestamp()
  const actualCount = await countDeedsForPeriod(db, goal.userId, goal.type, periodTime)
  const completed = actualCount >= goal.targetCount
  const period = getPeriodStartEnd(goal.type, timezone)

  await db
    .prepare(
      `INSERT INTO goal_history
       (id, goal_id, user_id, type, period_time, target_count, actual_count, start_date, end_date, completed, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      generateId(),
      goal.id,
      goal.userId,
      goal.type,
      periodTime,
      goal.targetCount,
      actualCount,
      period.startDate,
      period.endDate,
      completed ? 1 : 0,
      now,
      now,
    )
    .run()
}

export const updateGoalHistoryForPeriod = async (
  db: D1Database,
  userId: string,
  type: GoalType,
  periodTime: string,
  options?: { targetCount?: number },
): Promise<void> => {
  const existing = await getGoalHistoryByPeriod(db, userId, type, periodTime)
  if (!existing) {
    return
  }

  const now = getCurrentTimestamp()
  const targetCount = options?.targetCount ?? existing.targetCount
  const actualCount = await countDeedsForPeriod(db, userId, type, periodTime)
  const completed = actualCount >= targetCount

  const setClauses = ['actual_count = ?', 'completed = ?', 'updated_at = ?']
  const bindings: Array<string | number> = [actualCount, completed ? 1 : 0, now]

  if (options?.targetCount !== undefined) {
    setClauses.unshift('target_count = ?')
    bindings.unshift(targetCount)
  }

  bindings.push(existing.id)

  await db
    .prepare(`UPDATE goal_history SET ${setClauses.join(', ')} WHERE id = ?`)
    .bind(...bindings)
    .run()
}

export const deleteGoalHistoryForCurrentPeriod = async (
  db: D1Database,
  goal: Goal,
  timezone: string,
): Promise<void> => {
  const periodTime = getCurrentPeriod(goal.type, timezone)

  await db
    .prepare('DELETE FROM goal_history WHERE user_id = ? AND type = ? AND period_time = ?')
    .bind(goal.userId, goal.type, periodTime)
    .run()
}

export const updateGoalHistoryIfExists = async (
  db: D1Database,
  userId: string,
  type: GoalType,
  periodTime: string,
): Promise<void> => {
  await updateGoalHistoryForPeriod(db, userId, type, periodTime)
}

export const handleDeedCreate = async (
  db: D1Database,
  user: User,
  deedPeriods: DeedPeriods,
): Promise<void> => {
  const { results } = await db
    .prepare('SELECT * FROM goals WHERE user_id = ? AND is_enabled = 1')
    .bind(user.id)
    .all<any>()

  const enabledByType = new Map<GoalType, Goal>()
  for (const row of results || []) {
    enabledByType.set(row.type as GoalType, {
      id: row.id,
      userId: row.user_id,
      type: row.type,
      targetCount: row.target_count,
      isEnabled: Boolean(row.is_enabled),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })
  }

  const types: GoalType[] = ['weekly', 'monthly', 'yearly']
  for (const type of types) {
    const deedPeriod = getDeedPeriodForGoal(type, deedPeriods)
    const currentPeriod = getCurrentPeriod(type, user.timezone)
    const goal = enabledByType.get(type)

    if (goal && deedPeriod === currentPeriod) {
      await createGoalHistoryForPeriod(db, goal, deedPeriod, user.timezone)
    }
  }

  await Promise.all(
    types.map(async (type) => {
      const deedPeriod = getDeedPeriodForGoal(type, deedPeriods)
      await updateGoalHistoryIfExists(db, user.id, type, deedPeriod)
    }),
  )
}

export const handleDeedDelete = async (
  db: D1Database,
  user: User,
  deedPeriods: DeedPeriods,
): Promise<void> => {
  const types: GoalType[] = ['weekly', 'monthly', 'yearly']

  await Promise.all(
    types.map(async (type) => {
      const deedPeriod = getDeedPeriodForGoal(type, deedPeriods)
      await updateGoalHistoryIfExists(db, user.id, type, deedPeriod)
    }),
  )
}

export const syncCurrentGoalHistoryTarget = async (
  db: D1Database,
  goal: Goal,
  timezone: string,
): Promise<void> => {
  if (!goal.isEnabled) {
    return
  }

  const periodTime = getCurrentPeriod(goal.type, timezone)
  await createGoalHistoryForPeriod(db, goal, periodTime, timezone)

  await updateGoalHistoryForPeriod(db, goal.userId, goal.type, periodTime, {
    targetCount: goal.targetCount,
  })
}

export const getGoalHistoryPage = async (
  db: D1Database,
  userId: string,
  goalId: string,
  limit: number,
  cursor?: number,
) => {
  const pageLimit = Math.min(Math.max(limit, 1), 50)
  const bindings: Array<string | number> = [goalId, userId]
  let cursorCondition = ''

  if (cursor) {
    cursorCondition = 'AND created_at < ?'
    bindings.push(cursor)
  }

  const { results } = await db
    .prepare(
      `SELECT * FROM goal_history
       WHERE goal_id = ? AND user_id = ? ${cursorCondition}
       ORDER BY created_at DESC
       LIMIT ?`,
    )
    .bind(...bindings, pageLimit + 1)
    .all<any>()

  const sliced = results.slice(0, pageLimit)
  const hasMore = results.length > pageLimit
  const nextCursor = hasMore ? sliced[sliced.length - 1]?.created_at : null

  return {
    data: sliced.map(mapGoalHistory),
    pagination: {
      hasMore,
      nextCursor,
      limit: pageLimit,
    },
  }
}
