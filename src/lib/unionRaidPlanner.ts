export interface PlannerAttempt {
  id: string
  memberId: string
  memberName: string
  slot: 1 | 2 | 3
  mockDamage: number
  effectiveDamage: number
}

export interface PlannerTarget {
  id: string
  name: string
  remainingHp: number
  stage?: number
}

export interface Assignment {
  attemptId: string
  memberId: string
  memberName: string
  slot: 1 | 2 | 3
  targetId: string
  targetName: string
  plannedDamage: number
  usefulDamage: number
  overkill: number
  /** True when this hit clears leftover HP (may overkill). */
  isFinish: boolean
}

export interface TargetSummary {
  targetId: string
  targetName: string
  startHp: number
  endHp: number
  usefulDamage: number
  overkill: number
  cleared: boolean
  assignments: Assignment[]
}

export interface PlanResult {
  assignments: Assignment[]
  unused: PlannerAttempt[]
  targets: TargetSummary[]
  totalUseful: number
  totalOverkill: number
  totalWastedAttempts: number
}

export interface PlanOptions {
  /** If true, allow one finishing hit that overkills when no perfect fit remains. */
  allowFinishOverkill?: boolean
  /** Prefer clearing nearly-dead bosses first (default true). */
  clearSmallFirst?: boolean
}

/**
 * Assign attempts to bosses without exceeding remaining HP when possible.
 * Greedy: pack largest-fitting hits per boss, then optional finish overkill.
 */
export function planUnionRaid(
  targets: PlannerTarget[],
  attempts: PlannerAttempt[],
  options: PlanOptions = {},
): PlanResult {
  const allowFinishOverkill = options.allowFinishOverkill ?? true
  const clearSmallFirst = options.clearSmallFirst ?? true

  const pool = attempts
    .filter((a) => a.effectiveDamage > 0)
    .map((a) => ({ ...a }))
  const used = new Set<string>()
  const assignments: Assignment[] = []

  const ordered = [...targets]
    .filter((t) => t.remainingHp > 0)
    .sort((a, b) => (clearSmallFirst ? a.remainingHp - b.remainingHp : b.remainingHp - a.remainingHp))

  const remaining = new Map(ordered.map((t) => [t.id, t.remainingHp]))

  function available(): PlannerAttempt[] {
    return pool.filter((a) => !used.has(a.id))
  }

  for (const target of ordered) {
    let hpLeft = remaining.get(target.id) ?? 0
    if (hpLeft <= 0) continue

    // Pack largest hits that still fit
    let progressed = true
    while (progressed && hpLeft > 0) {
      progressed = false
      const fits = available()
        .filter((a) => a.effectiveDamage <= hpLeft)
        .sort((a, b) => b.effectiveDamage - a.effectiveDamage)
      const pick = fits[0]
      if (!pick) break
      used.add(pick.id)
      const useful = pick.effectiveDamage
      assignments.push({
        attemptId: pick.id,
        memberId: pick.memberId,
        memberName: pick.memberName,
        slot: pick.slot,
        targetId: target.id,
        targetName: target.name,
        plannedDamage: pick.effectiveDamage,
        usefulDamage: useful,
        overkill: 0,
        isFinish: false,
      })
      hpLeft -= useful
      remaining.set(target.id, hpLeft)
      progressed = true
    }

    // Optional single finish overkill with the smallest attempt that clears
    if (allowFinishOverkill && hpLeft > 0) {
      const finishers = available()
        .filter((a) => a.effectiveDamage >= hpLeft)
        .sort((a, b) => a.effectiveDamage - b.effectiveDamage)
      const finish = finishers[0]
      if (finish) {
        used.add(finish.id)
        const overkill = finish.effectiveDamage - hpLeft
        assignments.push({
          attemptId: finish.id,
          memberId: finish.memberId,
          memberName: finish.memberName,
          slot: finish.slot,
          targetId: target.id,
          targetName: target.name,
          plannedDamage: finish.effectiveDamage,
          usefulDamage: hpLeft,
          overkill,
          isFinish: true,
        })
        remaining.set(target.id, 0)
      }
    }
  }

  // Dump leftover attempts onto largest remaining HP bosses without packing (still no over-assign beyond HP)
  const leftoverTargets = [...ordered].sort(
    (a, b) => (remaining.get(b.id) ?? 0) - (remaining.get(a.id) ?? 0),
  )
  for (const attempt of available().sort((a, b) => b.effectiveDamage - a.effectiveDamage)) {
    const target = leftoverTargets.find((t) => (remaining.get(t.id) ?? 0) > 0)
    if (!target) break
    let hpLeft = remaining.get(target.id) ?? 0
    if (attempt.effectiveDamage <= hpLeft) {
      used.add(attempt.id)
      assignments.push({
        attemptId: attempt.id,
        memberId: attempt.memberId,
        memberName: attempt.memberName,
        slot: attempt.slot,
        targetId: target.id,
        targetName: target.name,
        plannedDamage: attempt.effectiveDamage,
        usefulDamage: attempt.effectiveDamage,
        overkill: 0,
        isFinish: false,
      })
      remaining.set(target.id, hpLeft - attempt.effectiveDamage)
    } else if (allowFinishOverkill) {
      used.add(attempt.id)
      assignments.push({
        attemptId: attempt.id,
        memberId: attempt.memberId,
        memberName: attempt.memberName,
        slot: attempt.slot,
        targetId: target.id,
        targetName: target.name,
        plannedDamage: attempt.effectiveDamage,
        usefulDamage: hpLeft,
        overkill: attempt.effectiveDamage - hpLeft,
        isFinish: true,
      })
      remaining.set(target.id, 0)
    }
  }

  const unused = pool.filter((a) => !used.has(a.id))
  const targetSummaries: TargetSummary[] = ordered.map((t) => {
    const startHp = t.remainingHp
    const endHp = remaining.get(t.id) ?? 0
    const list = assignments.filter((a) => a.targetId === t.id)
    return {
      targetId: t.id,
      targetName: t.name,
      startHp,
      endHp,
      usefulDamage: list.reduce((s, a) => s + a.usefulDamage, 0),
      overkill: list.reduce((s, a) => s + a.overkill, 0),
      cleared: endHp <= 0,
      assignments: list,
    }
  })

  return {
    assignments,
    unused,
    targets: targetSummaries,
    totalUseful: assignments.reduce((s, a) => s + a.usefulDamage, 0),
    totalOverkill: assignments.reduce((s, a) => s + a.overkill, 0),
    totalWastedAttempts: unused.length,
  }
}
