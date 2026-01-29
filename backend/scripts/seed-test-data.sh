#!/bin/bash

# Script để seed dữ liệu test vào database
# Sử dụng: bash seed-test-data.sh

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DB_PATH="$PROJECT_ROOT/.wrangler/state/v3/d1/miniflare-D1DatabaseObject/3893375a34392b941874b5a04d42426efcb1cccbd7614af1559f5287d9ce905b.sqlite"
SEED_SQL="$SCRIPT_DIR/seed-test-data.sql"

echo "🌱 My Locket Backend - Seed Test Data"
echo ""

# Kiểm tra file SQL tồn tại
if [ ! -f "$SEED_SQL" ]; then
  echo "❌ File seed-test-data.sql không tìm thấy tại: $SEED_SQL"
  exit 1
fi

# Kiểm tra database tồn tại
if [ ! -f "$DB_PATH" ]; then
  echo "❌ Database không tìm thấy tại: $DB_PATH"
  echo "💡 Hãy chạy 'npm run dev' hoặc 'wrangler d1 execute my-locket --local' trước"
  exit 1
fi

echo "📍 Database: $DB_PATH"
echo ""

echo "✨ Dữ liệu sẽ được thêm:"
echo "  👤 User 1 (Tùng Xuân)"
echo "     - Firebase UID: piRPVX01bGc4XDDaKFXjCnfb8e12"
echo "     - Email: tungxuan.temp@gmail.com"
echo ""
echo "  👤 User 2 (Friend User) - accepted friend"
echo "     - Firebase UID: test-friend-uid-001"
echo "     - Email: friend@example.com"
echo ""
echo "  👤 User 3 (Another Friend) - pending friend request"
echo "     - Firebase UID: test-friend-uid-002"
echo "     - Email: another-friend@example.com"
echo ""
echo "  📸 3 posts từ User 1 (cùng ngày, các thời điểm khác nhau)"
echo "     - Post 1: Sunset Beach (2 hours ago)"
echo "     - Post 2: Coffee with friend (1 hour ago)"
echo "     - Post 3: Living my best life (30 minutes ago - latest)"
echo ""
echo "  ❤️  Reactions:"
echo "     - Friend 1 reacted to Post 3 (heart)"
echo "     - Friend 2 reacted to Post 2 (like)"
echo ""

# Kiểm tra sqlite3 được cài đặt
if ! command -v sqlite3 &> /dev/null; then
  echo "❌ sqlite3 không được cài đặt"
  echo "💡 Cài đặt: brew install sqlite3"
  exit 1
fi

echo "⏳ Đang seed dữ liệu..."
echo ""

# Chạy seed SQL
sqlite3 "$DB_PATH" < "$SEED_SQL"

echo ""
echo "✅ Seed dữ liệu thành công!"
echo ""
echo "💡 Kiểm tra dữ liệu:"
echo "   sqlite3 $DB_PATH"
echo "   SELECT * FROM users;"
echo ""
