import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { MetaBadge } from '../components/MetaBadge'
import { Portrait } from '../components/Portrait'
import { allElements, allManufacturers, nikkeById, resolveNikkeRef } from '../data/catalog'
import { useFlash } from '../hooks/useFlash'
import { copyText, formatSquadLine } from '../lib/copyText'
import { suggestTeams } from '../lib/recommendations'
import {
  buildAllGoalTeams,
  buildMultiSquads,
  buildTeamFromInventory,
  type BuildContext,
  type TeamGoal,
} from '../lib/teamBuilder'
import { loadUiPrefs, saveUiPrefs } from '../lib/uiPrefs'
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

const GOAL_IDS = new Set<string>(GOALS.map((g) => g.id))
const ELEMENTS = ['Fire', 'Wind', 'Iron', 'Electric', 'Water']

function parseGoal(raw: string | null | undefined): TeamGoal | '' {
  return raw && GOAL_IDS.has(raw) ? (raw as TeamGoal) : ''
}

export function TeamsPage({ inventory }: Props) {
  const [params] = useSearchParams()
  const prefs = useMemo(() => loadUiPrefs(), [])
  const [goal, setGoal] = useState<TeamGoal>(
    () => parseGoal(params.get('goal')) || parseGoal(prefs.teamsGoal) || 'boss',
  )
  const [weakTo, setWeakTo] = useState(
    () => params.get('weakTo') || prefs.teamsWeakTo || '',
  )
  const [avoidElement, setAvoidElement] = useState(
    () => params.get('avoid') || prefs.teamsAvoid || '',
  )
  const [manufacturer, setManufacturer] = useState<'' | Manufacturer>(
    () => (params.get('mfr') as Manufacturer | null) || (prefs.teamsMfr as Manufacturer | '') || '',
  )
  const [squadCount, setSquadCount] = useState(3)
  const [lockedIds, setLockedIds] = useState<string[]>([])
  const [excludeIds, setExcludeIds] = useState<string[]>([])
  const [msg, flash] = useFlash()

  useEffect(() => {
    const g = parseGoal(params.get('goal'))
    if (g) setGoal(g)
    if (params.has('weakTo')) setWeakTo(params.get('weakTo') || '')
    if (params.has('avoid')) setAvoidElement(params.get('avoid') || '')
    if (params.has('mfr')) setManufacturer((params.get('mfr') as Manufacturer | null) || '')
  }, [params])

  useEffect(() => {
    saveUiPrefs({
      teamsGoal: goal,
      teamsWeakTo: weakTo,
      teamsAvoid: avoidElement,
      teamsMfr: manufacturer,
    })
  }, [goal, weakTo, avoidElement, manufacturer])

  const ctx: BuildContext = useMemo(
    () => ({
      weakTo: weakTo || undefined,
      avoidElement: avoidElement || undefined,
      manufacturer: manufacturer || undefined,
      lockedIds: lockedIds.length ? lockedIds : undefined,
      excludeIds: excludeIds.length ? excludeIds : undefined,
    }),
    [weakTo, avoidElement, manufacturer, lockedIds, excludeIds],
  )

  const toggleLock = (id: string) => {
    setExcludeIds((prev) => prev.filter((x) => x !== id))
    setLockedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const toggleExclude = (id: string) => {
    setLockedIds((prev) => prev.filter((x) => x !== id))
    setExcludeIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const clearLocks = () => {
    setLockedIds([])
    setExcludeIds([])
    flash('Locks & excludes cleared.')
  }

  const built = useMemo(() => buildTeamFromInventory(inventory, goal, ctx), [inventory, goal, ctx])
  const multi = useMemo(
    () => (goal === 'raid' || goal === 'boss' ? buildMultiSquads(inventory, goal, squadCount, ctx) : []),
    [inventory, goal, squadCount, ctx],
  )
  const all = useMemo(() => buildAllGoalTeams(inventory, ctx), [inventory, ctx])
  const templates = useMemo(() => suggestTeams(inventory), [inventory])

  const copyNames = async (names: string[], label?: string) => {
    const ok = await copyText(formatSquadLine(names, label))
    flash(ok ? 'Squad copied.' : 'Clipboard blocked — select text manually.')
  }

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

        <div className="toolbar secondary" style={{ marginTop: '0.75rem' }}>
          <button
            type="button"
            className="btn ghost"
            disabled={built.members.length === 0}
            onClick={() => void copyNames(built.members.map((m) => m.name), built.label)}
          >
            Copy squad
          </button>
          {(weakTo || avoidElement || manufacturer) && (
            <button
              type="button"
              className="btn ghost"
              onClick={() => {
                setWeakTo('')
                setAvoidElement('')
                setManufacturer('')
              }}
            >
              Clear filters
            </button>
          )}
          {(lockedIds.length > 0 || excludeIds.length > 0) && (
            <button type="button" className="btn ghost" onClick={clearLocks}>
              Clear locks
            </button>
          )}
        </div>
        <p className="fine-print" style={{ marginTop: '0.45rem' }}>
          Lock keeps a unit on squad 1 · Exclude pulls them out of the pool.
        </p>
        {msg ? <p className="flash">{msg}</p> : null}

        <ul className="chip-row squad-portrait-row" style={{ marginTop: '1rem' }}>
          {built.members.map((m) => {
            const locked = lockedIds.includes(m.id)
            return (
              <li key={m.id} className={`have squad-chip-li ${locked ? 'is-locked' : ''}`}>
                <Link to={`/nikkes/${m.id}`} className="squad-link">
                  <Portrait src={m.portraitUrl} name={m.name} size={36} />
                  <span>
                    {m.name}
                    {locked ? <span className="lock-badge"> locked</span> : null}{' '}
                    <span className="fine-print">
                      B{m.burst}
                      {m.element ? ` · ${m.element}` : ''}
                    </span>
                  </span>
                </Link>
                <div className="squad-chip-actions">
                  <button
                    type="button"
                    className={`btn ghost btn-compact ${locked ? 'active-toggle' : ''}`}
                    onClick={() => toggleLock(m.id)}
                  >
                    {locked ? 'Unlock' : 'Lock'}
                  </button>
                  <button
                    type="button"
                    className="btn ghost btn-compact"
                    onClick={() => toggleExclude(m.id)}
                  >
                    Exclude
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
        {built.members.length === 0 ? <p className="fine-print">Log Nikkes in Roster first.</p> : null}

        {excludeIds.length > 0 ? (
          <div className="exclude-row">
            <span className="fine-print">Excluded:</span>
            <ul className="chip-row">
              {excludeIds.map((id) => {
                const n = nikkeById[id]
                if (!n) return null
                return (
                  <li key={id} className="need">
                    <button
                      type="button"
                      className="btn ghost btn-compact"
                      onClick={() => toggleExclude(id)}
                      title="Restore to pool"
                    >
                      <Portrait src={n.portraitUrl} name={n.name} size={22} />
                      {n.name} ×
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ) : null}
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
                  <div className="panel-actions">
                    <span className="pill">score {t.score}</span>
                    <button
                      type="button"
                      className="btn ghost"
                      onClick={() => void copyNames(t.members.map((m) => m.name), t.label)}
                    >
                      Copy
                    </button>
                  </div>
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
          <div className="toolbar secondary" style={{ marginTop: '0.65rem' }}>
            <button
              type="button"
              className="btn ghost"
              onClick={() => {
                const block = multi
                  .map((t) => formatSquadLine(t.members.map((m) => m.name), t.label))
                  .join('\n')
                void copyText(block).then((ok) =>
                  flash(ok ? 'All squads copied.' : 'Clipboard blocked — select text manually.'),
                )
              }}
            >
              Copy all squads
            </button>
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
                <div className="panel-actions">
                  <button type="button" className="btn ghost" onClick={() => setGoal(t.goal)}>
                    Use
                  </button>
                  <button
                    type="button"
                    className="btn ghost"
                    disabled={t.members.length === 0}
                    onClick={() => void copyNames(t.members.map((m) => m.name), t.label)}
                  >
                    Copy
                  </button>
                </div>
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
                <div className="panel-actions">
                  <span className="pill">{t.score}%</span>
                  <button
                    type="button"
                    className="btn ghost"
                    onClick={() =>
                      void copyNames(
                        t.slots.map((ref) => resolveNikkeRef(ref)?.name ?? ref),
                        t.name,
                      )
                    }
                  >
                    Copy
                  </button>
                </div>
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
