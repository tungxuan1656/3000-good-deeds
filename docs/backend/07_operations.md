# G. Operations

## 1. Logging
- Structured log (JSON)
- Request ID

## 2. Monitoring
- Error rate
- Response time
- DB error

## 3. Health check
- /health endpoint
- Không yêu cầu auth

---

## 4. Scheduled Jobs (Cron)

- **Daily reminder job**: quét user có `reminder_enabled = true`, so sánh `last_reminder_sent_at` và `performed_at` để gửi nhắc nhở.
- **Achievement job** (tuỳ chọn): tổng hợp sau mỗi ngày để tránh tính lại quá nhiều.
- Sử dụng **Cloudflare Cron Triggers** (hoặc cron nội bộ khi migrate VPS).