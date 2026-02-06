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
    id: generateId(),
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

export type JournalEntriesPage = {
  data: Array<Pick<JournalEntry, 'id' | 'type' | 'content' | 'createdAt'>>
  pagination: {
    hasMore: boolean
    nextCursor: string | null
    limit: number
  }
}

export async function getJournalEntriesPaged(
  db: D1Database,
  userId: string,
  params: {
    limit?: number
    cursor?: string
    type?: 'repentance' | 'gratitude'
  } = {},
): Promise<JournalEntriesPage> {
  const pageLimit = Math.min(Math.max(params.limit ?? 20, 1), 50)
  const whereClauses: string[] = ['user_id = ?']
  const bindings: Array<string | number> = [userId]

  if (params.type) {
    whereClauses.push('type = ?')
    bindings.push(params.type)
  }

  if (params.cursor) {
    const [cursorCreatedAt, cursorId] = params.cursor.split('_')
    whereClauses.push('(created_at < ? OR (created_at = ? AND id < ?))')
    bindings.push(Number(cursorCreatedAt), Number(cursorCreatedAt), cursorId)
  }

  const { results } = await db
    .prepare(
      `SELECT 
        id,
        type,
        content,
        created_at as createdAt
       FROM journal_entries
       WHERE ${whereClauses.join(' AND ')}
       ORDER BY created_at DESC, id DESC
       LIMIT ?`,
    )
    .bind(...bindings, pageLimit + 1)
    .all<any>()

  const entries = results.map((row: any) => ({
    id: row.id,
    type: row.type,
    content: row.content,
    createdAt: row.createdAt,
  }))

  const sliced = entries.slice(0, pageLimit)
  const hasMore = entries.length > pageLimit
  const lastItem = sliced[sliced.length - 1]
  const nextCursor = hasMore && lastItem ? `${lastItem.createdAt}_${lastItem.id}` : null

  return {
    data: sliced,
    pagination: {
      hasMore,
      nextCursor,
      limit: pageLimit,
    },
  }
}

export async function getJournalEntryById(
  db: D1Database,
  userId: string,
  entryId: string,
): Promise<Pick<JournalEntry, 'id' | 'type' | 'content' | 'createdAt'>> {
  const row = await db
    .prepare(
      `SELECT 
        id,
        type,
        content,
        created_at as createdAt
       FROM journal_entries
       WHERE id = ? AND user_id = ?`,
    )
    .bind(entryId, userId)
    .first<any>()

  if (!row) {
    throw new Error('Không tìm thấy bài viết')
  }

  return {
    id: row.id,
    type: row.type,
    content: row.content,
    createdAt: row.createdAt,
  }
}

export async function getJournalEntryCreatedAt(
  db: D1Database,
  userId: string,
  entryId: string,
): Promise<number | null> {
  const row = await db
    .prepare('SELECT created_at as createdAt FROM journal_entries WHERE id = ? AND user_id = ?')
    .bind(entryId, userId)
    .first<any>()

  return row ? Number(row.createdAt) : null
}

export async function deleteJournalEntry(db: D1Database, userId: string, entryId: string) {
  const result = await db
    .prepare('DELETE FROM journal_entries WHERE id = ? AND user_id = ?')
    .bind(entryId, userId)
    .run()

  return Boolean(result.success)
}
