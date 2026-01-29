# API – Users & Settings

Base URL: `/api/v1`

---

## GET `/users/me`
Get current user profile and settings.

**Response (200)**
```json
{
  "id": "uuid",
  "email": "...",
  "displayName": "...",
  "avatarUrl": "...",
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

---

## PUT `/users/me`
Update profile or settings.

**Request**
```json
{
  "displayName": "New Name",
  "avatarUrl": "...",
  "settings": {
    "reminderTime": "21:00",
    "timezone": "Asia/Ho_Chi_Minh"
  },
  "privacyMode": "private"
}
```

**Response (200)**
```json
{
  "success": true
}
```
