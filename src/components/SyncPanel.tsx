import { useState } from 'react'
import { useFlash } from '../hooks/useFlash'
import { copyText } from '../lib/copyText'
import { decodeSyncCode, encodeSyncCode, mergeInventories } from '../lib/syncCode'
import type { InventoryState } from '../types'

interface Props {
  inventory: InventoryState
  onApply: (state: InventoryState) => void
}

export function SyncPanel({ inventory, onApply }: Props) {
  const [code, setCode] = useState('')
  const [out, setOut] = useState('')
  const [msg, flash] = useFlash()

  const updatedLabel = inventory.updatedAt
    ? new Date(inventory.updatedAt).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : null

  const importCode = async (mode: 'merge' | 'replace') => {
    try {
      const incoming = await decodeSyncCode(code)
      if (mode === 'replace') {
        if (!confirm('Replace local roster with this sync code? Current owns not in the code will be cleared.')) {
          return
        }
        onApply(incoming)
        flash('Replaced roster from sync code.')
      } else {
        onApply(mergeInventories(inventory, incoming))
        flash('Merged roster from sync code.')
      }
    } catch (e) {
      flash(e instanceof Error ? e.message : 'Invalid code')
    }
  }

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Sync code</h2>
        {updatedLabel ? <span className="pill">local · {updatedLabel}</span> : null}
      </div>
      <p className="section-lede">
        Copy a compact <code>NKC2.…</code> code (investment-aware) to another device. Legacy{' '}
        <code>NKC1.…</code> still imports. Data stays on-device — no account login.
      </p>
      <div className="toolbar secondary">
        <button
          type="button"
          className="btn primary"
          onClick={async () => {
            const c = await encodeSyncCode(inventory)
            setOut(c)
            const ok = await copyText(c)
            flash(ok ? 'Sync code copied.' : 'Code ready — clipboard blocked, copy from below.')
          }}
        >
          Export code
        </button>
        <button
          type="button"
          className="btn ghost"
          onClick={() => void importCode('merge')}
          disabled={!code.trim()}
        >
          Import / merge
        </button>
        <button
          type="button"
          className="btn ghost"
          onClick={() => void importCode('replace')}
          disabled={!code.trim()}
        >
          Import / replace
        </button>
      </div>
      <textarea
        className="paste-box"
        rows={2}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste NKC2.… (or legacy NKC1.…) code here"
        aria-label="Sync code"
      />
      {out ? <pre className="paste-report">{out}</pre> : null}
      {msg ? <p className="flash">{msg}</p> : null}
    </section>
  )
}
