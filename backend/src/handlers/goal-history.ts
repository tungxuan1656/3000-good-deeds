import type { Goal, GoalHistory, User } from '../types'
import { generateId, getCurrentTimestamp } from '../utils'
import { computeLocalPeriods, getPeriodStartEnd } from '../utils'

const MILESTONE_PERIOD = 'milestone_1'

type GoalType = Goal['type']

type DeedPeriods = {
  localWeek: string
  localMonth: string
  localYear: string
}

const getCurrentPeriod = (type: GoalType, timezone: string, timestamp?: number) => {
  if (type === 'milestone') {
    return MILESTONE_PERIOD
  }

  const { localWeek, localMonth, localYear } = computeLocalPeriods(timezone, timestamp)

  switch (type) {
    case 'weekly':
      return localWeek
    case 'monthly':
      return localMonth
    case 'yearly':
      return localYear
    default:
      return localWeek
  }
}

const getDeedPeriodForGoal = (type: GoalType, deedPeriods: DeedPeriods) => {
  switch (type) {
    case 'weekly':
      return deedPeriods.localWeek
    case 'monthly':
      return deedPeriods.localMonth
    case 'yearly':
      return deedPeriods.localYear
    case 'milestone':
      return MILESTONE_PERIOD
    default:
      return deedPeriods.localWeek
  }
}

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
  if (type === 'milestone') {
    const result = await db
      .prepare('SELECT COUNT(*) as count FROM good_deeds WHERE user_id = ?')
      .bind(userId)
      .first<{ count: number }>()

    return result?.count || 0
  }

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
): Promise<GoalHistory> => {
  const periodTime = getCurrentPeriod(goal.type, timezone)
  const existing = await getGoalHistoryByPeriod(db, goal.userId, goal.type, periodTime)

  if (existing) {
    return existing
  }

  const now = getCurrentTimestamp()
  const actualCount = await countDeedsForPeriod(db, goal.userId, goal.type, periodTime)
  const completed = actualCount >= goal.targetCount

  let startDate = now
  let endDate: number | null = null

  if (goal.type !== 'milestone') {
    const period = getPeriodStartEnd(goal.type, timezone)
    startDate = period.startDate
    endDate = period.endDate
  } else if (completed) {
    endDate = now
  }

  const newId = generateId()

  await db
    .prepare(
      `INSERT INTO goal_history
       (id, goal_id, user_id, type, period_time, target_count, actual_count, start_date, end_date, completed, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      newId,
      goal.id,
      goal.userId,
      goal.type,
      periodTime,
      goal.targetCount,
      actualCount,
      startDate,
      endDate,
      completed ? 1 : 0,
      now,
      now,
    )
    .run()

  const created = await getGoalHistoryByPeriod(db, goal.userId, goal.type, periodTime)
  if (!created) {
    throw new Error('Tạo lịch sử mục tiêu thất bại')
  }

  return created
}

export const updateGoalHistoryForPeriod = async (
  db: D1Database,
  goal: Goal,
  periodTime: string,
  options?: { updateTargetCount?: boolean },
): Promise<void> => {
  const existing = await getGoalHistoryByPeriod(db, goal.userId, goal.type, periodTime)
  if (!existing) {
    return
  }

  const now = getCurrentTimestamp()
  const actualCount = await countDeedsForPeriod(db, goal.userId, goal.type, periodTime)
  const targetCount = options?.updateTargetCount ? goal.targetCount : existing.targetCount
  const completed = actualCount >= targetCount

  let endDate = existing.endDate

  if (goal.type === 'milestone' && completed && !endDate) {
    endDate = now
  }

  const setClauses = ['actual_count = ?', 'completed = ?', 'updated_at = ?']
  const bindings: Array<string | number | null> = [actualCount, completed ? 1 : 0, now]

  if (options?.updateTargetCount) {
    setClauses.unshift('target_count = ?')
    bindings.unshift(targetCount)
  }

  if (goal.type === 'milestone') {
    setClauses.push('end_date = ?')
    bindings.push(endDate)
  }

  bindings.push(existing.id)

  await db
    .prepare(`UPDATE goal_history SET ${setClauses.join(', ')} WHERE id = ?`)
    .bind(...bindings)
    .run()
}

export const handleDeedChange = async (
  db: D1Database,
  user: User,
  deedPeriods: DeedPeriods,
): Promise<void> => {
  const { results } = await db
    .prepare('SELECT * FROM goals WHERE user_id = ? AND is_enabled = 1')
    .bind(user.id)
    .all<any>()

  if (!results || results.length === 0) {
    return
  }

  for (const row of results) {
    const goal: Goal = {
      id: row.id,
      userId: row.user_id,
      type: row.type,
      targetCount: row.target_count,
      isEnabled: Boolean(row.is_enabled),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }

    if (goal.type === 'milestone') {
      await ensureGoalHistoryForCurrentPeriod(db, goal, user.timezone)
      await updateGoalHistoryForPeriod(db, goal, MILESTONE_PERIOD)
      continue
    }

    const deedPeriod = getDeedPeriodForGoal(goal.type, deedPeriods)
    const currentPeriod = getCurrentPeriod(goal.type, user.timezone)

    if (deedPeriod === currentPeriod) {
      await ensureGoalHistoryForCurrentPeriod(db, goal, user.timezone)
      await updateGoalHistoryForPeriod(db, goal, currentPeriod)
      continue
    }

    const history = await getGoalHistoryByPeriod(db, goal.userId, goal.type, deedPeriod)
    if (history) {
      await updateGoalHistoryForPeriod(db, goal, deedPeriod)
    }
  }
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
  await ensureGoalHistoryForCurrentPeriod(db, goal, timezone)
  await updateGoalHistoryForPeriod(db, goal, periodTime, { updateTargetCount: true })
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

export const getCurrentGoalHistory = async (
  db: D1Database,
  goal: Goal,
  timezone: string,
): Promise<GoalHistory | null> => {
  const periodTime = getCurrentPeriod(goal.type, timezone)

  return getGoalHistoryByPeriod(db, goal.userId, goal.type, periodTime)
}
