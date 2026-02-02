# 01. DATABASE SCHEMA (Cloudflare D1)

Tài liệu này phản ánh chính xác cấu trúc CSDL đang chạy trên hệ thống (Synced with `migrations/`).

## 1. Users & Auth

### `users`
Bảng người dùng trung tâm.
| Column                | Type          | Description                         |
| :-------------------- | :------------ | :---------------------------------- |
| **id**                | TEXT (PK)     | UUID v4                             |
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
| **id**               | TEXT (PK) | UUID                    |
| **user_id**          | TEXT (FK) | Reference `users.id`    |
| **provider**         | TEXT      | 'google'                |
| **provider_user_id** | TEXT      | Google Subject ID (sub) |
| **provider_email**   | TEXT      | Email từ provider       |

### `refresh_tokens`
Quản lý phiên đăng nhập dài hạn.
| Column         | Type      | Description            |
| :------------- | :-------- | :--------------------- |
| **id**         | TEXT (PK) | UUID                   |
| **user_id**    | TEXT (FK) | Reference `users.id`   |
| **token_hash** | TEXT      | Hash của refresh token |
| **expires_at** | INTEGER   | Thời điểm hết hạn      |
| **revoked_at** | INTEGER   | Thời điểm hủy (nếu có) |

---

## 2. Core Features (Good Deeds)

### `categories`
Danh mục việc thiện (System managed).
| Column          | Type          | Description                             |
| :-------------- | :------------ | :-------------------------------------- |
| **id**          | TEXT (PK)     | UUID                                    |
| **key**         | TEXT (Unique) | Mã định danh ('body', 'speech', 'mind') |
| **name**        | TEXT          | Tên hiển thị (Tiếng Việt)               |
| **description** | TEXT          | Mô tả ngắn                              |
| **icon_key**    | TEXT          | Tên icon (Lucide)                       |
| **order_index** | INTEGER       | Thứ tự sắp xếp                          |
| **is_active**   | BOOLEAN       | 1 = Hiển thị                            |

### `good_deeds`
Bảng lưu trữ việc thiện.
| Column           | Type      | Description                   |
| :--------------- | :-------- | :---------------------------- |
| **id**           | TEXT (PK) | UUID                          |
| **user_id**      | TEXT (FK) | Reference `users.id`          |
| **category_id**  | TEXT (FK) | Reference `categories.id`     |
| **description**  | TEXT      | Ghi chú người dùng            |
| **performed_at** | INTEGER   | Thời điểm thực hiện hành động |
| **is_private**   | BOOLEAN   | Luôn là 1 (Private) trong MVP |

---

## 3. Goals & Gamification

### `goals`
Mục tiêu cá nhân.
| Column           | Type      | Description                      |
| :--------------- | :-------- | :------------------------------- |
| **id**           | TEXT (PK) | UUID                             |
| **user_id**      | TEXT (FK) | Reference `users.id`             |
| **type**         | TEXT      | 'daily' \| 'weekly' \| 'monthly' |
| **target_count** | INTEGER   | Số lượng việc thiện mục tiêu     |
| **start_date**   | INTEGER   | Ngày bắt đầu                     |
| **end_date**     | INTEGER   | Ngày kết thúc                    |
| **is_active**    | BOOLEAN   | 1 = Đang chạy                    |

### `achievement_definitions`
Định nghĩa huy hiệu.
| Column             | Type          | Description                   |
| :----------------- | :------------ | :---------------------------- |
| **id**             | TEXT (PK)     | UUID                          |
| **code**           | TEXT (Unique) | Mã ('STREAK_3', 'FIRST_DEED') |
| **title**          | TEXT          | Tên huy hiệu                  |
| **condition_json** | TEXT          | Cấu hình điều kiện (JSON)     |

### `user_achievements`
Huy hiệu người dùng đã đạt.
| Column             | Type      | Description                            |
| :----------------- | :-------- | :------------------------------------- |
| **id**             | TEXT (PK) | UUID                                   |
| **user_id**        | TEXT (FK) | Reference `users.id`                   |
| **achievement_id** | TEXT (FK) | Reference `achievement_definitions.id` |
| **unlocked_at**    | INTEGER   | Thời điểm mở khóa                      |

---

## 4. Cultivation Tools (Giai đoạn 2.5)

### `dharma_quotes`
Pháp ngữ mỗi ngày.
| Column      | Type      | Description      |
| :---------- | :-------- | :--------------- |
| **id**      | TEXT (PK) | UUID             |
| **content** | TEXT      | Nội dung câu nói |
| **author**  | TEXT      | Tác giả          |
| **source**  | TEXT      | Nguồn gốc        |

### `journal_entries`
Nhật ký tu tập.
| Column         | Type      | Description                                     |
| :------------- | :-------- | :---------------------------------------------- |
| **id**         | TEXT (PK) | UUID                                            |
| **user_id**    | TEXT (FK) | Reference `users.id`                            |
| **type**       | TEXT      | 'repentance' (Sám hối) \| 'gratitude' (Biết ơn) |
| **content**    | TEXT      | Nội dung nhật ký                                |
| **emotion**    | TEXT      | Cảm xúc (Optional)                              |
| **is_private** | BOOLEAN   | Luôn là 1 (Private)                             |

---
*Lưu ý: Tất cả thời gian lưu dưới dạng INTEGER (Unix Timestamp Milliseconds).*
