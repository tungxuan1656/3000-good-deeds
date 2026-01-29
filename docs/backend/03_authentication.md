# C. Authentication

## 1. Chiến lược
- Không dùng Supabase Auth
- Auth do backend kiểm soát
- Đăng nhập Google OAuth 2.0 (Authorization Code)
- Session nội bộ bằng JWT + refresh token

## 2. User identity
- User được định danh bằng UUID
- Email là định danh phụ
- OAuth account liên kết qua `provider_user_id` (Google sub)

## 3. Token
- Access token (JWT, ngắn hạn)
- Refresh token (lưu DB)

## 4. Flow cơ bản (Google)
- Frontend lấy `code` từ Google
- Frontend gửi `code` lên backend `/auth/google`
- Backend đổi `code` → Google token, lấy profile
- Backend tạo/ghép user, phát hành JWT + refresh token
- Refresh token
- Logout (revoke refresh token)

## 5. Nguyên tắc
- Worker chỉ verify token
- DB không phụ thuộc auth provider
- Không lưu access token Google lâu dài

---

## 6. Lưu trữ & bảo mật

- Refresh token: lưu **hash** trong bảng `refresh_tokens`
- OAuth account: lưu `provider`, `provider_user_id`
- JWT expiry ngắn (15–30 phút), refresh token dài hơn (7–30 ngày)

---

## 7. Claims đề xuất (JWT)

- `sub`: user_id
- `email`
- `iat`, `exp`