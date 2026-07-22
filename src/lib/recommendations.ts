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

export interface StageClearResult {
  stage: Stage
  bestLabel: string
  coverage: number
  ownedCount: number
  totalCount: number
  missing: string[]
  canClear: 'likely' | 'borderline' | 'need-more'
}

export function evaluateStages(inv: InventoryState): StageClearResult[] {
  return stages
    .map((stage) => {
      const evals = stage.sampleTeams.map((team) => {
        const missing = team.members.filter((ref) => !owns(inv, ref)).map(label)
        const ownedCount = team.members.length - missing.length
        const coverage = team.members.length === 0 ? 0 : ownedCount / team.members.length
        return { team, missing, ownedCount, totalCount: team.members.length, coverage }
      })
      const best = evals.sort((a, b) => b.coverage - a.coverage)[0]
      let canClear: StageClearResult['canClear'] = 'need-more'
      if (best.coverage >= 0.75) canClear = 'likely'
      else if (best.coverage >= 0.45) canClear = 'borderline'
      if (stage.threat >= 5 && canClear === 'likely' && best.coverage < 0.9) canClear = 'borderline'
      return {
        stage,
        bestLabel: best.team.label,
        coverage: best.coverage,
        ownedCount: best.ownedCount,
        totalCount: best.totalCount,
        missing: best.missing,
        canClear,
      }
    })
    .sort((a, b) => a.stage.threat - b.stage.threat)
}
