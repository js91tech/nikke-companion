import { catalog } from '../data/catalog'
import type { Burst, InventoryState, Nikke } from '../types'

export type TeamGoal = 'campaign' | 'boss' | 'tower' | 'raid'

export interface BuiltTeam {
  goal: TeamGoal
  label: string
  members: Nikke[]
  score: number
  burstCounts: Record<Burst, number>
  notes: string
}

const RARITY: Record<string, number> = { R: 1, SR: 3, SSR: 7 }

const GOAL_META: Record<TeamGoal, { label: string; notes: string }> = {
  campaign: { label: 'Campaign', notes: 'Balanced burst rotation with a reliable B1.' },
  boss: { label: 'Boss / Raid', notes: 'High DPS B3s with strong B2 enablers.' },
  tower: { label: 'Tribe Tower', notes: 'Prefer owned depth; manufacturer limits apply in-game.' },
  raid: { label: 'Solo / Union Raid', notes: 'Maximize burst windows and element-ready carries.' },
}

function owned(inv: InventoryState): Nikke[] {
  return catalog.filter((n) => inv.nikkes[n.id]?.owned)
}

function scoreNikke(n: Nikke, goal: TeamGoal): number {
  let s = RARITY[n.rarity] ?? 2
  if (goal === 'campaign' && n.burst === 1) s += 4
  if (goal === 'boss' && n.burst === 3) s += 5
  if (goal === 'boss' && n.class === 'Defender') s += 2
  if (goal === 'raid' && n.burst === 3) s += 4
  if (n.name === 'Liter' || n.name === 'Dorothy' || n.name === 'Crown') s += 3
  if (n.name.includes('Scarlet') || n.name === 'Modernia' || n.name === 'Alice' || n.name === 'Red Hood') s += 3
  return s
}

export function buildTeamFromInventory(inv: InventoryState, goal: TeamGoal): BuiltTeam {
  const pool = owned(inv)
  const used = new Set<string>()
  const members: Nikke[] = []
  const meta = GOAL_META[goal]

  const pickBurst = (burst: Burst, prefer?: (n: Nikke) => boolean) => {
    const pick = pool
      .filter((n) => !used.has(n.id) && n.burst === burst && (!prefer || prefer(n)))
      .sort((a, b) => scoreNikke(b, goal) - scoreNikke(a, goal))[0]
      ?? pool
        .filter((n) => !used.has(n.id) && n.burst === burst)
        .sort((a, b) => scoreNikke(b, goal) - scoreNikke(a, goal))[0]
    if (pick) {
      used.add(pick.id)
      members.push(pick)
    }
  }

  pickBurst(1)
  pickBurst(2)
  pickBurst(2)
  pickBurst(3)
  pickBurst(3)

  // Fill remaining slots with best leftover
  while (members.length < 5) {
    const next = pool
      .filter((n) => !used.has(n.id))
      .sort((a, b) => scoreNikke(b, goal) - scoreNikke(a, goal))[0]
    if (!next) break
    used.add(next.id)
    members.push(next)
  }

  const burstCounts: Record<Burst, number> = { 1: 0, 2: 0, 3: 0 }
  for (const m of members) burstCounts[m.burst]++

  const score =
    members.reduce((sum, n) => sum + scoreNikke(n, goal), 0) +
    (burstCounts[1] > 0 ? 8 : 0) +
    (burstCounts[3] >= 2 ? 5 : 0)

  return {
    goal,
    label: meta.label,
    members,
    score,
    burstCounts,
    notes:
      pool.length < 5
        ? 'Log more Nikkes in Roster for better teams.'
        : burstCounts[1] === 0
          ? 'No B1 owned — full burst will feel slow. Pull/invest in a battery.'
          : meta.notes,
  }
}

export function buildAllGoalTeams(inv: InventoryState): BuiltTeam[] {
  const goals: TeamGoal[] = ['campaign', 'boss', 'tower', 'raid']
  return goals.map((g) => buildTeamFromInventory(inv, g)).sort((a, b) => b.score - a.score)
}
