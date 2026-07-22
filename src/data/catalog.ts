import type { Nikke } from '../types'

/** Starter curated roster — expand later with a full catalog import. */
const raw: Nikke[] = [
  { id: 'rapi', name: 'Rapi', rarity: 'SR', burst: 3, class: 'Attacker', weapon: 'AR', manufacturer: 'Elysion' },
  { id: 'anis', name: 'Anis', rarity: 'SR', burst: 2, class: 'Defender', weapon: 'SG', manufacturer: 'Tetra' },
  { id: 'neon', name: 'Neon', rarity: 'SR', burst: 1, class: 'Supporter', weapon: 'RL', manufacturer: 'Missilis' },
  { id: 'liter', name: 'Liter', rarity: 'SSR', burst: 1, class: 'Supporter', weapon: 'SMG', manufacturer: 'Missilis', notes: 'Top B1 battery.' },
  { id: 'dorothy', name: 'Dorothy', rarity: 'SSR', burst: 1, class: 'Supporter', weapon: 'AR', manufacturer: 'Pilgrim' },
  { id: 'naga', name: 'Naga', rarity: 'SSR', burst: 2, class: 'Supporter', weapon: 'SG', manufacturer: 'Tetra' },
  { id: 'tia', name: 'Tia', rarity: 'SSR', burst: 2, class: 'Defender', weapon: 'RL', manufacturer: 'Tetra' },
  { id: 'blanc', name: 'Blanc', rarity: 'SSR', burst: 2, class: 'Defender', weapon: 'SG', manufacturer: 'Tetra' },
  { id: 'noir', name: 'Noir', rarity: 'SSR', burst: 3, class: 'Attacker', weapon: 'SG', manufacturer: 'Tetra' },
  { id: 'crown', name: 'Crown', rarity: 'SSR', burst: 2, class: 'Defender', weapon: 'AR', manufacturer: 'Pilgrim' },
  { id: 'scarlet', name: 'Scarlet', rarity: 'SSR', burst: 3, class: 'Attacker', weapon: 'AR', manufacturer: 'Pilgrim' },
  { id: 'scarlet-bs', name: 'Scarlet: Black Shadow', rarity: 'SSR', burst: 3, class: 'Attacker', weapon: 'AR', manufacturer: 'Pilgrim' },
  { id: 'modernia', name: 'Modernia', rarity: 'SSR', burst: 3, class: 'Attacker', weapon: 'MG', manufacturer: 'Pilgrim' },
  { id: 'alice', name: 'Alice', rarity: 'SSR', burst: 3, class: 'Attacker', weapon: 'SR', manufacturer: 'Tetra' },
  { id: 'red-hood', name: 'Red Hood', rarity: 'SSR', burst: 3, class: 'Attacker', weapon: 'SR', manufacturer: 'Pilgrim' },
  { id: 'helm', name: 'Helm', rarity: 'SSR', burst: 2, class: 'Supporter', weapon: 'SR', manufacturer: 'Elysion' },
  { id: 'privaty', name: 'Privaty', rarity: 'SSR', burst: 3, class: 'Attacker', weapon: 'AR', manufacturer: 'Elysion' },
  { id: 'maxwell', name: 'Maxwell', rarity: 'SSR', burst: 3, class: 'Attacker', weapon: 'SR', manufacturer: 'Missilis' },
  { id: 'drake', name: 'Drake', rarity: 'SSR', burst: 3, class: 'Attacker', weapon: 'SG', manufacturer: 'Missilis' },
  { id: 'sugar', name: 'Sugar', rarity: 'SSR', burst: 3, class: 'Attacker', weapon: 'SG', manufacturer: 'Tetra' },
  { id: 'centi', name: 'Centi', rarity: 'SSR', burst: 2, class: 'Defender', weapon: 'RL', manufacturer: 'Missilis' },
  { id: 'noah', name: 'Noah', rarity: 'SSR', burst: 2, class: 'Defender', weapon: 'RL', manufacturer: 'Pilgrim' },
  { id: 'rapunzel', name: 'Rapunzel', rarity: 'SSR', burst: 1, class: 'Supporter', weapon: 'RL', manufacturer: 'Pilgrim' },
  { id: 'snow-white', name: 'Snow White', rarity: 'SSR', burst: 3, class: 'Attacker', weapon: 'AR', manufacturer: 'Pilgrim' },
  { id: 'harran', name: 'Harran', rarity: 'SSR', burst: 3, class: 'Attacker', weapon: 'SR', manufacturer: 'Missilis' },
  { id: 'laplace', name: 'Laplace', rarity: 'SSR', burst: 3, class: 'Attacker', weapon: 'RL', manufacturer: 'Missilis' },
  { id: 'jackal', name: 'Jackal', rarity: 'SSR', burst: 1, class: 'Supporter', weapon: 'SMG', manufacturer: 'Missilis' },
  { id: 'volume', name: 'Volume', rarity: 'SSR', burst: 1, class: 'Supporter', weapon: 'SMG', manufacturer: 'Tetra' },
  { id: 'pepper', name: 'Pepper', rarity: 'SSR', burst: 1, class: 'Supporter', weapon: 'SG', manufacturer: 'Missilis' },
  { id: 'diesel', name: 'Diesel', rarity: 'SSR', burst: 2, class: 'Defender', weapon: 'MG', manufacturer: 'Elysion' },
  { id: 'maiden', name: 'Maiden', rarity: 'SSR', burst: 3, class: 'Attacker', weapon: 'SG', manufacturer: 'Elysion' },
  { id: 's-anis', name: 'Anis: Sparkling Summer', rarity: 'SSR', burst: 3, class: 'Attacker', weapon: 'RL', manufacturer: 'Tetra' },
  { id: 's-helm', name: 'Helm: Aquamarine', rarity: 'SSR', burst: 3, class: 'Attacker', weapon: 'SR', manufacturer: 'Elysion' },
  { id: 'cinderella', name: 'Cinderella', rarity: 'SSR', burst: 3, class: 'Attacker', weapon: 'SG', manufacturer: 'Abnormal' },
  { id: 'little-mermaid', name: 'Little Mermaid', rarity: 'SSR', burst: 1, class: 'Supporter', weapon: 'SR', manufacturer: 'Abnormal' },
  { id: 'siren', name: 'Siren', rarity: 'SSR', burst: 3, class: 'Attacker', weapon: 'MG', manufacturer: 'Abnormal' },
  { id: 'ein', name: 'Ein', rarity: 'SSR', burst: 3, class: 'Attacker', weapon: 'SMG', manufacturer: 'Missilis' },
  { id: 'zwei', name: 'Zwei', rarity: 'SSR', burst: 2, class: 'Supporter', weapon: 'AR', manufacturer: 'Missilis' },
  { id: 'quency', name: 'Quency', rarity: 'SSR', burst: 2, class: 'Attacker', weapon: 'SMG', manufacturer: 'Missilis' },
  { id: 'guilty', name: 'Guilty', rarity: 'SSR', burst: 2, class: 'Defender', weapon: 'SG', manufacturer: 'Missilis' },
  { id: 'sin', name: 'Sin', rarity: 'SSR', burst: 2, class: 'Defender', weapon: 'SMG', manufacturer: 'Missilis' },
  { id: 'd', name: 'D', rarity: 'SSR', burst: 3, class: 'Attacker', weapon: 'SMG', manufacturer: 'Elysion' },
  { id: 'admi', name: 'Admi', rarity: 'SSR', burst: 2, class: 'Supporter', weapon: 'SR', manufacturer: 'Missilis' },
  { id: 'mary', name: 'Mary', rarity: 'SR', burst: 1, class: 'Supporter', weapon: 'SR', manufacturer: 'Elysion' },
  { id: 'n102', name: 'N102', rarity: 'SR', burst: 1, class: 'Supporter', weapon: 'RL', manufacturer: 'Missilis' },
  { id: 'mira', name: 'Miranda', rarity: 'SR', burst: 2, class: 'Supporter', weapon: 'SMG', manufacturer: 'Elysion' },
  { id: 'novel', name: 'Novel', rarity: 'SSR', burst: 2, class: 'Supporter', weapon: 'SMG', manufacturer: 'Tetra' },
  { id: 'polly', name: 'Polly', rarity: 'SSR', burst: 1, class: 'Supporter', weapon: 'RL', manufacturer: 'Elysion' },
]

export const catalog: Nikke[] = raw
export const nikkeById = Object.fromEntries(catalog.map((n) => [n.id, n]))

export function resolveNikkeRef(ref: string): Nikke | undefined {
  const byId = nikkeById[ref]
  if (byId) return byId
  const q = ref.toLowerCase()
  return catalog.find((n) => n.name.toLowerCase() === q)
}

export const catalogMeta = {
  nikkeCount: catalog.length,
  version: 'seed-v1',
}

export const allManufacturers = [...new Set(catalog.map((n) => n.manufacturer))].sort()
export const allClasses = [...new Set(catalog.map((n) => n.class))].sort()
export const allWeapons = [...new Set(catalog.map((n) => n.weapon))].sort()
export const allRarities: Array<Nikke['rarity']> = ['SSR', 'SR', 'R']
