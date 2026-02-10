# Tính năng Đăng nhập với Google

## Tổng quan

Ứng dụng **3000 Việc Thiện** sử dụng Google Sign-In để xác thực người dùng một cách an toàn và tiện lợi.

## Các file đã thay đổi

### Frontend

1. **`frontend/src/stores/auth-store.ts`**
   - Store quản lý trạng thái đăng nhập
   - Lưu trữ user info, access token, và refresh token
   - Sử dụng zustand với persist middleware để lưu vào localStorage

2. **`frontend/src/api/client.ts`**
   - Axios client với interceptors
   - Tự động attach access token vào headers
   - Xử lý refresh token khi access token hết hạn
   - Redirect về login khi refresh token thất bại

3. **`frontend/src/api/auth.ts`**
   - API function để gọi backend endpoint `/auth/google`
   - Nhận authorization code từ Google và gửi đến backend

4. **`frontend/src/pages/login-page.tsx`**
   - UI trang đăng nhập
   - Tích hợp Google OAuth button
   - Xử lý login flow và error handling

5. **`frontend/src/routes/protected-route.tsx`**
   - Route wrapper để bảo vệ các trang cần đăng nhập
   - Redirect về `/login` nếu chưa authenticated

6. **`frontend/src/app.tsx`**
   - Wrap app với `GoogleOAuthProvider`
   - Cấu hình Client ID từ environment variable

## Flow hoạt động

```
1. User click "Tiếp tục với Google"
   ↓
2. Google OAuth popup hiện lên
   ↓
3. User chọn tài khoản Google
   ↓
4. Google trả về authorization code
   ↓
5. Frontend gửi code đến Backend API
   ↓
6. Backend trao đổi code với Google để lấy user info
   ↓
7. Backend tạo/cập nhật user trong database
   ↓
8. Backend tạo JWT access token & refresh token
   ↓
9. Frontend lưu tokens vào localStorage và auth store
   ↓
10. Redirect user đến home page
```

## Session Management

- **Access Token**: Hết hạn sau 24 giờ (cấu hình từ backend)
- **Refresh Token**: Hết hạn sau 6 tháng
- Khi access token hết hạn, client tự động sử dụng refresh token để lấy token mới
- Nếu refresh token cũng hết hạn, user cần đăng nhập lại

## Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8787/api/v1
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### Backend (wrangler.toml hoặc .dev.vars)
```env
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Cách sử dụng

### Sử dụng Auth Store

```typescript
import useAuthStore from '@/stores/auth-store'

function MyComponent() {
  const { isAuthenticated, user, logout } = useAuthStore()

  if (!isAuthenticated) {
    return <div>Please login</div>
  }

  return (
    <div>
      <p>Welcome {user?.displayName}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Gọi Protected API

```typescript
import { client } from '@/api/client'

// Client tự động attach token vào header
const response = await client.get('/deeds')
```

## Testing

### Local Development

1. Cấu hình Google OAuth (xem `05_google_oauth_setup.md`)
2. Khởi động backend: `cd backend && npm run dev`
3. Khởi động frontend: `cd frontend && npm run dev`
4. Truy cập `http://localhost:5173/login`
5. Test login flow

### Test Cases

- ✅ Login thành công với tài khoản Google
- ✅ Token được lưu vào localStorage
- ✅ Protected routes redirect về login khi chưa auth
- ✅ Access token tự động refresh khi hết hạn
- ✅ Logout xóa tokens và redirect về login
- ✅ Error handling khi Google OAuth thất bại

## Bảo mật

- Access token (24h) cân bằng giữa trải nghiệm và an toàn; vẫn cần cơ chế thu hồi/rotate khi cần
- Refresh token dài hạn nhưng chỉ dùng để lấy token mới
- Tokens lưu trong localStorage (trong production nên cân nhắc httpOnly cookie)
- Backend validate token với JWT secret
- Chỉ chấp nhận requests từ authorized origins

## Roadmap

Các cải tiến trong tương lai:

- [ ] Thêm biometric authentication (fingerprint, face ID)
- [ ] Social login khác (Facebook, Apple)
- [ ] Two-factor authentication (2FA)
- [ ] Session management (xem các device đã login)
- [ ] Logout from all devices
- [ ] Remember me option
