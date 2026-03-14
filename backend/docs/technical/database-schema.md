# Database Schema (Cloudflare D1)

## User and Auth Tables

- `users`
- `identity_accounts`
- `refresh_tokens`

## Core Feature Tables

- `categories`
- `good_deeds`
- `goals`
- `goal_history`
- `push_subscriptions`
- `dharma_quotes`
- `journal_entries`
- `random_acts`

## Data Conventions

- IDs are string-based unique identifiers.
- DB uses `snake_case`.
- API maps values to `camelCase`.
- Timestamps are stored as Unix milliseconds.
