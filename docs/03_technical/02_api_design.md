# 02. API DESIGN & REFERENCE

## 1. Nguyên tắc chung (Principles)
*   **Base URL:** `/api/v1`
*   **Auth:** Bearer Token (JWT).
*   **Response Format:**
    ```json
    {
      "success": true,
      "data": { ... },
      "error": null
    }
    ```
*   **Error Format:**
    ```json
    {
      "success": false,
      "data": null,
      "error": { "code": "VALIDATION_ERROR", "message": "..." }
    }
    ```

---

## 2. Danh sách Endpoints

### Auth
*   `POST /auth/google` - Đăng nhập bằng Google Code.
*   `POST /auth/logout` - Đăng xuất.

### Users
*   `GET /users/me` - Lấy profile & settings.
*   `PUT /users/me` - Cập nhật profile.

### Deeds (Cốt lõi)
*   `GET /deeds` - Lấy danh sách (hỗ trợ filter date).
*   `POST /deeds` - Thêm mới.
*   `DELETE /deeds/:id` - Xóa.

### Cultivation (Tu tập)
*   `GET /cultivation/quotes/daily` - Lấy pháp ngữ hôm nay.
*   `GET /cultivation/acts/random` - Gợi ý việc thiện.
*   `GET /journal` - Lấy danh sách nhật ký.
*   `POST /journal` - Viết nhật ký.

### Gamification
*   `GET /stats/summary` - Lấy thống kê tổng hợp.
*   `GET /achievements` - Lấy danh sách huy hiệu.

---

## 3. Status Codes
*   `200`: OK
*   `201`: Created (khi tạo deed/journal)
*   `400`: Bad Request (Thiếu field, sai format)
*   `401`: Unauthorized (Token hết hạn/thiếu)
*   `500`: Server Error
