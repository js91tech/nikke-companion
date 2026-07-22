import { buildTeamFromInventory } from './teamBuilder'
import type { InventoryState } from '../types'

export type ProgressChapter = 'early' | 'mid' | 'late' | 'endgame'

export interface ProgressPlan {
  chapter: ProgressChapter
  title: string
  summary: string
  tips: { id: string; title: string; detail: string; priority: 'high' | 'medium' | 'low' }[]
  focusTeam: string
}

const META: Record<ProgressChapter, { title: string; summary: string }> = {
  early: {
    title: 'Early game',
    summary: 'Build a full-burst core, clear campaign, and start manufacturer towers.',
  },
  mid: {
    title: 'Mid game',
    summary: 'Stabilize Liter/Dorothy + two B3 carries, push towers and Union.',
  },
  late: {
    title: 'Late game',
    summary: 'OL gear, multi-team raids, and Pilgrim/Abnormal investments.',
  },
  endgame: {
    title: 'Endgame',
    summary: 'Solo Raid depth, element coverage, and high-end bossing.',
  },
}

export function buildProgressPlan(inv: InventoryState, chapter: ProgressChapter): ProgressPlan {
  const owned = Object.values(inv.nikkes).filter((e) => e.owned).length
  const team = buildTeamFromInventory(inv, chapter === 'early' ? 'campaign' : 'boss')
  const meta = META[chapter]
  const tips: ProgressPlan['tips'] = []

  if (owned < 8) {
    tips.push({
      id: 'roster',
      title: 'Log your roster',
      detail: 'Mark owned Nikkes so team and stage advice can use what you actually have.',
      priority: 'high',
    })
  }
  if (team.burstCounts[1] === 0) {
    tips.push({
      id: 'b1',
      title: 'Get a B1 battery',
      detail: 'Liter or Dorothy transforms full-burst uptime. N102/Neon work early.',
      priority: 'high',
    })
  }
  if (chapter === 'early' || chapter === 'mid') {
    tips.push({
      id: 'synchro',
      title: 'Raise synchro level',
      detail: 'Push synchro device so your whole squad scales with your top 5.',
      priority: 'medium',
    })
  }
  if (chapter === 'late' || chapter === 'endgame') {
    tips.push({
      id: 'ol',
      title: 'Overload gear on carries',
      detail: 'OL your best B3 attackers first — element and max ammo lines matter for raids.',
      priority: 'high',
    })
    tips.push({
      id: 'teams',
      title: 'Build 3+ raid teams',
      detail: 'Spread B1s across teams instead of stacking them on squad 1.',
      priority: 'medium',
    })
  }
  tips.push({
    id: 'tower',
    title: 'Climb Tribe Tower',
    detail: 'Manufacturer towers gate gems and materials — invest one carry per brand.',
    priority: chapter === 'endgame' ? 'low' : 'medium',
  })

  return {
    chapter,
    title: meta.title,
    summary: meta.summary,
    tips,
    focusTeam: team.members.map((m) => m.name).join(' · ') || 'Log Nikkes to generate a focus team',
  }
}
