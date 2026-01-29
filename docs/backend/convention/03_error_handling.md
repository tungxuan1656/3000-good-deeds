# 03. Error Handling – Chuẩn xử lý lỗi Backend

## 1. Mục tiêu

Tài liệu này quy định cách **xử lý và trả lỗi thống nhất** cho backend dự án **3000 Việc Thiện**.

Mục tiêu:
- Frontend xử lý lỗi dễ dàng
- Backend debug nhanh
- Tránh trả lỗi tuỳ hứng

---

## 2. Nguyên tắc cốt lõi

- Lỗi có **mã lỗi (error code)** rõ ràng
- Message dành cho **con người đọc được**
- Không leak thông tin nội bộ

---

## 3. Cấu trúc response lỗi chuẩn

```json
{
  "error": {
    "code": "CHECKIN_ALREADY_DONE",
    "message": "You have already checked in today."
  }
}
```

---

## 4. Quy ước Error Code

### 4.1. Format

- `SCREAMING_SNAKE_CASE`
- Mang ý nghĩa nghiệp vụ

Ví dụ:
- `GOOD_DEED_NOT_FOUND`
- `CHECKIN_ALREADY_DONE`
- `GOAL_ALREADY_COMPLETED`

---

### 4.2. Không dùng

- Code mơ hồ: `ERROR_001`
- Code phụ thuộc UI

---

## 5. Mapping HTTP Status

| Trường hợp | Status |
|-----------|--------|
| Input sai | 400 |
| Chưa login | 401 |
| Không có quyền | 403 |
| Không tìm thấy | 404 |
| Trùng dữ liệu | 409 |
| Lỗi hệ thống | 500 |

---

## 6. Validation Error

Có thể trả chi tiết field:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "fields": {
      "title": "Title is required"
    }
  }
}
```

---

## 7. Logging (Backend only)

- Log đầy đủ stack trace
- Không trả stack trace cho client

---

## 8. Những điều cấm kỵ

- Trả plain text error
- Trả HTML error
- Trả message kỹ thuật (SQL, stacktrace)

---

## 9. Kết luận

Error handling tốt giúp:
- UX tốt hơn
- Debug nhanh hơn
- Hệ thống đáng tin cậy hơn

