# H. Scaling

## 1. Giai đoạn đầu
- Scale bằng Workers (auto)
- D1 đủ dùng với low concurrency

## 2. Khi vượt ngưỡng
- Tách DB ra PostgreSQL
- Giữ API contract

## 3. Nguyên tắc
- Scale DB trước, code sau