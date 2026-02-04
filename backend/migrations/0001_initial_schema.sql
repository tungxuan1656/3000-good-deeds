-- Migration number: 0001 2026-02-03T00:00:00.000Z
-- Baseline schema (ULID-based identifiers stored as TEXT)

-- 1. USERS
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,               -- ULID
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,

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
  id TEXT PRIMARY KEY,               -- ULID
  user_id TEXT NOT NULL,
  token_hash TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  revoked_at INTEGER,
  created_at INTEGER NOT NULL,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. OAUTH ACCOUNTS
CREATE TABLE IF NOT EXISTS oauth_accounts (
  id TEXT PRIMARY KEY,               -- ULID
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
  code TEXT PRIMARY KEY,            -- stable identifier (e.g., 'body')
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL,                -- icon URL
  style TEXT,                        -- className string
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  is_system_default BOOLEAN DEFAULT 1,

  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- 5. GOOD DEEDS (Core)
CREATE TABLE IF NOT EXISTS good_deeds (
  id TEXT PRIMARY KEY,               -- ULID
  user_id TEXT NOT NULL,
  category_code TEXT NOT NULL,

  description TEXT,                  -- short note
  labels TEXT,                       -- comma-separated tags
  is_private BOOLEAN DEFAULT 1,

  performed_at INTEGER NOT NULL,

  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_code) REFERENCES categories(code)
);

CREATE INDEX IF NOT EXISTS idx_deeds_user_date
ON good_deeds(user_id, performed_at);

CREATE INDEX IF NOT EXISTS idx_deeds_user_category
ON good_deeds(user_id, category_code);

-- 6. GOALS
CREATE TABLE IF NOT EXISTS goals (
  id TEXT PRIMARY KEY,               -- ULID
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
  id TEXT PRIMARY KEY,               -- stable ID
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
  id TEXT PRIMARY KEY,               -- ULID
  user_id TEXT NOT NULL,
  achievement_id TEXT NOT NULL,
  unlocked_at INTEGER NOT NULL,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (achievement_id) REFERENCES achievement_definitions(id)
);

-- 9. SYSTEM SETTINGS (Feature flags, content configs)
CREATE TABLE IF NOT EXISTS system_settings (
  id TEXT PRIMARY KEY,               -- ULID
  key TEXT UNIQUE NOT NULL,
  value_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

-- 10. DHARMA QUOTES (Cultivation)
CREATE TABLE IF NOT EXISTS dharma_quotes (
  id TEXT PRIMARY KEY,               -- ULID
  content TEXT NOT NULL,
  author TEXT,
  source TEXT,

  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- 11. JOURNAL ENTRIES (Cultivation)
CREATE TABLE IF NOT EXISTS journal_entries (
  id TEXT PRIMARY KEY,               -- ULID
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,                -- 'repentance' | 'gratitude'
  content TEXT NOT NULL,
  emotion TEXT,
  is_private BOOLEAN DEFAULT 1,

  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_journal_user_type
ON journal_entries(user_id, type);

-- 12. RANDOM ACTS (Cultivation)
CREATE TABLE IF NOT EXISTS random_acts (
  id TEXT PRIMARY KEY,               -- ULID
  content TEXT NOT NULL,

  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
