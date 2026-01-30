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

### `PUT /users/me`
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
      "categoryId": "cat_body",
      "description": "Giúp bà cụ qua đường",
      "performedAt": 1706500000000,
      "createdAt": 1706500100000,
      "category": {
        "id": "cat_body",
        "name": "Thân thiện",
        "icon": "hand-heart",
        "color": "blue"
      }
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
  "categoryId": "cat_body", // (Required)
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

## 4. Cultivation (Tu tập)

### `GET /cultivation/quotes/daily`
Lấy pháp ngữ (quote) của ngày hôm nay.

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
Lấy mục tiêu hiện tại.

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "g_1",
      "type": "daily",
      "targetCount": 3,
      "status": "active",
      "startDate": 1706500000000
    }
  ]
}
```

### `POST /goals`
Tạo/Cập nhật mục tiêu.

**Request Body:**
```json
{
  "type": "daily",
  "targetCount": 3
}
```

---

## 6. Common Error Codes

| Code              | Message               | Description                       |
| :---------------- | :-------------------- | :-------------------------------- |
| `INVALID_REQUEST` | Invalid input...      | Dữ liệu đầu vào không hợp lệ      |
| `UNAUTHORIZED`    | Token missing/invalid | Chưa đăng nhập hoặc token hết hạn |
| `NOT_FOUND`       | Resource not found    | Không tìm thấy ID tương ứng       |
| `INTERNAL_ERROR`  | Server error          | Lỗi hệ thống                      |
