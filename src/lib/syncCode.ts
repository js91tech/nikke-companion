import type { InventoryState, OwnedEntry } from '../types'
import { emptyInventory, normalizeOwnedEntry } from './inventory'

type CompactV1 = { v: 1; n: string[] }
type CompactV2Entry = { id: string; lb?: number; sk?: number[]; ol?: number }
type CompactV2 = { v: 2; n: CompactV2Entry[] }

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

function packEntry(id: string, e: OwnedEntry): CompactV2Entry {
  const row: CompactV2Entry = { id }
  if (e.limitBreak) row.lb = e.limitBreak
  if (e.olLines) row.ol = e.olLines
  if (e.skills && (e.skills[0] > 1 || e.skills[1] > 1 || e.skills[2] > 1)) {
    row.sk = [...e.skills]
  }
  return row
}

export async function encodeSyncCode(state: InventoryState): Promise<string> {
  const payload: CompactV2 = {
    v: 2,
    n: Object.entries(state.nikkes)
      .filter(([, e]) => e.owned)
      .map(([id, e]) => packEntry(id, e))
      .sort((a, b) => a.id.localeCompare(b.id)),
  }
  const compressed = await gzipEncode(JSON.stringify(payload))
  return `NKC2.${toBase64Url(compressed)}`
}

export async function decodeSyncCode(code: string): Promise<InventoryState> {
  const trimmed = code.trim().replace(/\s+/g, '')
  if (trimmed.startsWith('NKC2.')) {
    const json = await gzipDecode(fromBase64Url(trimmed.slice(5)))
    const parsed = JSON.parse(json) as CompactV2
    if (!parsed || parsed.v !== 2 || !Array.isArray(parsed.n)) throw new Error('Invalid NKC2 payload')
    const inv = emptyInventory()
    for (const row of parsed.n) {
      if (!row?.id) continue
      inv.nikkes[row.id] = normalizeOwnedEntry({
        owned: true,
        limitBreak: row.lb as OwnedEntry['limitBreak'],
        olLines: row.ol as OwnedEntry['olLines'],
        skills: row.sk as OwnedEntry['skills'],
      })
    }
    inv.updatedAt = new Date().toISOString()
    return inv
  }
  if (trimmed.startsWith('NKC1.')) {
    const json = await gzipDecode(fromBase64Url(trimmed.slice(5)))
    const parsed = JSON.parse(json) as CompactV1
    if (!parsed || parsed.v !== 1 || !Array.isArray(parsed.n)) throw new Error('Invalid NKC1 payload')
    const inv = emptyInventory()
    for (const id of parsed.n) inv.nikkes[id] = { owned: true }
    inv.updatedAt = new Date().toISOString()
    return inv
  }
  throw new Error('Not a valid sync code (expected NKC2.… or NKC1.…)')
}

export function mergeInventories(base: InventoryState, incoming: InventoryState): InventoryState {
  const nikkes = { ...base.nikkes }
  for (const [id, e] of Object.entries(incoming.nikkes)) {
    if (!e.owned) continue
    const prev = nikkes[id]
    nikkes[id] = normalizeOwnedEntry({
      owned: true,
      limitBreak: Math.max(prev?.limitBreak ?? 0, e.limitBreak ?? 0) as OwnedEntry['limitBreak'],
      olLines: Math.max(prev?.olLines ?? 0, e.olLines ?? 0) as OwnedEntry['olLines'],
      skills: mergeSkills(prev?.skills, e.skills),
    })
  }
  return { nikkes, updatedAt: new Date().toISOString() }
}

function mergeSkills(
  a: OwnedEntry['skills'] | undefined,
  b: OwnedEntry['skills'] | undefined,
): OwnedEntry['skills'] | undefined {
  if (!a && !b) return undefined
  const out: [number, number, number] = [
    Math.max(a?.[0] ?? 1, b?.[0] ?? 1),
    Math.max(a?.[1] ?? 1, b?.[1] ?? 1),
    Math.max(a?.[2] ?? 1, b?.[2] ?? 1),
  ]
  if (out[0] <= 1 && out[1] <= 1 && out[2] <= 1) return undefined
  return out
}
