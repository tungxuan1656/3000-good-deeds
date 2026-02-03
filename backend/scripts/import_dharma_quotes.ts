import { spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'csv-parse/sync'
import { ulid } from 'ulid'

type Target = 'local' | 'remote' | 'preview'

interface CliOptions {
  target: Target
  dbBinding: string
  env?: string
}

const README = `Usage:
  pnpm --filter backend run import:dharma-quotes [--local|--remote|--preview] [--db <binding>] [--env <environment>]

Options:
  --local           Execute against the local D1 instance used by wrangler dev (default)
  --remote          Run the SQL against the remote D1 database defined in wrangler.toml
  --preview         Target the D1 preview database
  --db <binding>     Database binding name (default: DB)
  --env <env>       Wrangler environment to load before executing
  --help, -h        Show this help
` // ascii only

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
    control.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Command exited with code ${code}`))
      }
    })
    control.on('error', (err) => reject(err))
  })
}

async function main() {
  const options = parseArgs()
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const csvPath = path.join(scriptDir, '..', 'resources', 'dharma_quotes', 'kinhphapcu-all.csv')

  const rawCsv = await fs.readFile(csvPath, 'utf-8')
  const parsed = parse(rawCsv, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
  })

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('No dharma quotes were found in the CSV file')
  }

  const records = parsed
    .map((row) => ({
      content: String((row as Record<string, string>).content ?? '').trim(),
      author: String((row as Record<string, string>).author ?? '').trim(),
      source: String((row as Record<string, string>).source ?? '').trim(),
    }))
    .filter((quote) => quote.content.length > 0)

  if (records.length === 0) {
    throw new Error('Trimmed dharma quotes are empty after filtering')
  }

  const statements = records.map((quote) => {
    const createdAt = Date.now()
    const id = ulid()
    return `INSERT OR REPLACE INTO dharma_quotes (id, content, author, source, created_at, updated_at)\nVALUES (${sqlString(
      id,
    )}, ${sqlString(quote.content)}, ${sqlString(quote.author || null)}, ${sqlString(quote.source || null)}, ${createdAt}, ${createdAt});`
  })

  const sql = ['BEGIN TRANSACTION;', ...statements, 'COMMIT;'].join('\n')

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'import-dharma-'))
  const sqlFilePath = path.join(tempDir, 'dharma-quotes.sql')
  await fs.writeFile(sqlFilePath, sql)

  try {
    console.log(`Generated SQL script with ${statements.length} statements at ${sqlFilePath}`)

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

    console.log('Import completed successfully.')
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true })
  }
}

main().catch((error) => {
  console.error('Failed to import dharma quotes:', error)
  process.exit(1)
})
