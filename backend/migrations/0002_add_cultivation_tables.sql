-- Migration number: 0002 	 2024-01-30T16:35:00.000Z

-- 10. DHARMA QUOTES (Cultivation)
CREATE TABLE IF NOT EXISTS dharma_quotes (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  author TEXT,                       -- e.g., 'Thich Nhat Hanh', 'Dhammapada'
  source TEXT,                       -- e.g., 'Book Title, Page 123'
  tags_json TEXT,                    -- JSON array of tags e.g. ["kindness", "mindfulness"]
  
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- 11. JOURNAL ENTRIES (Cultivation)
CREATE TABLE IF NOT EXISTS journal_entries (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,                -- 'repentance' | 'gratitude'
  content TEXT NOT NULL,
  emotion TEXT,                      -- optional: 'peaceful', 'anxious', etc.
  is_private BOOLEAN DEFAULT 1,      -- always private for now

  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_journal_user_type
ON journal_entries(user_id, type);
