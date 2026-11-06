import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Portrait } from '../components/Portrait'
import { SyncPanel } from '../components/SyncPanel'
import {
  allClasses,
  allElements,
  allManufacturers,
  allRarities,
  allWeapons,
  catalog,
  catalogMeta,
} from '../data/catalog'
import { STORY_TIER_SCORE } from '../data/metaSource'
import { useFlash } from '../hooks/useFlash'
import { investmentScore } from '../lib/inventory'
import { matchNameList, type AmbiguousHit } from '../lib/nameMatch'
import { loadUiPrefs, saveUiPrefs } from '../lib/uiPrefs'
import type { InventoryState, OwnedEntry } from '../types'

interface Props {
  inventory: InventoryState
  toggleNikke: (id: string) => void
  setNikkesOwned: (ids: string[], owned: boolean) => void
  patchNikke: (id: string, patch: Partial<OwnedEntry>) => void
  reset: () => void
  replaceInventory: (state: InventoryState) => void
  download: () => void
  upload: (file: File) => Promise<void>
  ownedCount: number
}

type OwnFilter = 'all' | 'owned' | 'missing'
type SortKey = 'name' | 'rarity' | 'investment' | 'tier'

const RARITY_RANK: Record<string, number> = { SSR: 3, SR: 2, R: 1 }

export function RosterPage({
  inventory,
  toggleNikke,
  setNikkesOwned,
  patchNikke,
  reset,
  replaceInventory,
  download,
  upload,
  ownedCount,
}: Props) {
  const prefs = useMemo(() => loadUiPrefs(), [])
  const [q, setQ] = useState('')
  const [ownFilter, setOwnFilter] = useState<OwnFilter>('all')
  const [manufacturer, setManufacturer] = useState('all')
  const [klass, setKlass] = useState('all')
  const [weapon, setWeapon] = useState('all')
  const [rarity, setRarity] = useState('all')
  const [burst, setBurst] = useState('all')
  const [element, setElement] = useState('all')
  const [sort, setSort] = useState<SortKey>(
    () => (prefs.rosterSort as SortKey) || 'name',
  )
  const [paste, setPaste] = useState('')
  const [pasteReport, setPasteReport] = useState('')
  const [ambiguousHits, setAmbiguousHits] = useState<AmbiguousHit[]>([])
  const [msg, flash] = useFlash()
  const [checklist, setChecklist] = useState(false)
  const [visible, setVisible] = useState(60)

  const effectiveOwn: OwnFilter = checklist ? 'missing' : ownFilter

  const activeFilterCount = [
    manufacturer !== 'all',
    klass !== 'all',
    weapon !== 'all',
    rarity !== 'all',
    burst !== 'all',
    element !== 'all',
    !checklist && ownFilter !== 'all',
    Boolean(q.trim()),
  ].filter(Boolean).length

  const clearFilters = () => {
    setQ('')
    setOwnFilter('all')
    setManufacturer('all')
    setKlass('all')
    setWeapon('all')
    setRarity('all')
    setBurst('all')
    setElement('all')
    setVisible(60)
    flash('Filters cleared.')
  }

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    const list = catalog.filter((n) => {
      const owned = Boolean(inventory.nikkes[n.id]?.owned)
      if (effectiveOwn === 'owned' && !owned) return false
      if (effectiveOwn === 'missing' && owned) return false
      if (manufacturer !== 'all' && n.manufacturer !== manufacturer) return false
      if (klass !== 'all' && n.class !== klass) return false
      if (weapon !== 'all' && n.weapon !== weapon) return false
      if (rarity !== 'all' && n.rarity !== rarity) return false
      if (burst !== 'all' && String(n.burst) !== burst) return false
      if (element !== 'all' && n.element !== element) return false
      if (!query) return true
      return (
        n.name.toLowerCase().includes(query) ||
        n.manufacturer.toLowerCase().includes(query) ||
        (n.squad || '').toLowerCase().includes(query) ||
        (n.element || '').toLowerCase().includes(query)
      )
    })

    const tier = (name: string) => STORY_TIER_SCORE[name] ?? 0

    return [...list].sort((a, b) => {
      if (sort === 'rarity') {
        const d = (RARITY_RANK[b.rarity] ?? 0) - (RARITY_RANK[a.rarity] ?? 0)
        return d || a.name.localeCompare(b.name)
      }
      if (sort === 'investment') {
        const d =
          investmentScore(inventory.nikkes[b.id]) - investmentScore(inventory.nikkes[a.id])
        return d || a.name.localeCompare(b.name)
      }
      if (sort === 'tier') {
        const d = tier(b.name) - tier(a.name)
        return d || a.name.localeCompare(b.name)
      }
      return a.name.localeCompare(b.name)
    })
  }, [
    q,
    inventory.nikkes,
    effectiveOwn,
    manufacturer,
    klass,
    weapon,
    rarity,
    burst,
    element,
    sort,
  ])

  const applyPaste = () => {
    const result = matchNameList(paste)
    setNikkesOwned(result.ids, true)
    setAmbiguousHits(result.ambiguousHits)
    setPasteReport(
      [
        `Added ${result.ids.length}.`,
        result.unmatched.length ? `Unmatched: ${result.unmatched.slice(0, 10).join(', ')}` : '',
        result.ambiguousHits.length
          ? `Ambiguous: pick below (${result.ambiguousHits.length}).`
          : '',
      ]
        .filter(Boolean)
        .join('\n'),
    )
    flash(
      result.ambiguousHits.length
        ? `Paste import: ${result.ids.length} owned — resolve ${result.ambiguousHits.length} ambiguous.`
        : `Paste import: ${result.ids.length} owned.`,
    )
  }

  const resolveAmbiguous = (query: string, id: string) => {
    setNikkesOwned([id], true)
    setAmbiguousHits((prev) => prev.filter((h) => h.query !== query))
    flash('Ambiguous name resolved.')
  }

  const skipAmbiguous = (query: string) => {
    setAmbiguousHits((prev) => prev.filter((h) => h.query !== query))
  }

  const updatedLabel = inventory.updatedAt
    ? new Date(inventory.updatedAt).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : null

  return (
    <div className="page">
      <header className="page-header">
        <h1>Roster</h1>
        <p>
          {catalogMeta.nikkeCount} Nikkes ({catalogMeta.source}) · you have logged {ownedCount}.
          {updatedLabel ? ` · synced ${updatedLabel}` : ''}
        </p>
      </header>

      <section className={`panel ${checklist ? 'active-check' : ''}`}>
        <div className="panel-head">
          <h2>Checklist</h2>
          <span className="pill">
            {ownedCount}/{catalog.length}
          </span>
        </div>
        <p className="section-lede">Work through missing Nikkes — checked units drop off the list.</p>
        <div className="toolbar secondary">
          {!checklist ? (
            <button
              type="button"
              className="btn primary"
              onClick={() => {
                setChecklist(true)
                setOwnFilter('missing')
                flash('Checklist on.')
              }}
            >
              Start checklist
            </button>
          ) : (
            <button
              type="button"
              className="btn ghost"
              onClick={() => {
                setChecklist(false)
                setOwnFilter('all')
              }}
            >
              Exit checklist
            </button>
          )}
        </div>
      </section>

      <SyncPanel
        inventory={inventory}
        onApply={(state) => {
          replaceInventory(state)
          flash('Roster updated from sync code.')
        }}
      />

      <section className="panel">
        <h2>Paste names</h2>
        <textarea
          className="paste-box"
          rows={3}
          value={paste}
          onChange={(e) => setPaste(e.target.value)}
          placeholder={'Liter\nAlice\nScarlet: Black Shadow\nModernia, Crown'}
          aria-label="Paste Nikke names"
        />
        <div className="toolbar secondary">
          <button type="button" className="btn primary" onClick={applyPaste} disabled={!paste.trim()}>
            Mark pasted owned
          </button>
        </div>
        {pasteReport ? <pre className="paste-report">{pasteReport}</pre> : null}
        {ambiguousHits.length > 0 ? (
          <div className="ambiguous-list">
            <p className="section-lede">Pick the Nikke for each ambiguous paste:</p>
            {ambiguousHits.map((hit) => (
              <div key={hit.query} className="ambiguous-row">
                <div className="ambiguous-query">
                  <strong>{hit.query}</strong>
                  <button type="button" className="btn ghost btn-compact" onClick={() => skipAmbiguous(hit.query)}>
                    Skip
                  </button>
                </div>
                <ul className="chip-row">
                  {hit.candidates.map((c) => (
                    <li key={c.id}>
                      <button
                        type="button"
                        className="btn ghost ambiguous-pick"
                        onClick={() => resolveAmbiguous(hit.query, c.id)}
                      >
                        <Portrait
                          src={catalog.find((n) => n.id === c.id)?.portraitUrl}
                          name={c.name}
                          size={24}
                        />
                        {c.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <div className="roster-sticky">
        <div className="toolbar">
          <input
            className="search"
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setVisible(60)
            }}
            placeholder="Search Nikkes…"
            aria-label="Search"
          />
        </div>

        <div className="filter-row">
          <label>
            Show
            <select
              value={effectiveOwn}
              disabled={checklist}
              onChange={(e) => setOwnFilter(e.target.value as OwnFilter)}
            >
              <option value="all">All</option>
              <option value="owned">Owned</option>
              <option value="missing">Missing</option>
            </select>
          </label>
          <label>
            Mfr
            <select value={manufacturer} onChange={(e) => setManufacturer(e.target.value)}>
              <option value="all">All</option>
              {allManufacturers.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <label>
            Class
            <select value={klass} onChange={(e) => setKlass(e.target.value)}>
              <option value="all">All</option>
              {allClasses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label>
            Weapon
            <select value={weapon} onChange={(e) => setWeapon(e.target.value)}>
              <option value="all">All</option>
              {allWeapons.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </label>
          <label>
            Burst
            <select value={burst} onChange={(e) => setBurst(e.target.value)}>
              <option value="all">All</option>
              <option value="1">B1</option>
              <option value="2">B2</option>
              <option value="3">B3</option>
            </select>
          </label>
          <label>
            Element
            <select value={element} onChange={(e) => setElement(e.target.value)}>
              <option value="all">All</option>
              {allElements.map((el) => (
                <option key={el} value={el}>
                  {el}
                </option>
              ))}
            </select>
          </label>
          <label>
            Rarity
            <select value={rarity} onChange={(e) => setRarity(e.target.value)}>
              <option value="all">All</option>
              {allRarities.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <label>
            Sort
            <select
              value={sort}
              onChange={(e) => {
                const next = e.target.value as SortKey
                setSort(next)
                saveUiPrefs({ rosterSort: next })
              }}
            >
              <option value="name">Name</option>
              <option value="rarity">Rarity</option>
              <option value="tier">Story tier</option>
              <option value="investment">Investment</option>
            </select>
          </label>
        </div>

        <div className="toolbar secondary filter-actions">
          <span className="fine-print">
            {filtered.length} shown
            {activeFilterCount ? ` · ${activeFilterCount} filter${activeFilterCount === 1 ? '' : 's'}` : ''}
          </span>
          {activeFilterCount > 0 ? (
            <button type="button" className="btn ghost btn-compact" onClick={clearFilters}>
              Clear filters
            </button>
          ) : null}
        </div>
      </div>

      {msg ? <p className="flash">{msg}</p> : null}

      <ul className="check-list">
        {filtered.slice(0, visible).map((n) => {
          const entry = inventory.nikkes[n.id]
          const owned = Boolean(entry?.owned)
          const lb = entry?.limitBreak ?? 0
          const ol = entry?.olLines ?? 0
          return (
            <li key={n.id} className={owned ? 'row-owned' : ''}>
              <label className={owned ? 'owned' : ''}>
                <input type="checkbox" checked={owned} onChange={() => toggleNikke(n.id)} />
                <Portrait src={n.portraitUrl} name={n.name} size={36} />
                <span className="name">
                  <Link to={`/nikkes/${n.id}`}>{n.name}</Link>
                </span>
                <span className="meta">
                  B{n.burst} · {n.class} · {n.weapon}
                  {n.element ? ` · ${n.element}` : ''} · {n.manufacturer} · {n.rarity}
                </span>
              </label>
              {owned ? (
                <div
                  className="invest-inline"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                >
                  <label className="invest-field">
                    <span>LB</span>
                    <select
                      value={lb}
                      aria-label={`${n.name} limit break`}
                      onChange={(e) =>
                        patchNikke(n.id, {
                          limitBreak: Number(e.target.value) as OwnedEntry['limitBreak'],
                        })
                      }
                    >
                      {[0, 1, 2, 3].map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="invest-field">
                    <span>OL</span>
                    <select
                      value={ol}
                      aria-label={`${n.name} overload pieces`}
                      onChange={(e) =>
                        patchNikke(n.id, {
                          olLines: Number(e.target.value) as OwnedEntry['olLines'],
                        })
                      }
                    >
                      {[0, 1, 2, 3].map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              ) : null}
            </li>
          )
        })}
      </ul>

      {filtered.length > visible ? (
        <button type="button" className="btn ghost" onClick={() => setVisible((v) => v + 60)}>
          Show more ({filtered.length - visible} left)
        </button>
      ) : null}

      <div className="toolbar secondary" style={{ marginTop: '1rem' }}>
        <button type="button" className="btn ghost" onClick={download}>
          Export JSON
        </button>
        <label className="btn ghost file-btn">
          Import JSON
          <input
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) void upload(f).then(() => flash('Imported JSON.'))
              e.target.value = ''
            }}
          />
        </label>
        <button
          type="button"
          className="btn ghost"
          onClick={() => {
            if (confirm('Reset roster?')) reset()
          }}
        >
          Reset
        </button>
      </div>
    </div>
  )
}
