# API Reference

Base URL: `/api/v1`

## Response Envelope

Success:

```json
{ "success": true, "data": {}, "error": null }
```

Error:

```json
{
  "success": false,
  "data": null,
  "error": { "code": "BAD_REQUEST", "message": "..." }
}
```

## Auth

- `POST /auth/provider/exchange`
- `POST /auth/refresh`
- `POST /auth/logout`

## Users

- `GET /users/me`
- `PATCH /users/me`
- `DELETE /users/me`

## Categories

- `GET /categories`

## Deeds

- `GET /deeds` with `limit`, `cursor`, optional `from`/`to`
- `POST /deeds`
- `PUT /deeds/:id`
- `DELETE /deeds/:id`

Pagination cursor format: `<performedAt>_<id>`

## Goals

- `GET /goals`
- `POST /goals` (single or batch payload)
- `GET /goals/history` with `limit`, `cursor`, optional `type`

History cursor format: `<startDate>_<id>`

## Stats and Activities

- `GET /stats/summary`
- `GET /activities/calendar`
- `GET /activities/streak`

## Reminders

- `GET /reminders/settings`
- `PUT /reminders/settings`
- `GET /reminders/push-key`
- `POST /reminders/subscriptions`
- `DELETE /reminders/subscriptions`
- `POST /reminders/test`

## Cultivation

- `GET /cultivation/quotes/random`
- `GET /cultivation/acts/random`
- `GET /cultivation/acts/random-list`

## Journal

- `GET /journal`
- `GET /journal/entries`
- `GET /journal/entries/:id`
- `POST /journal/entries`
- `DELETE /journal/entries/:id` (15-minute delete window)
- `POST /journal` (legacy-compatible alias)

## Common Error Codes

- `BAD_REQUEST`
- `VALIDATION_ERROR`
- `INVALID_REQUEST`
- `UNAUTHORIZED`
- `FORBIDDEN`
- `NOT_FOUND`
- `CONFLICT`
- `INTERNAL_ERROR`
