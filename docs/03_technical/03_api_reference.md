# 03. API CHI TIẾT (API REFERENCE)

Tài liệu này mô tả chi tiết các endpoints, bao gồm input, output, và các mã lỗi.

**Base URL:** `/api/v1`
**Authentication:** Header `Authorization: Bearer <jwt_token>` (Trừ các API Auth)

---

## 1. Authentication (Xác thực)

### `POST /auth/google`
Đăng nhập hoặc Đăng ký bằng Google OAuth.

**Request Body:**
```json
{
  "code": "4/0AeaYSH...", // Authorization Code từ Google Client
  "redirectUri": "https://..." // (Optional)
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "accessToken": "ey...", // JWT dùng để gọi API (Hết hạn 1h)
    "refreshToken": "ey...", // JWT dùng để cấp lại token (Hết hạn 30 ngày)
    "user": {
      "id": "u_123",
      "email": "user@example.com",
      "displayName": "Nguyen Van A",
      "avatarUrl": "https://..."
    },
    "expiresIn": 3600
  },
  "error": null
}
```

**Response (Error):**
-   `400`: `INVALID_REQUEST` (Thiếu code)
-   `401`: `AUTH_FAILED` (Google code không hợp lệ)

---

## 2. User Profile (Người dùng)

### `GET /users/me`
Lấy thông tin người dùng hiện tại và cài đặt.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "u_123",
    "email": "user@example.com",
    "displayName": "Nguyen Van A",
    "avatarUrl": "...",
    "bio": "...",
    "settings": {
      "reminderTime": "20:00",
      "reminderEnabled": true,
      "timezone": "Asia/Ho_Chi_Minh",
      "themePreference": "system", // 'light' | 'dark' | 'system'
      "privacyMode": "private"     // 'private' | 'limited'
    }
  },
  "error": null
}
```

### `PATCH /users/me`
Cập nhật thông tin profile hoặc settings.

**Request Body (Partial Update):**
```json
{
  "displayName": "New Name",
  "bio": "My bio",
  "settings": {
    "reminderEnabled": false
  }
}
```

---

## 3. Good Deeds (Việc thiện)

### `GET /deeds`
Lấy danh sách việc thiện đã làm.

**Query Parameters:**
-   `from` (number): Timestamp bắt đầu (Optional).
-   `to` (number): Timestamp kết thúc (Optional).
-   `limit` (number): Số lượng bản ghi (Default: 20, Max: 100).

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "d_1",
      "categoryCode": "body",
      "description": "Giúp bà cụ qua đường",
      "performedAt": 1706500000000,
      "createdAt": 1706500100000,
    }
  ],
  "error": null
}
```

### `POST /deeds`
Ghi nhận việc thiện mới.

**Request Body:**
```json
{
  "categoryCode": "body", // (Required)
  "description": "Ghi chú...", // (Optional)
  "performedAt": 1706500000000 // (Optional, Default: now)
}
```

### `DELETE /deeds/:id`
Xóa việc thiện.

**Response (200 OK):**
```json
{ "success": true, "data": { "deleted": true } }
```

---

## 3. Categories (Danh mục)

### `GET /categories`
Lấy danh mục việc thiện (system default).

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "code": "body",
      "name": "Thân thiện",
      "description": "Hành động cụ thể bằng thân",
      "icon": "/icons/icon_than.png",
      "style": "bg-body/20 hover:bg-body/40"
    }
  ],
  "error": null
}
```

---

## 4. Cultivation (Tu tập)

### `GET /cultivation/quotes/random`
Lấy pháp ngữ (quote) ngẫu nhiên.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "q1",
    "content": "Hãy tự mình thắp đuốc lên mà đi.",
    "author": "Đức Phật Thích Ca",
    "source": "Kinh Đại Bát Niết Bàn",
    "tagsJson": "[\"tự lực\", \"tinh tấn\"]"
  },
  "error": null
}
```

### `GET /cultivation/acts/random`
Lấy gợi ý một việc thiện ngẫu nhiên.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "content": "Nhắn tin hỏi thăm một người bạn cũ."
  },
  "error": null
}
```

### `GET /journal`
Lấy nhật ký Sám hối / Biết ơn.

**Query Parameters:**
-   `type`: `repentance` | `gratitude` (Optional)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "j_1",
      "type": "repentance",
      "content": "Hôm nay mình đã nóng giận...",
      "emotion": "sad",
      "createdAt": 1706500000000
    }
  ]
}
```

### `POST /journal`
Viết nhật ký mới (Không thể sửa/xóa sau khi viết).

**Request Body:**
```json
{
  "type": "repentance", // 'repentance' | 'gratitude'
  "content": "Nội dung nhật ký...",
  "emotion": "calm" // (Optional)
}
```

---

## 5. Goals & Stats (Mục tiêu & Thống kê)

### `GET /stats/summary`
Lấy thống kê tổng quan.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalDeeds": 150,
    "streakDays": 5, // Chuỗi ngày liên tục hiện tại
    "todayCount": 2  // Số việc đã làm hôm nay
  }
}
```

### `GET /goals`
Lấy tất cả mục tiêu hiện tại của user.

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "g_1",
      "type": "weekly",
      "targetCount": 21,
      "isEnabled": true,
      "currentProgress": {
        "periodTime": "2026-W05",
        "actualCount": 15,
        "completed": false
      },
      "createdAt": 1706500000000,
      "updatedAt": 1706500000000
    },
    {
      "id": "g_2",
      "type": "milestone",
      "targetCount": 3000,
      "isEnabled": true,
      "currentProgress": {
        "periodTime": "milestone_1",
        "actualCount": 150,
        "completed": false
      },
      "createdAt": 1706400000000,
      "updatedAt": 1706400000000
    }
  ]
}
```

### `POST /goals`
Tạo hoặc cập nhật mục tiêu.

**Request Body:**
```json
{
  "type": "weekly", // 'weekly' | 'monthly' | 'yearly' | 'milestone'
  "targetCount": 21,
  "isEnabled": true // (Optional, default: true)
}
```

**Response (201 Created / 200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "g_1",
    "type": "weekly",
    "targetCount": 21,
    "isEnabled": true,
    "createdAt": 1706500000000,
    "updatedAt": 1706500000000
  }
}
```

**Notes:**
- Tạo mục tiêu mới sẽ tự động tạo bản ghi `goal_history` cho chu kỳ hiện tại
- Nếu mục tiêu đã tồn tại (cùng user + type), sẽ update thay vì tạo mới

### `PATCH /goals/:id`
Cập nhật mục tiêu (target hoặc is_enabled).

**Request Body:**
```json
{
  "targetCount": 30,
  "isEnabled": false
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "g_1",
    "type": "weekly",
    "targetCount": 30,
    "isEnabled": false,
    "updatedAt": 1706510000000
  }
}
```

**Notes:**
- Thay đổi `targetCount` chỉ ảnh hưởng chu kỳ hiện tại và tương lai, không cập nhật lịch sử

### `DELETE /goals/:id`
Xóa mục tiêu vĩnh viễn (bao gồm cả lịch sử).

**Response (200 OK):**
```json
{
  "success": true,
  "data": { "deleted": true }
}
```

### `GET /goals/:id/history`
Lấy lịch sử tiến độ theo chu kỳ của một mục tiêu.

**Query Parameters:**
- `limit` (number): Số chu kỳ tối đa (Default: 10, Max: 50)
- `offset` (number): Bỏ qua số bản ghi đầu (Default: 0)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "gh_1",
      "goalId": "g_1",
      "type": "weekly",
      "periodTime": "2026-W05",
      "targetCount": 21,
      "actualCount": 15,
      "startDate": 1738540800000,
      "endDate": 1739145599999,
      "completed": false,
      "createdAt": 1738540800000,
      "updatedAt": 1738900000000
    },
    {
      "id": "gh_2",
      "goalId": "g_1",
      "type": "weekly",
      "periodTime": "2026-W04",
      "targetCount": 21,
      "actualCount": 21,
      "startDate": 1737936000000,
      "endDate": 1738540799999,
      "completed": true,
      "createdAt": 1737936000000,
      "updatedAt": 1738540000000
    }
  ],
  "pagination": {
    "total": 25,
    "limit": 10,
    "offset": 0
  }
}
```

**Notes:**
- History được sắp xếp theo `period_time` DESC (mới nhất trước)
- Milestone chỉ có 1 bản ghi history (period_time cố định)

---

## 6. Common Error Codes

| Code              | Message               | Description                       |
| :---------------- | :-------------------- | :-------------------------------- |
| `INVALID_REQUEST` | Invalid input...      | Dữ liệu đầu vào không hợp lệ      |
| `UNAUTHORIZED`    | Token missing/invalid | Chưa đăng nhập hoặc token hết hạn |
| `NOT_FOUND`       | Resource not found    | Không tìm thấy ID tương ứng       |
| `INTERNAL_ERROR`  | Server error          | Lỗi hệ thống                      |
