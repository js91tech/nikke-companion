export type Rarity = 'R' | 'SR' | 'SSR'
export type Burst = 1 | 2 | 3
export type NikkeClass = 'Attacker' | 'Defender' | 'Supporter'
export type Weapon = 'AR' | 'SMG' | 'SG' | 'SR' | 'RL' | 'MG'
export type Manufacturer =
  | 'Elysion'
  | 'Missilis'
  | 'Tetra'
  | 'Pilgrim'
  | 'Abnormal'
  | 'Other'
export type Element = 'Fire' | 'Wind' | 'Iron' | 'Electric' | 'Water' | string

export type StageMode =
  | 'campaign'
  | 'campaign-hard'
  | 'anomaly'
  | 'tower'
  | 'union'
  | 'solo'

export interface Nikke {
  id: string
  name: string
  rarity: Rarity
  burst: Burst
  burstLabel?: string
  class: NikkeClass
  weapon: Weapon
  weaponLabel?: string
  manufacturer: Manufacturer
  manufacturerLabel?: string
  element?: Element
  squad?: string
  specialties?: string[]
  releaseDate?: string
  sourceId?: number
  treasure?: boolean
  portraitUrl?: string
  cardUrl?: string
  notes?: string
}

export interface OwnedEntry {
  owned: boolean
  /** Limit Break 0–3 */
  limitBreak?: 0 | 1 | 2 | 3
  /** Skill levels 1–10 for S1/S2/Burst */
  skills?: [number, number, number]
  /** Number of Overload gear pieces invested (0–3) */
  olLines?: 0 | 1 | 2 | 3
}

export interface InventoryState {
  nikkes: Record<string, OwnedEntry>
  updatedAt: string
}

export interface TeamTemplate {
  id: string
  name: string
  purpose: string
  slots: string[]
  notes: string
}

export interface Stage {
  id: string
  mode: StageMode
  chapter: string
  name: string
  threat: number
  enemyNotes: string
  tips: string[]
  sampleTeams: { label: string; members: string[]; notes: string }[]
  /** Boss element / code when relevant */
  element?: string
  weakTo?: string
  strongAgainst?: string
  drops?: string
}
