-- Migration number: 0002 2026-02-06T00:00:00.000Z
-- Add cursor paging index for Soul Journal (journal_entries)

CREATE INDEX IF NOT EXISTS idx_journal_entries_paging
ON journal_entries (user_id, created_at DESC, id DESC);
