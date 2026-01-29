# A. Backend Vision

## 1. Mục tiêu
- Backend phải **luôn online**, không auto sleep
- Chi phí gần 0 trong giai đoạn đầu
- Không khóa chặt vào vendor
- Có thể migrate sang VPS self-host

## 2. Phạm vi backend
Backend chịu trách nhiệm:
- Authentication & Authorization
- Business logic
- Data persistence
- API contract

Backend không chịu trách nhiệm:
- UI / Rendering
- Analytics nâng cao
- Recommendation

## 3. Triết lý thiết kế
- Auth do hệ thống kiểm soát
- Database là source of truth
- API stateless
- Ưu tiên đơn giản > hoàn hảo

## 4. Công nghệ giai đoạn đầu
- Runtime: Cloudflare Workers
- Database: Cloudflare D1 (SQLite)
- Auth: Google OAuth 2.0 + JWT
- Storage: Cloudflare R2 (sau)