-- Migration number: 0003 2026-02-04T00:00:00.000Z
-- Add local_date column to good_deeds

ALTER TABLE good_deeds ADD COLUMN local_date TEXT;

-- Backfill local_date using UTC date as fallback
UPDATE good_deeds
SET local_date = strftime('%Y-%m-%d', datetime(performed_at/1000, 'unixepoch', '+7 hours'))
WHERE local_date IS NULL;
