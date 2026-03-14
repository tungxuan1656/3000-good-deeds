# 06. AUTHENTICATION IMPLEMENTATION

## 1. Mục tiêu
- Firebase xử lý xác thực user (email/password + Google).
- Backend giữ session model riêng (JWT access + refresh token).
- Có thể thay provider trong tương lai mà không thay API session.

## 2. Thành phần chính

### Frontend
- `frontend/src/lib/firebase.ts`: init Firebase app/auth.
- `frontend/src/hooks/auth/use-auth-provider.ts`: các action auth với Firebase.
- `frontend/src/pages/login-page.tsx`: UI login/register/forgot password + Google.
- `frontend/src/api/auth.ts`: gọi `/auth/provider/exchange`.
- `frontend/src/api/client.ts`: auto attach token + refresh interceptor.
- `frontend/src/stores/auth.store.ts`: lưu trạng thái session.

### Backend
- `backend/src/routes/auth.ts`: route auth (`provider/exchange`, `refresh`, `logout`).
- `backend/src/handlers/auth.ts`: verify Firebase idToken + issue session token.
- `backend/src/middlewares/auth.ts`: verify access token cho API protected.

## 3. Luồng đăng nhập
1. User đăng nhập với Firebase Auth.
2. Frontend lấy `idToken` từ Firebase.
3. Frontend gọi `POST /api/v1/auth/provider/exchange`.
4. Backend verify token Firebase.
5. Backend upsert user + identity account.
6. Backend trả `accessToken` + `refreshToken`.
7. Frontend lưu token và truy cập API protected.

## 4. Luồng refresh token
1. API trả `401` do access token hết hạn.
2. Axios interceptor gọi `POST /auth/refresh` với refresh token.
3. Backend rotate refresh token và trả token mới.
4. Frontend retry request cũ.

## 5. Luồng logout
1. Frontend gọi `/auth/logout` (best effort).
2. Frontend clear store/token local.
3. Frontend signOut Firebase.

## 6. Security notes
- Refresh token lưu dạng hash trong DB.
- Backend không lưu password user.
- Secrets bắt buộc: `JWT_SECRET`, `FIREBASE_PROJECT_ID`.
- Token verification yêu cầu đúng issuer + audience.
