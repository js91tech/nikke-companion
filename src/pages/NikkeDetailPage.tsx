import { Link, useParams } from 'react-router-dom'
import { nikkeById } from '../data/catalog'
import type { InventoryState } from '../types'

interface Props {
  inventory: InventoryState
  toggleNikke: (id: string) => void
}

export function NikkeDetailPage({ inventory, toggleNikke }: Props) {
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

  const owned = Boolean(inventory.nikkes[nikke.id]?.owned)

  return (
    <div className="page">
      <p>
        <Link className="text-link" to="/roster">
          ← Roster
        </Link>
      </p>
      <header className="page-header">
        <h1>{nikke.name}</h1>
        <p>
          B{nikke.burst}
          {nikke.burstLabel && nikke.burstLabel !== String(nikke.burst) ? ` (${nikke.burstLabel})` : ''} ·{' '}
          {nikke.class} · {nikke.weaponLabel || nikke.weapon} · {nikke.manufacturerLabel || nikke.manufacturer} ·{' '}
          {nikke.rarity}
          {nikke.element ? ` · ${nikke.element}` : ''}
        </p>
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
