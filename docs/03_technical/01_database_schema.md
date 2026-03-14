# 01. DATABASE SCHEMA (Cloudflare D1)

Tài liệu này phản ánh schema hiện hành trong `backend/migrations/0001_initial_schema.sql`.

## 1. Users & Auth

### `users`
Bảng người dùng trung tâm.

| Column                | Type          | Description                           |
| :-------------------- | :------------ | :------------------------------------ |
| **id**                | TEXT (PK)     | ULID                                  |
| **email**             | TEXT (Unique) | Email đăng nhập                       |
| **display_name**      | TEXT          | Tên hiển thị                          |
| **bio**               | TEXT          | Mô tả ngắn (optional)                 |
| **email_verified_at** | INTEGER       | Timestamp xác thực email (optional)   |
| **privacy_mode**      | TEXT          | `private` (default) hoặc `limited`    |
| *created_at*          | INTEGER       | Unix timestamp (ms)                   |
| *updated_at*          | INTEGER       | Unix timestamp (ms)                   |

Ghi chú:
- **Không dùng avatar** ở schema hiện tại.

### `identity_accounts`
Liên kết người dùng app với danh tính từ provider.

| Column               | Type      | Description                      |
| :------------------- | :-------- | :------------------------------- |
| **id**               | TEXT (PK) | ULID                             |
| **user_id**          | TEXT (FK) | Reference `users.id`             |
| **provider**         | TEXT      | Ví dụ: `firebase`                |
| **provider_user_id** | TEXT      | ID user từ provider (Firebase uid) |
| **provider_email**   | TEXT      | Email do provider trả về         |
| *created_at*         | INTEGER   | Unix timestamp (ms)              |
| *updated_at*         | INTEGER   | Unix timestamp (ms)              |

Index chính:
- Unique (`provider`, `provider_user_id`)

### `refresh_tokens`
Quản lý session dài hạn.

| Column         | Type      | Description                                  |
| :------------- | :-------- | :------------------------------------------- |
| **id**         | TEXT (PK) | ULID                                         |
| **user_id**    | TEXT (FK) | Reference `users.id`                         |
| **token_hash** | TEXT      | SHA-256 hash của refresh token               |
| **expires_at** | INTEGER   | Hạn dùng                                     |
| **revoked_at** | INTEGER   | Timestamp revoke (optional)                  |
| *created_at*   | INTEGER   | Unix timestamp (ms)                          |

---

## 2. Core Features

### `categories`
Danh mục việc thiện (system managed): `body`, `speech`, `mind`.

### `good_deeds`
Bảng chính ghi nhận việc thiện theo user + thời gian local (`local_date`, `local_week`, `local_month`, `local_year`).

### `goals`, `goal_history`
Mục tiêu định kỳ và lịch sử hoàn thành theo chu kỳ.

### `push_subscriptions`
Thông tin web push subscription cho reminders.

### `dharma_quotes`, `journal_entries`, `random_acts`
Dữ liệu cho nhóm tính năng tu tập.

---

## 3. Quy ước dữ liệu
- Timestamp: Unix milliseconds.
- DB dùng `snake_case`, API dùng `camelCase`.
- Không dùng `SELECT *` trong handler production.
