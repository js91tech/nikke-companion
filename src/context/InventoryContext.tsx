import { createContext, useContext, type ReactNode } from 'react'
import type { InventoryState } from '../types'

const Ctx = createContext<{ inventory: InventoryState } | null>(null)

export function InventoryProvider({
  inventory,
  children,
}: {
  inventory: InventoryState
  children: ReactNode
}) {
  return <Ctx.Provider value={{ inventory }}>{children}</Ctx.Provider>
}

export function useInventoryContext() {
  return useContext(Ctx)
}
