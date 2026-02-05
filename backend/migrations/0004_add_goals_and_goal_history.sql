-- Migration: Add goals and goal_history tables
-- Date: 2026-02-05
-- Description: Add support for user goals (weekly/monthly/yearly/milestone) and goal history tracking

-- ============================================
-- 1. Add local_week, local_month, local_year to good_deeds
-- ============================================
ALTER TABLE good_deeds ADD COLUMN local_week TEXT;
ALTER TABLE good_deeds ADD COLUMN local_month TEXT;
ALTER TABLE good_deeds ADD COLUMN local_year TEXT;

-- Backfill existing records (assuming Asia/Ho_Chi_Minh timezone for existing data)
UPDATE good_deeds 
SET 
  local_week = strftime('%Y-W%W', datetime(performed_at / 1000, 'unixepoch', '+7 hours')),
  local_month = strftime('%Y-%m', datetime(performed_at / 1000, 'unixepoch', '+7 hours')),
  local_year = strftime('%Y', datetime(performed_at / 1000, 'unixepoch', '+7 hours'))
WHERE local_week IS NULL OR local_month IS NULL OR local_year IS NULL;

-- ============================================
-- 2. Create goals table
-- ============================================
CREATE TABLE IF NOT EXISTS goals (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('weekly', 'monthly', 'yearly', 'milestone')),
  target_count INTEGER NOT NULL CHECK (target_count > 0),
  is_enabled BOOLEAN NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE (user_id, type)
);

CREATE INDEX IF NOT EXISTS idx_goals_user_enabled ON goals(user_id, is_enabled);

-- ============================================
-- 3. Create goal_history table
-- ============================================
CREATE TABLE IF NOT EXISTS goal_history (
  id TEXT PRIMARY KEY,
  goal_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('weekly', 'monthly', 'yearly', 'milestone')),
  period_time TEXT NOT NULL,
  target_count INTEGER NOT NULL CHECK (target_count > 0),
  actual_count INTEGER NOT NULL DEFAULT 0,
  start_date INTEGER NOT NULL,
  end_date INTEGER,
  completed BOOLEAN NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  
  FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE (user_id, type, period_time)
);

CREATE INDEX IF NOT EXISTS idx_goal_history_user_type ON goal_history(user_id, type);
CREATE INDEX IF NOT EXISTS idx_goal_history_goal_period ON goal_history(goal_id, period_time);
