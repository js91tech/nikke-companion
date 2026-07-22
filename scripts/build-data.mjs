/**
 * Build catalog from @sancti0n/nikke-utils (offline static data).
 * fuwaguwa/NikkeAPI (nikke-api.vercel.app) is broken — Prydwen list JSON 404/403.
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { getAllNikkes } = require('@sancti0n/nikke-utils')

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '..', 'src', 'data', 'generated')

const WEAPON_MAP = {
  'Assault Rifle': 'AR',
  'Sub Machine Gun': 'SMG',
  SMG: 'SMG',
  Shotgun: 'SG',
  'Sniper Rifle': 'SR',
  'Rocket Launcher': 'RL',
  Minigun: 'MG',
  MG: 'MG',
}

const MFR_MAP = {
  Elysion: 'Elysion',
  'Missilis Industry': 'Missilis',
  Missilis: 'Missilis',
  'Tetra Line': 'Tetra',
  Tetra: 'Tetra',
  Pilgrim: 'Pilgrim',
  Abnormal: 'Abnormal',
  Overspec: 'Other',
  'Underworld Queen': 'Other',
}

/** Manual fixes where community DB is known wrong / flexible. */
const OVERRIDES = {
  Rapi: { burst: 3 },
  'Rapi: Red Hood': { burst: 3 },
  'Red Hood': { burst: 3 },
}

function slug(name) {
  return String(name)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function mapBurst(raw, name) {
  if (OVERRIDES[name]?.burst) return OVERRIDES[name].burst
  const s = String(raw || '').trim()
  if (s === 'I' || s === '1') return 1
  if (s === 'II' || s === '2') return 2
  if (s === 'III' || s === '3') return 3
  // Flex bursts (e.g. I-II-III) — treat as B3 carry for team building
  if (s.includes('III')) return 3
  if (s.includes('II')) return 2
  if (s.includes('I')) return 1
  return 3
}

function mapManufacturer(raw) {
  const key = String(raw || '').trim()
  return MFR_MAP[key] || (key ? 'Other' : 'Other')
}

function mapWeapon(raw) {
  const key = String(raw || '').trim()
  return WEAPON_MAP[key] || 'AR'
}

function specialtiesOf(raw) {
  if (!raw || typeof raw !== 'object') return []
  return Object.values(raw).filter(Boolean).map(String)
}

const all = getAllNikkes()
const seen = new Set()
const nikkes = []

for (const n of all) {
  const name = String(n.name || '').trim()
  if (!name) continue
  const id = slug(name)
  if (seen.has(id)) continue
  seen.add(id)

  const burstRaw = String(n.burst || '')
  nikkes.push({
    id,
    name,
    rarity: n.rarity === 'R' || n.rarity === 'SR' || n.rarity === 'SSR' ? n.rarity : 'SR',
    burst: mapBurst(n.burst, name),
    burstLabel: burstRaw || undefined,
    class: n.class === 'Defender' || n.class === 'Supporter' ? n.class : 'Attacker',
    weapon: mapWeapon(n.weapon),
    weaponLabel: n.weapon || undefined,
    manufacturer: mapManufacturer(n.manufacturer),
    manufacturerLabel: n.manufacturer || undefined,
    element: n.element || undefined,
    squad: n.squad || undefined,
    specialties: specialtiesOf(n.specialties),
    releaseDate: n.dateAdded || undefined,
    sourceId: n.id,
    notes: burstRaw.includes('-') ? `Flexible burst (${burstRaw}).` : undefined,
  })
}

nikkes.sort((a, b) => a.name.localeCompare(b.name))

mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, 'nikkes.json'), JSON.stringify(nikkes, null, 2))
writeFileSync(
  join(outDir, 'meta.json'),
  JSON.stringify(
    {
      nikkeCount: nikkes.length,
      version: 'nikke-utils',
      package: '@sancti0n/nikke-utils',
      builtAt: new Date().toISOString(),
      note: 'Generated offline from nikke-utils. Live NikkeAPI (fuwaguwa) is unavailable.',
    },
    null,
    2,
  ),
)

console.log(`Wrote ${nikkes.length} nikkes → src/data/generated/`)
