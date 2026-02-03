import type { AchievementDefinition, UserAchievement } from '../types'
import { generateId, getCurrentTimestamp } from '../utils'

export async function getAchievementDefinitions(db: D1Database): Promise<AchievementDefinition[]> {
  const results = await db
    .prepare(
      `SELECT 
        id, code, title, description, icon_key as icon, 
        condition_json as conditionJsonString, order_index, is_active
       FROM achievement_definitions 
       WHERE is_active = 1 
       ORDER BY order_index ASC`,
    )
    .all<any>()

  return results.results.map((r) => {
    let criteria = { type: 'unknown', value: 0 }
    try {
      criteria = JSON.parse(r.conditionJsonString)
    } catch (e) {
      console.error('Failed to parse achievement criteria', e)
    }

    return {
      id: r.id,
      name: r.title,
      description: r.description,
      icon: r.icon,
      criteriaType: criteria.type,
      criteriaValue: criteria.value,
    } as unknown as AchievementDefinition
  })
}

export async function getUserAchievements(
  db: D1Database,
  userId: string,
): Promise<UserAchievement[]> {
  const results = await db
    .prepare(
      `
        SELECT 
            ua.id, ua.user_id, ua.achievement_id, ua.unlocked_at,
            ad.title, ad.description, ad.icon_key
        FROM user_achievements ua
        JOIN achievement_definitions ad ON ua.achievement_id = ad.id
        WHERE ua.user_id = ?
        ORDER BY ua.unlocked_at DESC
    `,
    )
    .bind(userId)
    .all<any>()

  return results.results.map((r) => ({
    id: r.id,
    userId: r.user_id,
    achievementId: r.achievement_id,
    earnedAt: r.unlocked_at,
    details: {
      id: r.achievement_id,
      name: r.title,
      description: r.description,
      icon: r.icon_key,
      criteriaType: 'unknown',
      criteriaValue: 0,
    } as any,
  }))
}

export async function checkAndUnlockAchievements(db: D1Database, userId: string) {
  const countResult = await db
    .prepare('SELECT COUNT(*) as count FROM good_deeds WHERE user_id = ?')
    .bind(userId)
    .first<{ count: number }>()
  const deedCount = countResult?.count || 0

  // Get First Deed Definition
  const firstDeedDef = await db
    .prepare("SELECT id FROM achievement_definitions WHERE code = 'FIRST_DEED'")
    .first<{ id: string }>()

  if (firstDeedDef && deedCount >= 1) {
    await unlockAchievement(db, userId, firstDeedDef.id)
  }
}

async function unlockAchievement(db: D1Database, userId: string, achievementId: string) {
  const existing = await db
    .prepare('SELECT id FROM user_achievements WHERE user_id = ? AND achievement_id = ?')
    .bind(userId, achievementId)
    .first()
  if (existing) return

  const now = getCurrentTimestamp()

  await db
    .prepare(
      'INSERT INTO user_achievements (id, user_id, achievement_id, unlocked_at) VALUES (?, ?, ?, ?)',
    )
    .bind(generateId(), userId, achievementId, now)
    .run()
}
