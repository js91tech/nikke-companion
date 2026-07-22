import { catalog } from '../data/catalog'

export function normalizeQuery(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9:]+/g, '')
}

export function matchNameList(raw: string): {
  ids: string[]
  matched: string[]
  unmatched: string[]
  ambiguous: string[]
} {
  const ids: string[] = []
  const matched: string[] = []
  const unmatched: string[] = []
  const ambiguous: string[] = []
  const seen = new Set<string>()

  for (const part of raw.split(/[\n,;|]+/).map((p) => p.trim()).filter(Boolean)) {
    const q = normalizeQuery(part)
    const hits = catalog
      .map((n) => {
        const name = normalizeQuery(n.name)
        let score = 0
        if (name === q) score = 100
        else if (name.includes(q) || q.includes(name)) score = 80
        return { n, score }
      })
      .filter((x) => x.score >= 80)
      .sort((a, b) => b.score - a.score)

    if (hits.length === 0) unmatched.push(part)
    else if (hits.length > 1 && hits[0].score < 100 && hits[0].score === hits[1].score) {
      ambiguous.push(part)
    } else {
      matched.push(hits[0].n.name)
      if (!seen.has(hits[0].n.id)) {
        seen.add(hits[0].n.id)
        ids.push(hits[0].n.id)
      }
    }
  }
  return { ids, matched, unmatched, ambiguous }
}
