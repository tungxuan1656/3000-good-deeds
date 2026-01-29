# 10. AUTHENTICATION – GOOGLE OAUTH

## 1. Mục tiêu tài liệu

Tài liệu này mô tả **luồng đăng nhập bằng Google (Google OAuth 2.0)** cho backend sử dụng **Cloudflare Workers + D1**, áp dụng cho giai đoạn MVP của ứng dụng **3000 Việc Thiện**.

Mục tiêu:
- Đăng nhập **không password**
- Giảm friction cho người dùng mới
- Thiết kế đủ chuẩn để mở rộng thêm Apple / Facebook sau này

---

## 2. Nguyên tắc cốt lõi

1. **Google đã xác thực email thay chúng ta** → không cần verify email lại
2. Backend **không tin frontend**, chỉ tin Google
3. **Không dùng email làm khoá định danh OAuth**
4. Google chỉ dùng để **xác minh danh tính**, không dùng làm session nội bộ

---

## 3. Kiến trúc tổng thể

```txt
User → Frontend → Google → Frontend → Worker → D1
```

Worker đóng vai trò:
- Đổi `authorization code` → token Google
- Lấy thông tin người dùng
- Tạo hoặc liên kết user nội bộ
- Phát hành session / JWT của hệ thống

---

## 4. Luồng chi tiết (Authorization Code Flow)

### 4.1. Frontend redirect sang Google

```txt
https://accounts.google.com/o/oauth2/v2/auth
  ?client_id=GOOGLE_CLIENT_ID
  &redirect_uri=GOOGLE_REDIRECT_URI
  &response_type=code
  &scope=openid email profile
  &state=RANDOM_STRING
```

- `state`: chống CSRF
- **Khuyến nghị** thêm `code_challenge` (PKCE) cho SPA
- Không dùng implicit flow (`response_type=token`)

---

### 4.2. Google redirect về Frontend

```txt
https://app.domain/auth/google/callback?code=XXX&state=YYY
```

Frontend **không xử lý Google**, chỉ forward `code` về backend.

---

### 4.3. Frontend gửi code cho Worker

```http
POST /auth/google
Content-Type: application/json

{
  "code": "XXX",
  "redirectUri": "https://app.domain/auth/google/callback"
}
```

---

## 5. Worker xử lý OAuth Google

### 5.1. Đổi code → access_token

Worker gọi Google Token API:

```ts
POST https://oauth2.googleapis.com/token
```

Payload:

```txt
client_id
client_secret
code
grant_type=authorization_code
redirect_uri
code_verifier (nếu dùng PKCE)
```

---

### 5.2. Lấy thông tin user từ Google

```ts
GET https://www.googleapis.com/oauth2/v3/userinfo
Authorization: Bearer ACCESS_TOKEN
```

Google trả về:

```json
{
  "sub": "10987654321",
  "email": "abc@gmail.com",
  "email_verified": true,
  "name": "Nguyen Van A",
  "picture": "..."
}
```

Giải thích:
- `sub`: **Google User ID** (ổn định, không đổi)
- `email_verified`: luôn true với Google

---

## 6. Thiết kế database (D1)

### 6.1. Bảng `users`

```sql
  users
  - id
  - email
  - display_name
  - avatar_url
  - email_verified_at
  - created_at
```

### 6.2. Bảng `oauth_accounts`

```sql
  oauth_accounts
  - id
  - user_id
  - provider            -- 'google'
  - provider_user_id    -- sub từ Google
  - provider_email
  - created_at
```

> Không dùng email làm khoá liên kết OAuth.

---

## 7. Logic tạo / liên kết user

```txt
IF tồn tại oauth_accounts(provider='google', provider_user_id=sub)
  → Login user tương ứng
ELSE
  IF tồn tại users.email = email Google
    → Gắn Google account vào user hiện có
  ELSE
    → Tạo user mới + oauth_account
```

Mục tiêu:
- Không tạo user trùng
- Cho phép 1 user có nhiều provider

---

## 8. Xử lý email_verified

Với Google login:

```txt
email_verified_at = NOW()
```

- Không gửi email xác nhận
- Không tạo token verify

---

## 9. Session sau đăng nhập

Sau khi xác thực Google thành công:

- Worker phát hành **JWT + refresh token** nội bộ
- Frontend chỉ dùng token này cho API

```txt
Google token = xác minh danh tính
Internal token = quyền truy cập hệ thống
```

Không lưu access_token Google lâu dài.

---

## 10. Các lỗi nghiêm trọng cần tránh

- Dùng email làm khoá OAuth
- Không lưu `provider_user_id`
- Frontend tự gọi Google API
- Tin dữ liệu frontend gửi lên
- Dùng implicit flow

---

## 11. Khuyến nghị cho MVP 3000 Việc Thiện

- Ưu tiên Google login cho onboarding
- Cho phép gắn thêm email/password sau
- Không ép người dùng xác minh phức tạp
- Giữ luồng đăng nhập **nhẹ – nhanh – không áp lực**

---

## 12. Mở rộng trong tương lai

- Apple Sign In
- Facebook Login
- Liên kết nhiều provider cho 1 user
- Thu hồi session theo provider

Thiết kế hiện tại đã sẵn sàng cho các mở rộng này.
