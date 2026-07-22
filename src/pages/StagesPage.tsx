import { useMemo, useState } from 'react'
import { evaluateStages } from '../lib/recommendations'
import type { InventoryState } from '../types'

interface Props {
  inventory: InventoryState
}

export function StagesPage({ inventory }: Props) {
  const [mode, setMode] = useState<'all' | 'campaign' | 'tower' | 'union' | 'solo'>('all')
  const results = useMemo(() => evaluateStages(inventory), [inventory])
  const filtered = mode === 'all' ? results : results.filter((r) => r.stage.mode === mode)

  return (
    <div className="page">
      <header className="page-header">
        <h1>Stages</h1>
        <p>Coverage against sample campaign, tower, and raid teams.</p>
      </header>

      <div className="seg wrap">
        {(['all', 'campaign', 'tower', 'union', 'solo'] as const).map((m) => (
          <button key={m} type="button" className={mode === m ? 'active' : ''} onClick={() => setMode(m)}>
            {m}
          </button>
        ))}
      </div>

      <div className="stack" style={{ marginTop: '1rem' }}>
        {filtered.map((r) => (
          <article key={r.stage.id} className="panel">
            <div className="panel-head">
              <h3>
                {r.stage.name}
                <span className="fine-print"> · {r.stage.chapter}</span>
              </h3>
              <span className={`pill status-${r.canClear}`}>{r.canClear}</span>
            </div>
            <p>{r.stage.enemyNotes}</p>
            <p className="fine-print">
              Best sample: {r.bestLabel} · {r.ownedCount}/{r.totalCount} owned
            </p>
            <div className="meter" aria-hidden>
              <span style={{ width: `${Math.round(r.coverage * 100)}%` }} />
            </div>
            <ul className="tips">
              {r.stage.tips.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            {r.missing.length > 0 ? <p className="missing">Missing: {r.missing.join(', ')}</p> : null}
          </article>
        ))}
      </div>
    </div>
  )
}
