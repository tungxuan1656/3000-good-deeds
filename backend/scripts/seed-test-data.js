#!/usr/bin/env node

/**
 * Script để seed dữ liệu test vào database
 * Sử dụng: node seed-test-data.js [environment]
 *
 * environment: 'local' (default) hoặc 'production'
 */

import fs from 'fs'
import path from 'path'

// Hàm để đọc file SQL
function readSQLFile(filename) {
  try {
    const filePath = path.join(import.meta.dirname, filename)
    return fs.readFileSync(filePath, 'utf-8')
  } catch (error) {
    console.error(`❌ Lỗi đọc file ${filename}:`, error.message)
    process.exit(1)
  }
}

// Hàm để split SQL statements
function splitSQL(sql) {
  // Split bởi dấu `;` nhưng bỏ qua các dấu `;` bên trong comments hoặc strings
  const statements = []
  let currentStatement = ''
  let inString = false
  let stringChar = null
  let inComment = false

  for (let i = 0; i < sql.length; i++) {
    const char = sql[i]
    const nextChar = sql[i + 1]

    // Xử lý comments
    if (!inString && char === '-' && nextChar === '-') {
      // Single-line comment
      inComment = true
      currentStatement += char
      i++
      continue
    }

    if (inComment && char === '\n') {
      inComment = false
    }

    // Xử lý strings
    if (
      !inComment &&
      (char === '"' || char === "'") &&
      (i === 0 || sql[i - 1] !== '\\')
    ) {
      if (!inString) {
        inString = true
        stringChar = char
      } else if (char === stringChar) {
        inString = false
        stringChar = null
      }
    }

    // Split khi gặp `;` ngoài string
    if (!inString && !inComment && char === ';') {
      if (currentStatement.trim()) {
        statements.push(currentStatement.trim() + ';')
      }
      currentStatement = ''
      continue
    }

    if (!inComment || char === '\n') {
      currentStatement += char
    }
  }

  if (currentStatement.trim()) {
    statements.push(currentStatement.trim())
  }

  return statements.filter(
    (stmt) => stmt.trim() && !stmt.startsWith('--') && !stmt.startsWith('.'),
  )
}

// Hàm chính
async function main() {
  const environment = process.argv[2] || 'local'

  console.log('🌱 My Locket Backend - Seed Test Data')
  console.log(`📍 Environment: ${environment}`)
  console.log('')

  // Kiểm tra wrangler.json để validate environment
  const wranglerPath = path.join(import.meta.dirname, '../wrangler.json')
  let wrangler = {}

  try {
    const wranglerContent = fs.readFileSync(wranglerPath, 'utf-8')
    wrangler = JSON.parse(wranglerContent)
  } catch (error) {
    console.error('❌ Không thể đọc wrangler.json:', error.message)
    process.exit(1)
  }

  // Đọc SQL seed file
  const seedSQL = readSQLFile('./seed-test-data.sql')

  // Split statements
  const statements = splitSQL(seedSQL)
  console.log(`📋 Tìm thấy ${statements.length} SQL statements`)
  console.log('')

  // Thông báo dữ liệu sẽ được thêm
  console.log('✨ Dữ liệu sẽ được thêm:')
  console.log('  👤 User 1 (Tùng Xuân)')
  console.log('     - Firebase UID: piRPVX01bGc4XDDaKFXjCnfb8e12')
  console.log('     - Email: tungxuan.temp@gmail.com')
  console.log('')
  console.log('  👤 User 2 (Friend User) - accepted friend')
  console.log('     - Firebase UID: test-friend-uid-001')
  console.log('     - Email: friend@example.com')
  console.log('')
  console.log('  👤 User 3 (Another Friend) - pending friend request')
  console.log('     - Firebase UID: test-friend-uid-002')
  console.log('     - Email: another-friend@example.com')
  console.log('')
  console.log('  📸 3 posts từ User 1 (cùng ngày, các thời điểm khác nhau)')
  console.log('     - Post 1: Sunset Beach (2 hours ago)')
  console.log('     - Post 2: Coffee with friend (1 hour ago)')
  console.log('     - Post 3: Living my best life (30 minutes ago - latest)')
  console.log('')
  console.log('  ❤️  Reactions:')
  console.log('     - Friend 1 reacted to Post 3 (heart)')
  console.log('     - Friend 2 reacted to Post 2 (like)')
  console.log('')

  console.log(
    '⚠️  Chú ý: Script sẽ INSERT OR IGNORE, không làm mất dữ liệu hiện có',
  )
  console.log('')

  console.log('💡 Để chạy script này vào database thực, sử dụng lệnh:')
  console.log(
    `   sqlite3 .wrangler/state/v3/${wrangler.name}.sqlite3 < scripts/seed-test-data.sql`,
  )
  console.log('')
  console.log('   hoặc chạy từ Wrangler (nếu có endpoint seed):')
  console.log(`   npm run seed:test`)
  console.log('')

  console.log('✅ Script seed-test-data.sql đã sẵn sàng!')
}

main().catch(console.error)
