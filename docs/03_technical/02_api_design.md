# 02. API DESIGN

## 1. Nguyên tắc chung
- Base URL: `/api/v1`
- Auth: `Authorization: Bearer <accessToken>` (trừ API auth)
- JSON only
- Response chuẩn:

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

Lỗi:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "BAD_REQUEST",
    "message": "..."
  }
}
```

---

## 2. Endpoints

### Auth
- `POST /auth/provider/exchange`: exchange Firebase `idToken` sang session token nội bộ.
- `POST /auth/refresh`: rotate access/refresh token.
- `POST /auth/logout`: revoke refresh token hiện tại.

### Users
- `GET /users/me`: lấy thông tin user + settings.
- `PATCH /users/me`: cập nhật displayName/bio/settings.

### Categories
- `GET /categories`

### Deeds
- `GET /deeds`
- `POST /deeds`
- `PATCH /deeds/:id`
- `DELETE /deeds/:id`

### Goals
- `GET /goals`
- `POST /goals`
- `GET /goals/history`

### Stats / Activities
- `GET /stats/summary`
- `GET /activities/calendar`
- `GET /activities/streak`

### Reminders
- `GET /reminders/settings`
- `PATCH /reminders/settings`
- `GET /reminders/push-key`
- `POST /reminders/subscriptions`
- `POST /reminders/test`

### Cultivation / Journal
- `GET /cultivation/quotes/random`
- `GET /cultivation/acts/random`
- `GET /cultivation/acts/random-list`
- `GET /journal`
- `POST /journal`
- `GET /journal/entries`
- `DELETE /journal/entries/:id`

---

## 3. Status Codes
- `200`: OK
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `409`: Conflict
- `500`: Internal Server Error
