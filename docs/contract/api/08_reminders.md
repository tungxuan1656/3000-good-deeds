# API – Reminders

Base URL: `/api/v1`

---

## GET `/reminders/settings`
Get reminder settings for current user.

**Response (200)**
```json
{
  "reminderEnabled": true,
  "reminderTime": "20:00",
  "timezone": "Asia/Ho_Chi_Minh"
}
```

---

## PUT `/reminders/settings`
Update reminder settings.

**Request**
```json
{
  "reminderEnabled": true,
  "reminderTime": "20:00",
  "timezone": "Asia/Ho_Chi_Minh"
}
```

**Response (200)**
```json
{
  "success": true
}
```
