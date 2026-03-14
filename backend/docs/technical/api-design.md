# API Design

## Core Principles

- Base URL: `/api/v1`
- Auth header: `Authorization: Bearer <accessToken>` (except auth endpoints)
- JSON-only API responses
- Consistent response envelope

Success envelope:

```json
{ "success": true, "data": {}, "error": null }
```

Error envelope:

```json
{
  "success": false,
  "data": null,
  "error": { "code": "BAD_REQUEST", "message": "..." }
}
```

## Endpoint Groups

- Auth
- Users
- Categories
- Deeds
- Goals
- Stats and Activities
- Reminders
- Cultivation and Journal

## Status Codes

- `200`, `201`, `400`, `401`, `403`, `404`, `409`, `500`
