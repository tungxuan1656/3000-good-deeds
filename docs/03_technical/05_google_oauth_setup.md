# Hướng dẫn cấu hình Google OAuth

## 1. Tạo Google Cloud Project

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project có sẵn
3. Enable Google+ API:
   - Vào menu **APIs & Services** > **Library**
   - Tìm "Google+ API" và click Enable

## 2. Tạo OAuth 2.0 Client ID

1. Vào **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Nếu chưa có OAuth consent screen, tạo mới:
   - Chọn **External** user type
   - Điền tên ứng dụng: "3000 Việc Thiện"
   - Thêm email support
   - Thêm test users nếu cần
4. Sau khi có consent screen, tạo OAuth Client ID:
   - Application type: **Web application**
   - Name: "3000 Good Deeds Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:5173` (development)
     - `https://your-domain.com` (production)
   - Authorized redirect URIs:
     - `http://localhost:5173` (development)
     - `https://your-domain.com` (production)

## 3. Cấu hình Frontend

1. Copy file `.env.example` thành `.env`:
   ```bash
   cp .env.example .env
   ```

2. Cập nhật `.env` với Client ID từ Google:
   ```env
   VITE_API_URL=http://localhost:8787/api/v1
   VITE_GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
   ```

## 4. Cấu hình Backend

Backend cần có biến môi trường sau (trong `wrangler.toml` hoặc `.dev.vars`):

```toml
[vars]
GOOGLE_CLIENT_ID = "your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET = "your-client-secret"
```

Hoặc trong `.dev.vars`:
```
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

## 5. Kiểm tra hoạt động

1. Khởi động backend:
   ```bash
   cd backend
   npm run dev
   ```

2. Khởi động frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Truy cập `http://localhost:5173/login`
4. Click "Tiếp tục với Google"
5. Chọn tài khoản Google để đăng nhập

## Lưu ý

- Trong development mode, Google có thể hiển thị cảnh báo "This app isn't verified". Đây là bình thường khi app đang ở chế độ test.
- Để deploy production, cần verify app với Google.
- Không commit file `.env` vào git (đã có trong `.gitignore`).
