import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MetaBadge } from '../components/MetaBadge'
import { Portrait } from '../components/Portrait'
import { allElements, allManufacturers, resolveNikkeRef } from '../data/catalog'
import { suggestTeams } from '../lib/recommendations'
import {
  buildAllGoalTeams,
  buildMultiSquads,
  buildTeamFromInventory,
  type BuildContext,
  type TeamGoal,
} from '../lib/teamBuilder'
import type { InventoryState, Manufacturer } from '../types'

interface Props {
  inventory: InventoryState
}

const GOALS: { id: TeamGoal; label: string }[] = [
  { id: 'campaign', label: 'Campaign' },
  { id: 'boss', label: 'Boss' },
  { id: 'tower', label: 'Tower' },
  { id: 'raid', label: 'Raid' },
]

const ELEMENTS = ['Fire', 'Wind', 'Iron', 'Electric', 'Water']

export function TeamsPage({ inventory }: Props) {
  const [goal, setGoal] = useState<TeamGoal>('boss')
  const [weakTo, setWeakTo] = useState('')
  const [avoidElement, setAvoidElement] = useState('')
  const [manufacturer, setManufacturer] = useState<'' | Manufacturer>('')
  const [squadCount, setSquadCount] = useState(3)

  const ctx: BuildContext = useMemo(
    () => ({
      weakTo: weakTo || undefined,
      avoidElement: avoidElement || undefined,
      manufacturer: manufacturer || undefined,
    }),
    [weakTo, avoidElement, manufacturer],
  )

  const built = useMemo(() => buildTeamFromInventory(inventory, goal, ctx), [inventory, goal, ctx])
  const multi = useMemo(
    () => (goal === 'raid' || goal === 'boss' ? buildMultiSquads(inventory, goal, squadCount, ctx) : []),
    [inventory, goal, squadCount, ctx],
  )
  const all = useMemo(() => buildAllGoalTeams(inventory, ctx), [inventory, ctx])
  const templates = useMemo(() => suggestTeams(inventory), [inventory])

  return (
    <div className="page">
      <header className="page-header">
        <h1>Teams</h1>
        <p>
          Element-aware builder using Prydwen Story tiers + your investment. Multi-squad for Solo/UR depth.
        </p>
        <MetaBadge />
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

        <div className="filter-row">
          <label>
            Prefer element (weakTo)
            <select value={weakTo} onChange={(e) => setWeakTo(e.target.value)}>
              <option value="">Any</option>
              {ELEMENTS.map((el) => (
                <option key={el} value={el}>
                  {el}
                </option>
              ))}
            </select>
          </label>
          <label>
            Avoid element
            <select value={avoidElement} onChange={(e) => setAvoidElement(e.target.value)}>
              <option value="">None</option>
              {(allElements.length ? allElements : ELEMENTS).map((el) => (
                <option key={el} value={el}>
                  {el}
                </option>
              ))}
            </select>
          </label>
          <label>
            Tower mfr
            <select
              value={manufacturer}
              onChange={(e) => setManufacturer(e.target.value as '' | Manufacturer)}
            >
              <option value="">Any</option>
              {allManufacturers.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          {(goal === 'raid' || goal === 'boss') && (
            <label>
              Squads
              <select value={squadCount} onChange={(e) => setSquadCount(Number(e.target.value))}>
                {[2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

        <ul className="chip-row squad-portrait-row" style={{ marginTop: '1rem' }}>
          {built.members.map((m) => (
            <li key={m.id} className="have squad-chip-li">
              <Link to={`/nikkes/${m.id}`} className="squad-link">
                <Portrait src={m.portraitUrl} name={m.name} size={36} />
                <span>
                  {m.name}{' '}
                  <span className="fine-print">
                    B{m.burst}
                    {m.element ? ` · ${m.element}` : ''}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        {built.members.length === 0 ? <p className="fine-print">Log Nikkes in Roster first.</p> : null}
      </section>

      {multi.length > 1 ? (
        <section className="section">
          <div className="section-head">
            <h2>Multi-squad</h2>
            <span className="section-tag">{multi.length} teams · no reuse</span>
          </div>
          <div className="stack">
            {multi.map((t) => (
              <article key={t.label} className="panel">
                <div className="panel-head">
                  <h3>{t.label}</h3>
                  <span className="pill">score {t.score}</span>
                </div>
                <ul className="chip-row">
                  {t.members.map((m) => (
                    <li key={m.id} className="have">
                      <Portrait src={m.portraitUrl} name={m.name} size={28} /> {m.name}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      ) : null}

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
                      {n ? (
                        <Link to={`/nikkes/${n.id}`} className="squad-link">
                          <Portrait src={n.portraitUrl} name={n.name} size={24} />
                          {n.name}
                        </Link>
                      ) : (
                        ref
                      )}
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
