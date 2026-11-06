import { META_SOURCE } from './metaSource'
import type { TeamTemplate } from '../types'

/**
 * SP Arena archetypes from Prydwen PvP guides ({@link META_SOURCE.pvp}).
 * Slots are preferred fillers; the PvP builder substitutes owned Nikkes by role.
 */
export interface PvpArchetype extends TeamTemplate {
  side: 'attack' | 'defense' | 'both'
  speed: '2RL' | '2.5RL' | '3RL' | '3.5RL+' | 'flex'
  roleTags: string[]
}

export const pvpArchetypes: PvpArchetype[] = [
  {
    id: 'pvp-scar-jackal-2rl',
    name: '2RL Scarlet Jackal',
    purpose: 'SP Attack / Defense nuke',
    side: 'both',
    speed: '2RL',
    roleTags: ['nuke', 'jackal-link', 'fast'],
    slots: ['Scarlet', 'Anne: Miracle Fairy', 'Anis', 'Centi', 'Jackal'],
    notes: `Fastest Scarlet nuke (${META_SOURCE.asOf}). Outspeeds most 3RL defenses. Jackal P1 preferred.`,
  },
  {
    id: 'pvp-scar-blanc-jackal',
    name: 'Scarlet Blanc Jackal',
    purpose: 'SP Attack / Defense indom nuke',
    side: 'both',
    speed: '2RL',
    roleTags: ['nuke', 'indom', 'jackal-link'],
    slots: ['Scarlet', 'Blanc', 'Anis', 'Centi', 'Jackal'],
    notes: 'Indom on Scarlet via Blanc — less glass-cannon than XAnne 2RL.',
  },
  {
    id: 'pvp-scar-jackal-3rl',
    name: '3RL Scarlet Jackal',
    purpose: 'SP Defense staple',
    side: 'defense',
    speed: '3RL',
    roleTags: ['nuke', 'jackal-link'],
    slots: ['Scarlet', 'Blanc', 'Noise', 'Centi', 'Jackal'],
    notes: 'Classic SP defense T1 — frees meta units for other teams vs 2RL.',
  },
  {
    id: 'pvp-biscuit-sanis',
    name: 'Biscuit SAnis stall',
    purpose: 'SP Attack / Defense stall',
    side: 'both',
    speed: '3RL',
    roleTags: ['stall', 'biscuit', 'sanis'],
    slots: ['Noah', 'Rapunzel', 'Anis: Sparkling Summer', 'Biscuit', 'Anis'],
    notes: 'Primary counter target for defenses. Revive + SAnis pressure; CP gap makes this brutal.',
  },
  {
    id: 'pvp-biscuit-alice',
    name: 'Biscuit Alice stall',
    purpose: 'SP Attack / Defense stall',
    side: 'both',
    speed: '3.5RL+',
    roleTags: ['stall', 'biscuit', 'alice'],
    slots: ['Noah', 'Rapunzel', 'Alice', 'Biscuit', 'Blanc'],
    notes: 'Alice variant of Biscuit stall — weaker vs SAnis Blanc but strong knowledge check.',
  },
  {
    id: 'pvp-blanc-sanis',
    name: 'Blanc SAnis breaker',
    purpose: 'SP Attack stall-breaker',
    side: 'attack',
    speed: '3RL',
    roleTags: ['stall-break', 'sanis'],
    slots: ['Blanc', 'Biscuit', 'Anis: Sparkling Summer', 'Centi', 'Anis'],
    notes: 'Runs over Noise Rapu Biscuit stalls once full burst lands.',
  },
  {
    id: 'pvp-privaty-sanis',
    name: 'Privaty SAnis',
    purpose: 'SP Attack stun window',
    side: 'attack',
    speed: '3RL',
    roleTags: ['stun', 'sanis'],
    slots: ['Privaty', 'Blanc', 'Anis: Sparkling Summer', 'Centi', 'Anis'],
    notes: 'Privaty stun opens free damage for SAnis / clip SG lines.',
  },
  {
    id: 'pvp-2b-nuke',
    name: '2B / Maiden nuke',
    purpose: 'SP Attack Scarlet save',
    side: 'attack',
    speed: '3RL',
    roleTags: ['nuke', 'alt-scar'],
    slots: ['2B', 'Anne: Miracle Fairy', 'Anis', 'Centi', 'Jackal'],
    notes: 'Save Scarlet for another round — Maiden or Harran can fill the nuke seat.',
  },
  {
    id: 'pvp-power-fast',
    name: 'Fast Power snipe',
    purpose: 'SP Attack vs slow solo B3',
    side: 'attack',
    speed: '2.5RL',
    roleTags: ['snipe', 'fast'],
    slots: ['Power', 'Noise', 'Noah', 'Centi', 'Jackal'],
    notes: 'Nukes slow non-revive solo B3 comps before they rotate.',
  },
  {
    id: 'pvp-rosanna-anti-jackal',
    name: 'Rosanna anti-Jackal',
    purpose: 'SP Attack vs Jackal link',
    side: 'attack',
    speed: '3RL',
    roleTags: ['anti-jackal', 'stall'],
    slots: ['Noise', 'Rosanna', 'Anis: Sparkling Summer', 'Biscuit', 'Jackal'],
    notes: 'Rosanna S1 ≥4 dispels Jackal link — clutch vs classic Scar Jackal defense.',
  },
  {
    id: 'pvp-def-t3-flex',
    name: 'Defense T3 flex',
    purpose: 'SP Defense third team',
    side: 'defense',
    speed: '3RL',
    roleTags: ['flex', 'defense'],
    slots: ['Alice', 'Noah', 'Biscuit', 'Centi', 'Privaty'],
    notes: 'Prydwen starter T3 — Alice / Maiden / Power / Privaty as main B3 flex.',
  },
]

export const PVP_DEFENSE_STARTER_IDS = [
  'pvp-scar-jackal-3rl',
  'pvp-biscuit-sanis',
  'pvp-def-t3-flex',
] as const

export const PVP_ATTACK_STARTER_IDS = [
  'pvp-scar-jackal-2rl',
  'pvp-biscuit-sanis',
  'pvp-blanc-sanis',
] as const
