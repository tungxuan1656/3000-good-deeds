# 01. DATABASE SCHEMA (Cloudflare D1)

## 1. Tổng quan
Dự án sử dụng **SQLite** (thông qua Cloudflare D1).
*   **Naming:** Snake_case (`user_id`, `created_at`).
*   **IDs:** UUID v4 (lưu dạng TEXT).
*   **Time:** Unix Timestamp (milli-seconds) lưu dạng INTEGER.

---

## 2. Lược đồ chi tiết (Tables)

### 2.1. Users Identity
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  
  -- Settings
  reminder_time TEXT,                -- "20:00"
  reminder_enabled BOOLEAN DEFAULT 0,
  timezone TEXT DEFAULT 'Asia/Ho_Chi_Minh',
  
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE oauth_accounts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  provider TEXT NOT NULL,            -- 'google'
  provider_user_id TEXT NOT NULL,    -- Google sub
  provider_email TEXT,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 2.2. Core Features (Deeds & Goals)
```sql
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,          -- 'body', 'speech', 'mind'
  name TEXT NOT NULL,
  icon_key TEXT,
  order_index INTEGER DEFAULT 0
);

CREATE TABLE good_deeds (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  category_id TEXT NOT NULL,
  description TEXT,
  is_private BOOLEAN DEFAULT 1,
  performed_at INTEGER NOT NULL,     -- Thời điểm làm việc thiện
  created_at INTEGER NOT NULL,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE goals (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,                -- 'daily', 'weekly'
  target_count INTEGER NOT NULL,
  status TEXT DEFAULT 'active',
  start_date INTEGER NOT NULL,
  end_date INTEGER,
  
  created_at INTEGER NOT NULL
);
```

### 2.3. Cultivation Tools (New)
```sql
CREATE TABLE dharma_quotes (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  author TEXT,
  tags_json TEXT
);

CREATE TABLE journal_entries (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,                -- 'repentance', 'gratitude'
  content TEXT NOT NULL,
  is_private BOOLEAN DEFAULT 1,
  created_at INTEGER NOT NULL
);
```

### 2.4. Gamification
```sql
CREATE TABLE user_achievements (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  achievement_id TEXT NOT NULL,
  unlocked_at INTEGER NOT NULL
);
```
