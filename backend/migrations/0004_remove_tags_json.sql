-- Migration number: 0004 	 2026-02-02T16:20:00.000Z

-- Remove tags_json from dharma_quotes
ALTER TABLE dharma_quotes DROP COLUMN tags_json;
