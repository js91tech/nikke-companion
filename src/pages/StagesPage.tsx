import type { StageMode } from '../types'
import { useMemo, useState } from 'react'
import { CAMPAIGN_MAX_CHAPTER } from '../data/stages'
import { evaluateStages, type TeamEval } from '../lib/recommendations'
import type { InventoryState } from '../types'

interface Props {
  inventory: InventoryState
}

type Filter = 'all' | StageMode

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'campaign', label: 'Normal' },
  { id: 'campaign-hard', label: 'Hard' },
  { id: 'anomaly', label: 'Anomaly AI' },
  { id: 'tower', label: 'Tower' },
  { id: 'union', label: 'Union Raid' },
  { id: 'solo', label: 'Solo Raid' },
]

function TeamCard({ team, isBest }: { team: TeamEval; isBest: boolean }) {
  const isBis = team.label === 'BiS' || team.label.startsWith('BiS')
  return (
    <div className={`team-card ${isBis ? 'is-bis' : 'is-sub'} ${isBest ? 'is-best' : ''}`}>
      <div className="team-card-head">
        <span className={`team-label ${isBis ? 'bis' : ''}`}>{team.label}</span>
        <span className="team-cov">
          {team.ownedCount}/{team.totalCount}
        </span>
      </div>
      <ul className="chip-row team-members">
        {team.members.map((name) => {
          const have = team.owned.includes(name)
          return (
            <li key={name} className={have ? 'have' : 'need'}>
              {name}
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
  const [mode, setMode] = useState<Filter>('anomaly')
  const [chapterQ, setChapterQ] = useState('')
  const results = useMemo(() => evaluateStages(inventory), [inventory])

  const filtered = useMemo(() => {
    let list = mode === 'all' ? results : results.filter((r) => r.stage.mode === mode)
    const q = chapterQ.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (r) =>
          r.stage.name.toLowerCase().includes(q) ||
          r.stage.chapter.toLowerCase().includes(q) ||
          (r.stage.drops || '').toLowerCase().includes(q),
      )
    }
    return list
  }, [results, mode, chapterQ])

  return (
    <div className="page">
      <header className="page-header">
        <h1>Stages</h1>
        <p>
          BiS + substitute teams for Normal/Hard Ch.1–{CAMPAIGN_MAX_CHAPTER}, Anomaly AI, Solo Museum, Union
          Raid, and Tower — coverage from your roster.
        </p>
      </header>

      <div className="seg wrap">
        {FILTERS.map((m) => (
          <button
            key={m.id}
            type="button"
            className={mode === m.id ? 'active' : ''}
            onClick={() => setMode(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="toolbar" style={{ marginTop: '0.85rem' }}>
        <input
          className="search"
          value={chapterQ}
          onChange={(e) => setChapterQ(e.target.value)}
          placeholder="Filter by chapter, boss, drops…"
          aria-label="Filter stages"
        />
      </div>

      <p className="fine-print">
        Showing {filtered.length} / {results.length} entries · green chips = owned
      </p>

      <div className="stack" style={{ marginTop: '0.75rem' }}>
        {filtered.map((r) => (
          <article key={r.stage.id} className={`panel stage-card mode-${r.stage.mode}`}>
            <div className="panel-head">
              <h3>
                {r.stage.name}
                <span className="fine-print"> · {r.stage.chapter}</span>
              </h3>
              <span className={`pill status-${r.canClear}`}>{r.canClear}</span>
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
                <TeamCard key={t.label} team={t} isBest={t.label === r.bestLabel} />
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
