import type { Category } from '../types'

export async function getCategories(db: D1Database): Promise<Category[]> {
  const { results } = await db
    .prepare(
      `SELECT 
        code, name, description, icon, style,
        is_active as isActive,
        created_at as createdAt
       FROM categories
       WHERE is_active = 1
       ORDER BY order_index ASC`,
      // NOTE: Updated column names to match schema (icon -> icon_key, order_index)
    )
    .all<any>() // Typed as any first because we map fields

  return results.map((r) => ({
    code: r.code,
    name: r.name,
    description: r.description,
    icon: r.icon,
    isActive: Boolean(r.isActive),
    createdAt: r.createdAt,
    style: r.style ?? null,
  }))
}
