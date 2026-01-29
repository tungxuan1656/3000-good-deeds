# 04. DATABASE SCHEMA (Cloudflare D1)

## 1. Overview

This document defines the **SQL schema** for the application using **Cloudflare D1 (SQLite)**.

**Conventions**
- All tables use `created_at` and `updated_at` (Unix timestamp in **milliseconds**).
- Primary keys are `UUID` strings.
- **DB uses snake_case**, API uses camelCase (mapping documented in API spec).

---

## 2. SQL Schema (MVP + Near-future)

```sql
-- 1. USERS
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,

  email_verified_at INTEGER,

  -- Optional profile (future-safe, nullable)
  age_range TEXT,
  location TEXT,
  buddhism_level TEXT,
  privacy_mode TEXT DEFAULT 'private', -- 'private' | 'limited'

  -- Settings (MVP)
  reminder_time TEXT,                -- "HH:mm"
  reminder_enabled BOOLEAN DEFAULT 0,
  timezone TEXT DEFAULT 'Asia/Ho_Chi_Minh',
  theme_preference TEXT DEFAULT 'system', -- 'light' | 'dark' | 'system'
  notification_on BOOLEAN DEFAULT 1,
  last_reminder_sent_at INTEGER,

  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- 2. AUTH TOKENS
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token_hash TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  revoked_at INTEGER,
  created_at INTEGER NOT NULL,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. OAUTH ACCOUNTS
CREATE TABLE IF NOT EXISTS oauth_accounts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  provider TEXT NOT NULL,            -- 'google'
  provider_user_id TEXT NOT NULL,    -- Google sub
  provider_email TEXT,
  created_at INTEGER NOT NULL,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_oauth_provider_user
ON oauth_accounts(provider, provider_user_id);

-- 4. CATEGORIES (System-managed in MVP)
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,          -- stable identifier (e.g., 'body')
  name TEXT NOT NULL,
  description TEXT,
  icon_key TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  is_system_default BOOLEAN DEFAULT 1,

  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- 5. GOOD DEEDS (Core)
CREATE TABLE IF NOT EXISTS good_deeds (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  category_id TEXT NOT NULL,

  description TEXT,                  -- short note
  emotion_after TEXT,                -- optional (future)
  is_private BOOLEAN DEFAULT 1,

  performed_at INTEGER NOT NULL,

  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE INDEX IF NOT EXISTS idx_deeds_user_date
ON good_deeds(user_id, performed_at);

CREATE INDEX IF NOT EXISTS idx_deeds_user_category
ON good_deeds(user_id, category_id);

-- 6. GOALS
CREATE TABLE IF NOT EXISTS goals (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,

  title TEXT,
  type TEXT NOT NULL,                -- 'daily' | 'weekly' | 'monthly'
  target_count INTEGER NOT NULL,
  start_date INTEGER NOT NULL,
  end_date INTEGER,
  is_active BOOLEAN DEFAULT 1,

  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_goals_user_active
ON goals(user_id, type, is_active);

-- 7. ACHIEVEMENTS (Definitions)
CREATE TABLE IF NOT EXISTS achievement_definitions (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,         -- 'STREAK_3', 'FIRST_DEED'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_key TEXT,
  condition_json TEXT NOT NULL,      -- criteria schema (JSON)
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,

  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- 8. USER ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS user_achievements (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  achievement_id TEXT NOT NULL,
  unlocked_at INTEGER NOT NULL,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (achievement_id) REFERENCES achievement_definitions(id)
);

-- 9. SYSTEM SETTINGS (Feature flags, content configs)
CREATE TABLE IF NOT EXISTS system_settings (
  id TEXT PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
```

---

## 3. Data Type Notes

- **Boolean**: stored as `0/1`.
- **DateTime**: stored as `INTEGER` (Unix ms) for range queries.
- **Timezone**: stored on `users.timezone` (IANA string).

---

## 4. Initial Seed Data (Categories)

```sql
INSERT INTO categories (id, key, name, description, icon_key, order_index, is_active, is_system_default, created_at, updated_at) VALUES
('cat_body', 'body', 'Thân thiện', 'Hành động cụ thể bằng thân', 'hand-heart', 1, 1, 1, 1700000000000, 1700000000000),
('cat_speech', 'speech', 'Khẩu thiện', 'Lời nói ái ngữ, chân thật', 'message-circle-heart', 2, 1, 1, 1700000000000, 1700000000000),
('cat_mind', 'mind', 'Ý thiện', 'Suy nghĩ lành, buông xả', 'brain-circuit', 3, 1, 1, 1700000000000, 1700000000000),
('cat_patience', 'patience', 'Nhẫn nhục', 'Chấp nhận nghịch cảnh', 'shield', 4, 1, 0, 1700000000000, 1700000000000),
('cat_gratitude', 'gratitude', 'Biết ơn', 'Tri ân người và vật', 'flower', 5, 1, 0, 1700000000000, 1700000000000);
```
