import type { InventoryState, OwnedEntry } from '../types'

const STORAGE_KEY = 'nkc-inventory-v1'

export const emptyInventory = (): InventoryState => ({
  nikkes: {},
  updatedAt: new Date().toISOString(),
})

export function normalizeOwnedEntry(raw: Partial<OwnedEntry> | undefined): OwnedEntry {
  const owned = Boolean(raw?.owned)
  const limitBreak = clampLb(raw?.limitBreak)
  const olLines = clampOl(raw?.olLines)
  const skills = normalizeSkills(raw?.skills)
  const entry: OwnedEntry = { owned }
  if (owned && limitBreak) entry.limitBreak = limitBreak
  if (owned && olLines) entry.olLines = olLines
  if (owned && skills) entry.skills = skills
  return entry
}

function clampLb(n: unknown): 0 | 1 | 2 | 3 {
  const v = Number(n)
  if (!Number.isFinite(v) || v <= 0) return 0
  if (v >= 3) return 3
  if (v >= 2) return 2
  return 1
}

function clampOl(n: unknown): 0 | 1 | 2 | 3 {
  return clampLb(n)
}

function normalizeSkills(raw: unknown): [number, number, number] | undefined {
  if (!Array.isArray(raw) || raw.length < 3) return undefined
  const out: [number, number, number] = [
    clampSkill(raw[0]),
    clampSkill(raw[1]),
    clampSkill(raw[2]),
  ]
  if (out[0] <= 1 && out[1] <= 1 && out[2] <= 1) return undefined
  return out
}

function clampSkill(n: unknown): number {
  const v = Math.round(Number(n))
  if (!Number.isFinite(v) || v < 1) return 1
  return Math.min(10, v)
}

function migrateNikkes(raw: Record<string, Partial<OwnedEntry>> | undefined): Record<string, OwnedEntry> {
  const out: Record<string, OwnedEntry> = {}
  if (!raw) return out
  for (const [id, e] of Object.entries(raw)) {
    out[id] = normalizeOwnedEntry(e)
  }
  return out
}

export function loadInventory(): InventoryState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyInventory()
    const parsed = JSON.parse(raw) as InventoryState
    return {
      nikkes: migrateNikkes(parsed.nikkes),
      updatedAt: parsed.updatedAt ?? new Date().toISOString(),
    }
  } catch {
    return emptyInventory()
  }
}

export function saveInventory(state: InventoryState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, updatedAt: new Date().toISOString() }))
}

export function exportInventory(state: InventoryState): string {
  return JSON.stringify(state, null, 2)
}

export function importInventory(json: string): InventoryState {
  const parsed = JSON.parse(json) as InventoryState
  if (!parsed || typeof parsed !== 'object') throw new Error('Invalid inventory file')
  return {
    nikkes: migrateNikkes(parsed.nikkes),
    updatedAt: new Date().toISOString(),
  }
}

export function investmentScore(entry: OwnedEntry | undefined): number {
  if (!entry?.owned) return 0
  return (entry.limitBreak ?? 0) * 2 + (entry.olLines ?? 0) * 3 + ((entry.skills?.[2] ?? 1) - 1) * 0.5
}
