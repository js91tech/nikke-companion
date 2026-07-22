import { teamTemplates } from '../data/teams'
import { stages } from '../data/stages'
import { resolveNikkeRef } from '../data/catalog'
import type { InventoryState, Stage } from '../types'

function owns(inv: InventoryState, ref: string): boolean {
  const n = resolveNikkeRef(ref)
  return Boolean(n && inv.nikkes[n.id]?.owned)
}

function label(ref: string): string {
  return resolveNikkeRef(ref)?.name ?? ref
}

export function suggestTeams(inv: InventoryState) {
  return teamTemplates
    .map((tpl) => {
      const missing = tpl.slots.filter((ref) => !owns(inv, ref)).map(label)
      const ownedCount = tpl.slots.length - missing.length
      const score = tpl.slots.length === 0 ? 0 : Math.round((ownedCount / tpl.slots.length) * 100)
      return { ...tpl, ownedCount, totalCount: tpl.slots.length, missing, score }
    })
    .sort((a, b) => b.score - a.score)
}

export interface TeamEval {
  label: string
  members: string[]
  notes: string
  ownedCount: number
  totalCount: number
  coverage: number
  missing: string[]
  owned: string[]
}

export interface StageClearResult {
  stage: Stage
  bestLabel: string
  coverage: number
  ownedCount: number
  totalCount: number
  missing: string[]
  canClear: 'likely' | 'borderline' | 'need-more'
  teams: TeamEval[]
}

function evalTeam(
  inv: InventoryState,
  team: { label: string; members: string[]; notes: string },
): TeamEval {
  const missingRefs = team.members.filter((ref) => !owns(inv, ref))
  const ownedRefs = team.members.filter((ref) => owns(inv, ref))
  const ownedCount = ownedRefs.length
  const totalCount = team.members.length
  const coverage = totalCount === 0 ? 0 : ownedCount / totalCount
  return {
    label: team.label,
    members: team.members.map(label),
    notes: team.notes,
    ownedCount,
    totalCount,
    coverage,
    missing: missingRefs.map(label),
    owned: ownedRefs.map(label),
  }
}

export function evaluateStages(inv: InventoryState): StageClearResult[] {
  return stages
    .map((stage) => {
      const teams = stage.sampleTeams.map((team) => evalTeam(inv, team))
      const best =
        [...teams].sort((a, b) => {
          if (b.coverage !== a.coverage) return b.coverage - a.coverage
          const aBis = a.label === 'BiS' || a.label.startsWith('BiS') ? 1 : 0
          const bBis = b.label === 'BiS' || b.label.startsWith('BiS') ? 1 : 0
          return bBis - aBis
        })[0] ?? {
          label: '—',
          coverage: 0,
          ownedCount: 0,
          totalCount: 0,
          missing: [] as string[],
        }
      let canClear: StageClearResult['canClear'] = 'need-more'
      if (best.coverage >= 0.75) canClear = 'likely'
      else if (best.coverage >= 0.45) canClear = 'borderline'
      if (stage.threat >= 5 && canClear === 'likely' && best.coverage < 0.9) canClear = 'borderline'
      return {
        stage,
        bestLabel: best.label,
        coverage: best.coverage,
        ownedCount: best.ownedCount,
        totalCount: best.totalCount,
        missing: best.missing,
        canClear,
        teams,
      }
    })
    .sort((a, b) => a.stage.threat - b.stage.threat)
}
