/** Classic Union Raid boss HP by stage (Normal). Source: community tables (nikke.gg era). */
export interface UnionBossStage {
  stage: number
  hp: number
  atk?: number
  def?: number
}

export interface UnionBossTemplate {
  id: string
  name: string
  weakTo?: string
  notes: string
  stages: UnionBossStage[]
}

export const UNION_RAID_MAX_ATTEMPTS = 3

export const unionBossTemplates: UnionBossTemplate[] = [
  {
    id: 'obelisk',
    name: 'Obelisk',
    weakTo: 'Fire',
    notes: 'Long-range. Healing parts on body.',
    stages: [
      { stage: 1, hp: 17_920_249, atk: 21631, def: 4326 },
      { stage: 2, hp: 24_688_727, atk: 29046, def: 5808 },
      { stage: 3, hp: 24_688_727, atk: 29046, def: 5808 },
      { stage: 4, hp: 246_887_270, atk: 29046, def: 5808 },
      { stage: 5, hp: 246_887_270, atk: 29046, def: 5808 },
      { stage: 6, hp: 429_279_564, atk: 48289, def: 9660 },
      { stage: 7, hp: 429_279_564, atk: 48289, def: 9660 },
    ],
  },
  {
    id: 'doctor',
    name: 'Doctor',
    weakTo: 'Electric',
    notes: 'Mid-range. Radiation + heal parts.',
    stages: [
      { stage: 1, hp: 14_933_541, atk: 21631, def: 4326 },
      { stage: 2, hp: 20_573_939, atk: 29046, def: 5808 },
      { stage: 3, hp: 20_573_939, atk: 29046, def: 5808 },
      { stage: 4, hp: 205_739_394, atk: 29046, def: 5808 },
      { stage: 5, hp: 205_739_394, atk: 29046, def: 5808 },
      { stage: 6, hp: 357_732_974, atk: 48289, def: 9660 },
      { stage: 7, hp: 357_732_974, atk: 48289, def: 9660 },
    ],
  },
  {
    id: 'halo',
    name: 'Halo',
    weakTo: 'Water',
    notes: 'Close-range Angel Ring.',
    stages: [
      { stage: 1, hp: 14_933_541, atk: 21631, def: 4326 },
      { stage: 2, hp: 20_573_939, atk: 29046, def: 5808 },
      { stage: 3, hp: 20_573_939, atk: 29046, def: 5808 },
      { stage: 4, hp: 205_739_394, atk: 29046, def: 5808 },
      { stage: 5, hp: 205_739_394, atk: 29046, def: 5808 },
      { stage: 6, hp: 357_732_974, atk: 48289, def: 9660 },
      { stage: 7, hp: 357_732_974, atk: 48289, def: 9660 },
    ],
  },
  {
    id: 'modernia',
    name: 'Modernia',
    weakTo: 'Wind',
    notes: 'Tyrant. Missile / particle blades. High HP.',
    stages: [
      { stage: 1, hp: 55_828_468, atk: 21633, def: 4326 },
      { stage: 2, hp: 76_914_881, atk: 29037, def: 5808 },
      { stage: 3, hp: 76_914_881, atk: 29037, def: 5808 },
      { stage: 4, hp: 769_148_817, atk: 29037, def: 5808 },
      { stage: 5, hp: 769_148_817, atk: 29037, def: 5808 },
      { stage: 6, hp: 1_337_370_974, atk: 48306, def: 9660 },
      { stage: 7, hp: 1_337_370_974, atk: 48306, def: 9660 },
    ],
  },
  {
    id: 'stormbringer',
    name: 'Stormbringer',
    weakTo: 'Iron',
    notes: 'Long-range air boss. High DEF.',
    stages: [
      { stage: 1, hp: 51_176_096, atk: 21633, def: 5969 },
      { stage: 2, hp: 70_505_307, atk: 29037, def: 8013 },
      { stage: 3, hp: 70_505_307, atk: 29037, def: 8013 },
      { stage: 4, hp: 705_053_074, atk: 29037, def: 8013 },
      { stage: 5, hp: 705_053_074, atk: 29037, def: 8013 },
      { stage: 6, hp: 1_225_923_379, atk: 48306, def: 13329 },
      { stage: 7, hp: 1_225_923_379, atk: 48306, def: 13329 },
    ],
  },
]

/** Rotating / selectable bosses — HP not fixed in classic tables; enter manually. */
export const rotatingBossPresets: { id: string; name: string; weakTo?: string }[] = [
  { id: 'sinister', name: 'Sinister', weakTo: 'Wind' },
  { id: 'red-shoes', name: 'Red Shoes Replica', weakTo: 'Water' },
  { id: 'nihilister', name: 'Nihilister', weakTo: 'Fire' },
  { id: 'rebuild-torso', name: 'Rebuild Big Torso' },
  { id: 'ultra', name: 'Ultra', weakTo: 'Electric' },
  { id: 'land-eater', name: 'Land Eater' },
  { id: 'alteisen', name: 'Alteisen', weakTo: 'Fire' },
  { id: 'chatterbox', name: 'Chatterbox' },
]

export function getTemplateHp(bossId: string, stage: number): number | null {
  const tpl = unionBossTemplates.find((b) => b.id === bossId)
  const row = tpl?.stages.find((s) => s.stage === stage)
  return row?.hp ?? null
}

export function formatDamage(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return '0'
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(Math.round(n))
}

export function parseDamageInput(raw: string): number {
  const s = raw.trim().toLowerCase().replace(/,/g, '').replace(/_/g, '')
  if (!s) return 0
  const m = s.match(/^(\d+(?:\.\d+)?)\s*([kmb])?$/)
  if (!m) {
    const n = Number(s)
    return Number.isFinite(n) && n > 0 ? n : 0
  }
  const base = Number(m[1])
  const suf = m[2]
  if (suf === 'k') return base * 1_000
  if (suf === 'm') return base * 1_000_000
  if (suf === 'b') return base * 1_000_000_000
  return base
}
