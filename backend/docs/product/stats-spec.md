# Backend Stats Spec

## Purpose

Define backend behavior for user activity statistics and streak tracking.

## Scope

- `GET /stats/summary`
- `GET /activities/calendar`
- `GET /activities/streak`

## Business Rules

- all stats are user-scoped and private
- stats are computed from the requesting user's deeds only
- no cross-user aggregation or comparison
- `summary` returns aggregate deed counts for the current period
- `calendar` returns per-day activity counts for heatmap display
- `streak` returns current and best consecutive active-day counts

## Error Rules

- unauthenticated requests -> `401`
- unexpected backend failure -> `500`
