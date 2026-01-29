# API – Achievements

Base URL: `/api/v1`

---

## GET `/achievements`
List user achievements.

**Response (200)**
```json
{
  "data": [
    {
      "id": "ua_1",
      "achievementId": "achv_1",
      "unlockedAt": 1706500000000
    }
  ]
}
```

---

## GET `/achievements/definitions`
List achievement definitions.

**Response (200)**
```json
{
  "data": [
    {
      "id": "achv_1",
      "code": "STREAK_3",
      "title": "3 ngày đều đặn",
      "description": "Ghi nhận 3 ngày liên tiếp",
      "iconKey": "...",
      "orderIndex": 1,
      "isActive": true
    }
  ]
}
```
