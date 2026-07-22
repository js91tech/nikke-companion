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

export interface Nikke {
  id: string
  name: string
  rarity: Rarity
  burst: Burst
  class: NikkeClass
  weapon: Weapon
  manufacturer: Manufacturer
  notes?: string
}

export interface OwnedEntry {
  owned: boolean
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
  mode: 'campaign' | 'tower' | 'union' | 'solo'
  chapter: string
  name: string
  threat: number
  enemyNotes: string
  tips: string[]
  sampleTeams: { label: string; members: string[]; notes: string }[]
}
