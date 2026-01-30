import type { Category } from '../types'

export async function getCategories(db: D1Database): Promise<Category[]> {
    const { results } = await db
        .prepare(
            `SELECT 
        id, name, description, icon, color,
        is_active as isActive,
        created_at as createdAt
       FROM categories
       WHERE is_active = 1
       ORDER BY id ASC`,
        )
        .all<Category>()

    return results
}

