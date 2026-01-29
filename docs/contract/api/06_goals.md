# API – Goals

Base URL: `/api/v1`

---

## GET `/goals`
List goals (default: active only).

---

## POST `/goals`
Create a new goal.

**Request**
```json
{
  "title": "Mỗi ngày 1 việc thiện",
  "type": "daily",
  "targetCount": 1,
  "startDate": 1706500000000,
  "endDate": 1709000000000
}
```

**Response (201)**
```json
{
  "id": "goal_uuid"
}
```

---

## PUT `/goals/:id`
Update a goal.

---

## DELETE `/goals/:id`
Deactivate a goal (soft delete).
