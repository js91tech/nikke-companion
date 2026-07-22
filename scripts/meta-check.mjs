/**
 * Validate meta / team / stage member names against the catalog.
 * Usage: node scripts/meta-check.mjs
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const nikkes = JSON.parse(readFileSync(join(root, 'src/data/generated/nikkes.json'), 'utf8'))
const byName = new Map(nikkes.map((n) => [n.name.toLowerCase(), n.name]))

const refs = new Set()
for (const file of [
  'src/data/stages.ts',
  'src/data/teams.ts',
  'src/data/metaSource.ts',
]) {
  const src = readFileSync(join(root, file), 'utf8')
  for (const m of src.matchAll(/(?:members|slots):\s*\[([^\]]+)\]/gs)) {
    for (const q of m[1].matchAll(/'([^']+)'/g)) refs.add(q[1])
  }
  for (const m of src.matchAll(/^\s+'([^']+)':\s*\d+/gm)) refs.add(m[1])
}

const miss = [...refs].filter((r) => !byName.has(r.toLowerCase())).sort()
console.log(`Checked ${refs.size} refs against ${nikkes.length} nikkes`)
if (miss.length) {
  console.error('Unresolved names:')
  for (const m of miss) console.error('  -', m)
  process.exit(1)
}
console.log('OK — all meta/team/stage names resolve')
