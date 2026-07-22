import { catalog } from '../data/catalog'
import { STORY_TIER_SCORE } from '../data/metaSource'
import { investmentScore } from './inventory'
import type { Burst, InventoryState, Manufacturer, Nikke } from '../types'

export type TeamGoal = 'campaign' | 'boss' | 'tower' | 'raid'

export interface BuildContext {
  /** Prefer this element (boss weakTo). */
  weakTo?: string
  /** Avoid this element (boss strongAgainst / punish). */
  avoidElement?: string
  /** Tribe tower manufacturer lock. */
  manufacturer?: Manufacturer
  /** Already used Nikke ids (multi-squad). */
  excludeIds?: string[]
}

export interface BuiltTeam {
  goal: TeamGoal
  label: string
  members: Nikke[]
  score: number
  burstCounts: Record<Burst, number>
  notes: string
  context?: BuildContext
}

const RARITY: Record<string, number> = { R: 1, SR: 3, SSR: 6 }

const GOAL_META: Record<TeamGoal, { label: string; notes: string }> = {
  campaign: {
    label: 'Campaign',
    notes: 'Prydwen Story meta — prefer Anis: Star / Siren B1 and Crown / Maid Mast enables.',
  },
  boss: {
    label: 'Boss / Raid',
    notes: 'Element-aware bossing — boosts weakTo carries + Crown/Maid enables.',
  },
  tower: {
    label: 'Tribe Tower',
    notes: 'Manufacturer-filtered when set; B1 depth matters.',
  },
  raid: {
    label: 'Solo / Union Raid',
    notes: 'Element-ready carries; use multi-squad to spread batteries.',
  },
}

function ownedPool(inv: InventoryState, ctx: BuildContext = {}): Nikke[] {
  const exclude = new Set(ctx.excludeIds ?? [])
  return catalog.filter((n) => {
    if (!inv.nikkes[n.id]?.owned) return false
    if (exclude.has(n.id)) return false
    if (ctx.manufacturer && n.manufacturer !== ctx.manufacturer) return false
    return true
  })
}

export function scoreNikke(n: Nikke, goal: TeamGoal, inv: InventoryState, ctx: BuildContext = {}): number {
  let s = RARITY[n.rarity] ?? 2
  s += STORY_TIER_SCORE[n.name] ?? 0
  s += investmentScore(inv.nikkes[n.id])

  if (goal === 'campaign' && n.burst === 1) s += 3
  if (goal === 'boss' && n.burst === 3) s += 4
  if (goal === 'boss' && (n.name === 'Crown' || n.name === 'Naga' || n.name === 'Mast: Romantic Maid')) s += 2
  if (goal === 'raid' && n.burst === 3) s += 3
  if (goal === 'tower' && n.burst === 1) s += 2

  if (ctx.weakTo && n.element === ctx.weakTo) s += 8
  if (ctx.avoidElement && n.element === ctx.avoidElement) s -= 10

  if (n.name.includes('Siren') || n.name.includes('Little Mermaid')) s = Math.max(s, 18)

  return s
}

export function buildTeamFromInventory(
  inv: InventoryState,
  goal: TeamGoal,
  ctx: BuildContext = {},
): BuiltTeam {
  const pool = ownedPool(inv, ctx)
  const used = new Set<string>()
  const members: Nikke[] = []
  const meta = GOAL_META[goal]

  const pickBurst = (burst: Burst) => {
    const pick = pool
      .filter((n) => !used.has(n.id) && n.burst === burst)
      .sort((a, b) => scoreNikke(b, goal, inv, ctx) - scoreNikke(a, goal, inv, ctx))[0]
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

  while (members.length < 5) {
    const next = pool
      .filter((n) => !used.has(n.id))
      .sort((a, b) => scoreNikke(b, goal, inv, ctx) - scoreNikke(a, goal, inv, ctx))[0]
    if (!next) break
    used.add(next.id)
    members.push(next)
  }

  const burstCounts: Record<Burst, number> = { 1: 0, 2: 0, 3: 0 }
  for (const m of members) burstCounts[m.burst]++

  const score =
    members.reduce((sum, n) => sum + scoreNikke(n, goal, inv, ctx), 0) +
    (burstCounts[1] > 0 ? 8 : 0) +
    (burstCounts[3] >= 2 ? 5 : 0)

  const elemNote =
    ctx.weakTo || ctx.avoidElement
      ? ` WeakTo ${ctx.weakTo ?? '—'}; avoid ${ctx.avoidElement ?? '—'}.`
      : ''

  return {
    goal,
    label: meta.label,
    members,
    score,
    burstCounts,
    context: ctx,
    notes:
      pool.length < 5
        ? 'Log more Nikkes in Roster for better teams.'
        : burstCounts[1] === 0
          ? 'No B1 owned — full burst will feel slow. Prioritize Anis: Star / Siren / Liter.'
          : meta.notes + elemNote,
  }
}

export function buildAllGoalTeams(inv: InventoryState, ctx: BuildContext = {}): BuiltTeam[] {
  const goals: TeamGoal[] = ['campaign', 'boss', 'tower', 'raid']
  return goals.map((g) => buildTeamFromInventory(inv, g, ctx)).sort((a, b) => b.score - a.score)
}

/** Build multiple squads without reusing units (Solo / UR depth). */
export function buildMultiSquads(
  inv: InventoryState,
  goal: TeamGoal,
  count: number,
  ctx: BuildContext = {},
): BuiltTeam[] {
  const excludeIds = [...(ctx.excludeIds ?? [])]
  const out: BuiltTeam[] = []
  for (let i = 0; i < count; i++) {
    const team = buildTeamFromInventory(inv, goal, { ...ctx, excludeIds: [...excludeIds] })
    if (team.members.length === 0) break
    out.push({ ...team, label: `${team.label} · Squad ${i + 1}` })
    for (const m of team.members) excludeIds.push(m.id)
  }
  return out
}
