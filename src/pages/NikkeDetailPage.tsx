import { Link, useParams } from 'react-router-dom'
import { Portrait } from '../components/Portrait'
import { nikkeById } from '../data/catalog'
import type { InventoryState, OwnedEntry } from '../types'

interface Props {
  inventory: InventoryState
  toggleNikke: (id: string) => void
  patchNikke: (id: string, patch: Partial<OwnedEntry>) => void
}

export function NikkeDetailPage({ inventory, toggleNikke, patchNikke }: Props) {
  const { id } = useParams()
  const nikke = id ? nikkeById[id] : undefined

  if (!nikke) {
    return (
      <div className="page">
        <p>Nikke not found.</p>
        <Link to="/roster">Back to roster</Link>
      </div>
    )
  }

  const entry = inventory.nikkes[nikke.id]
  const owned = Boolean(entry?.owned)
  const lb = entry?.limitBreak ?? 0
  const ol = entry?.olLines ?? 0
  const skills = entry?.skills ?? ([1, 1, 1] as [number, number, number])

  return (
    <div className="page">
      <p>
        <Link className="text-link" to="/roster">
          ← Roster
        </Link>
      </p>
      <header className="page-header detail-hero">
        <Portrait src={nikke.portraitUrl} name={nikke.name} size={96} className="detail-portrait" />
        <div>
          <h1>{nikke.name}</h1>
          <p>
            B{nikke.burst}
            {nikke.burstLabel && nikke.burstLabel !== String(nikke.burst) ? ` (${nikke.burstLabel})` : ''} ·{' '}
            {nikke.class} · {nikke.weaponLabel || nikke.weapon} · {nikke.manufacturerLabel || nikke.manufacturer} ·{' '}
            {nikke.rarity}
            {nikke.element ? ` · ${nikke.element}` : ''}
          </p>
        </div>
      </header>
      <section className="panel">
        <div className="toolbar secondary">
          <button type="button" className={owned ? 'btn ghost' : 'btn primary'} onClick={() => toggleNikke(nikke.id)}>
            {owned ? 'Mark not owned' : 'Mark owned'}
          </button>
          <Link className="btn primary" to="/teams">
            Use in team builder
          </Link>
        </div>

        {owned ? (
          <div className="invest-grid">
            <label className="ur-field">
              <span>Limit Break</span>
              <select
                value={lb}
                onChange={(e) =>
                  patchNikke(nikke.id, { limitBreak: Number(e.target.value) as OwnedEntry['limitBreak'] })
                }
              >
                {[0, 1, 2, 3].map((n) => (
                  <option key={n} value={n}>
                    LB{n}
                  </option>
                ))}
              </select>
            </label>
            <label className="ur-field">
              <span>OL pieces</span>
              <select
                value={ol}
                onChange={(e) =>
                  patchNikke(nikke.id, { olLines: Number(e.target.value) as OwnedEntry['olLines'] })
                }
              >
                {[0, 1, 2, 3].map((n) => (
                  <option key={n} value={n}>
                    {n} OL
                  </option>
                ))}
              </select>
            </label>
            {(['S1', 'S2', 'Burst'] as const).map((label, i) => (
              <label key={label} className="ur-field">
                <span>{label}</span>
                <select
                  value={skills[i]}
                  onChange={(e) => {
                    const next: [number, number, number] = [...skills]
                    next[i] = Number(e.target.value)
                    patchNikke(nikke.id, { skills: next })
                  }}
                >
                  {Array.from({ length: 10 }, (_, k) => k + 1).map((n) => (
                    <option key={n} value={n}>
                      Lv {n}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        ) : (
          <p className="fine-print">Mark owned to track LB / skills / OL investment.</p>
        )}

        {nikke.squad ? <p>Squad: {nikke.squad}</p> : null}
        {nikke.specialties && nikke.specialties.length > 0 ? (
          <>
            <h4 className="subhead">Specialties</h4>
            <ul className="chip-row">
              {nikke.specialties.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </>
        ) : null}
        {nikke.releaseDate ? <p className="fine-print">Added: {nikke.releaseDate}</p> : null}
        {nikke.treasure ? <p className="fine-print">Treasure upgrade unit.</p> : null}
        {nikke.notes ? <p>{nikke.notes}</p> : null}
      </section>
    </div>
  )
}
