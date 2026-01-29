# 05. API SPECIFICATION (REST)

## 1. General Principles

- **Base URL**: `/api/v1`
- **Content-Type**: `application/json`
- **Auth Header**: `Authorization: Bearer <token>`
- **Date Format**: Unix Timestamp (Milliseconds)
- **Naming**: API uses camelCase, DB uses snake_case

---

## 2. Authentication

### POST `/auth/google`
Exchange Google authorization code for internal session.

**Request:**
```json
{
  "code": "google_authorization_code",
  "redirectUri": "https://app.domain/auth/google/callback"
}
```

**Response (200 OK):**
```json
{
  "accessToken": "jwt_token_string",
  "refreshToken": "refresh_token_string",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "displayName": "Nguyen Van A",
    "avatarUrl": "..."
  }
}
```

### POST `/auth/refresh`
Refresh access token using refresh token.

**Request:**
```json
{
  "refreshToken": "refresh_token_string"
}
```

**Response (200 OK):**
```json
{
  "accessToken": "new_jwt_token_string"
}
```

### POST `/auth/logout`
Revoke refresh token.

**Request:**
```json
{
  "refreshToken": "refresh_token_string"
}
```

---

## 3. User Profile

### GET `/users/me`
Get current user profile and settings.

**Response:**
```json
{
  "id": "uuid",
  "email": "...",
  "display_name": "...",
  "settings": {
    "reminderTime": "20:00",
    "reminderEnabled": true,
    "timezone": "Asia/Ho_Chi_Minh",
    "themePreference": "system",
    "notificationOn": true
  },
  "privacyMode": "private"
}
```

### PUT `/users/me`
Update profile or settings.

**Request:**
```json
{
  "display_name": "New Name",
  "settings": {
    "reminderTime": "21:00",
    "timezone": "Asia/Ho_Chi_Minh"
  },
  "privacyMode": "private"
}
```

---

## 4. Good Deeds (Core)

### GET `/deeds`
Get history of deeds.

**Query Params:**
- `from`: Timestamp (start date)
- `to`: Timestamp (end date)
- `limit`: Number await (default 20, max 100)

**Response:**
```json
{
  "data": [
    {
      "id": "deed_1",
      "categoryId": "cat_body",
      "description": "Helped neighbor",
      "performedAt": 1706500000000,
      "isPrivate": true,
      "category": {
        "name": "Thân thiện",
        "iconKey": "hand-heart"
      }
    }
  ],
  "meta": {
    "total": 50
  }
}
```

### POST `/deeds`
Log a new good deed.

**Request:**
```json
{
  "categoryId": "cat_body",
  "description": "Optional note",
  "performedAt": 1706500000000,
  "isPrivate": true
}
```

**Response (201 Created):**
```json
{
  "id": "new_uuid",
  ...
}
```

### PUT `/deeds/:id`
**Request:**
```json
{
  "description": "Updated note",
  "categoryId": "cat_mind",
  "isPrivate": true
}
```

### DELETE `/deeds/:id`
**Response (204 No Content)**

---

## 5. Statistics

### GET `/stats/summary`
Get aggregated stats for the user.

**Query Params:**
- `from`: Timestamp
- `to`: Timestamp
- `timezone`: IANA string (optional)

**Response:**
```json
{
  "total_deeds": 150,
  "current_streak": 5,
  "longest_streak": 12,
  "by_category": {
    "cat_body": 50,
    "cat_mind": 30
  },
  "this_week": [2, 0, 1, 3, 5, 0, 0] // Array of counts for last 7 days
}
```

---

## 6. Goals

### GET `/goals`
List goals (default: active only).

### POST `/goals`
**Request:**
```json
{
  "title": "Mỗi ngày 1 việc thiện",
  "type": "daily",
  "targetCount": 1,
  "startDate": 1706500000000,
  "endDate": 1709000000000
}
```

### PUT `/goals/:id`
Update a goal.

### DELETE `/goals/:id`
Deactivate a goal (soft delete).

---

## 7. Achievements

### GET `/achievements`
List user achievements.

### GET `/achievements/definitions`
List achievement definitions.

---

## 8. Reminders

### GET `/reminders/settings`
Get reminder settings for current user.

### PUT `/reminders/settings`
Update reminder settings.

**Request:**
```json
{
  "reminderEnabled": true,
  "reminderTime": "20:00",
  "timezone": "Asia/Ho_Chi_Minh"
}
```

---

## 9. Metadata

### GET `/categories`
Get list of available categories.

**Response:**
```json
[
  {
    "id": "cat_body",
    "key": "body",
    "name": "Thân thiện",
    "iconKey": "hand-heart",
    "description": "...",
    "orderIndex": 1,
    "isActive": true,
    "isSystemDefault": true
  },
  ...
]
```
