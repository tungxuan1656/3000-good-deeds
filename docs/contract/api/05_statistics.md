# API – Statistics

Base URL: `/api/v1`

---

## GET `/stats/summary`
Get aggregated stats for current user.

**Query Params**
- `from`: Timestamp
- `to`: Timestamp
- `timezone`: IANA string (optional)

**Response (200)**
```json
{
  "totalDeeds": 150,
  "currentStreak": 5,
  "longestStreak": 12,
  "byCategory": {
    "cat_body": 50,
    "cat_mind": 30
  },
  "last7Days": [2, 0, 1, 3, 5, 0, 0]
}
```
