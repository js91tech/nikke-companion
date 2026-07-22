import { useCallback, useEffect, useState } from 'react'
import {
  emptyInventory,
  exportInventory,
  importInventory,
  loadInventory,
  normalizeOwnedEntry,
  saveInventory,
} from '../lib/inventory'
import type { InventoryState, OwnedEntry } from '../types'

export function useInventory() {
  const [inventory, setInventory] = useState<InventoryState>(() => loadInventory())

  useEffect(() => {
    saveInventory(inventory)
  }, [inventory])

  const toggleNikke = useCallback((id: string) => {
    setInventory((prev) => {
      const current = prev.nikkes[id]
      const owned = !(current?.owned ?? false)
      return {
        ...prev,
        nikkes: {
          ...prev.nikkes,
          [id]: owned
            ? normalizeOwnedEntry({ ...current, owned: true })
            : { owned: false },
        },
      }
    })
  }, [])

  const setNikkesOwned = useCallback((ids: string[], owned: boolean) => {
    if (ids.length === 0) return
    setInventory((prev) => {
      const nikkes = { ...prev.nikkes }
      for (const id of ids) {
        nikkes[id] = owned
          ? normalizeOwnedEntry({ ...nikkes[id], owned: true })
          : { owned: false }
      }
      return { ...prev, nikkes }
    })
  }, [])

  const patchNikke = useCallback((id: string, patch: Partial<OwnedEntry>) => {
    setInventory((prev) => {
      const current = prev.nikkes[id]
      const next = normalizeOwnedEntry({
        ...current,
        owned: patch.owned ?? current?.owned ?? true,
        ...patch,
      })
      if (!next.owned) {
        return { ...prev, nikkes: { ...prev.nikkes, [id]: { owned: false } } }
      }
      return { ...prev, nikkes: { ...prev.nikkes, [id]: next } }
    })
  }, [])

  const reset = useCallback(() => setInventory(emptyInventory()), [])

  const replaceInventory = useCallback((state: InventoryState) => {
    setInventory({
      nikkes: Object.fromEntries(
        Object.entries(state.nikkes ?? {}).map(([id, e]) => [id, normalizeOwnedEntry(e)]),
      ),
      updatedAt: new Date().toISOString(),
    })
  }, [])

  const download = useCallback(() => {
    const blob = new Blob([exportInventory(inventory)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `nikke-roster-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [inventory])

  const upload = useCallback(async (file: File) => {
    setInventory(importInventory(await file.text()))
  }, [])

  const ownedCount = Object.values(inventory.nikkes).filter((n) => n.owned).length

  return {
    inventory,
    toggleNikke,
    setNikkesOwned,
    patchNikke,
    reset,
    replaceInventory,
    download,
    upload,
    ownedCount,
  }
}
