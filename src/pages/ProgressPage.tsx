import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { buildProgressPlan, type ProgressChapter } from '../lib/progression'
import type { InventoryState } from '../types'

interface Props {
  inventory: InventoryState
}

const CHAPTERS: { id: ProgressChapter; label: string }[] = [
  { id: 'early', label: 'Early' },
  { id: 'mid', label: 'Mid' },
  { id: 'late', label: 'Late' },
  { id: 'endgame', label: 'Endgame' },
]

export function ProgressPage({ inventory }: Props) {
  const [chapter, setChapter] = useState<ProgressChapter>('mid')
  const plan = useMemo(() => buildProgressPlan(inventory, chapter), [inventory, chapter])

  return (
    <div className="page">
      <header className="page-header">
        <h1>Progression</h1>
        <p>What to focus on based on where you are and what you own.</p>
      </header>

      <section className="panel">
        <h2>Where are you?</h2>
        <div className="seg wrap">
          {CHAPTERS.map((c) => (
            <button
              key={c.id}
              type="button"
              className={chapter === c.id ? 'active' : ''}
              onClick={() => setChapter(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>{plan.title}</h2>
        <p>{plan.summary}</p>
        <h4 className="subhead">Focus team</h4>
        <p>{plan.focusTeam}</p>
        <Link className="text-link" to="/teams">
          Open team builder →
        </Link>
      </section>

      <section className="section">
        <h2>Priorities</h2>
        <div className="stack">
          {plan.tips.map((t) => (
            <article key={t.id} className="panel">
              <div className="panel-head">
                <h3>{t.title}</h3>
                <span className="pill">{t.priority}</span>
              </div>
              <p>{t.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
