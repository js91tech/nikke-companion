import type { InventoryState } from '../types'
import { emptyInventory } from './inventory'

type CompactPayload = { v: 1; n: string[] }

function toBase64Url(bytes: Uint8Array): string {
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(str: string): Uint8Array {
  const pad = str.length % 4 === 0 ? '' : '='.repeat(4 - (str.length % 4))
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/') + pad
  const bin = atob(b64)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

async function gzipEncode(text: string): Promise<Uint8Array> {
  if (typeof CompressionStream === 'undefined') return new TextEncoder().encode(text)
  const stream = new Blob([text]).stream().pipeThrough(new CompressionStream('gzip'))
  return new Uint8Array(await new Response(stream).arrayBuffer())
}

async function gzipDecode(bytes: Uint8Array): Promise<string> {
  if (typeof DecompressionStream === 'undefined') return new TextDecoder().decode(bytes)
  try {
    const ab = new ArrayBuffer(bytes.byteLength)
    new Uint8Array(ab).set(bytes)
    const stream = new Blob([ab]).stream().pipeThrough(new DecompressionStream('gzip'))
    return await new Response(stream).text()
  } catch {
    return new TextDecoder().decode(bytes)
  }
}

export async function encodeSyncCode(state: InventoryState): Promise<string> {
  const payload: CompactPayload = {
    v: 1,
    n: Object.entries(state.nikkes)
      .filter(([, e]) => e.owned)
      .map(([id]) => id)
      .sort(),
  }
  const compressed = await gzipEncode(JSON.stringify(payload))
  return `NKC1.${toBase64Url(compressed)}`
}

export async function decodeSyncCode(code: string): Promise<InventoryState> {
  const trimmed = code.trim().replace(/\s+/g, '')
  if (!trimmed.startsWith('NKC1.')) throw new Error('Not a valid sync code (expected NKC1.…)')
  const json = await gzipDecode(fromBase64Url(trimmed.slice(5)))
  const parsed = JSON.parse(json) as CompactPayload
  if (!parsed || parsed.v !== 1 || !Array.isArray(parsed.n)) throw new Error('Invalid sync payload')
  const inv = emptyInventory()
  for (const id of parsed.n) inv.nikkes[id] = { owned: true }
  inv.updatedAt = new Date().toISOString()
  return inv
}

export function mergeInventories(base: InventoryState, incoming: InventoryState): InventoryState {
  const nikkes = { ...base.nikkes }
  for (const [id, e] of Object.entries(incoming.nikkes)) {
    if (e.owned) nikkes[id] = { owned: true }
  }
  return { nikkes, updatedAt: new Date().toISOString() }
}
