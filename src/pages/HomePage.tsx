import { Link } from 'react-router-dom'
import { catalogMeta } from '../data/catalog'
import { CAMPAIGN_MAX_CHAPTER } from '../data/stages'
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
  const anomaly = stages.filter((s) => s.stage.mode === 'anomaly')
  const solo = stages.filter((s) => s.stage.mode === 'solo')
  const union = stages.filter((s) => s.stage.mode === 'union')
  const likely = stages.filter((s) => s.canClear === 'likely').length
  const built = buildTeamFromInventory(inventory, ownedCount < 10 ? 'campaign' : 'boss')

  return (
    <div className="page home-page">
      <section className="hero hero-hud">
        <div className="hero-frame" aria-hidden>
          <span className="hud-corner tl" />
          <span className="hud-corner tr" />
          <span className="hud-corner bl" />
          <span className="hud-corner br" />
        </div>
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="pulse-dot" /> Commander terminal
          </p>
          <h1 className="hero-brand">
            Goddess of Victory
            <span className="hero-brand-sub">NIKKE Companion</span>
          </h1>
          <p className="hero-lede">
            Local-first outpost aide for {catalogMeta.nikkeCount} Nikkes — roster, burst teams, campaign Ch.1–
            {CAMPAIGN_MAX_CHAPTER} (Normal/Hard), Anomaly AI, Solo Raid Museum, and Union Raid bosses.
          </p>
          <div className="cta-row">
            <Link className="btn primary" to="/roster">
              Open roster
            </Link>
            <Link className="btn ghost" to="/stages">
              Stages &amp; raids
            </Link>
          </div>
        </div>
        <div className="hero-side" aria-hidden>
          <div className="hero-stat">
            <span>SYNC</span>
            <strong>{ownedCount}</strong>
          </div>
          <div className="hero-stat">
            <span>BURST</span>
            <strong>
              {built.burstCounts[1]}-{built.burstCounts[2]}-{built.burstCounts[3]}
            </strong>
          </div>
          <div className="hero-stat">
            <span>CLEAR</span>
            <strong>{likely}</strong>
          </div>
        </div>
      </section>

      <section className="section stats-strip">
        <div>
          <strong>{ownedCount}</strong>
          <span>Nikkes logged</span>
        </div>
        <div>
          <strong>
            {anomaly.filter((a) => a.canClear === 'likely').length}/{anomaly.length}
          </strong>
          <span>AI bosses looking ready</span>
        </div>
        <div>
          <strong>
            {solo.length}+{union.length}
          </strong>
          <span>Solo / Union raid bosses</span>
        </div>
      </section>

      <section className="section">
        <h2>Suggested squad</h2>
        <p className="section-lede">
          {built.label}: {built.members.map((m) => m.name).join(', ') || 'Log Nikkes to generate a team'}
        </p>
        <Link className="text-link" to="/teams">
          Open team builder →
        </Link>
      </section>

      <section className="section">
        <h2>Anomaly Interception</h2>
        <div className="stack">
          {anomaly.map((a) => (
            <article key={a.stage.id} className="panel stage-card mode-anomaly">
              <div className="panel-head">
                <h3>{a.stage.name}</h3>
                <span className={`pill status-${a.canClear}`}>{a.canClear}</span>
              </div>
              <div className="ai-meta">
                {a.stage.weakTo ? <span className="tag weak">Weak to {a.stage.weakTo}</span> : null}
                {a.stage.drops ? <span className="tag">{a.stage.drops.split(',')[0]}</span> : null}
              </div>
              <p className="fine-print">
                {a.ownedCount}/{a.totalCount} sample owned
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Solo Raid Museum</h2>
        <div className="stack">
          {solo.map((a) => (
            <article key={a.stage.id} className="panel stage-card mode-solo">
              <div className="panel-head">
                <h3>{a.stage.name}</h3>
                <span className={`pill status-${a.canClear}`}>{a.canClear}</span>
              </div>
              <div className="ai-meta">
                {a.stage.weakTo ? <span className="tag weak">Weak to {a.stage.weakTo}</span> : null}
              </div>
              <p className="fine-print">
                {a.ownedCount}/{a.totalCount} sample owned
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Union Raid bosses</h2>
        <div className="stack">
          {union.slice(0, 5).map((a) => (
            <article key={a.stage.id} className="panel stage-card mode-union">
              <div className="panel-head">
                <h3>{a.stage.name}</h3>
                <span className={`pill status-${a.canClear}`}>{a.canClear}</span>
              </div>
              <div className="ai-meta">
                {a.stage.weakTo ? <span className="tag weak">Weak to {a.stage.weakTo}</span> : null}
              </div>
              <p className="fine-print">
                {a.ownedCount}/{a.totalCount} sample owned
              </p>
            </article>
          ))}
        </div>
        <p className="fine-print">Classic 5 shown — {union.length} total bosses in Stages (incl. rotating seasons).</p>
        <Link className="text-link" to="/stages">
          Full stage list →
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
