# B. Architecture

## 1. Tổng thể
Client → Worker API → D1 Database

## 2. Thành phần
- Worker: xử lý HTTP, auth, nghiệp vụ
- D1: lưu dữ liệu quan hệ
- JWT: truyền danh tính user

## 3. Nguyên tắc
- Không state trong Worker
- Không logic nghiệp vụ trong client
- Mọi request đều có thể retry

## 4. Khả năng thay thế
- D1 → PostgreSQL
- Worker → Node/Bun trên VPS
- JWT giữ nguyên