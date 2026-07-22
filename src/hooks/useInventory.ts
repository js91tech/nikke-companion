import { useCallback, useEffect, useState } from 'react'
import {
  emptyInventory,
  exportInventory,
  importInventory,
  loadInventory,
  saveInventory,
} from '../lib/inventory'
import type { InventoryState } from '../types'

export function useInventory() {
  const [inventory, setInventory] = useState<InventoryState>(() => loadInventory())

  useEffect(() => {
    saveInventory(inventory)
  }, [inventory])

  const toggleNikke = useCallback((id: string) => {
    setInventory((prev) => {
      const current = prev.nikkes[id]?.owned ?? false
      return {
        ...prev,
        nikkes: { ...prev.nikkes, [id]: { owned: !current } },
      }
    })
  }, [])

  const setNikkesOwned = useCallback((ids: string[], owned: boolean) => {
    if (ids.length === 0) return
    setInventory((prev) => {
      const nikkes = { ...prev.nikkes }
      for (const id of ids) nikkes[id] = { owned }
      return { ...prev, nikkes }
    })
  }, [])

  const reset = useCallback(() => setInventory(emptyInventory()), [])

  const replaceInventory = useCallback((state: InventoryState) => {
    setInventory({
      nikkes: state.nikkes ?? {},
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
    reset,
    replaceInventory,
    download,
    upload,
    ownedCount,
  }
}
