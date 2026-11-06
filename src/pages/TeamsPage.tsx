import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { MetaBadge } from '../components/MetaBadge'
import { Portrait } from '../components/Portrait'
import { allElements, allManufacturers, nikkeById, resolveNikkeRef } from '../data/catalog'
import { META_SOURCE } from '../data/metaSource'
import { bossRaidStages, CAMPAIGN_MAX_CHAPTER, hardCampaignStages, stageById } from '../data/stages'
import { useFlash } from '../hooks/useFlash'
import { copyText, formatSquadLine } from '../lib/copyText'
import { suggestTeams } from '../lib/recommendations'
import {
  buildAllGoalTeams,
  buildMultiSquads,
  buildPvpTeams,
  buildTeamForStage,
  buildTeamFromInventory,
  listPvpArchetypes,
  type BuildContext,
  type BuiltTeam,
  type TeamGoal,
} from '../lib/teamBuilder'
import { loadUiPrefs, saveUiPrefs } from '../lib/uiPrefs'
import type { InventoryState, Manufacturer } from '../types'

interface Props {
  inventory: InventoryState
}

type BuilderTab = 'standard' | 'hard' | 'boss' | 'pvp'

const STANDARD_GOALS: { id: TeamGoal; label: string }[] = [
  { id: 'campaign', label: 'Campaign' },
  { id: 'campaign-hard', label: 'Hard' },
  { id: 'boss', label: 'Boss' },
  { id: 'tower', label: 'Tower' },
  { id: 'raid', label: 'Raid' },
]

const GOAL_IDS = new Set<string>(STANDARD_GOALS.map((g) => g.id))
const ELEMENTS = ['Fire', 'Wind', 'Iron', 'Electric', 'Water']

const TABS: { id: BuilderTab; label: string }[] = [
  { id: 'standard', label: 'Standard' },
  { id: 'hard', label: 'Hard chapters' },
  { id: 'boss', label: 'Boss / Raid' },
  { id: 'pvp', label: 'PvP Arena' },
]

function parseGoal(raw: string | null | undefined): TeamGoal | '' {
  return raw && GOAL_IDS.has(raw) ? (raw as TeamGoal) : ''
}

function SquadRow({
  team,
  onCopy,
}: {
  team: BuiltTeam
  onCopy?: (names: string[], label?: string) => void
}) {
  return (
    <>
      <p className="section-lede">{team.notes}</p>
      <ul className="chip-row squad-portrait-row" style={{ marginTop: '0.75rem' }}>
        {team.members.map((m) => (
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
      {team.members.length === 0 ? <p className="fine-print">Log Nikkes in Roster first.</p> : null}
      {team.missing && team.missing.length > 0 ? (
        <p className="missing">Preferred missing: {team.missing.join(', ')}</p>
      ) : null}
      {onCopy && team.members.length > 0 ? (
        <div className="toolbar secondary" style={{ marginTop: '0.65rem' }}>
          <button
            type="button"
            className="btn ghost"
            onClick={() => onCopy(team.members.map((m) => m.name), team.label)}
          >
            Copy squad
          </button>
        </div>
      ) : null}
    </>
  )
}

export function TeamsPage({ inventory }: Props) {
  const [params] = useSearchParams()
  const prefs = useMemo(() => loadUiPrefs(), [])
  const [tab, setTab] = useState<BuilderTab>('hard')
  const [goal, setGoal] = useState<TeamGoal>(
    () => parseGoal(params.get('goal')) || parseGoal(prefs.teamsGoal) || 'campaign-hard',
  )
  const [weakTo, setWeakTo] = useState(() => params.get('weakTo') || prefs.teamsWeakTo || '')
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
    if (g) {
      setGoal(g)
      setTab('standard')
    }
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

  const hardStages = useMemo(() => hardCampaignStages(), [])
  const bossStages = useMemo(() => bossRaidStages(), [])
  const [hardChapterId, setHardChapterId] = useState(
    () => hardStages[hardStages.length - 1]?.id ?? 'hard-50',
  )
  const [bossStageId, setBossStageId] = useState(() => bossStages[0]?.id ?? 'ai-kraken')
  const [pvpSide, setPvpSide] = useState<'attack' | 'defense'>('attack')

  const ctx: BuildContext = useMemo(
    () => ({
      weakTo: weakTo || undefined,
      avoidElement: avoidElement || undefined,
      manufacturer: manufacturer || undefined,
      hardMode: goal === 'campaign-hard',
      lockedIds: lockedIds.length ? lockedIds : undefined,
      excludeIds: excludeIds.length ? excludeIds : undefined,
    }),
    [weakTo, avoidElement, manufacturer, goal, lockedIds, excludeIds],
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

  const hardStage = stageById[hardChapterId] ?? hardStages[hardStages.length - 1]
  const hardBuilt = useMemo(
    () => (hardStage ? buildTeamForStage(inventory, hardStage, true) : null),
    [inventory, hardStage],
  )

  const bossStage = stageById[bossStageId] ?? bossStages[0]
  const bossBuilt = useMemo(
    () => (bossStage ? buildTeamForStage(inventory, bossStage, false) : null),
    [inventory, bossStage],
  )

  const pvpTeams = useMemo(() => buildPvpTeams(inventory, pvpSide, 3), [inventory, pvpSide])
  const pvpArchetypes = useMemo(() => listPvpArchetypes(pvpSide), [pvpSide])

  const copyNames = async (names: string[], label?: string) => {
    const ok = await copyText(formatSquadLine(names, label))
    flash(ok ? 'Squad copied.' : 'Clipboard blocked — select text manually.')
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>Teams</h1>
        <p>
          Inventory builders for Story/Hard Ch.1–{CAMPAIGN_MAX_CHAPTER}, Anomaly/Solo/Union bosses, and SP Arena —
          Prydwen {META_SOURCE.asOf} meta + your investment.
        </p>
        <MetaBadge />
      </header>

      <div className="seg wrap" style={{ marginBottom: '1rem' }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={tab === t.id ? 'active' : ''}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'standard' ? (
        <>
          <section className="panel">
            <div className="panel-head">
              <h2>Team builder</h2>
              <span className="pill">
                score {built.score} · B{built.burstCounts[1]}/{built.burstCounts[2]}/{built.burstCounts[3]}
              </span>
            </div>
            <p className="section-lede">{built.notes}</p>

            <div className="seg wrap" style={{ marginTop: '1rem' }}>
              {STANDARD_GOALS.map((g) => (
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
        </>
      ) : null}

      {tab === 'hard' && hardBuilt && hardStage ? (
        <section className="panel">
          <div className="panel-head">
            <h2>Hard Mode chapter builder</h2>
            <span className="pill">
              {Math.round((hardBuilt.coverage ?? 0) * 100)}% BiS · score {hardBuilt.score}
            </span>
          </div>
          <p className="section-lede">
            Pick a Hard chapter — fills Prydwen BiS slots from your roster, then backfills with Hard-weighted
            carries (investment + sustain).
          </p>
          <div className="filter-row">
            <label>
              Hard chapter
              <select value={hardChapterId} onChange={(e) => setHardChapterId(e.target.value)}>
                {hardStages.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.chapter} — {s.name.replace(/^Ch\.\s*\d+\s*—\s*/, '')}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="threat-row fine-print" style={{ marginTop: '0.5rem' }}>
            Threat {'★'.repeat(hardStage.threat)}
            {hardStage.enemyNotes ? ` · ${hardStage.enemyNotes}` : ''}
          </div>
          {hardStage.tips?.length ? (
            <ul className="tip-list">
              {hardStage.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          ) : null}
          <SquadRow team={hardBuilt} onCopy={(names, label) => void copyNames(names, label)} />
          {msg && tab === 'hard' ? <p className="flash">{msg}</p> : null}
          <p className="fine-print" style={{ marginTop: '0.75rem' }}>
            Sample BiS: {(hardStage.sampleTeams[0]?.members ?? []).join(' · ') || '—'}
          </p>
        </section>
      ) : null}

      {tab === 'boss' && bossBuilt && bossStage ? (
        <section className="panel">
          <div className="panel-head">
            <h2>Boss / raid builder</h2>
            <span className="pill">
              {Math.round((bossBuilt.coverage ?? 0) * 100)}% BiS · score {bossBuilt.score}
            </span>
          </div>
          <p className="section-lede">
            Anomaly Interception, Solo Museum, and Union Raid bosses — element-aware fills from your roster.
          </p>
          <div className="filter-row">
            <label>
              Boss
              <select value={bossStageId} onChange={(e) => setBossStageId(e.target.value)}>
                {bossStages.map((s) => (
                  <option key={s.id} value={s.id}>
                    [{s.mode}] {s.name}
                    {s.weakTo ? ` · weak ${s.weakTo}` : ''}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="fine-print" style={{ marginTop: '0.5rem' }}>
            {bossStage.chapter}
            {bossStage.element ? ` · boss ${bossStage.element}` : ''}
            {bossStage.weakTo ? ` · weakTo ${bossStage.weakTo}` : ''}
            {bossStage.strongAgainst ? ` · avoid ${bossStage.strongAgainst}` : ''}
          </div>
          {bossStage.tips?.length ? (
            <ul className="tip-list">
              {bossStage.tips.slice(0, 3).map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          ) : null}
          <SquadRow team={bossBuilt} onCopy={(names, label) => void copyNames(names, label)} />
          {msg && tab === 'boss' ? <p className="flash">{msg}</p> : null}
        </section>
      ) : null}

      {tab === 'pvp' ? (
        <>
          <section className="panel">
            <div className="panel-head">
              <h2>SP Arena team builder</h2>
              <span className="pill">{pvpSide === 'attack' ? 'Attack' : 'Defense'} · 3 squads</span>
            </div>
            <p className="section-lede">
              Prydwen SP Arena archetypes — Scarlet+Jackal and Biscuit+SAnis first, then flex. Units are not reused
              across squads. Attackers are favored; defense is a knowledge check.
            </p>
            <div className="seg wrap">
              <button
                type="button"
                className={pvpSide === 'attack' ? 'active' : ''}
                onClick={() => setPvpSide('attack')}
              >
                Attack
              </button>
              <button
                type="button"
                className={pvpSide === 'defense' ? 'active' : ''}
                onClick={() => setPvpSide('defense')}
              >
                Defense
              </button>
            </div>
            <div className="stack" style={{ marginTop: '1rem' }}>
              {pvpTeams.map((t) => (
                <article key={t.label} className="panel nested-panel">
                  <div className="panel-head">
                    <h3>{t.label}</h3>
                    <div className="panel-actions">
                      <span className="pill">
                        score {t.score}
                        {t.coverage != null ? ` · ${Math.round(t.coverage * 100)}%` : ''}
                      </span>
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
                  <SquadRow team={t} />
                </article>
              ))}
              {pvpTeams.length === 0 ? <p className="fine-print">Log PvP Nikkes in Roster first.</p> : null}
            </div>
            {msg && tab === 'pvp' ? <p className="flash">{msg}</p> : null}
          </section>

          <section className="section">
            <div className="section-head">
              <h2>Archetype library</h2>
              <span className="section-tag">{pvpArchetypes.length} comps</span>
            </div>
            <div className="stack">
              {pvpArchetypes.map((a) => (
                <article key={a.id} className="panel">
                  <div className="panel-head">
                    <h3>{a.name}</h3>
                    <div className="panel-actions">
                      <span className="pill">{a.speed}</span>
                      <button
                        type="button"
                        className="btn ghost"
                        onClick={() =>
                          void copyNames(
                            a.slots.map((ref) => resolveNikkeRef(ref)?.name ?? ref),
                            a.name,
                          )
                        }
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <p className="purpose">{a.purpose}</p>
                  <ul className="chip-row">
                    {a.slots.map((ref) => {
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
                  <p className="fine-print">{a.notes}</p>
                </article>
              ))}
            </div>
          </section>
        </>
      ) : null}

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
