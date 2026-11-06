import { catalog } from '../data/catalog'
import type { Nikke } from '../types'

/** Normalized query → catalog display name (common player shorthand). */
export const NAME_ALIASES: Record<string, string> = {
  siren: 'Little Mermaid (Siren)',
  littlemermaid: 'Little Mermaid (Siren)',
  mermaid: 'Little Mermaid (Siren)',
  sbs: 'Scarlet: Black Shadow',
  blackshadow: 'Scarlet: Black Shadow',
  scarletbs: 'Scarlet: Black Shadow',
  rh: 'Red Hood',
  redhood: 'Red Hood',
  anisstar: 'Anis: Star',
  staranis: 'Anis: Star',
  summeranis: 'Anis: Sparkling Summer',
  anissummer: 'Anis: Sparkling Summer',
  sparklinganis: 'Anis: Sparkling Summer',
  maidmast: 'Mast: Romantic Maid',
  romanticmaid: 'Mast: Romantic Maid',
  mastmaid: 'Mast: Romantic Maid',
  bunnyalice: 'Alice: Wonderland Bunny',
  wonderlandbunny: 'Alice: Wonderland Bunny',
  alicebunny: 'Alice: Wonderland Bunny',
  sw: 'Snow White',
  snowwhite: 'Snow White',
  innocentdays: 'Snow White: Innocent Days',
  heavyarms: 'Snow White: Heavy Arms',
  modernia: 'Modernia',
  crown: 'Crown',
  liter: 'Liter',
  naga: 'Naga',
  tia: 'Tia',
  blanc: 'Blanc',
  noir: 'Noir',
}

export function normalizeQuery(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9:]+/g, '')
}

export interface MatchCandidate {
  id: string
  name: string
  score: number
}

export interface AmbiguousHit {
  query: string
  candidates: MatchCandidate[]
}

export interface NameMatchResult {
  ids: string[]
  matched: string[]
  unmatched: string[]
  ambiguous: string[]
  ambiguousHits: AmbiguousHit[]
}

function candidatesFor(query: string): MatchCandidate[] {
  const q = normalizeQuery(query)
  if (!q) return []

  const aliasName = NAME_ALIASES[q]
  if (aliasName) {
    const n = catalog.find((c) => c.name === aliasName)
    if (n) return [{ id: n.id, name: n.name, score: 100 }]
  }

  return catalog
    .map((n) => {
      const name = normalizeQuery(n.name)
      let score = 0
      if (name === q) score = 100
      else if (name.startsWith(q) || q.startsWith(name)) score = 90
      else if (name.includes(q) || q.includes(name)) score = 80
      return { id: n.id, name: n.name, score }
    })
    .filter((x) => x.score >= 80)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
}

export function matchNameList(raw: string): NameMatchResult {
  const ids: string[] = []
  const matched: string[] = []
  const unmatched: string[] = []
  const ambiguous: string[] = []
  const ambiguousHits: AmbiguousHit[] = []
  const seen = new Set<string>()

  for (const part of raw.split(/[\n,;|]+/).map((p) => p.trim()).filter(Boolean)) {
    const hits = candidatesFor(part)

    if (hits.length === 0) {
      unmatched.push(part)
      continue
    }

    const top = hits[0]
    const tied =
      hits.length > 1 && top.score < 100 && hits.filter((h) => h.score === top.score).length > 1

    if (tied) {
      const group = hits.filter((h) => h.score === top.score)
      ambiguous.push(part)
      ambiguousHits.push({ query: part, candidates: group })
      continue
    }

    matched.push(top.name)
    if (!seen.has(top.id)) {
      seen.add(top.id)
      ids.push(top.id)
    }
  }

  return { ids, matched, unmatched, ambiguous, ambiguousHits }
}

export function searchCandidates(query: string, limit = 8): MatchCandidate[] {
  return candidatesFor(query).slice(0, limit)
}

export function nikkeFromCandidate(c: MatchCandidate): Nikke | undefined {
  return catalog.find((n) => n.id === c.id)
}
