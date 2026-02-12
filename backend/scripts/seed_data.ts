/// <reference types="node" />

import { spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { parse } from 'csv-parse/sync'
import { ulid } from 'ulid'

const seedCategories = [
  {
    code: 'body',
    name: 'Thân thiện',
    description: 'Những hành động tốt như giúp đỡ, bảo vệ, bố thí,...',
    icon: '/icons/icon_than.png',
    style: 'bg-body/20 hover:bg-body/40',
    order_index: 1,
  },
  {
    code: 'speech',
    name: 'Khẩu thiện',
    description: 'Lời nói ái ngữ, chân thật',
    icon: '/icons/icon_khau.png',
    style: 'bg-speech/20 hover:bg-speech/40',
    order_index: 2,
  },
  {
    code: 'mind',
    name: 'Ý thiện',
    description: 'Suy nghĩ hiểu, thương, không ganh ghét, tham lam, sân hận, ác ý, tà kiến.',
    icon: '/icons/icon_y.png',
    style: 'bg-mind/20 hover:bg-mind/40',
    order_index: 3,
  },
]

type Target = 'local' | 'remote' | 'preview'

interface CliOptions {
  target: Target
  dbBinding: string
  env?: string
}

const README = `Usage:
  pnpm --filter backend run seed:data [--local|--remote|--preview] [--db <binding>] [--env <environment>]

Options:
  --local            Execute against the local D1 instance used by wrangler dev (default)
  --remote           Run the SQL against the remote D1 database defined in wrangler.toml
  --preview          Target the D1 preview database
  --db <binding>     Database binding name (default: DB)
  --env <env>        Wrangler environment to load before executing
  --help, -h         Show this help
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

    throw new Error(`Unknown argument: ${arg}`)
  }

  if (targetFlags.length > 1) {
    throw new Error('Only one of --local, --remote, or --preview may be provided')
  }

  return { target, dbBinding, env }
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

async function loadQuotes(csvPath: string) {
  const rawCsv = await fs.readFile(csvPath, 'utf-8')
  const parsed = parse(rawCsv, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
  })

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('No dharma quotes were found in the CSV file')
  }

  return parsed
    .map((row) => ({
      content: String((row as Record<string, string>).content ?? '').trim(),
      author: String((row as Record<string, string>).author ?? '').trim(),
      source: String((row as Record<string, string>).source ?? '').trim(),
    }))
    .filter((quote) => quote.content.length > 0)
}

async function loadRandomActs(csvPath: string) {
  const rawCsv = await fs.readFile(csvPath, 'utf-8')
  const parsed = parse(rawCsv, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
  })

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('No random acts were found in the CSV file')
  }

  return parsed
    .map((row) => ({
      category: String((row as Record<string, string>).category ?? '').trim(),
      name: String((row as Record<string, string>).name ?? '').trim(),
      detail: String((row as Record<string, string>).detail ?? '').trim(),
      note: String((row as Record<string, string>).note ?? '').trim(),
    }))
    .filter((act) => act.category.length > 0 && act.name.length > 0)
}

async function main() {
  const options = parseArgs()
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const quotesPath = path.join(scriptDir, '..', 'resources', 'kinhphapcu-all.csv')
  const randomActsPath = path.join(scriptDir, '..', 'resources', 'random-acts-all.csv')

  const quotes = await loadQuotes(quotesPath)
  const randomActs = await loadRandomActs(randomActsPath)

  const wrapInSqlTransaction = options.target === 'local'
  const statements: string[] = []

  if (wrapInSqlTransaction) {
    statements.push('BEGIN TRANSACTION;')
  }

  for (const category of seedCategories) {
    const now = Date.now()
    statements.push(
      `INSERT OR REPLACE INTO categories (code, name, description, icon, style, order_index, is_active, is_system_default, created_at, updated_at)
       VALUES (${sqlString(category.code)}, ${sqlString(category.name)}, ${sqlString(
         category.description,
       )}, ${sqlString(category.icon)}, ${sqlString(category.style)}, ${category.order_index}, 1, 1, ${now}, ${now});`,
    )
  }

  for (const quote of quotes) {
    const now = Date.now()
    statements.push(
      `INSERT OR REPLACE INTO dharma_quotes (id, content, author, source, created_at, updated_at)
       VALUES (${sqlString(ulid())}, ${sqlString(quote.content)}, ${sqlString(
         quote.author || null,
       )}, ${sqlString(quote.source || null)}, ${now}, ${now});`,
    )
  }

  for (const act of randomActs) {
    const now = Date.now()
    statements.push(
      `INSERT OR REPLACE INTO random_acts (id, category, name, detail, note, created_at, updated_at)
       VALUES (${sqlString(ulid())}, ${sqlString(act.category)}, ${sqlString(
         act.name,
       )}, ${sqlString(act.detail || null)}, ${sqlString(act.note || null)}, ${now}, ${now});`,
    )
  }

  if (wrapInSqlTransaction) {
    statements.push('COMMIT;')
  }

  const sql = statements.join('\n')

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'seed-data-'))
  const sqlFilePath = path.join(tempDir, 'seed-data.sql')
  await fs.writeFile(sqlFilePath, sql)

  try {
    const statementCount = wrapInSqlTransaction ? statements.length - 2 : statements.length
    console.log(`Generated SQL script with ${statementCount} statements at ${sqlFilePath}`)

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

    console.log('Seed data completed successfully.')
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true })
  }
}

main().catch((error) => {
  console.error('Failed to seed data:', error)
  process.exit(1)
})
