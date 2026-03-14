# Backend Feature Rules Overview

## Authentication

- Backend exchanges identity provider token for internal session tokens.
- Backend owns access token and refresh token lifecycle.

## Deeds

- Update/delete operations must enforce ownership checks.
- If `performedAt` changes, goal-history periods are synchronized.

## Goals and Goal History

- At most one goal per user for each type (`weekly`, `monthly`, `yearly`).
- No retroactive creation of goal history for past periods.
- Goal history is updated when deeds are created/deleted.

## Reminders

- Reminder settings are user-level profile settings.
- Push subscriptions are tracked per user endpoint.
- Reminder test endpoint requires enabled reminders and valid subscriptions.

## Journal

- Journal entries are private and user-scoped.
- Delete is allowed only within 15 minutes after creation.
- Supported types: `repentance`, `gratitude`.

## Cultivation

- Quotes and acts are randomly served from seeded data.
- Current endpoints are public-read (no auth required).

## Stats and Activities

- Calculations are timezone-aware per user.
- Calendar/streak derive from recorded deeds.
