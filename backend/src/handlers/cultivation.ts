import type { DharmaQuote, RandomAct } from '../types'

// Lấy pháp ngữ ngẫu nhiên
export async function getRandomQuote(db: D1Database): Promise<DharmaQuote | null> {
  const quote = await db
    .prepare(
      `SELECT 
        id, content, author, source, 
        created_at as createdAt, updated_at as updatedAt 
      FROM dharma_quotes 
      ORDER BY RANDOM() 
      LIMIT 1`,
    )
    .first<DharmaQuote>()

  return quote
}

// Lấy ngẫu nhiên hành động thiện
export async function getRandomAct(db: D1Database): Promise<RandomAct | null> {
  const act = await db
    .prepare(
      `SELECT 
        id, category, name, detail, note,
        created_at as createdAt, updated_at as updatedAt 
      FROM random_acts 
      ORDER BY RANDOM() 
      LIMIT 1`,
    )
    .first<RandomAct>()

  return act
}

// Lấy danh sách hành động thiện ngẫu nhiên
export async function getRandomActs(db: D1Database, limit = 10): Promise<RandomAct[]> {
  const { results } = await db
    .prepare(
      `SELECT 
        id, category, name, detail, note,
        created_at as createdAt, updated_at as updatedAt 
      FROM random_acts 
      ORDER BY RANDOM() 
      LIMIT ?`,
    )
    .bind(limit)
    .all<RandomAct>()

  return results
}
