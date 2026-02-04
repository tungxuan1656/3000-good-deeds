
ALTER TABLE good_deeds ADD COLUMN local_date TEXT;
CREATE INDEX IF NOT EXISTS idx_deeds_user_local_date
ON good_deeds(user_id, local_date);

UPDATE good_deeds
SET local_date = strftime('%Y-%m-%d', datetime(performed_at/1000, 'unixepoch', '+7 hours'))
WHERE local_date IS NULL;
