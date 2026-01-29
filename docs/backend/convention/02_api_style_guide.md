# 02. API Style Guide – Chuẩn thiết kế API

## 1. Mục tiêu

Tài liệu này định nghĩa **chuẩn thiết kế API** cho backend dự án **3000 Việc Thiện** nhằm:

- API dễ đoán, dễ dùng
- Tránh API "tự phát" theo từng dev
- Dễ mở rộng về sau (mobile, public API)

---

## 2. Nguyên tắc tổng quát

- RESTful
- Resource-based (danh từ, không phải động từ)
- Stateless
- Nhất quán toàn hệ thống

---

## 3. URL & Endpoint

### 3.1. Quy tắc chung

- Chữ thường
- Kebab-case
- Danh từ số nhiều

```
/api/good-deeds
/api/users
```

---

### 3.2. CRUD chuẩn

```
GET    /api/good-deeds
POST   /api/good-deeds
GET    /api/good-deeds/{id}
PUT    /api/good-deeds/{id}
DELETE /api/good-deeds/{id}
```

---

### 3.3. Hành động đặc biệt

Dùng **sub-resource**, không dùng động từ trong URL:

```
POST /api/good-deeds/{id}/checkin
GET  /api/users/{id}/stats
GET  /api/users/{id}/streak
```

❌ Tránh:
```
/api/checkinGoodDeed
/api/getUserStats
```

---

### 3.4. Query parameters

Query chỉ dùng để **lọc / tìm kiếm**:

```
GET /api/good-deeds?from=2026-01-01&to=2026-01-31
GET /api/good-deeds?category=body
```

---

## 4. HTTP Method

- `GET` – lấy dữ liệu
- `POST` – tạo mới / hành động
- `PUT` – cập nhật toàn bộ
- `PATCH` – cập nhật một phần (chỉ dùng khi cần)
- `DELETE` – xoá

---

## 5. Status Code

- `200 OK`
- `201 Created`
- `400 Bad Request`
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`
- `409 Conflict`
- `500 Internal Server Error`

---

## 6. Request & Response Format

### 6.1. JSON chuẩn

- `camelCase`
- Không dùng `snake_case`

```json
{
  "id": "gd_123",
  "title": "Giúp người già qua đường",
  "checkinDate": "2026-01-29"
}
```

---

### 6.2. Không trả thừa dữ liệu

- Không trả field frontend không dùng
- Không trả dữ liệu nhạy cảm

---

## 7. Versioning

- MVP: **chưa version**
- Khi public: `/api/v1/...`

---

## 8. Nguyên tắc mở rộng

- Thêm endpoint mới không phá endpoint cũ
- Không thay đổi response structure tuỳ tiện

---

## 9. Kết luận

API của dự án phải:
- Dễ đọc
- Dễ đoán
- Phản ánh đúng nghiệp vụ

