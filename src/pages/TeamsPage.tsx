import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { buildAllGoalTeams, buildTeamFromInventory, type TeamGoal } from '../lib/teamBuilder'
import { suggestTeams } from '../lib/recommendations'
import { resolveNikkeRef } from '../data/catalog'
import type { InventoryState } from '../types'

interface Props {
  inventory: InventoryState
}

const GOALS: { id: TeamGoal; label: string }[] = [
  { id: 'campaign', label: 'Campaign' },
  { id: 'boss', label: 'Boss' },
  { id: 'tower', label: 'Tower' },
  { id: 'raid', label: 'Raid' },
]

export function TeamsPage({ inventory }: Props) {
  const [goal, setGoal] = useState<TeamGoal>('campaign')
  const built = useMemo(() => buildTeamFromInventory(inventory, goal), [inventory, goal])
  const all = useMemo(() => buildAllGoalTeams(inventory), [inventory])
  const templates = useMemo(() => suggestTeams(inventory), [inventory])

  return (
    <div className="page">
      <header className="page-header">
        <h1>Teams</h1>
        <p>
          Burst-aware squads from your roster (Prydwen Story tier weights, Jul 2026) plus template coverage from
          Prydwen AI / meta-team guides. Not live-scraped — refresh when the meta shifts.
        </p>
      </header>

      <section className="panel">
        <div className="panel-head">
          <h2>Team builder</h2>
          <span className="pill">
            score {built.score} · B{built.burstCounts[1]}/{built.burstCounts[2]}/{built.burstCounts[3]}
          </span>
        </div>
        <p className="section-lede">{built.notes}</p>
        <div className="seg wrap">
          {GOALS.map((g) => (
            <button
              key={g.id}
              type="button"
              className={goal === g.id ? 'active' : ''}
              onClick={() => setGoal(g.id)}
            >
              {g.label}
            </button>
          ))}
        </div>
        <ul className="chip-row" style={{ marginTop: '1rem' }}>
          {built.members.map((m) => (
            <li key={m.id} className="have">
              <Link to={`/nikkes/${m.id}`}>
                {m.name} <span className="fine-print">B{m.burst}</span>
              </Link>
            </li>
          ))}
        </ul>
        {built.members.length === 0 ? <p className="fine-print">Log Nikkes in Roster first.</p> : null}
      </section>

      <section className="section">
        <h2>All goals</h2>
        <div className="stack">
          {all.map((t) => (
            <article key={t.goal} className="panel">
              <div className="panel-head">
                <h3>{t.label}</h3>
                <button type="button" className="btn ghost" onClick={() => setGoal(t.goal)}>
                  Use
                </button>
              </div>
              <p className="fine-print">{t.members.map((m) => m.name).join(' · ') || 'Need more roster'}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Template coverage</h2>
        <div className="stack">
          {templates.map((t) => (
            <article key={t.id} className="panel">
              <div className="panel-head">
                <h3>{t.name}</h3>
                <span className="pill">{t.score}%</span>
              </div>
              <p className="purpose">{t.purpose}</p>
              <div className="meter" aria-hidden>
                <span style={{ width: `${t.score}%` }} />
              </div>
              <ul className="chip-row">
                {t.slots.map((ref) => {
                  const n = resolveNikkeRef(ref)
                  const owned = Boolean(n && inventory.nikkes[n.id]?.owned)
                  return (
                    <li key={ref} className={owned ? 'have' : 'need'}>
                      {n ? <Link to={`/nikkes/${n.id}`}>{n.name}</Link> : ref}
                    </li>
                  )
                })}
              </ul>
              <p>{t.notes}</p>
              {t.missing.length > 0 ? (
                <p className="missing">Missing: {t.missing.join(', ')}</p>
              ) : (
                <p className="missing ok">You own every slot.</p>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
