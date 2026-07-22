import type { TeamTemplate } from '../types'
import { META_SOURCE } from './metaSource'

/** Global templates — Prydwen Story/AI meta ({@link META_SOURCE.asOf}). */
export const teamTemplates: TeamTemplate[] = [
  {
    id: 'story-anis-star',
    name: 'Story BiS (Anis: Star)',
    purpose: 'Campaign / high deficit',
    slots: ['Anis: Star', 'Crown', 'Mast: Romantic Maid', 'Rapi: Red Hood', 'Scarlet: Black Shadow'],
    notes: `Prydwen Story SSS core (${META_SOURCE.asOf}). Anis: Star = top B1 CDR.`,
  },
  {
    id: 'story-vesgod',
    name: 'Vesgod carry',
    purpose: 'Campaign mobbing / deficit',
    slots: ['Anis: Star', 'Crown', 'Mast: Romantic Maid', 'Vesti: Tactical Upgrade', 'Ada Wong'],
    notes: 'Vesti: TU one-nikke-army + Ada Wong (Prydwen SSS B3).',
  },
  {
    id: 'duo-maids',
    name: 'Duo Maids',
    purpose: 'Campaign / boss flex',
    slots: ['Anis: Star', 'Mast: Romantic Maid', 'Anchor: Innocent Maid', 'Rapi: Red Hood', 'Alice'],
    notes: 'El Ma-chor — Prydwen says maids outclass bunny for buffs/heal/reload.',
  },
  {
    id: 'duo-idols',
    name: 'Duo Idols (Mint-ka)',
    purpose: 'Campaign buffer duo',
    slots: ['Anis: Star', 'Mint', 'Prika', 'Rapi: Red Hood', 'Scarlet: Black Shadow'],
    notes: 'Mint + Prika idol duo from Prydwen meta teams.',
  },
  {
    id: 'siren-crown',
    name: 'Siren + Crown',
    purpose: 'Endgame if no Anis: Star',
    slots: ['Siren', 'Crown', 'Naga', 'Rapi: Red Hood', 'Scarlet: Black Shadow'],
    notes: 'Siren is #2 B1 after Anis: Star on Prydwen AI/Story guides.',
  },
  {
    id: 'bunny-legacy',
    name: 'Bunny duo (legacy)',
    purpose: 'Mid-game / budget B2',
    slots: ['Liter', 'Blanc', 'Noir', 'Alice', 'Scarlet'],
    notes: 'Still fine early; Prydwen ranks maids above bunny now.',
  },
  {
    id: 'budget-early',
    name: 'Budget early',
    purpose: 'Ch.1–6 story',
    slots: ['Neon', 'Anis', 'Rapi', 'Mary', 'N102'],
    notes: 'Counters + free healers (Prydwen starter tips).',
  },
  {
    id: 'ai-kraken',
    name: 'AI Kraken BiS',
    purpose: 'Anomaly — Wind vs Iron',
    slots: ['Anis: Star', 'Nayuta', 'Mast: Romantic Maid', 'Scarlet: Black Shadow', 'Liberalio'],
    notes: 'Prydwen Kraken Team 53 — Nayuta can replace Crown; Liberalio CS-buffs SBS.',
  },
  {
    id: 'ai-mirror',
    name: 'AI Mirror BiS',
    purpose: 'Anomaly — Electric vs Water',
    slots: ['Anis: Star', 'Crown', 'Anis: Sparkling Summer', 'Cinderella', 'Maiden: Ice Rose'],
    notes: 'Electric funnel — Cinderella + S.Anis + Ice Rose (Prydwen Mirror).',
  },
  {
    id: 'ai-indivilia',
    name: 'AI Indivilia BiS',
    purpose: 'Anomaly — Fire vs Wind',
    slots: ['Anis: Star', 'Crown', 'Mast: Romantic Maid', 'Rapi: Red Hood', 'Mihara: Bonding Chain'],
    notes: 'Prydwen Indivilia Team 83 — time Crown S2 on P2 laser.',
  },
  {
    id: 'ai-ultra',
    name: 'AI Ultra BiS',
    purpose: 'Anomaly — Iron vs Electric',
    slots: ['Anis: Star', 'Crown', 'Mast: Romantic Maid', 'Red Hood B3', 'Rapi: Red Hood'],
    notes: 'Prydwen Ultra DPS table — RH B3 + RRH lead Iron.',
  },
  {
    id: 'ai-harvester',
    name: 'AI Harvester BiS',
    purpose: 'Anomaly — Water vs Fire',
    slots: ['Anis: Star', 'Crown', 'Mast: Romantic Maid', 'Snow White: Heavy Arms', 'Helm (Treasure)'],
    notes: 'Prydwen Harvester Team 80 — SWHA is top Water DPS; kill mobs before HelmT burst.',
  },
  {
    id: 'solo-whale',
    name: 'Museum Mother Whale',
    purpose: 'Solo Raid — Electric',
    slots: ['Anis: Star', 'Crown', 'Mast: Romantic Maid', 'Cinderella', 'Ein'],
    notes: 'Electric opener aligned with Prydwen Mirror DPS.',
  },
  {
    id: 'union-modernia',
    name: 'UR Modernia BiS',
    purpose: 'Union Raid — Wind',
    slots: ['Anis: Star', 'Crown', 'Mast: Romantic Maid', 'Scarlet: Black Shadow', 'Liberalio'],
    notes: 'Wind carry line; save SBS/Liberalio for Modernia.',
  },
]
