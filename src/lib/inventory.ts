import type { InventoryState } from '../types'

const STORAGE_KEY = 'nkc-inventory-v1'

export const emptyInventory = (): InventoryState => ({
  nikkes: {},
  updatedAt: new Date().toISOString(),
})

export function loadInventory(): InventoryState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyInventory()
    const parsed = JSON.parse(raw) as InventoryState
    return {
      nikkes: parsed.nikkes ?? {},
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
    nikkes: parsed.nikkes ?? {},
    updatedAt: new Date().toISOString(),
  }
}
