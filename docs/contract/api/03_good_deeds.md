# API – Good Deeds

Base URL: `/api/v1`

---

## GET `/deeds`
Get history of deeds.

**Query Params**
- `from`: Timestamp
- `to`: Timestamp
- `limit`: default 20, max 100

**Response (200)**
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

---

## POST `/deeds`
Create a new good deed.

**Request**
```json
{
  "categoryId": "cat_body",
  "description": "Optional note",
  "performedAt": 1706500000000,
  "isPrivate": true
}
```

**Response (201)**
```json
{
  "id": "new_uuid"
}
```

---

## PUT `/deeds/:id`
Update a good deed.

**Request**
```json
{
  "description": "Updated note",
  "categoryId": "cat_mind",
  "isPrivate": true
}
```

---

## DELETE `/deeds/:id`
Delete a good deed.

**Response (204)**