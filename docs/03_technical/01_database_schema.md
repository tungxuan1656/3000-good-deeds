# 01. DATABASE SCHEMA (Cloudflare D1)

Tài liệu này phản ánh chính xác cấu trúc CSDL đang chạy trên hệ thống (Synced with `migrations/`).

## 1. Users & Auth

### `users`
Bảng người dùng trung tâm.
| Column                | Type          | Description                         |
| :-------------------- | :------------ | :---------------------------------- |
| **id**                | TEXT (PK)     | ULID                                |
| **email**             | TEXT (Unique) | Email đăng nhập                     |
| **display_name**      | TEXT          | Tên hiển thị                        |
| **avatar_url**        | TEXT          | URL ảnh đại diện                    |
| **bio**               | TEXT          | Giới thiệu ngắn về bản thân         |
| **email_verified_at** | INTEGER       | Thời điểm xác thực email            |
| **privacy_mode**      | TEXT          | 'private' (Mặc định) hoặc 'limited' |
| *created_at*          | INTEGER       | Unix Timestamp                      |
| *updated_at*          | INTEGER       | Unix Timestamp                      |

**Extended Profile (Nullable):**
- `age_range`: Độ tuổi
- `location`: Địa điểm
- `buddhism_level`: Trình độ/Sự quan tâm tới Phật pháp

**Settings (Tích hợp sẵn):**
- `reminder_time`: Giờ nhắc nhở (HH:mm)
- `reminder_enabled`: Có bật nhắc nhở không (0/1)
- `timezone`: Múi giờ (Default: 'Asia/Ho_Chi_Minh')
- `theme_preference`: 'light' \| 'dark' \| 'system'
- `notification_on`: Bật/tắt thông báo chung
- `last_reminder_sent_at`: Thời điểm gửi noti cuối cùng

### `oauth_accounts`
Liên kết tài khoản Google.
| Column               | Type      | Description             |
| :------------------- | :-------- | :---------------------- |
| **id**               | TEXT (PK) | ULID                    |
| **user_id**          | TEXT (FK) | Reference `users.id`    |
| **provider**         | TEXT      | 'google'                |
| **provider_user_id** | TEXT      | Google Subject ID (sub) |
| **provider_email**   | TEXT      | Email từ provider       |

### `refresh_tokens`
Quản lý phiên đăng nhập dài hạn.
| Column         | Type      | Description            |
| :------------- | :-------- | :--------------------- |
| **id**         | TEXT (PK) | ULID                   |
| **user_id**    | TEXT (FK) | Reference `users.id`   |
| **token_hash** | TEXT      | Hash của refresh token |
| **expires_at** | INTEGER   | Thời điểm hết hạn      |
| **revoked_at** | INTEGER   | Thời điểm hủy (nếu có) |

---

## 2. Core Features (Good Deeds)

### `categories`
Danh mục việc thiện (System managed).
| Column          | Type      | Description                             |
| :-------------- | :-------- | :-------------------------------------- |
| **code**        | TEXT (PK) | Mã định danh ('body', 'speech', 'mind') |
| **name**        | TEXT      | Tên hiển thị (Tiếng Việt)               |
| **description** | TEXT      | Mô tả ngắn                              |
| **icon**        | TEXT      | URL icon                                |
| **style**       | TEXT      | className string                        |
| **order_index** | INTEGER   | Thứ tự sắp xếp                          |
| **is_active**   | BOOLEAN   | 1 = Hiển thị                            |

### `good_deeds`
Bảng lưu trữ việc thiện.
| Column            | Type      | Description                   |
| :---------------- | :-------- | :---------------------------- |
| **id**            | TEXT (PK) | ULID                          |
| **user_id**       | TEXT (FK) | Reference `users.id`          |
| **category_code** | TEXT (FK) | Reference `categories.code`   |
| **description**   | TEXT      | Ghi chú người dùng            |
| **performed_at**  | INTEGER   | Thời điểm thực hiện hành động |
| **is_private**    | BOOLEAN   | Luôn là 1 (Private) trong MVP |
| **local_date**    | TEXT      | Ngày cục bộ (YYYY-MM-DD)      |
| **local_week**    | TEXT      | Tuần cục bộ (YYYY-Www)        |
| **local_month**   | TEXT      | Tháng cục bộ (YYYY-MM)        |
| **local_year**    | TEXT      | Năm cục bộ (YYYY)             |

**Index:**
- `idx_deeds_user_local_date` on `(user_id, local_date)`

---

## 3. Goals & Gamification

### `goals`
Mục tiêu cá nhân hiện tại.
| Column           | Type      | Description                       |
| :--------------- | :-------- | :-------------------------------- |
| **id**           | TEXT (PK) | ULID                              |
| **user_id**      | TEXT (FK) | Reference `users.id`              |
| **type**         | TEXT      | 'weekly' \| 'monthly' \| 'yearly' |
| **target_count** | INTEGER   | Số lượng việc thiện mục tiêu      |
| **is_enabled**   | BOOLEAN   | 1 = Đang bật, 0 = Đã tắt          |
| *created_at*     | INTEGER   | Unix Timestamp                    |
| *updated_at*     | INTEGER   | Unix Timestamp                    |

**Constraints:**
- UNIQUE (`user_id`, `type`) - Mỗi loại mục tiêu chỉ có 1 active goal

### `goal_history`
Lịch sử tiến độ theo từng chu kỳ.
| Column           | Type      | Description                            |
| :--------------- | :-------- | :------------------------------------- |
| **id**           | TEXT (PK) | ULID                                   |
| **goal_id**      | TEXT (FK) | Reference `goals.id`                   |
| **user_id**      | TEXT (FK) | Reference `users.id`                   |
| **type**         | TEXT      | 'weekly' \| 'monthly' \| 'yearly'      |
| **period_time**  | TEXT      | Chu kỳ ('2026-W05', '2026-02', '2026') |
| **target_count** | INTEGER   | Mục tiêu tại thời điểm đó              |
| **actual_count** | INTEGER   | Số việc thiện thực tế đạt được         |
| **start_date**   | INTEGER   | Timestamp bắt đầu chu kỳ               |
| **end_date**     | INTEGER   | Timestamp kết thúc                     |
| **completed**    | BOOLEAN   | 1 = Đã đạt target                      |
| *created_at*     | INTEGER   | Unix Timestamp                         |
| *updated_at*     | INTEGER   | Unix Timestamp                         |

**Constraints:**
- UNIQUE (`user_id`, `type`, `period_time`) - Một chu kỳ chỉ có 1 bản ghi

## 4. Cultivation Tools (Giai đoạn 2.5)

### `dharma_quotes`
Pháp ngữ (cache theo phiên ở client).
| Column      | Type      | Description      |
| :---------- | :-------- | :--------------- |
| **id**      | TEXT (PK) | ULID             |
| **content** | TEXT      | Nội dung câu nói |
| **author**  | TEXT      | Tác giả          |
| **source**  | TEXT      | Nguồn gốc        |

### `journal_entries`
Nhật ký tu tập.
| Column         | Type      | Description                                     |
| :------------- | :-------- | :---------------------------------------------- |
| **id**         | TEXT (PK) | ULID                                            |
| **user_id**    | TEXT (FK) | Reference `users.id`                            |
| **type**       | TEXT      | 'repentance' (Sám hối) \| 'gratitude' (Biết ơn) |
| **content**    | TEXT      | Nội dung nhật ký                                |
| **emotion**    | TEXT      | Cảm xúc (Optional)                              |
| **is_private** | BOOLEAN   | Luôn là 1 (Private)                             |

### `random_acts`
Gợi ý việc thiện ngẫu nhiên.
| Column       | Type      | Description                    |
| :----------- | :-------- | :----------------------------- |
| **id**       | TEXT (PK) | ULID                           |
| **category** | TEXT      | 'body' \| 'speech' \| 'mind'   |
| **name**     | TEXT      | Tên gợi ý ngắn                 |
| **detail**   | TEXT      | Mô tả chi tiết (Optional)      |
| **note**     | TEXT      | Gợi ý/ngữ cảnh thêm (Optional) |
| *created_at* | INTEGER   | Unix Timestamp                 |
| *updated_at* | INTEGER   | Unix Timestamp                 |

---
*Lưu ý: Tất cả thời gian lưu dưới dạng INTEGER (Unix Timestamp Milliseconds).*
