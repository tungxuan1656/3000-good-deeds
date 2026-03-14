# 03. API REFERENCE

Base URL: `/api/v1`

## 1) Authentication

### `POST /auth/provider/exchange`
Exchange identity token từ provider sang session token của app.

Request:
```json
{
  "provider": "firebase",
  "idToken": "<firebase-id-token>"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "accessToken": "<jwt>",
    "refreshToken": "<opaque-token>",
    "expiresIn": 86400,
    "user": {
      "id": "01H...",
      "email": "user@example.com",
      "displayName": "Nguyen Van A",
      "bio": null,
      "reminderTime": null,
      "reminderEnabled": false,
      "timezone": "Asia/Ho_Chi_Minh",
      "themePreference": "system",
      "privacyMode": "private"
    }
  },
  "error": null
}
```

### `POST /auth/refresh`
Request:
```json
{
  "refreshToken": "<refresh-token>"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "accessToken": "<jwt>",
    "refreshToken": "<next-refresh-token>"
  },
  "error": null
}
```

### `POST /auth/logout`
Request:
```json
{
  "refreshToken": "<refresh-token>"
}
```

Response:
```json
{
  "success": true,
  "data": true,
  "error": null
}
```

---

## 2) Users

### `GET /users/me`
Lấy hồ sơ + settings hiện tại.

### `PATCH /users/me`
Request (partial):
```json
{
  "displayName": "Tên mới",
  "bio": "Mô tả ngắn",
  "reminderTime": "20:00",
  "reminderEnabled": true,
  "timezone": "Asia/Ho_Chi_Minh",
  "themePreference": "system",
  "privacyMode": "private"
}
```

---

## 3) Feature APIs
Các API nghiệp vụ (`deeds`, `goals`, `stats`, `activities`, `reminders`, `cultivation`, `journal`) giữ nguyên contract theo implementation hiện tại; bắt buộc Bearer token hợp lệ do backend cấp.

---

## 4) Error Codes thường gặp
- `BAD_REQUEST`
- `UNAUTHORIZED`
- `NOT_FOUND`
- `CONFLICT`
- `INTERNAL_ERROR`
