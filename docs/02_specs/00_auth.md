# 00. XÁC THỰC (AUTHENTICATION)

## 1. Tổng quan
Hệ thống dùng **Firebase Authentication** làm lớp xác thực danh tính (Identity Provider), hỗ trợ:
- Email + Password
- Google Sign-In

Backend **không phụ thuộc session Firebase**. Sau khi xác thực Firebase thành công, backend phát hành session riêng:
- `accessToken` (JWT ngắn hạn)
- `refreshToken` (token dài hạn)

Nguyên tắc:
- Provider-agnostic: có thể thêm provider khác trong tương lai.
- Không lưu mật khẩu người dùng trong database ứng dụng.
- Backend giữ quyền kiểm soát phiên API.

---

## 2. User Flows

### 2.1 Đăng ký (Email + Password)
1. Người dùng nhập email, mật khẩu, tên hiển thị ở frontend.
2. Frontend tạo tài khoản bằng Firebase Auth.
3. Frontend lấy `idToken` từ Firebase.
4. Frontend gọi `POST /api/v1/auth/provider/exchange`.
5. Backend verify token, tạo/link user, trả về `accessToken` + `refreshToken`.

### 2.2 Đăng nhập (Email + Password / Google)
1. Người dùng đăng nhập bằng Firebase Auth.
2. Frontend lấy `idToken`.
3. Frontend gọi `POST /api/v1/auth/provider/exchange`.
4. Backend trả session token nội bộ.

### 2.3 Quên mật khẩu
- Frontend gọi Firebase `sendPasswordResetEmail`.
- Email reset được gửi bởi Firebase template.

### 2.4 Đổi mật khẩu
- Chỉ áp dụng cho tài khoản provider `password`.
- Cần nhập mật khẩu hiện tại để re-auth trước khi đổi.

---

## 3. Technical Flow
1. Firebase xác thực user và cấp `idToken`.
2. Frontend gửi `{ provider: "firebase", idToken }` đến backend.
3. Backend verify JWT của Firebase (issuer, audience, exp, sub).
4. Backend upsert user + identity mapping.
5. Backend cấp `accessToken`/`refreshToken` cho API app.
6. Frontend lưu token nội bộ, dùng Bearer cho toàn bộ API protected.

---

## 4. Session Management
- **Access Token:** TTL 24 giờ.
- **Refresh Token:** TTL 30 ngày, lưu dạng hash trong DB.
- Khi access token hết hạn: frontend gọi `/auth/refresh`.
- Khi refresh token không hợp lệ/hết hạn: logout và yêu cầu đăng nhập lại.

---

## 5. Mở rộng trong tương lai
- Thêm provider mới (Apple/Facebook/custom email service) bằng cách mở rộng lớp provider adapter.
- Có thể thay Firebase mà không đổi contract session của backend.
