# 12. API PAGINATION & FILTERING STRATEGY

## 1. Mục đích

Tài liệu này định nghĩa:
- Pagination pattern cho các endpoint trả về list
- Filtering và sorting strategy
- Best practices để scale

---

## 2. Pagination Pattern: Cursor-based

### 2.1. Tại sao dùng Cursor-based?

**Ưu điểm:**
- Consistent results (không bỏ sót item khi data thay đổi)
- Performance tốt với large dataset
- Phù hợp với D1/SQLite

**So với Offset-based:**
- Offset: `LIMIT 20 OFFSET 100` → slow với offset lớn
- Cursor: `WHERE id > last_id LIMIT 20` → fast với index

---

## 3. Implementation

### 3.1. GET /deeds (Good Deeds History)

**Request:**
```http
GET /api/v1/deeds?limit=20&cursor=deed_xyz123&from=1706500000000&to=1706600000000
```

**Query Parameters:**

| Param        | Type      | Required | Description                     |
| ------------ | --------- | -------- | ------------------------------- |
| `limit`      | integer   | No       | Default: 20, Max: 100           |
| `cursor`     | string    | No       | Last item ID from previous page |
| `from`       | timestamp | No       | Filter by performed_at >= from  |
| `to`         | timestamp | No       | Filter by performed_at <= to    |
| `categoryId` | string    | No       | Filter by category              |

**Response:**
```json
{
  "data": [
    {
      "id": "deed_abc123",
      "categoryId": "cat_body",
      "description": "Helped neighbor",
      "performedAt": 1706500000000,
      "isPrivate": true,
      "category": {
        "name": "Thân thiện",
        "iconKey": "hand-heart"
      }
    }
  ],
  "pagination": {
    "nextCursor": "deed_xyz123",
    "hasMore": true,
    "total": 150
  }
}
```

**SQL Query:**
```sql
-- First page
SELECT * FROM good_deeds 
WHERE user_id = ?
  AND performed_at BETWEEN ? AND ?
ORDER BY performed_at DESC, id DESC
LIMIT 21; -- +1 để check hasMore

-- Next page
SELECT * FROM good_deeds 
WHERE user_id = ?
  AND performed_at BETWEEN ? AND ?
  AND (performed_at < ? OR (performed_at = ? AND id < ?))
ORDER BY performed_at DESC, id DESC
LIMIT 21;
```

**Logic:**
```typescript
async function getDeedsWithPagination(
  db: D1Database,
  userId: string,
  options: {
    limit?: number
    cursor?: string
    from?: number
    to?: number
    categoryId?: string
  }
) {
  const limit = Math.min(options.limit || 20, 100)
  const fetchLimit = limit + 1 // +1 to check hasMore
  
  let query = `
    SELECT d.*, c.name as category_name, c.icon_key as category_icon
    FROM good_deeds d
    JOIN categories c ON d.category_id = c.id
    WHERE d.user_id = ?
  `
  const params: any[] = [userId]
  
  // Time filters
  if (options.from) {
    query += ` AND d.performed_at >= ?`
    params.push(options.from)
  }
  if (options.to) {
    query += ` AND d.performed_at <= ?`
    params.push(options.to)
  }
  
  // Category filter
  if (options.categoryId) {
    query += ` AND d.category_id = ?`
    params.push(options.categoryId)
  }
  
  // Cursor
  if (options.cursor) {
    const cursorDeed = await db
      .prepare('SELECT performed_at, id FROM good_deeds WHERE id = ?')
      .bind(options.cursor)
      .first()
      
    if (cursorDeed) {
      query += ` AND (d.performed_at < ? OR (d.performed_at = ? AND d.id < ?))`
      params.push(cursorDeed.performed_at, cursorDeed.performed_at, cursorDeed.id)
    }
  }
  
  query += ` ORDER BY d.performed_at DESC, d.id DESC LIMIT ?`
  params.push(fetchLimit)
  
  const results = await db.prepare(query).bind(...params).all()
  
  const hasMore = results.results.length > limit
  const data = results.results.slice(0, limit)
  
  const nextCursor = hasMore && data.length > 0 
    ? data[data.length - 1].id 
    : null
  
  return {
    data,
    pagination: {
      nextCursor,
      hasMore
    }
  }
}
```

---

### 3.2. GET /goals (Goals List)

**Request:**
```http
GET /api/v1/goals?status=active
```

**Query Parameters:**

| Param    | Type   | Required | Description                                    |
| -------- | ------ | -------- | ---------------------------------------------- |
| `status` | string | No       | `active`, `inactive`, `all`. Default: `active` |

**Response:**
```json
{
  "data": [
    {
      "id": "goal_123",
      "title": "1 việc thiện mỗi ngày",
      "type": "daily",
      "targetCount": 1,
      "startDate": 1706500000000,
      "endDate": 1709000000000,
      "isActive": true,
      "progress": {
        "current": 5,
        "target": 7
      }
    }
  ]
}
```

**Note:** Goals không cần pagination vì mỗi user ít goals (<10 thường).

---

## 4. Sorting Strategy

### 4.1. Default Sorting

| Endpoint        | Default Sort                 |
| --------------- | ---------------------------- |
| `/deeds`        | `performed_at DESC, id DESC` |
| `/goals`        | `created_at DESC`            |
| `/achievements` | `unlocked_at DESC`           |

### 4.2. Custom Sorting (Future)

Nếu cần, cho phép query param `sort`:

```http
GET /deeds?sort=performed_at:asc
GET /deeds?sort=created_at:desc
```

**MVP:** Chỉ dùng default sort.

---

## 5. Filtering Best Practices

### 5.1. Date Range Filters

**Always inclusive:**
```typescript
// from: start of day
// to: end of day
WHERE performed_at >= from AND performed_at <= to
```

**Frontend responsibility:**
- Convert user timezone → UTC timestamps
- Send Unix milliseconds

### 5.2. Category Filter

```http
GET /deeds?categoryId=cat_body
```

**Multiple categories (future):**
```http
GET /deeds?categoryId=cat_body,cat_mind
```

**SQL:**
```sql
WHERE category_id IN (?, ?)
```

---

## 6. Performance Optimization

### 6.1. Indexes (Đã có trong schema)

```sql
-- Critical for cursor pagination
CREATE INDEX idx_deeds_user_date 
ON good_deeds(user_id, performed_at DESC, id DESC);

-- For category filter
CREATE INDEX idx_deeds_user_category 
ON good_deeds(user_id, category_id);
```

### 6.2. Limit Max Results

```typescript
const MAX_LIMIT = 100
const limit = Math.min(requestedLimit, MAX_LIMIT)
```

### 6.3. Avoid COUNT(*) in Pagination Response

**Slow:**
```sql
SELECT COUNT(*) FROM good_deeds WHERE user_id = ?
```

**Better:** Tính total từ `/stats/summary` endpoint, cache lại.

**MVP:** Không return `total` trong pagination response.

---

## 7. Error Handling

### 7.1. Invalid Cursor

```typescript
if (options.cursor) {
  const cursorDeed = await getCursorDeed(db, options.cursor)
  if (!cursorDeed) {
    // Invalid cursor → reset to first page
    options.cursor = undefined
  }
}
```

**Response:** Return first page, không throw error.

### 7.2. Invalid Date Range

```typescript
if (options.from && options.to && options.from > options.to) {
  return c.json({
    error: {
      code: 'INVALID_RANGE',
      message: 'from must be <= to'
    }
  }, 400)
}
```

---

## 8. Frontend Integration (React Query)

### 8.1. Infinite Query Pattern

```tsx
import { useInfiniteQuery } from '@tanstack/react-query'

function useDeedsInfinite(filters: { from?: number; to?: number }) {
  return useInfiniteQuery({
    queryKey: ['deeds', 'infinite', filters],
    queryFn: async ({ pageParam }) => {
      const response = await axios.get('/api/v1/deeds', {
        params: {
          cursor: pageParam,
          ...filters,
          limit: 20
        }
      })
      return response.data
    },
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasMore 
        ? lastPage.pagination.nextCursor 
        : undefined
    },
    initialPageParam: undefined
  })
}
```

### 8.2. Usage in Component

```tsx
function DeedsHistory() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useDeedsInfinite({ from: startOfMonth, to: endOfMonth })

  return (
    <div>
      {data?.pages.map((page) => (
        page.data.map((deed) => (
          <DeedCard key={deed.id} deed={deed} />
        ))
      ))}
      
      {hasNextPage && (
        <button onClick={() => fetchNextPage()}>
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  )
}
```

---

## 9. API Contract Summary

### 9.1. Standard Pagination Response

```typescript
interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    nextCursor: string | null
    hasMore: boolean
  }
}
```

### 9.2. All Paginated Endpoints

| Endpoint            | Paginated | Filters              |
| ------------------- | --------- | -------------------- |
| `GET /deeds`        | ✅         | from, to, categoryId |
| `GET /goals`        | ❌         | status               |
| `GET /achievements` | ❌         | -                    |

---

## 10. Testing

### 10.1. Test Cases

| Case                    | Expected                           |
| ----------------------- | ---------------------------------- |
| First page (no cursor)  | Return first 20 items              |
| Next page (with cursor) | Return next 20 items               |
| Last page               | hasMore = false, nextCursor = null |
| Invalid cursor          | Return first page                  |
| limit > MAX_LIMIT       | Clamp to MAX_LIMIT                 |
| Empty result            | data = [], hasMore = false         |

### 10.2. Load Testing

Test với:
- 1000 deeds / user
- 10 concurrent requests
- Verify query time < 100ms

---

## 11. Future Enhancements

### 11.1. Search

```http
GET /deeds?q=giúp+đỡ
```

**Implementation:**
- Full-text search trong SQLite (FTS5)
- Hoặc filter `description LIKE %keyword%` (đơn giản hơn)

### 11.2. Advanced Filters

```http
GET /deeds?categoryId=cat_body,cat_mind&emotionAfter=happy
```

### 11.3. Aggregation Endpoint

```http
GET /deeds/aggregate?groupBy=category&from=...&to=...
```

**Response:**
```json
{
  "byCategory": {
    "cat_body": 50,
    "cat_mind": 30
  },
  "byDate": {
    "2024-01-01": 5,
    "2024-01-02": 3
  }
}
```

---

## 12. Kết luận

Cursor-based pagination là lựa chọn tốt nhất cho:
- Consistent results
- Good performance
- Simple implementation

Cần đảm bảo:
- Index đúng columns
- Handle invalid cursor gracefully
- Document rõ ràng cho frontend
