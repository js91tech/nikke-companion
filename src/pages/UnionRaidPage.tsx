import { useEffect, useMemo, useState } from 'react'
import {
  formatDamage,
  getTemplateHp,
  parseDamageInput,
  rotatingBossPresets,
  unionBossTemplates,
} from '../data/unionRaid'
import { planUnionRaid, type PlanResult } from '../lib/unionRaidPlanner'
import {
  defaultUnionRaidState,
  loadUnionRaidState,
  newBossRow,
  newMember,
  normalizeMocks,
  saveUnionRaidState,
  type UrBossRow,
  type UrMember,
  type UnionRaidState,
} from '../lib/unionRaidStorage'

function DamageField({
  value,
  onChange,
  label,
}: {
  value: number
  onChange: (n: number) => void
  label: string
}) {
  const [text, setText] = useState(value > 0 ? String(value) : '')
  useEffect(() => {
    setText(value > 0 ? String(value) : '')
  }, [value])

  return (
    <label className="ur-field">
      <span>{label}</span>
      <input
        className="search"
        inputMode="decimal"
        placeholder="e.g. 85m"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => onChange(parseDamageInput(text))}
      />
    </label>
  )
}

export function UnionRaidPage() {
  const [state, setState] = useState<UnionRaidState>(() => loadUnionRaidState())
  const [addBossId, setAddBossId] = useState(unionBossTemplates[0]?.id ?? 'obelisk')
  const [addStage, setAddStage] = useState(6)
  const [plan, setPlan] = useState<PlanResult | null>(null)

  useEffect(() => {
    saveUnionRaidState(state)
  }, [state])

  const classicOptions = unionBossTemplates
  const rotatingOptions = rotatingBossPresets

  const attempts = useMemo(() => {
    const list = []
    for (const m of state.members) {
      for (let i = 0; i < 3; i++) {
        const mock = m.mocks[i] ?? 0
        if (mock <= 0) continue
        list.push({
          id: `${m.id}-a${i + 1}`,
          memberId: m.id,
          memberName: m.name,
          slot: (i + 1) as 1 | 2 | 3,
          mockDamage: mock,
          effectiveDamage: Math.round(mock * state.mockFactor),
        })
      }
    }
    return list
  }, [state.members, state.mockFactor])

  const targets = useMemo(
    () =>
      state.bosses
        .filter((b) => b.enabled && b.remainingHp > 0)
        .map((b) => ({
          id: b.id,
          name: `${b.name} S${b.stage}`,
          remainingHp: b.remainingHp,
          stage: b.stage,
        })),
    [state.bosses],
  )

  function updateMember(id: string, patch: Partial<UrMember>) {
    setState((s) => ({
      ...s,
      members: s.members.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    }))
    setPlan(null)
  }

  function updateBoss(id: string, patch: Partial<UrBossRow>) {
    setState((s) => ({
      ...s,
      bosses: s.bosses.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    }))
    setPlan(null)
  }

  function addMember() {
    setState((s) => ({
      ...s,
      members: [...s.members, newMember(`Cmdr ${s.members.length + 1}`)],
    }))
    setPlan(null)
  }

  function removeMember(id: string) {
    setState((s) => ({ ...s, members: s.members.filter((m) => m.id !== id) }))
    setPlan(null)
  }

  function addBoss() {
    const classic = classicOptions.find((b) => b.id === addBossId)
    const rotating = rotatingOptions.find((b) => b.id === addBossId)
    const name = classic?.name ?? rotating?.name ?? 'Custom'
    const hp = classic ? (getTemplateHp(addBossId, addStage) ?? 0) : 0
    setState((s) => ({
      ...s,
      bosses: [...s.bosses, newBossRow(addBossId, name, addStage, hp)],
    }))
    setPlan(null)
  }

  function removeBoss(id: string) {
    setState((s) => ({ ...s, bosses: s.bosses.filter((b) => b.id !== id) }))
    setPlan(null)
  }

  function fillFullHp(boss: UrBossRow) {
    const hp = getTemplateHp(boss.templateId, boss.stage)
    if (hp != null) updateBoss(boss.id, { remainingHp: hp })
  }

  function runPlan() {
    setPlan(
      planUnionRaid(targets, attempts, {
        allowFinishOverkill: state.allowFinishOverkill,
        clearSmallFirst: true,
      }),
    )
  }

  function resetAll() {
    setState(defaultUnionRaidState())
    setPlan(null)
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>Union Raid calculator</h1>
        <p>
          Assign mock-battle damage across bosses without overkill waste. Enter remaining HP, member
          attempt damage, then generate a plan. Local only — not linked to the game.
        </p>
      </header>

      <section className="panel ur-settings">
        <div className="panel-head">
          <h3>Settings</h3>
        </div>
        <div className="ur-settings-row">
          <label className="ur-field">
            <span>Mock → real factor</span>
            <input
              className="search"
              type="number"
              min={0.5}
              max={1}
              step={0.05}
              value={state.mockFactor}
              onChange={(e) => {
                setState((s) => ({ ...s, mockFactor: Number(e.target.value) || 0.8 }))
                setPlan(null)
              }}
            />
          </label>
          <p className="fine-print ur-hint">
            Real raids often land ~70–85% of mock. Default 0.8.
          </p>
          <label className="ur-check">
            <input
              type="checkbox"
              checked={state.allowFinishOverkill}
              onChange={(e) => {
                setState((s) => ({ ...s, allowFinishOverkill: e.target.checked }))
                setPlan(null)
              }}
            />
            Allow finish overkill (smallest hit that clears leftover HP)
          </label>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Bosses / stages</h2>
          <span className="section-tag">{state.bosses.filter((b) => b.enabled).length} active</span>
        </div>

        <div className="ur-add-row toolbar">
          <label className="ur-field grow">
            <span>Boss</span>
            <select
              value={addBossId}
              onChange={(e) => setAddBossId(e.target.value)}
            >
              <optgroup label="Classic">
                {classicOptions.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                    {b.weakTo ? ` (weak ${b.weakTo})` : ''}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Rotating (enter HP)">
                {rotatingOptions.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                    {b.weakTo ? ` (weak ${b.weakTo})` : ''}
                  </option>
                ))}
              </optgroup>
            </select>
          </label>
          <label className="ur-field">
            <span>Stage</span>
            <select value={addStage} onChange={(e) => setAddStage(Number(e.target.value))}>
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="btn ghost" onClick={addBoss}>
            Add boss
          </button>
        </div>

        <div className="stack" style={{ marginTop: '0.75rem' }}>
          {state.bosses.length === 0 ? (
            <p className="section-lede">Add the bosses your Union is working this reset.</p>
          ) : (
            state.bosses.map((b) => (
              <article key={b.id} className={`panel ur-boss ${b.enabled ? '' : 'dimmed'}`}>
                <div className="panel-head">
                  <h3>
                    {b.name} · S{b.stage}
                  </h3>
                  <label className="ur-check compact">
                    <input
                      type="checkbox"
                      checked={b.enabled}
                      onChange={(e) => updateBoss(b.id, { enabled: e.target.checked })}
                    />
                    Active
                  </label>
                </div>
                <div className="ur-boss-row">
                  <DamageField
                    label="Remaining HP"
                    value={b.remainingHp}
                    onChange={(n) => updateBoss(b.id, { remainingHp: n })}
                  />
                  <button type="button" className="btn ghost" onClick={() => fillFullHp(b)}>
                    Fill full HP
                  </button>
                  <button type="button" className="btn ghost" onClick={() => removeBoss(b.id)}>
                    Remove
                  </button>
                </div>
                <p className="fine-print">
                  Table full HP: {formatDamage(getTemplateHp(b.templateId, b.stage) ?? 0) || '— (enter manually)'}
                </p>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Union members</h2>
          <span className="section-tag">{state.members.length} · {attempts.length} attempts</span>
        </div>
        <div className="toolbar">
          <button type="button" className="btn primary" onClick={addMember}>
            <span className="btn-glow" aria-hidden />
            Add member
          </button>
        </div>

        <div className="stack" style={{ marginTop: '0.75rem' }}>
          {state.members.length === 0 ? (
            <p className="section-lede">Add commanders and paste mock damage for up to 3 attempts.</p>
          ) : (
            state.members.map((m) => (
              <article key={m.id} className="panel ur-member">
                <div className="panel-head">
                  <input
                    className="search ur-name"
                    value={m.name}
                    onChange={(e) => updateMember(m.id, { name: e.target.value })}
                    aria-label="Member name"
                  />
                  <button type="button" className="btn ghost" onClick={() => removeMember(m.id)}>
                    Remove
                  </button>
                </div>
                <div className="ur-mock-row">
                  {([0, 1, 2] as const).map((i) => (
                    <DamageField
                      key={i}
                      label={`Attempt ${i + 1} (mock)`}
                      value={m.mocks[i]}
                      onChange={(n) => {
                        const mocks = normalizeMocks([...m.mocks])
                        mocks[i] = n
                        updateMember(m.id, { mocks })
                      }}
                    />
                  ))}
                </div>
                <p className="fine-print">
                  Effective:{' '}
                  {m.mocks
                    .map((d) => (d > 0 ? formatDamage(Math.round(d * state.mockFactor)) : '—'))
                    .join(' / ')}
                </p>
              </article>
            ))
          )}
        </div>
      </section>

      <div className="toolbar ur-actions">
        <button
          type="button"
          className="btn primary"
          onClick={runPlan}
          disabled={targets.length === 0 || attempts.length === 0}
        >
          <span className="btn-glow" aria-hidden />
          Generate plan
        </button>
        <button type="button" className="btn ghost" onClick={resetAll}>
          Reset planner
        </button>
      </div>

      {plan ? (
        <section className="section">
          <div className="section-head">
            <h2>Plan</h2>
            <span className="section-tag">
              {formatDamage(plan.totalUseful)} useful · {formatDamage(plan.totalOverkill)} overkill
            </span>
          </div>

          <div className="stats-strip ur-summary">
            <div>
              <strong>{formatDamage(plan.totalUseful)}</strong>
              <span>Useful damage</span>
            </div>
            <div>
              <strong>{formatDamage(plan.totalOverkill)}</strong>
              <span>Overkill waste</span>
            </div>
            <div>
              <strong>{plan.unused.length}</strong>
              <span>Unused attempts</span>
            </div>
          </div>

          <div className="stack" style={{ marginTop: '1rem' }}>
            {plan.targets.map((t) => (
              <article
                key={t.targetId}
                className={`panel ur-plan-boss ${t.cleared ? 'cleared' : ''}`}
              >
                <div className="panel-head">
                  <h3>{t.targetName}</h3>
                  <span className={`pill ${t.cleared ? 'status-likely' : 'status-borderline'}`}>
                    {t.cleared ? 'cleared' : `${formatDamage(t.endHp)} left`}
                  </span>
                </div>
                <p className="fine-print">
                  {formatDamage(t.startHp)} → {formatDamage(t.endHp)} · useful{' '}
                  {formatDamage(t.usefulDamage)}
                  {t.overkill > 0 ? ` · overkill ${formatDamage(t.overkill)}` : ''}
                </p>
                <div className="meter" aria-hidden>
                  <span
                    style={{
                      width: `${Math.min(100, Math.round((t.usefulDamage / Math.max(1, t.startHp)) * 100))}%`,
                    }}
                  />
                </div>
                {t.assignments.length === 0 ? (
                  <p className="section-lede">No hits assigned.</p>
                ) : (
                  <ul className="ur-assign-list">
                    {t.assignments.map((a) => (
                      <li key={a.attemptId}>
                        <strong>
                          {a.memberName} · A{a.slot}
                        </strong>
                        <span>
                          {formatDamage(a.plannedDamage)}
                          {a.overkill > 0
                            ? ` (useful ${formatDamage(a.usefulDamage)}, OK ${formatDamage(a.overkill)})`
                            : ''}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>

          {plan.unused.length > 0 ? (
            <div className="panel" style={{ marginTop: '0.85rem' }}>
              <h3>Unused attempts</h3>
              <p className="fine-print">
                Could not place without overkill (or no HP left). Save for the next stage / boss.
              </p>
              <ul className="chip-row">
                {plan.unused.map((a) => (
                  <li key={a.id} className="have">
                    {a.memberName} A{a.slot}: {formatDamage(a.effectiveDamage)}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  )
}
