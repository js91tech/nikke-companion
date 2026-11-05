import { catalog, resolveNikkeRef } from '../data/catalog'
import { PVP_TIER_SCORE, STORY_TIER_SCORE } from '../data/metaSource'
import {
  PVP_ATTACK_STARTER_IDS,
  PVP_DEFENSE_STARTER_IDS,
  pvpArchetypes,
  type PvpArchetype,
} from '../data/pvpTeams'
import { investmentScore } from './inventory'
import type { Burst, InventoryState, Manufacturer, Nikke, Stage } from '../types'

export type TeamGoal = 'campaign' | 'campaign-hard' | 'boss' | 'tower' | 'raid' | 'pvp'

export interface BuildContext {
  /** Prefer this element (boss weakTo). */
  weakTo?: string
  /** Avoid this element (boss strongAgainst / punish). */
  avoidElement?: string
  /** Tribe tower manufacturer lock. */
  manufacturer?: Manufacturer
  /** Already used Nikke ids (multi-squad). */
  excludeIds?: string[]
  /** Stage label for notes. */
  stageName?: string
  /** Prefer sustain / OL-heavy picks (Hard Mode). */
  hardMode?: boolean
}

export interface BuiltTeam {
  goal: TeamGoal
  label: string
  members: Nikke[]
  score: number
  burstCounts: Record<Burst, number>
  notes: string
  context?: BuildContext
  /** Template / archetype coverage when built from a named lineup. */
  coverage?: number
  missing?: string[]
}

const RARITY: Record<string, number> = { R: 1, SR: 3, SSR: 6 }

const GOAL_META: Record<TeamGoal, { label: string; notes: string }> = {
  campaign: {
    label: 'Campaign',
    notes: 'Prydwen Story meta — Anis: Star B1, Crown / Flora (Treasure) B2, Marian: Queen / Vesgod / RRH B3.',
  },
  'campaign-hard': {
    label: 'Hard Campaign',
    notes: 'Hard Mode — same Story cores with heavier weight on investment, sustain, and deficit carries.',
  },
  boss: {
    label: 'Boss / Raid',
    notes: 'Element-aware bossing — boosts weakTo carries + Crown/Maid/Flora enables.',
  },
  tower: {
    label: 'Tribe Tower',
    notes: 'Manufacturer-filtered when set; B1 depth matters.',
  },
  raid: {
    label: 'Solo / Union Raid',
    notes: 'Element-ready carries; use multi-squad to spread batteries.',
  },
  pvp: {
    label: 'SP Arena',
    notes: 'PvP meta — Scarlet+Jackal nukes and Biscuit+SAnis stalls; burst gen > Story tiers.',
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
  const entry = inv.nikkes[n.id]
  s += investmentScore(entry)

  if (goal === 'pvp') {
    s += PVP_TIER_SCORE[n.name] ?? 0
    if (n.weapon === 'RL' || n.weapon === 'SG') s += 1
    return s
  }

  s += STORY_TIER_SCORE[n.name] ?? 0

  if (goal === 'campaign' && n.burst === 1) s += 3
  if (goal === 'campaign-hard') {
    s += n.burst === 1 ? 4 : 0
    s += (entry?.olLines ?? 0) * 2
    s += (entry?.limitBreak ?? 0)
    if (n.class === 'Defender' || n.class === 'Supporter') s += 1
    if (n.name === 'Crown' || n.name === 'Flora (Treasure)' || n.name === 'Mast: Romantic Maid') s += 3
  }
  if (goal === 'boss' && n.burst === 3) s += 4
  if (goal === 'boss' && (n.name === 'Crown' || n.name === 'Naga' || n.name === 'Mast: Romantic Maid' || n.name === 'Flora (Treasure)'))
    s += 2
  if (goal === 'raid' && n.burst === 3) s += 3
  if (goal === 'tower' && n.burst === 1) s += 2

  if (ctx.weakTo && n.element === ctx.weakTo) s += 8
  if (ctx.avoidElement && n.element === ctx.avoidElement) s -= 10
  if (ctx.hardMode) {
    s += (entry?.olLines ?? 0) * 1.5
    if (n.name === 'Marian: Queen' || n.name === 'Vesti: Tactical Upgrade') s += 2
  }

  if (n.name.includes('Siren') || n.name.includes('Little Mermaid')) s = Math.max(s, 18)

  return s
}

function burstCountsOf(members: Nikke[]): Record<Burst, number> {
  const burstCounts: Record<Burst, number> = { 1: 0, 2: 0, 3: 0 }
  for (const m of members) burstCounts[m.burst]++
  return burstCounts
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
  const scoreGoal: TeamGoal = goal === 'pvp' ? 'pvp' : goal

  const pickBurst = (burst: Burst) => {
    const pick = pool
      .filter((n) => !used.has(n.id) && n.burst === burst)
      .sort((a, b) => scoreNikke(b, scoreGoal, inv, ctx) - scoreNikke(a, scoreGoal, inv, ctx))[0]
    if (pick) {
      used.add(pick.id)
      members.push(pick)
    }
  }

  if (goal === 'pvp') {
    // Prefer high burst-gen shape: B1, B2, B2/flex, B3, battery
    pickBurst(1)
    pickBurst(2)
    pickBurst(3)
    pickBurst(1)
    pickBurst(2)
  } else if (goal === 'campaign-hard') {
    pickBurst(1)
    pickBurst(2)
    pickBurst(2)
    pickBurst(3)
    pickBurst(3)
  } else {
    pickBurst(1)
    pickBurst(2)
    pickBurst(2)
    pickBurst(3)
    pickBurst(3)
  }

  while (members.length < 5) {
    const next = pool
      .filter((n) => !used.has(n.id))
      .sort((a, b) => scoreNikke(b, scoreGoal, inv, ctx) - scoreNikke(a, scoreGoal, inv, ctx))[0]
    if (!next) break
    used.add(next.id)
    members.push(next)
  }

  const burstCounts = burstCountsOf(members)

  const score =
    members.reduce((sum, n) => sum + scoreNikke(n, scoreGoal, inv, ctx), 0) +
    (burstCounts[1] > 0 ? 8 : 0) +
    (burstCounts[3] >= 2 ? 5 : 0)

  const elemNote =
    ctx.weakTo || ctx.avoidElement
      ? ` WeakTo ${ctx.weakTo ?? '—'}; avoid ${ctx.avoidElement ?? '—'}.`
      : ''
  const stageNote = ctx.stageName ? ` Target: ${ctx.stageName}.` : ''

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
          ? 'No B1 owned — full burst will feel slow. Prioritize Anis: Star / Siren / Liter (or Jackal/Centi for PvP).'
          : meta.notes + elemNote + stageNote,
  }
}

export function buildAllGoalTeams(inv: InventoryState, ctx: BuildContext = {}): BuiltTeam[] {
  const goals: TeamGoal[] = ['campaign', 'campaign-hard', 'boss', 'tower', 'raid']
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

/**
 * Build a Hard Mode / boss team for a specific stage:
 * fill BiS sample slots from inventory, then backfill by burst with stage element context.
 */
export function buildTeamForStage(inv: InventoryState, stage: Stage, preferHard = true): BuiltTeam {
  const goal: TeamGoal =
    stage.mode === 'campaign-hard' || (preferHard && stage.mode === 'campaign')
      ? 'campaign-hard'
      : stage.mode === 'tower'
        ? 'tower'
        : 'boss'

  const ctx: BuildContext = {
    weakTo: stage.weakTo,
    avoidElement: stage.strongAgainst,
    hardMode: stage.mode === 'campaign-hard' || preferHard,
    stageName: stage.name,
  }

  const preferred = stage.sampleTeams.find((t) => t.label === 'BiS' || t.label.startsWith('BiS')) ?? stage.sampleTeams[0]
  const excludeIds: string[] = []
  const members: Nikke[] = []
  const missing: string[] = []

  if (preferred) {
    for (const ref of preferred.members) {
      const n = resolveNikkeRef(ref)
      if (n && inv.nikkes[n.id]?.owned && !excludeIds.includes(n.id)) {
        members.push(n)
        excludeIds.push(n.id)
      } else {
        missing.push(n?.name ?? ref)
      }
    }
  }

  const fill = buildTeamFromInventory(inv, goal, { ...ctx, excludeIds })
  for (const m of fill.members) {
    if (members.length >= 5) break
    if (excludeIds.includes(m.id)) continue
    members.push(m)
    excludeIds.push(m.id)
  }

  const burstCounts = burstCountsOf(members)
  const score =
    members.reduce((sum, n) => sum + scoreNikke(n, goal, inv, ctx), 0) +
    (burstCounts[1] > 0 ? 8 : 0) +
    Math.round(((preferred?.members.length ?? 5) - missing.length) * 4)

  const coverage =
    preferred && preferred.members.length > 0
      ? (preferred.members.length - missing.length) / preferred.members.length
      : members.length / 5

  return {
    goal,
    label: `${stage.mode === 'campaign-hard' ? 'Hard' : stage.chapter} · ${stage.name}`,
    members: members.slice(0, 5),
    score,
    burstCounts,
    context: ctx,
    coverage,
    missing,
    notes:
      members.length === 0
        ? 'Log Nikkes in Roster first.'
        : [
            preferred?.notes,
            stage.weakTo ? `Prefer ${stage.weakTo} codes.` : null,
            stage.strongAgainst ? `Avoid ${stage.strongAgainst}.` : null,
            missing.length ? `Missing BiS: ${missing.join(', ')} — filled from roster.` : 'Full BiS coverage from roster.',
            stage.mode === 'campaign-hard' ? 'Hard Mode: invest skills/OL before forcing clears.' : null,
          ]
            .filter(Boolean)
            .join(' '),
  }
}

function pickOwned(ref: string, inv: InventoryState, used: Set<string>): Nikke | undefined {
  const n = resolveNikkeRef(ref)
  if (!n || !inv.nikkes[n.id]?.owned || used.has(n.id)) return undefined
  return n
}

function fillPvpSlot(
  preferred: string | undefined,
  inv: InventoryState,
  used: Set<string>,
  wantBurst?: Burst,
): Nikke | undefined {
  if (preferred) {
    const exact = pickOwned(preferred, inv, used)
    if (exact) return exact
  }
  const pool = ownedPool(inv, { excludeIds: [...used] })
  const ranked = pool
    .filter((n) => (wantBurst == null ? true : n.burst === wantBurst))
    .sort((a, b) => scoreNikke(b, 'pvp', inv) - scoreNikke(a, 'pvp', inv))
  return ranked[0]
}

export function buildPvpArchetypeTeam(
  inv: InventoryState,
  archetype: PvpArchetype,
  excludeIds: string[] = [],
): BuiltTeam {
  const used = new Set(excludeIds)
  const members: Nikke[] = []
  const missing: string[] = []
  const burstHints: Array<Burst | undefined> = [3, 2, 2, 1, 1]

  archetype.slots.forEach((slot, i) => {
    const pick = fillPvpSlot(slot, inv, used, burstHints[i])
    if (pick) {
      members.push(pick)
      used.add(pick.id)
    } else {
      missing.push(slot)
      const flex = fillPvpSlot(undefined, inv, used, burstHints[i])
      if (flex) {
        members.push(flex)
        used.add(flex.id)
      }
    }
  })

  while (members.length < 5) {
    const next = fillPvpSlot(undefined, inv, used)
    if (!next) break
    members.push(next)
    used.add(next.id)
  }

  const burstCounts = burstCountsOf(members)
  const score =
    members.reduce((sum, n) => sum + scoreNikke(n, 'pvp', inv), 0) +
    Math.round((archetype.slots.length - missing.length) * 5)

  return {
    goal: 'pvp',
    label: archetype.name,
    members: members.slice(0, 5),
    score,
    burstCounts,
    coverage: archetype.slots.length ? (archetype.slots.length - missing.length) / archetype.slots.length : 0,
    missing,
    notes: [
      archetype.notes,
      `Speed target: ${archetype.speed}.`,
      missing.length ? `Missing preferred: ${missing.join(', ')}.` : 'All preferred slots owned.',
    ].join(' '),
  }
}

export function buildPvpTeams(
  inv: InventoryState,
  side: 'attack' | 'defense',
  squadCount = 3,
): BuiltTeam[] {
  const starterIds = [...(side === 'attack' ? PVP_ATTACK_STARTER_IDS : PVP_DEFENSE_STARTER_IDS)]
  const starterSet = new Set<string>(starterIds)
  const preferred = starterIds
    .map((id) => pvpArchetypes.find((a) => a.id === id))
    .filter((a): a is PvpArchetype => Boolean(a))

  const extras = pvpArchetypes.filter(
    (a) => (a.side === side || a.side === 'both') && !starterSet.has(a.id),
  )

  const ordered = [...preferred, ...extras]
  const excludeIds: string[] = []
  const out: BuiltTeam[] = []

  for (const arch of ordered) {
    if (out.length >= squadCount) break
    const team = buildPvpArchetypeTeam(inv, arch, excludeIds)
    if (team.members.length === 0) continue
    out.push({
      ...team,
      label: `${side === 'attack' ? 'ATK' : 'DEF'} ${out.length + 1} · ${team.label}`,
    })
    for (const m of team.members) excludeIds.push(m.id)
  }

  return out
}

export function listPvpArchetypes(side?: 'attack' | 'defense'): PvpArchetype[] {
  if (!side) return pvpArchetypes
  return pvpArchetypes.filter((a) => a.side === side || a.side === 'both')
}
