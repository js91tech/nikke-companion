const KEY = 'nkc-ui-prefs-v1'

export interface UiPrefs {
  stagesMode?: string
  teamsGoal?: string
  teamsWeakTo?: string
  teamsAvoid?: string
  teamsMfr?: string
  progressChapter?: string
  rosterSort?: string
}

export function loadUiPrefs(): UiPrefs {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as UiPrefs
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export function saveUiPrefs(patch: Partial<UiPrefs>): UiPrefs {
  const next = { ...loadUiPrefs(), ...patch }
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* ignore quota */
  }
  return next
}
