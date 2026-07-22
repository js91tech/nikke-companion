/**
 * Build full Nikke catalog:
 * - Master list: Prydwen.gg characters (all known playable units, incl. Treasure)
 * - Metadata: @sancti0n/nikke-utils when available
 * - Gaps filled by cloning base unit / sensible defaults
 */
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { getAllNikkes } = require('@sancti0n/nikke-utils')

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '..', 'src', 'data', 'generated')
const prydwenNames = JSON.parse(readFileSync(join(__dirname, 'prydwen-names.json'), 'utf8'))

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

const OVERRIDES = {
  Rapi: { burst: 3 },
  'Rapi: Red Hood': { burst: 3 },
  'Red Hood': { burst: 3 },
  'Red Hood B3': { burst: 3 },
  Siren: { burst: 3, class: 'Attacker', weapon: 'MG', manufacturer: 'Abnormal', element: 'Water' },
}

function slug(name) {
  return String(name)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function norm(s) {
  return String(s)
    .toLowerCase()
    .replace(/[:\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function mapBurst(raw, name) {
  if (OVERRIDES[name]?.burst) return OVERRIDES[name].burst
  const s = String(raw || '').trim()
  if (s === 'I' || s === '1') return 1
  if (s === 'II' || s === '2') return 2
  if (s === 'III' || s === '3') return 3
  if (s.includes('III')) return 3
  if (s.includes('II')) return 2
  if (s.includes('I')) return 1
  return 3
}

function mapManufacturer(raw) {
  const key = String(raw || '').trim()
  return MFR_MAP[key] || 'Other'
}

function mapWeapon(raw) {
  const key = String(raw || '').trim()
  return WEAPON_MAP[key] || 'AR'
}

function specialtiesOf(raw) {
  if (!raw || typeof raw !== 'object') return []
  return Object.values(raw).filter(Boolean).map(String)
}

function findUtilsEntry(name, utilsByNorm) {
  const n = norm(name)
  if (utilsByNorm.has(n)) return utilsByNorm.get(n)

  const noTreasure = n.replace(/ \(treasure\)$/, '')
  if (utilsByNorm.has(noTreasure)) return utilsByNorm.get(noTreasure)

  const compact = n.replace(/\s/g, '')
  for (const [k, v] of utilsByNorm) {
    if (k.replace(/\s/g, '') === compact) return v
  }

  // Prydwen Siren ↔ utils "Little Mermaid (Siren)"
  if (n === 'siren') {
    for (const [k, v] of utilsByNorm) {
      if (k.includes('siren') || k.includes('mermaid')) return v
    }
  }

  if (n === 'red hood b3' && utilsByNorm.has('red hood')) return utilsByNorm.get('red hood')

  // Product-08 ↔ Product 08
  const product = n.replace(/^product\s*/, 'product ')
  if (utilsByNorm.has(product)) return utilsByNorm.get(product)
  for (const [k, v] of utilsByNorm) {
    if (k.replace(/\s/g, '') === compact) return v
  }

  return null
}

function fromUtils(name, src) {
  const burstRaw = String(src?.burst || '')
  const over = OVERRIDES[name] || {}
  return {
    id: slug(name),
    name,
    rarity: src?.rarity === 'R' || src?.rarity === 'SR' || src?.rarity === 'SSR' ? src.rarity : 'SSR',
    burst: over.burst ?? mapBurst(src?.burst, name),
    burstLabel: burstRaw || undefined,
    class: over.class ?? (src?.class === 'Defender' || src?.class === 'Supporter' ? src.class : 'Attacker'),
    weapon: over.weapon ?? mapWeapon(src?.weapon),
    weaponLabel: src?.weapon || undefined,
    manufacturer: over.manufacturer ?? mapManufacturer(src?.manufacturer),
    manufacturerLabel: src?.manufacturer || undefined,
    element: over.element ?? src?.element ?? undefined,
    squad: src?.squad || undefined,
    specialties: specialtiesOf(src?.specialties),
    releaseDate: src?.dateAdded || undefined,
    sourceId: src?.id,
    treasure: /\(Treasure\)$/i.test(name) || String(src?.treasure).toLowerCase() === 'yes',
    notes: burstRaw.includes('-')
      ? `Flexible burst (${burstRaw}).`
      : /\(Treasure\)$/i.test(name)
        ? 'Treasure upgrade variant.'
        : undefined,
  }
}

function stubFromBase(name, base) {
  if (base) {
    return {
      ...base,
      id: slug(name),
      name,
      treasure: /\(Treasure\)$/i.test(name),
      notes: /\(Treasure\)$/i.test(name)
        ? `Treasure variant of ${base.name}.`
        : name === 'Red Hood B3'
          ? 'Red Hood locked to Burst III mode.'
          : base.notes,
      sourceId: undefined,
    }
  }
  const over = OVERRIDES[name] || {}
  return {
    id: slug(name),
    name,
    rarity: 'SSR',
    burst: over.burst ?? 3,
    class: over.class ?? 'Attacker',
    weapon: over.weapon ?? 'AR',
    manufacturer: over.manufacturer ?? 'Other',
    element: over.element,
    specialties: [],
    treasure: /\(Treasure\)$/i.test(name),
    notes: 'Stub entry — metadata incomplete; listed on Prydwen.',
  }
}

const utils = getAllNikkes()
const utilsByNorm = new Map()
for (const u of utils) {
  utilsByNorm.set(norm(u.name), u)
  // also index without spaces around colon
  utilsByNorm.set(norm(u.name.replace(':', ': ')), u)
}

const byName = new Map()
const unmatched = []

for (const name of prydwenNames) {
  const src = findUtilsEntry(name, utilsByNorm)
  if (src) {
    byName.set(name, fromUtils(name, src))
  } else {
    unmatched.push(name)
  }
}

// Fill gaps: Treasure clones, Red Hood B3, etc.
for (const name of unmatched) {
  const baseName = name.replace(/\s*\(Treasure\)$/i, '').trim()
  const base =
    byName.get(baseName) ||
    (name === 'Red Hood B3' ? byName.get('Red Hood') : null) ||
    (name === 'Siren'
      ? [...byName.values()].find((n) => /siren|mermaid/i.test(n.name))
      : null)
  byName.set(name, stubFromBase(name, base || undefined))
}

// Also keep any utils-only units not on Prydwen (rare), under their utils name
for (const u of utils) {
  const already = [...byName.keys()].some((p) => {
    const a = norm(p)
    const b = norm(u.name)
    return a === b || a.replace(/\s/g, '') === b.replace(/\s/g, '')
  })
  if (!already) {
    byName.set(u.name, fromUtils(u.name, u))
  }
}

const nikkes = [...byName.values()].sort((a, b) => a.name.localeCompare(b.name))

mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, 'nikkes.json'), JSON.stringify(nikkes, null, 2))
writeFileSync(
  join(outDir, 'meta.json'),
  JSON.stringify(
    {
      nikkeCount: nikkes.length,
      prydwenCount: prydwenNames.length,
      utilsCount: utils.length,
      stubCount: unmatched.length,
      version: 'prydwen+nikke-utils',
      package: '@sancti0n/nikke-utils',
      builtAt: new Date().toISOString(),
      note: 'Master list from Prydwen (Jul 2026). Stats/metadata from nikke-utils where available.',
      stubs: unmatched,
    },
    null,
    2,
  ),
)

console.log(`Wrote ${nikkes.length} nikkes (Prydwen ${prydwenNames.length}, stubs ${unmatched.length})`)
if (unmatched.length) console.log('Stubs:', unmatched.join(', '))
