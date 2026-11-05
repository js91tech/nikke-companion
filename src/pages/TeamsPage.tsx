import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MetaBadge } from '../components/MetaBadge'
import { Portrait } from '../components/Portrait'
import { allElements, allManufacturers, resolveNikkeRef } from '../data/catalog'
import { META_SOURCE } from '../data/metaSource'
import { bossRaidStages, CAMPAIGN_MAX_CHAPTER, hardCampaignStages, stageById } from '../data/stages'
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

const ELEMENTS = ['Fire', 'Wind', 'Iron', 'Electric', 'Water']

const TABS: { id: BuilderTab; label: string }[] = [
  { id: 'standard', label: 'Standard' },
  { id: 'hard', label: 'Hard chapters' },
  { id: 'boss', label: 'Boss / Raid' },
  { id: 'pvp', label: 'PvP Arena' },
]

function SquadRow({ team }: { team: BuiltTeam }) {
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
    </>
  )
}

export function TeamsPage({ inventory }: Props) {
  const [tab, setTab] = useState<BuilderTab>('hard')
  const [goal, setGoal] = useState<TeamGoal>('campaign-hard')
  const [weakTo, setWeakTo] = useState('')
  const [avoidElement, setAvoidElement] = useState('')
  const [manufacturer, setManufacturer] = useState<'' | Manufacturer>('')
  const [squadCount, setSquadCount] = useState(3)

  const hardStages = useMemo(() => hardCampaignStages(), [])
  const bossStages = useMemo(() => bossRaidStages(), [])
  const [hardChapterId, setHardChapterId] = useState(() => hardStages[hardStages.length - 1]?.id ?? 'hard-50')
  const [bossStageId, setBossStageId] = useState(() => bossStages[0]?.id ?? 'ai-kraken')
  const [pvpSide, setPvpSide] = useState<'attack' | 'defense'>('attack')

  const ctx: BuildContext = useMemo(
    () => ({
      weakTo: weakTo || undefined,
      avoidElement: avoidElement || undefined,
      manufacturer: manufacturer || undefined,
      hardMode: goal === 'campaign-hard',
    }),
    [weakTo, avoidElement, manufacturer, goal],
  )

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
            <SquadRow team={built} />

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
          <SquadRow team={hardBuilt} />
          <p className="fine-print" style={{ marginTop: '0.75rem' }}>
            Sample BiS:{' '}
            {(hardStage.sampleTeams[0]?.members ?? []).join(' · ') || '—'}
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
          <SquadRow team={bossBuilt} />
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
                    <span className="pill">
                      score {t.score}
                      {t.coverage != null ? ` · ${Math.round(t.coverage * 100)}%` : ''}
                    </span>
                  </div>
                  <SquadRow team={t} />
                </article>
              ))}
              {pvpTeams.length === 0 ? <p className="fine-print">Log PvP Nikkes in Roster first.</p> : null}
            </div>
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
                    <span className="pill">{a.speed}</span>
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
