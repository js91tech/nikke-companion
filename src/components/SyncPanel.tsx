import { useState } from 'react'
import { decodeSyncCode, encodeSyncCode, mergeInventories } from '../lib/syncCode'
import type { InventoryState } from '../types'

interface Props {
  inventory: InventoryState
  onApply: (state: InventoryState) => void
}

export function SyncPanel({ inventory, onApply }: Props) {
  const [code, setCode] = useState('')
  const [out, setOut] = useState('')
  const [msg, setMsg] = useState('')

  return (
    <section className="panel">
      <h2>Sync code</h2>
      <p className="section-lede">
        Copy a compact <code>NKC1.…</code> code to another device. Data stays on-device — no account login.
      </p>
      <div className="toolbar secondary">
        <button
          type="button"
          className="btn primary"
          onClick={async () => {
            const c = await encodeSyncCode(inventory)
            setOut(c)
            await navigator.clipboard.writeText(c).catch(() => undefined)
            setMsg('Sync code copied.')
          }}
        >
          Export code
        </button>
        <button
          type="button"
          className="btn ghost"
          onClick={async () => {
            try {
              const incoming = await decodeSyncCode(code)
              onApply(mergeInventories(inventory, incoming))
              setMsg('Merged roster from sync code.')
            } catch (e) {
              setMsg(e instanceof Error ? e.message : 'Invalid code')
            }
          }}
          disabled={!code.trim()}
        >
          Import / merge
        </button>
      </div>
      <textarea
        className="paste-box"
        rows={2}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste NKC1.… code here"
        aria-label="Sync code"
      />
      {out ? <pre className="paste-report">{out}</pre> : null}
      {msg ? <p className="flash">{msg}</p> : null}
    </section>
  )
}
