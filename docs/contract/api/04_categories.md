# API – Categories

Base URL: `/api/v1`

---

## GET `/categories`
Get list of available categories.

**Response (200)**
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
  }
]
```
