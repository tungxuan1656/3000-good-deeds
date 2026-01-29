# 11. DATABASE → FEATURE MAPPING

Tài liệu này mô tả **các bảng dữ liệu liên quan trực tiếp tới từng tính năng** để dev backend biết rõ dữ liệu nào phục vụ nghiệp vụ nào.

---

## 1. Auth & User Identity (Google OAuth)

**Bảng liên quan:**
- `users`: thông tin người dùng, settings, `email_verified_at`
- `oauth_accounts`: liên kết Google account
- `refresh_tokens`: duy trì phiên đăng nhập

**Nghiệp vụ:**
- Đăng nhập Google → tạo/ghép user
- Phát hành JWT + refresh token
- Logout → revoke refresh token

---

## 2. Check-in Việc thiện

**Bảng liên quan:**
- `good_deeds`
- `categories`

**Nghiệp vụ:**
- Tạo/sửa/xoá việc thiện
- Gắn danh mục
- Lọc theo khoảng thời gian

---

## 3. Phân loại việc thiện

**Bảng liên quan:**
- `categories`

**Nghiệp vụ:**
- Danh mục hệ thống (MVP)
- Bật/tắt danh mục (`is_active`)

---

## 4. Thống kê & Quan sát

**Bảng liên quan:**
- `good_deeds`
- `categories`

**Nghiệp vụ:**
- Tổng số việc thiện
- Streak theo ngày (derived từ `performed_at`)
- Thống kê theo danh mục

---

## 5. Mục tiêu (Goals)

**Bảng liên quan:**
- `goals`
- `good_deeds` (để tính tiến trình)

**Nghiệp vụ:**
- Tạo mục tiêu theo ngày/tuần/tháng
- Chỉ 1 mục tiêu active / loại
- Theo dõi tiến trình

---

## 6. Achievements (Ghi nhận)

**Bảng liên quan:**
- `achievement_definitions`
- `user_achievements`
- `good_deeds` (tính điều kiện)

**Nghiệp vụ:**
- Unlock theo streak hoặc milestone
- Mỗi achievement đạt 1 lần

---

## 7. Reminder

**Bảng liên quan:**
- `users` (settings)
- `good_deeds` (kiểm tra đã check-in chưa)

**Nghiệp vụ:**
- Nhắc 1 lần/ngày
- Dựa theo timezone + `reminder_time`
- Không gửi nếu đã check-in

---

## 8. System Config

**Bảng liên quan:**
- `system_settings`

**Nghiệp vụ:**
- Feature flags
- Danh sách nội dung nhắc nhở (future)
