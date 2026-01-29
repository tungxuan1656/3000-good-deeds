# My Locket - Cloudflare Workers Backend

Backend API cho ứng dụng My Locket, xây dựng trên Cloudflare Workers và D1 Database.

## 📁 Cấu trúc thư mục

```
cloudflare-backend/
├── docs/              # Documentation
│   ├── readme.md      # Main documentation
│   ├── api-routes.md  # API endpoints reference
│   └── setup-guide.md # Setup & deployment guide
├── migrations/        # D1 database migrations
├── scripts/           # Utility scripts
│   └── test-local.sh  # Local testing script
├── src/               # Source code
│   ├── index.ts       # Main router
│   ├── auth.ts        # Authentication middleware
│   ├── types.ts       # TypeScript types
│   ├── utils.ts       # Utilities & helpers
│   └── handlers/      # API handlers
│       ├── users.ts
│       ├── posts.ts
│       ├── activities.ts
│       ├── friends.ts
│       └── reactions.ts
├── package.json
├── tsconfig.json
└── wrangler.json      # Cloudflare Workers config
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup database
npx wrangler d1 create my-locket-database
# Update database_id in wrangler.json

# Run migrations
npm run migrate:local

# Start dev server
npm run dev

# Test APIs
./scripts/test-local.sh
```

## 📚 Documentation

- **[Main Documentation](./docs/readme.md)** - Tổng quan về backend
- **[API Routes](./docs/api-routes.md)** - Chi tiết tất cả API endpoints
- **[Setup Guide](./docs/setup-guide.md)** - Hướng dẫn setup và deploy
- **[Database Migrations Guide](../docs/database-migrations-guide.md)** - Hướng dẫn tạo & cập nhật migrations ⭐

## 🛠 Commands

```bash
npm run dev              # Dev server (local)
npm run db:reset         # Reset database (delete & re-run migrations)
npm run migrate:local    # Run migrations (local)
npm run migrate:remote   # Run migrations (remote)
npm run deploy           # Deploy to Cloudflare
npm run check            # TypeScript check & dry-run deploy
npm run seed:test        # Seed test data vào database (local)
```

## 🌱 Seeding Test Data

Để thêm dữ liệu test vào database cho testing:

```bash
# Chạy seed script
npm run seed:test
```

**Dữ liệu test sẽ thêm:**
- 👤 **User 1 (Tùng Xuân)** - Firebase UID: `piRPVX01bGc4XDDaKFXjCnfb8e12`
- 👤 **User 2 (Friend User)** - accepted friend
- 👤 **User 3 (Another Friend)** - pending friend request
- 📸 **3 Posts** từ User 1 (cùng ngày, khác giờ)
- ❤️ **Reactions** từ bạn bè

**Chú ý:** Script sử dụng `INSERT OR IGNORE`, nên không làm mất dữ liệu hiện có.

📝 Xem chi tiết trong `scripts/seed-test-data.sql`

## 📝 Khi cần thay đổi Database Schema

1. **Tạo migration file mới** (không sửa file cũ)
   ```bash
   cat > migrations/0010_description.sql << 'EOF'
   -- Your SQL here
   EOF
   ```

2. **Cập nhật TypeScript types** trong `src/types.ts`

3. **Reset & test local**
   ```bash
   npm run db:reset
   npm run dev
   npx wrangler dev --port 8787 --local --ip 192.168.2.9
   ./scripts/test-local.sh
   ```

👉 Chi tiết đầy đủ xem [Database Migrations Guide](../docs/database-migrations-guide.md)

## 📝 License

My Locket Project - Internal Use
