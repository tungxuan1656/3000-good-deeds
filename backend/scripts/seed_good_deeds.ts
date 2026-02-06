/// <reference types="node" />

import { spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { ulid } from 'ulid'

type Target = 'local' | 'remote' | 'preview'

interface CliOptions {
  target: Target
  dbBinding: string
  env?: string
  userId: string
  count: number
}

const README = `Usage:
  pnpm --filter backend run seed:deeds --user-id <userId> [--count <number>] [--local|--remote|--preview] [--db <binding>] [--env <environment>]

Options:
  --user-id <id>     User ID (ULID) to create deeds for (required)
  --count <number>   Number of deeds to generate (default: 20)
  --local            Execute against the local D1 instance used by wrangler dev (default)
  --remote           Run the SQL against the remote D1 database defined in wrangler.toml
  --preview          Target the D1 preview database
  --db <binding>     Database binding name (default: DB)
  --env <env>        Wrangler environment to load before executing
  --help, -h         Show this help

Example:
  pnpm --filter backend run seed:deeds --user-id 01JKG7H8... --count 30 --local
`

function printHelp() {
  console.log(README)
}

function parseArgs(): CliOptions {
  const args = process.argv.slice(2)
  let target: Target = 'local'
  const targetFlags: Target[] = []
  let dbBinding = 'DB'
  let env: string | undefined
  let userId: string | undefined
  let count = 20

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    if (arg === '--help' || arg === '-h') {
      printHelp()
      process.exit(0)
    }

    if (arg === '--local') {
      target = 'local'
      targetFlags.push('local')
      continue
    }

    if (arg === '--remote') {
      target = 'remote'
      targetFlags.push('remote')
      continue
    }

    if (arg === '--preview') {
      target = 'preview'
      targetFlags.push('preview')
      continue
    }

    if (arg === '--db') {
      const value = args[++i]
      if (!value) {
        throw new Error('--db requires a value')
      }
      dbBinding = value
      continue
    }

    if (arg === '--env') {
      const value = args[++i]
      if (!value) {
        throw new Error('--env requires a value')
      }
      env = value
      continue
    }

    if (arg === '--user-id') {
      const value = args[++i]
      if (!value) {
        throw new Error('--user-id requires a value')
      }
      userId = value
      continue
    }

    if (arg === '--count') {
      const value = args[++i]
      if (!value) {
        throw new Error('--count requires a value')
      }
      const parsed = Number.parseInt(value, 10)
      if (Number.isNaN(parsed) || parsed < 1) {
        throw new Error('--count must be a positive number')
      }
      count = parsed
      continue
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  if (targetFlags.length > 1) {
    throw new Error('Only one of --local, --remote, or --preview may be provided')
  }

  if (!userId) {
    throw new Error('--user-id is required')
  }

  return { target, dbBinding, env, userId, count }
}

function sqlString(value: string | null | undefined): string {
  if (value == null || value === '') {
    return 'NULL'
  }
  return `'${value.replace(/'/g, "''")}'`
}

async function runCommand(args: string[], cwd: string) {
  const control = spawn('npx', args, { cwd, stdio: 'inherit' })

  await new Promise<void>((resolve, reject) => {
    control.on('close', (code: number | null) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Command exited with code ${code}`))
      }
    })
    control.on('error', (err: unknown) => reject(err))
  })
}

// Sample deed descriptions by category
const deedsByCategory = {
  body: [
    'Giúp người già qua đường',
    'Nhặt rác trong công viên',
    'Dọn dẹp nhà cửa cho bố mẹ',
    'Cho người nghèo vài chục ngàn',
    'Phát cơm từ thiện',
    'Giúp hàng xóm khiêng đồ',
    'Tưới cây cho láng giềng',
    'Sửa xe đạp cho bạn',
    'Làm vệ sinh chung cư',
    'Hiến máu nhân đạo',
    'Trồng cây xanh',
    'Chăm sóc thú cưng bị bỏ rơi',
    'Sửa chữa nhà cho người nghèo',
    'Giúp đỡ người khuyết tật',
    'Tham gia hoạt động từ thiện',
  ],
  speech: [
    'Động viên bạn bè',
    'Cảm ơn người phục vụ',
    'Khen ngợi đồng nghiệp',
    'Xin lỗi người thân',
    'Nói lời yêu thương với bố mẹ',
    'An ủi người đang buồn',
    'Khuyên bảo người làm lỗi',
    'Chia sẻ kinh nghiệm tốt',
    'Tán dương việc tốt của người khác',
    'Giải thích nhẹ nhàng khi bất đồng',
    'Chúc mừng thành công của bạn',
    'Nói lời cảm ơn chân thành',
    'Khuyến khích người khác làm việc thiện',
    'Xin lỗi vì lỗi lầm của mình',
    'Nói lời hay ý đẹp',
  ],
  mind: [
    'Thiền định 15 phút',
    'Niệm Phật 108 lần',
    'Buông bỏ sân hận',
    'Hướng lòng từ bi đến mọi người',
    'Quán tưởng về vô thường',
    'Cảm ơn những gì mình đang có',
    'Tha thứ cho người làm mình tổn thương',
    'Nuôi dưỡng tâm an lạc',
    'Phát tâm bồ đề',
    'Sám hối lỗi lầm',
    'Hồi hướng công đức',
    'Quán chiếu hơi thở',
    'Trì chú Đại Bi',
    'Đọc kinh Pháp Cú',
    'Suy nghĩ về ân đức của cha mẹ',
  ],
}

const categories = ['body', 'speech', 'mind']

const tags = ['An vui', 'Biết ơn', 'Nhẹ lòng', 'Ấm áp', 'Bình an', 'Hy vọng']

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomDate(daysAgo: number): Date {
  const now = new Date()
  const past = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
  const randomTime = past.getTime() + Math.random() * (now.getTime() - past.getTime())
  return new Date(randomTime)
}

function formatLocalDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatLocalWeek(date: Date): string {
  const year = date.getFullYear()
  const onejan = new Date(year, 0, 1)
  const week = Math.ceil(((date.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7)
  return `${year}-W${String(week).padStart(2, '0')}`
}

function formatLocalMonth(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

function formatLocalYear(date: Date): string {
  return String(date.getFullYear())
}

function generateGoodDeed(userId: string, daysAgo: number) {
  const categoryCode = randomElement(categories)
  const description = randomElement(deedsByCategory[categoryCode as keyof typeof deedsByCategory])
  const performedAt = randomDate(daysAgo)
  const now = Date.now()

  // Random tags (0-3 tags)
  const numTags = Math.floor(Math.random() * 4)
  const selectedTags: string[] = []
  for (let i = 0; i < numTags; i++) {
    const tag = randomElement(tags)
    if (!selectedTags.includes(tag)) {
      selectedTags.push(tag)
    }
  }

  return {
    id: ulid(),
    user_id: userId,
    category_code: categoryCode,
    description,
    labels: selectedTags.length > 0 ? selectedTags.join(',') : null,
    local_date: formatLocalDate(performedAt),
    local_week: formatLocalWeek(performedAt),
    local_month: formatLocalMonth(performedAt),
    local_year: formatLocalYear(performedAt),
    is_private: Math.random() > 0.3 ? 1 : 0, // 70% private
    performed_at: performedAt.getTime(),
    created_at: now,
    updated_at: now,
  }
}

async function main() {
  const options = parseArgs()
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))

  console.log(`Generating ${options.count} good deeds for user: ${options.userId}`)

  const statements: string[] = ['BEGIN TRANSACTION;']

  // Generate deeds spread over the last 90 days
  for (let i = 0; i < options.count; i++) {
    const deed = generateGoodDeed(options.userId, 90)
    statements.push(
      `INSERT INTO good_deeds (id, user_id, category_code, description, labels, local_date, local_week, local_month, local_year, is_private, performed_at, created_at, updated_at)
       VALUES (${sqlString(deed.id)}, ${sqlString(deed.user_id)}, ${sqlString(deed.category_code)}, ${sqlString(deed.description)}, ${sqlString(deed.labels)}, ${sqlString(deed.local_date)}, ${sqlString(deed.local_week)}, ${sqlString(deed.local_month)}, ${sqlString(deed.local_year)}, ${deed.is_private}, ${deed.performed_at}, ${deed.created_at}, ${deed.updated_at});`,
    )
  }

  statements.push('COMMIT;')

  const sql = statements.join('\n')

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'seed-deeds-'))
  const sqlFilePath = path.join(tempDir, 'seed-deeds.sql')
  await fs.writeFile(sqlFilePath, sql)

  try {
    console.log(`Generated SQL script with ${statements.length - 2} statements at ${sqlFilePath}`)

    const commandArgs = ['wrangler', 'd1', 'execute', options.dbBinding, '--file', sqlFilePath]
    if (options.target === 'local') {
      commandArgs.push('--local')
    }
    if (options.target === 'remote') {
      commandArgs.push('--remote')
    }
    if (options.target === 'preview') {
      commandArgs.push('--preview')
    }
    if (options.env) {
      commandArgs.push('--env', options.env)
    }

    console.log(`Running: npx ${commandArgs.join(' ')}`)
    await runCommand(commandArgs, path.join(scriptDir, '..'))

    console.log('✅ Seed good deeds completed successfully.')
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true })
  }
}

main().catch((error) => {
  console.error('Failed to seed good deeds:', error)
  process.exit(1)
})
