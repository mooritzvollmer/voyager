import { spawnSync } from 'node:child_process'
import fs from 'node:fs'

const source = 'dist/'
const target = process.env.DEPLOY_TARGET
const isDryRun = process.env.DEPLOY_DRY_RUN === '1'

if (!target) {
  console.error('Missing DEPLOY_TARGET, for example user@example.com:voyager/.')
  process.exit(1)
}

if (!fs.existsSync('dist/index.html')) {
  console.error('Missing dist/index.html. Deploy stopped.')
  process.exit(1)
}

if (!target.endsWith('/')) {
  console.error('DEPLOY_TARGET must end with "/".')
  process.exit(1)
}

const args = [
  '-az',
  '--delete',
  '--human-readable',
  '--itemize-changes',
  ...(isDryRun ? ['--dry-run'] : []),
  source,
  target,
]

console.log(`${isDryRun ? 'Dry-running' : 'Deploying'} ${source} to ${target}`)

const result = spawnSync('rsync', args, { stdio: 'inherit' })

if (result.error) {
  console.error(result.error.message)
  process.exit(1)
}

process.exit(result.status ?? 1)
