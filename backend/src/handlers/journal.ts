import type { CreateJournalRequest, JournalEntry } from '../types'
import { generateId, getCurrentTimestamp } from '../utils'

// Lấy danh sách nhật ký
export async function getJournalEntries(
  db: D1Database,
  userId: string,
  type?: string,
): Promise<JournalEntry[]> {
  let query = `
    SELECT 
      id, user_id as userId, type, content, emotion, 
      is_private as isPrivate, 
      created_at as createdAt, updated_at as updatedAt 
    FROM journal_entries 
    WHERE user_id = ?`

  const params: any[] = [userId]

  if (type) {
    query += ' AND type = ?'
    params.push(type)
  }

  query += ' ORDER BY created_at DESC LIMIT 50'

  const { results } = await db
    .prepare(query)
    .bind(...params)
    .all<JournalEntry>()

  // Convert boolean
  return results.map((entry) => ({
    ...entry,
    isPrivate: Boolean(entry.isPrivate),
  }))
}

// Tạo nhật kí mới
export async function createJournalEntry(
  db: D1Database,
  userId: string,
  body: CreateJournalRequest,
): Promise<JournalEntry> {
  const now = getCurrentTimestamp()
  const newEntry: JournalEntry = {
    id: generateId('journal_'),
    userId,
    type: body.type,
    content: body.content,
    emotion: body.emotion || null,
    isPrivate: true,
    createdAt: now,
    updatedAt: now,
  }

  const { success } = await db
    .prepare(
      `INSERT INTO journal_entries (id, user_id, type, content, emotion, is_private, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      newEntry.id,
      newEntry.userId,
      newEntry.type,
      newEntry.content,
      newEntry.emotion,
      newEntry.isPrivate ? 1 : 0,
      newEntry.createdAt,
      newEntry.updatedAt,
    )
    .run()

  if (!success) {
    throw new Error('Failed to create journal entry')
  }

  return newEntry
}
