import type { StageMode } from '../types'
import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { MetaBadge } from '../components/MetaBadge'
import { Portrait } from '../components/Portrait'
import { resolveNikkeRef } from '../data/catalog'
import { CAMPAIGN_MAX_CHAPTER } from '../data/stages'
import { useFlash } from '../hooks/useFlash'
import { copyText, formatSquadLine } from '../lib/copyText'
import { evaluateStages, type StageClearResult, type TeamEval } from '../lib/recommendations'
import { loadUiPrefs, saveUiPrefs } from '../lib/uiPrefs'
import type { InventoryState } from '../types'

interface Props {
  inventory: InventoryState
}

type Filter = 'all' | StageMode
type ReadyFilter = 'all' | StageClearResult['canClear']

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'campaign', label: 'Normal' },
  { id: 'campaign-hard', label: 'Hard' },
  { id: 'anomaly', label: 'Anomaly AI' },
  { id: 'tower', label: 'Tower' },
  { id: 'union', label: 'Union Raid' },
  { id: 'solo', label: 'Solo Raid' },
]

const READY: { id: ReadyFilter; label: string }[] = [
  { id: 'all', label: 'Any ready' },
  { id: 'likely', label: 'Likely' },
  { id: 'borderline', label: 'Borderline' },
  { id: 'need-more', label: 'Need more' },
]

const MODE_IDS = new Set(FILTERS.map((f) => f.id))
const READY_IDS = new Set(READY.map((r) => r.id))

function teamsGoalForMode(mode: StageMode): string {
  if (mode === 'tower') return 'tower'
  if (mode === 'campaign' || mode === 'campaign-hard') return 'campaign'
  if (mode === 'union' || mode === 'solo' || mode === 'anomaly') return 'boss'
  return 'boss'
}

function buildTeamsHref(r: StageClearResult): string {
  const q = new URLSearchParams()
  q.set('goal', teamsGoalForMode(r.stage.mode))
  if (r.stage.weakTo) q.set('weakTo', r.stage.weakTo)
  if (r.stage.strongAgainst) q.set('avoid', r.stage.strongAgainst)
  return `/teams?${q.toString()}`
}

function TeamCard({
  team,
  isBest,
  onCopy,
}: {
  team: TeamEval
  isBest: boolean
  onCopy: () => void
}) {
  const isBis = team.label === 'BiS' || team.label.startsWith('BiS')
  return (
    <div className={`team-card ${isBis ? 'is-bis' : 'is-sub'} ${isBest ? 'is-best' : ''}`}>
      <div className="team-card-head">
        <span className={`team-label ${isBis ? 'bis' : ''}`}>{team.label}</span>
        <div className="panel-actions">
          <span className="team-cov">
            {team.ownedCount}/{team.totalCount}
          </span>
          <button type="button" className="btn ghost btn-compact" onClick={onCopy}>
            Copy
          </button>
        </div>
      </div>
      <ul className="chip-row team-members">
        {team.members.map((name) => {
          const have = team.owned.includes(name)
          const n = resolveNikkeRef(name)
          return (
            <li key={name} className={have ? 'have' : 'need'}>
              {n ? (
                <Link to={`/nikkes/${n.id}`} className="squad-link">
                  <Portrait src={n.portraitUrl} name={n.name} size={22} />
                  {name}
                </Link>
              ) : (
                name
              )}
            </li>
          )
        })}
      </ul>
      <p className="fine-print">{team.notes}</p>
      <div className="meter" aria-hidden>
        <span style={{ width: `${Math.round(team.coverage * 100)}%` }} />
      </div>
    </div>
  )
}

export function StagesPage({ inventory }: Props) {
  const [params, setParams] = useSearchParams()
  const prefs = useMemo(() => loadUiPrefs(), [])
  const initialMode = (params.get('mode') || prefs.stagesMode || 'anomaly') as Filter
  const initialReady = (params.get('ready') || 'all') as ReadyFilter

  const [mode, setMode] = useState<Filter>(MODE_IDS.has(initialMode) ? initialMode : 'anomaly')
  const [ready, setReady] = useState<ReadyFilter>(
    READY_IDS.has(initialReady) ? initialReady : 'all',
  )
  const [chapterQ, setChapterQ] = useState(() => params.get('q') || '')
  const [msg, flash] = useFlash()
  const results = useMemo(() => evaluateStages(inventory), [inventory])

  useEffect(() => {
    const m = params.get('mode') as Filter | null
    const r = params.get('ready') as ReadyFilter | null
    const q = params.get('q')
    if (m && MODE_IDS.has(m)) setMode(m)
    if (r && READY_IDS.has(r)) setReady(r)
    else if (!params.has('ready')) setReady('all')
    if (q != null) setChapterQ(q)
    else if (!params.has('q')) setChapterQ('')
  }, [params])

  useEffect(() => {
    saveUiPrefs({ stagesMode: mode })
  }, [mode])

  const syncUrl = (nextMode: Filter, nextReady: ReadyFilter, nextQ: string) => {
    const next = new URLSearchParams()
    if (nextMode !== 'anomaly') next.set('mode', nextMode)
    if (nextReady !== 'all') next.set('ready', nextReady)
    if (nextQ.trim()) next.set('q', nextQ.trim())
    if (next.toString() !== params.toString()) setParams(next, { replace: true })
  }

  const filtered = useMemo(() => {
    let list = mode === 'all' ? results : results.filter((r) => r.stage.mode === mode)
    if (ready !== 'all') list = list.filter((r) => r.canClear === ready)
    const q = chapterQ.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (r) =>
          r.stage.name.toLowerCase().includes(q) ||
          r.stage.chapter.toLowerCase().includes(q) ||
          (r.stage.drops || '').toLowerCase().includes(q) ||
          r.stage.id.toLowerCase().includes(q),
      )
    }
    return list
  }, [results, mode, ready, chapterQ])

  const readyCounts = useMemo(() => {
    const base = mode === 'all' ? results : results.filter((r) => r.stage.mode === mode)
    return {
      likely: base.filter((r) => r.canClear === 'likely').length,
      borderline: base.filter((r) => r.canClear === 'borderline').length,
      'need-more': base.filter((r) => r.canClear === 'need-more').length,
    }
  }, [results, mode])

  return (
    <div className="page">
      <header className="page-header">
        <h1>Stages</h1>
        <p>
          BiS + substitute teams for Normal/Hard Ch.1–{CAMPAIGN_MAX_CHAPTER}, Anomaly AI, Solo Museum, Union
          Raid, and Tower — coverage from your roster.
        </p>
        <MetaBadge />
      </header>

      <div className="stages-sticky">
        <div className="seg wrap">
          {FILTERS.map((m) => (
            <button
              key={m.id}
              type="button"
              className={mode === m.id ? 'active' : ''}
              onClick={() => {
                setMode(m.id)
                syncUrl(m.id, ready, chapterQ)
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="seg wrap ready-seg">
          {READY.map((r) => (
            <button
              key={r.id}
              type="button"
              className={ready === r.id ? 'active' : ''}
              onClick={() => {
                setReady(r.id)
                syncUrl(mode, r.id, chapterQ)
              }}
            >
              {r.label}
              {r.id !== 'all' ? ` (${readyCounts[r.id]})` : ''}
            </button>
          ))}
        </div>

        <div className="toolbar" style={{ marginTop: '0.85rem' }}>
          <input
            className="search"
            value={chapterQ}
            onChange={(e) => {
              const v = e.target.value
              setChapterQ(v)
              syncUrl(mode, ready, v)
            }}
            placeholder="Filter by chapter, boss, drops…"
            aria-label="Filter stages"
          />
        </div>
      </div>

      <p className="fine-print">
        Showing {filtered.length} / {results.length} entries · green chips = owned
      </p>
      {msg ? <p className="flash">{msg}</p> : null}

      <div className="stack" style={{ marginTop: '0.75rem' }}>
        {filtered.map((r) => (
          <article
            key={r.stage.id}
            id={r.stage.id}
            className={`panel stage-card mode-${r.stage.mode}`}
          >
            <div className="panel-head">
              <h3>
                {r.stage.name}
                <span className="fine-print"> · {r.stage.chapter}</span>
              </h3>
              <div className="panel-actions">
                <span className={`pill status-${r.canClear}`}>{r.canClear}</span>
                <Link className="btn ghost btn-compact" to={buildTeamsHref(r)}>
                  Build team
                </Link>
              </div>
            </div>
            {(r.stage.element || r.stage.weakTo || r.stage.strongAgainst) && (
              <div className="ai-meta">
                {r.stage.element ? <span className="tag">Code {r.stage.element}</span> : null}
                {r.stage.weakTo ? <span className="tag weak">Weak to {r.stage.weakTo}</span> : null}
                {r.stage.strongAgainst ? (
                  <span className="tag resist">Strong vs {r.stage.strongAgainst}</span>
                ) : null}
              </div>
            )}
            <p>{r.stage.enemyNotes}</p>
            {r.stage.drops ? <p className="fine-print">Drops: {r.stage.drops}</p> : null}

            <p className="subhead">Recommended teams</p>
            <div className="team-grid">
              {r.teams.map((t) => (
                <TeamCard
                  key={t.label}
                  team={t}
                  isBest={t.label === r.bestLabel}
                  onCopy={() =>
                    void copyText(formatSquadLine(t.members, `${r.stage.name} · ${t.label}`)).then(
                      (ok) => flash(ok ? 'Team copied.' : 'Clipboard blocked.'),
                    )
                  }
                />
              ))}
            </div>

            <ul className="tips">
              {r.stage.tips.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  )
}
