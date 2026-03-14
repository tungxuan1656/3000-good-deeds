# 04. HƯỚNG DẪN SETUP LOCAL (NEWCOMER FRIENDLY)

Mục tiêu: clone repo, điền env, chạy backend + frontend trên máy local.

## 1. Prerequisites
- Node.js >= 20
- pnpm >= 10
- Cloudflare Wrangler CLI (qua devDependency, không cần cài global)
- Firebase CLI (chỉ cần khi deploy frontend):
  ```bash
  npm i -g firebase-tools
  ```

## 2. Cài dependencies
```bash
pnpm install
```

## 3. Cấu hình Environment Variables

### 3.1 Backend: `backend/.dev.vars`
Tạo file từ mẫu:
```bash
cp backend/.dev.vars.example backend/.dev.vars
```

Biến bắt buộc:
- `FIREBASE_PROJECT_ID`: Firebase project id dùng để verify idToken
- `JWT_SECRET`: secret để ký access token

Biến cho reminders (nếu dùng):
- `VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `VAPID_SUBJECT`

### 3.2 Frontend: `frontend/.env`
Tạo file từ mẫu:
```bash
cp frontend/.env.example frontend/.env
```

Biến bắt buộc:
- `VITE_API_URL` (local: `http://localhost:8787/api/v1`)
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`

Biến tùy chọn:
- `VITE_SUPPORT_EMAIL`

## 4. Setup Database local
```bash
pnpm --filter backend migrate:local
```

(Optional) seed dữ liệu:
```bash
pnpm --filter backend seed:data
```

## 5. Chạy ứng dụng

### Cách 1: từ root (khuyến nghị)
```bash
# Terminal 1
pnpm dev:backend

# Terminal 2
pnpm dev:frontend
```

### Cách 2: chạy từng package
```bash
pnpm --filter backend dev
pnpm --filter frontend dev
```

## 6. Verify nhanh
1. Mở `http://localhost:5173`
2. Test 3 luồng auth:
   - Đăng ký email + password
   - Đăng nhập email + password
   - Đăng nhập Google
3. Vào app và gọi một API protected (ví dụ danh sách deeds)

## 7. Scripts thường dùng
```bash
pnpm --filter frontend lint
pnpm --filter backend lint
pnpm --filter frontend build
pnpm --filter backend check
pnpm --filter backend deploy
```

## 8. Tài liệu liên quan
- Auth implementation: [06_authentication_implementation.md](./06_authentication_implementation.md)
- Firebase config: [05_firebase_auth_setup.md](./05_firebase_auth_setup.md)
- Deploy production checklist: [08_production_deploy_checklist.md](./08_production_deploy_checklist.md)
