import type { UnionRaidState } from './unionRaidStorage'
import { normalizeMocks } from './unionRaidStorage'

type UrPayload = {
  v: 1
  mockFactor: number
  allowFinishOverkill: boolean
  members: { name: string; mocks: number[] }[]
  bosses: { templateId: string; name: string; stage: number; remainingHp: number; enabled: boolean }[]
}

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

export async function encodeUrPlan(state: UnionRaidState): Promise<string> {
  const payload: UrPayload = {
    v: 1,
    mockFactor: state.mockFactor,
    allowFinishOverkill: state.allowFinishOverkill,
    members: state.members.map((m) => ({ name: m.name, mocks: [...m.mocks] })),
    bosses: state.bosses.map((b) => ({
      templateId: b.templateId,
      name: b.name,
      stage: b.stage,
      remainingHp: b.remainingHp,
      enabled: b.enabled,
    })),
  }
  return `URC1.${toBase64Url(await gzipEncode(JSON.stringify(payload)))}`
}

export async function decodeUrPlan(code: string): Promise<Partial<UnionRaidState>> {
  const trimmed = code.trim().replace(/\s+/g, '')
  if (!trimmed.startsWith('URC1.')) throw new Error('Not a valid UR plan code (expected URC1.…)')
  const parsed = JSON.parse(await gzipDecode(fromBase64Url(trimmed.slice(5)))) as UrPayload
  if (!parsed || parsed.v !== 1) throw new Error('Invalid UR plan payload')
  return {
    mockFactor: typeof parsed.mockFactor === 'number' ? parsed.mockFactor : 0.8,
    allowFinishOverkill: parsed.allowFinishOverkill !== false,
    members: (parsed.members ?? []).map((m) => ({
      id: `m-${crypto.randomUUID()}`,
      name: m.name || 'Commander',
      mocks: normalizeMocks(m.mocks ?? []),
    })),
    bosses: (parsed.bosses ?? []).map((b) => ({
      id: `b-${crypto.randomUUID()}`,
      templateId: b.templateId || 'custom',
      name: b.name || 'Boss',
      stage: b.stage || 1,
      remainingHp: Math.max(0, Number(b.remainingHp) || 0),
      enabled: b.enabled !== false,
    })),
  }
}

export function planToDiscordText(
  state: UnionRaidState,
  plan: {
    targets: {
      targetName: string
      cleared: boolean
      endHp: number
      assignments: { memberName: string; slot: number; plannedDamage: number; overkill: number }[]
    }[]
    unused: { memberName: string; slot: number; effectiveDamage: number }[]
    totalUseful: number
    totalOverkill: number
  },
  formatDamage: (n: number) => string,
): string {
  const lines = [
    `**Union Raid plan** (factor ${state.mockFactor})`,
    `Useful ${formatDamage(plan.totalUseful)} · Overkill ${formatDamage(plan.totalOverkill)}`,
    '',
  ]
  for (const t of plan.targets) {
    lines.push(
      `**${t.targetName}** — ${t.cleared ? 'CLEARED' : `${formatDamage(t.endHp)} left`}`,
    )
    for (const a of t.assignments) {
      lines.push(
        `• ${a.memberName} A${a.slot}: ${formatDamage(a.plannedDamage)}${a.overkill > 0 ? ' (finish)' : ''}`,
      )
    }
    lines.push('')
  }
  if (plan.unused.length) {
    lines.push('**Unused**')
    for (const u of plan.unused) {
      lines.push(`• ${u.memberName} A${u.slot}: ${formatDamage(u.effectiveDamage)}`)
    }
  }
  return lines.join('\n')
}
