import type { Nikke } from '../types'
import generated from './generated/nikkes.json'
import meta from './generated/meta.json'

export const catalog: Nikke[] = generated as Nikke[]
export const nikkeById = Object.fromEntries(catalog.map((n) => [n.id, n]))

export function resolveNikkeRef(ref: string): Nikke | undefined {
  const byId = nikkeById[ref]
  if (byId) return byId
  const q = ref.toLowerCase()
  return catalog.find((n) => n.name.toLowerCase() === q)
}

export const catalogMeta = {
  nikkeCount: (meta as { nikkeCount: number }).nikkeCount ?? catalog.length,
  version: (meta as { version: string }).version ?? 'unknown',
  source: (meta as { package?: string }).package ?? 'seed',
}

export const allManufacturers = [...new Set(catalog.map((n) => n.manufacturer))].sort()
export const allClasses = [...new Set(catalog.map((n) => n.class))].sort()
export const allWeapons = [...new Set(catalog.map((n) => n.weapon))].sort()
export const allElements = [...new Set(catalog.map((n) => n.element).filter(Boolean) as string[])].sort()
export const allRarities: Array<Nikke['rarity']> = ['SSR', 'SR', 'R']
