import type { DharmaQuote, RandomAct } from '../types'

// Lấy pháp ngữ mỗi ngày (Daily rotation based on day of year)
export async function getDailyQuote(db: D1Database): Promise<DharmaQuote | null> {
  // 1. Count total quotes
  const countResult = await db
    .prepare('SELECT COUNT(*) as count FROM dharma_quotes')
    .first<{ count: number }>()

  const count = countResult?.count || 0
  if (count === 0) return null

  // 2. Calculate index based on day of year
  const today = new Date()
  const start = new Date(today.getFullYear(), 0, 0)
  const diff = today.getTime() - start.getTime()
  const oneDay = 1000 * 60 * 60 * 24
  const dayOfYear = Math.floor(diff / oneDay)

  const offset = dayOfYear % count

  // 3. Fetch quote at offset
  const quote = await db
    .prepare(
      `SELECT 
        id, content, author, source, 
        created_at as createdAt, updated_at as updatedAt 
      FROM dharma_quotes 
      LIMIT 1 OFFSET ?`,
    )
    .bind(offset)
    .first<DharmaQuote>()

  return quote
}

// Lấy ngẫu nhiên hành động thiện
export async function getRandomAct(db: D1Database): Promise<RandomAct | null> {
  const act = await db
    .prepare(
      `SELECT 
        id, content, 
        created_at as createdAt, updated_at as updatedAt 
      FROM random_acts 
      ORDER BY RANDOM() 
      LIMIT 1`,
    )
    .first<RandomAct>()

  return act
}
