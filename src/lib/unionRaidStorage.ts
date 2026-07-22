import { UNION_RAID_MAX_ATTEMPTS } from '../data/unionRaid'

const KEY = 'nkc-union-raid-v1'

export interface UrMember {
  id: string
  name: string
  /** Mock battle damage per attempt slot (1–3). */
  mocks: [number, number, number]
}

export interface UrBossRow {
  id: string
  templateId: string
  name: string
  stage: number
  remainingHp: number
  enabled: boolean
}

export interface UnionRaidState {
  members: UrMember[]
  bosses: UrBossRow[]
  /** Real ≈ mock × factor (default 0.8). */
  mockFactor: number
  allowFinishOverkill: boolean
  updatedAt: string
}

export function defaultUnionRaidState(): UnionRaidState {
  return {
    members: [],
    bosses: [],
    mockFactor: 0.8,
    allowFinishOverkill: true,
    updatedAt: new Date().toISOString(),
  }
}

export function loadUnionRaidState(): UnionRaidState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultUnionRaidState()
    const parsed = JSON.parse(raw) as Partial<UnionRaidState>
    return {
      ...defaultUnionRaidState(),
      ...parsed,
      members: Array.isArray(parsed.members) ? parsed.members : [],
      bosses: Array.isArray(parsed.bosses) ? parsed.bosses : [],
      mockFactor: typeof parsed.mockFactor === 'number' ? parsed.mockFactor : 0.8,
      allowFinishOverkill: parsed.allowFinishOverkill !== false,
    }
  } catch {
    return defaultUnionRaidState()
  }
}

export function saveUnionRaidState(state: UnionRaidState): void {
  localStorage.setItem(
    KEY,
    JSON.stringify({ ...state, updatedAt: new Date().toISOString() }),
  )
}

export function newMember(name = 'Commander'): UrMember {
  return {
    id: `m-${crypto.randomUUID()}`,
    name,
    mocks: [0, 0, 0],
  }
}

export function newBossRow(
  templateId: string,
  name: string,
  stage: number,
  hp: number,
): UrBossRow {
  return {
    id: `b-${crypto.randomUUID()}`,
    templateId,
    name,
    stage,
    remainingHp: hp,
    enabled: true,
  }
}

export function normalizeMocks(mocks: number[]): [number, number, number] {
  const out: [number, number, number] = [0, 0, 0]
  for (let i = 0; i < UNION_RAID_MAX_ATTEMPTS; i++) {
    out[i] = Math.max(0, Number(mocks[i]) || 0)
  }
  return out
}
