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
  const aiReady = anomaly.filter((a) => a.canClear === 'likely').length

  return (
    <div className="page home-page">
      <section className="hero hero-bleed">
        <div className="hero-bg" aria-hidden>
          <div className="hero-skyline" />
          <div className="hero-sweep" />
          <div className="hero-radar" />
          <div className="hero-noise" />
          <div className="hero-reticle" />
        </div>

        <div className="hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="pulse-dot" />
              Surface ops // local sync
            </p>
            <h1 className="hero-brand">
              <span className="hero-brand-kicker">Goddess of Victory</span>
              <span className="hero-brand-main glitch-text" data-text="NIKKE">
                NIKKE
              </span>
              <span className="hero-brand-sub">Companion</span>
            </h1>
            <div className="burst-gauge" aria-hidden>
              <span className="burst-pip b1" />
              <span className="burst-pip b2" />
              <span className="burst-pip b3" />
              <span className="burst-fill" />
            </div>
            <p className="hero-lede">
              Dock checklist, burst teams, and raid coverage for {catalogMeta.nikkeCount} Nikkes — campaign Ch.1–
              {CAMPAIGN_MAX_CHAPTER}, Anomaly AI, Solo Museum, Union bosses.
            </p>
            <div className="cta-row">
              <Link className="btn primary" to="/roster">
                <span className="btn-glow" aria-hidden />
                Open roster
              </Link>
              <Link className="btn ghost" to="/stages">
                Stages &amp; raids
              </Link>
            </div>
          </div>

          <aside className="hero-rack" aria-label="Quick status">
            <div className="rack-head">
              <span>SYS STATUS</span>
              <span className="rack-live">LIVE</span>
            </div>
            <div className="rack-row">
              <span>SYNCED</span>
              <strong data-value={ownedCount}>{ownedCount}</strong>
            </div>
            <div className="rack-row">
              <span>BURST MIX</span>
              <strong>
                B{built.burstCounts[1]}/{built.burstCounts[2]}/{built.burstCounts[3]}
              </strong>
            </div>
            <div className="rack-row">
              <span>AI READY</span>
              <strong>
                {aiReady}/{anomaly.length}
              </strong>
            </div>
            <div className="rack-row">
              <span>CLEARS</span>
              <strong>{likely}</strong>
            </div>
            <div className="rack-meter" aria-hidden>
              <span style={{ width: `${Math.min(100, (ownedCount / Math.max(1, catalogMeta.nikkeCount)) * 100)}%` }} />
            </div>
            <p className="rack-caption">Roster fill vs catalog</p>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Suggested squad</h2>
          <span className="section-tag">{built.label}</span>
        </div>
        <div className="squad-strip">
          {built.members.length > 0 ? (
            built.members.map((m, i) => (
              <Link
                key={m.id}
                to={`/nikkes/${m.id}`}
                className={`squad-chip burst-${m.burst}`}
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <span className="squad-burst-ring" aria-hidden />
                <span className="squad-burst">B{m.burst}</span>
                <span className="squad-name">{m.name}</span>
                <span className="squad-meta">
                  {m.class} · {m.weapon}
                </span>
              </Link>
            ))
          ) : (
            <p className="section-lede">Log Nikkes in Roster to generate a team.</p>
          )}
        </div>
        <Link className="text-link" to="/teams">
          Open team builder →
        </Link>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Anomaly Interception</h2>
          <span className="section-tag">5 bosses</span>
        </div>
        <div className="boss-grid">
          {anomaly.map((a, i) => (
            <article
              key={a.stage.id}
              className={`boss-tile status-${a.canClear}`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className="target-lock" aria-hidden />
              <div className="boss-tile-top">
                <h3>{a.stage.name}</h3>
                <span className={`pill status-${a.canClear}`}>{a.canClear.replace('-', ' ')}</span>
              </div>
              <div className="ai-meta">
                {a.stage.weakTo ? <span className="tag weak">Weak {a.stage.weakTo}</span> : null}
                {a.stage.element ? <span className="tag">Code {a.stage.element}</span> : null}
              </div>
              <div className="meter" aria-hidden>
                <span style={{ width: `${Math.round(a.coverage * 100)}%` }} />
              </div>
              <p className="fine-print">
                BiS: {a.stage.sampleTeams[0]?.members.slice(0, 3).join(', ')}
                {(a.stage.sampleTeams[0]?.members.length ?? 0) > 3 ? '…' : ''} · {a.ownedCount}/
                {a.totalCount} best owned · {a.stage.sampleTeams.length} teams
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="section twin-rails">
        <div>
          <div className="section-head">
            <h2>Solo Museum</h2>
            <span className="section-tag">{solo.length}</span>
          </div>
          <div className="mini-boss-list">
            {solo.map((a) => (
              <div key={a.stage.id} className="mini-boss">
                <span>{a.stage.name}</span>
                <span className={`pill status-${a.canClear}`}>{a.canClear === 'likely' ? 'ready' : a.canClear}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="section-head">
            <h2>Union Raid</h2>
            <span className="section-tag">{union.length}</span>
          </div>
          <div className="mini-boss-list">
            {union.slice(0, 6).map((a) => (
              <div key={a.stage.id} className="mini-boss">
                <span>{a.stage.name}</span>
                {a.stage.weakTo ? <span className="tag weak">{a.stage.weakTo}</span> : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <p className="section-foot">
        <Link className="text-link" to="/stages">
          Open full stage database →
        </Link>
        {' · '}
        <Link className="text-link" to="/union-raid">
          Union Raid damage planner →
        </Link>
      </p>

      <section className="section">
        <div className="section-head">
          <h2>Template coverage</h2>
        </div>
        <div className="stack">
          {teams.map((t, i) => (
            <article key={t.id} className="panel cover-panel" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="panel-head">
                <h3>{t.name}</h3>
                <span className="pill">
                  {t.ownedCount}/{t.totalCount}
                </span>
              </div>
              <div className="meter" aria-hidden>
                <span style={{ width: `${t.score}%` }} />
              </div>
              <p className="fine-print">{t.purpose}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
