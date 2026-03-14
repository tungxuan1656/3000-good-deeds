# 05. FIREBASE AUTH SETUP

Tài liệu này hướng dẫn cấu hình Firebase để chạy được các luồng:
- Email + Password
- Google Sign-In
- Forgot password (email reset)

## 1) Tạo Firebase project
1. Vào [Firebase Console](https://console.firebase.google.com/)
2. Create project mới.
3. Tạo web app và lấy Firebase config.

## 2) Bật Authentication providers
Trong Firebase Console > Authentication > Sign-in method:
- Bật `Email/Password`
- Bật `Google`

## 3) Cấu hình Authorized domains
Thêm domain:
- `localhost` (dev)
- domain production frontend (ví dụ `your-app.web.app`)

## 4) Lấy Firebase Web config cho frontend
Project settings > Your apps > SDK setup and configuration.

Điền vào `frontend/.env`:
```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
```

## 5) Cấu hình backend verify token
Điền `backend/.dev.vars`:
```env
FIREBASE_PROJECT_ID=...
JWT_SECRET=...
```

`FIREBASE_PROJECT_ID` phải trùng với frontend config (`VITE_FIREBASE_PROJECT_ID`).

## 6) Cấu hình template email reset password (khuyến nghị)
Authentication > Templates:
- Password reset
- Verify email (nếu muốn bật verify email flow)

## 7) Test local
1. Chạy backend + frontend local.
2. Test register/login email + password.
3. Test login Google.
4. Test forgot password.
