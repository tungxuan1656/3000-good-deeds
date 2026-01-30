# 12. API OVERVIEW – DANH SÁCH ENDPOINT

Base URL: `/api/v1`

---

## 1. Authentication (Google)
- `POST /auth/google`
- `POST /auth/refresh`
- `POST /auth/logout`

## 2. User & Settings
- `GET /users/me`
- `PUT /users/me`

## 3. Good Deeds
- `GET /deeds`
- `POST /deeds`
- `PUT /deeds/:id`
- `DELETE /deeds/:id`

## 4. Categories
- `GET /categories`

## 5. Statistics
- `GET /stats/summary`

## 6. Goals
- `GET /goals`
- `POST /goals`
- `PUT /goals/:id`
- `DELETE /goals/:id`

## 7. Achievements
- `GET /achievements`
- `GET /achievements/definitions`

## 8. Reminders
- `GET /reminders/settings`
- `PUT /reminders/settings`

## 9. Cultivation Tools
- `GET /quotes/daily`
- `GET /journal`
- `POST /journal`
- `GET /acts/random`
