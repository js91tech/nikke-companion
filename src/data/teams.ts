import type { TeamTemplate } from '../types'

export const teamTemplates: TeamTemplate[] = [
  {
    id: 'campaign-safe',
    name: 'Campaign comfort',
    purpose: 'General story / outpost clears',
    slots: ['Liter', 'Blanc', 'Noir', 'Alice', 'Scarlet'],
    notes: 'Classic B1 + bunny duo + dual B3 DPS.',
  },
  {
    id: 'boss-burst',
    name: 'Boss burst',
    purpose: 'Raid / high HP bosses',
    slots: ['Liter', 'Crown', 'Naga', 'Modernia', 'Alice'],
    notes: 'Crown enables strong full-burst windows.',
  },
  {
    id: 'sg-team',
    name: 'SG shotgun',
    purpose: 'Close-range SG comps',
    slots: ['Liter', 'Blanc', 'Noir', 'Sugar', 'Drake'],
    notes: 'Keep range short; Blanc/Noir synchronicity.',
  },
  {
    id: 'pilgrim-core',
    name: 'Pilgrim core',
    purpose: 'Pilgrim-heavy endgame',
    slots: ['Dorothy', 'Crown', 'Scarlet: Black Shadow', 'Red Hood', 'Modernia'],
    notes: 'High investment pilgrim carry lineup.',
  },
  {
    id: 'budget-early',
    name: 'Budget early',
    purpose: 'New commander starter',
    slots: ['Neon', 'Anis', 'Rapi', 'Mary', 'N102'],
    notes: 'Story trio + free healers until SSR batteries arrive.',
  },
]
