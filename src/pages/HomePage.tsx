import { Link } from 'react-router-dom'
import { catalogMeta } from '../data/catalog'
import { buildTeamFromInventory } from '../lib/teamBuilder'
import { evaluateStages, suggestTeams } from '../lib/recommendations'
import type { InventoryState } from '../types'

interface Props {
  inventory: InventoryState
  ownedCount: number
}

export function HomePage({ inventory, ownedCount }: Props) {
  const teams = suggestTeams(inventory).slice(0, 3)
  const stages = evaluateStages(inventory)
  const likely = stages.filter((s) => s.canClear === 'likely').length
  const built = buildTeamFromInventory(inventory, ownedCount < 10 ? 'campaign' : 'boss')

  return (
    <div className="page home-page">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Outpost aide</p>
          <h1 className="hero-brand">Nikke Companion</h1>
          <p className="hero-lede">
            Roster checklist, burst-aware teams, and stage coverage for {catalogMeta.nikkeCount} seeded Nikkes — from
            what you actually own. Local-first, no game account login.
          </p>
          <div className="cta-row">
            <Link className="btn primary" to="/roster">
              Open roster
            </Link>
            <Link className="btn ghost" to="/teams">
              Build team
            </Link>
          </div>
        </div>
      </section>

      <section className="section stats-strip">
        <div>
          <strong>{ownedCount}</strong>
          <span>Nikkes logged</span>
        </div>
        <div>
          <strong>{likely}</strong>
          <span>stages looking clearable</span>
        </div>
        <div>
          <strong>
            B{built.burstCounts[1]}/{built.burstCounts[2]}/{built.burstCounts[3]}
          </strong>
          <span>suggested burst mix</span>
        </div>
      </section>

      <section className="section">
        <h2>Suggested from your roster</h2>
        <p className="section-lede">
          {built.label}: {built.members.map((m) => m.name).join(', ') || 'Log Nikkes to generate a team'}
        </p>
        <Link className="text-link" to="/teams">
          Open team builder →
        </Link>
      </section>

      <section className="section">
        <h2>Template coverage</h2>
        <div className="stack">
          {teams.map((t) => (
            <article key={t.id} className="panel">
              <div className="panel-head">
                <h3>{t.name}</h3>
                <span className="pill">
                  {t.ownedCount}/{t.totalCount}
                </span>
              </div>
              <p className="fine-print">{t.purpose}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
