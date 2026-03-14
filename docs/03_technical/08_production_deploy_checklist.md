# 08. CHECKLIST DEPLOY PRODUCTION

Kiến trúc deploy:
- Backend: Cloudflare Workers + D1
- Frontend: Firebase Hosting
- Auth provider: Firebase Authentication

---

## A. Chuẩn bị (một lần)

### 1) Quyền truy cập
- [ ] Có quyền deploy Cloudflare Worker + D1.
- [ ] Có quyền Editor/Owner Firebase project.
- [ ] Đã cài và login CLI:
  - [ ] `wrangler login`
  - [ ] `firebase login`

### 2) Mapping môi trường
- [ ] Worker name đúng trong `backend/wrangler.json`.
- [ ] D1 `database_id` đúng trong `backend/wrangler.json`.
- [ ] Firebase project mặc định đúng trong `frontend/.firebaserc`.
- [ ] Firebase Hosting site đúng trong `frontend/firebase.json`.

---

## B. Environment Variables & Secrets

### 1) Backend (Cloudflare)
Bắt buộc:
- [ ] `FIREBASE_PROJECT_ID`
- [ ] `JWT_SECRET`

Theo tính năng reminders:
- [ ] `VAPID_PUBLIC_KEY`
- [ ] `VAPID_PRIVATE_KEY`
- [ ] `VAPID_SUBJECT`

Yêu cầu:
- [ ] Secrets nhạy cảm lưu bằng Cloudflare Secret, không commit repo.

### 2) Frontend (Firebase Hosting)
`frontend/.env.production`:
- [ ] `VITE_API_URL=https://<worker-domain>/api/v1`
- [ ] `VITE_FIREBASE_API_KEY`
- [ ] `VITE_FIREBASE_AUTH_DOMAIN`
- [ ] `VITE_FIREBASE_PROJECT_ID`
- [ ] `VITE_FIREBASE_APP_ID`
- [ ] `VITE_SUPPORT_EMAIL` (optional)

---

## C. Pre-deploy checks (mỗi release)
- [ ] `pnpm install`
- [ ] Backend:
  - [ ] `pnpm --filter backend type-check`
  - [ ] `pnpm --filter backend lint`
  - [ ] `pnpm --filter backend check`
- [ ] Frontend:
  - [ ] `pnpm --filter frontend type-check`
  - [ ] `pnpm --filter frontend lint`
  - [ ] `pnpm --filter frontend build`
- [ ] Review migration mới trong `backend/migrations`.

---

## D. Deploy backend
- [ ] `pnpm --filter backend deploy`
- [ ] Xác nhận migration remote đã apply (`predeploy` gọi `migrate:remote`).
- [ ] Xác nhận cron đúng cấu hình hiện tại (`*/30 * * * *`).

---

## E. Deploy frontend
- [ ] `pnpm --filter frontend build`
- [ ] `cd frontend && firebase deploy --only hosting`
  - hoặc `pnpm --filter frontend deploy`
- [ ] Smoke check domain production đã nhận bản mới.

---

## F. Smoke test sau deploy
- [ ] App load thành công, không blank screen.
- [ ] Đăng ký email/password thành công.
- [ ] Đăng nhập email/password thành công.
- [ ] Đăng nhập Google thành công.
- [ ] Refresh token hoạt động (không bị logout sớm).
- [ ] API protected trả dữ liệu bình thường.
- [ ] Reminders/push hoạt động (nếu bật).

---

## G. Rollback plan
- [ ] Có tag/commit release trước đó.
- [ ] Có thể redeploy frontend bản cũ nhanh chóng.
- [ ] Có phương án fix-forward cho migration lỗi.
- [ ] Có kênh thông báo khi incident production.
