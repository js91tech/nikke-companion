import type { Stage } from '../types'

export const stages: Stage[] = [
  {
    id: 'camp-7',
    mode: 'campaign',
    chapter: 'Campaign',
    name: 'Chapter 7+',
    threat: 2,
    enemyNotes: 'Mixed rapture packs; learn full burst timing.',
    tips: ['Prioritize a real B1 battery (Liter/Dorothy).', 'Keep one flexible B2 taunt/heal.'],
    sampleTeams: [
      {
        label: 'Safe push',
        members: ['Liter', 'Blanc', 'Noir', 'Alice', 'Scarlet'],
        notes: 'Comfortable campaign clearer.',
      },
    ],
  },
  {
    id: 'camp-late',
    mode: 'campaign',
    chapter: 'Campaign',
    name: 'Late chapters',
    threat: 4,
    enemyNotes: 'High HP bosses and awkward cover breaks.',
    tips: ['Bring Crown or Tia/Naga for sustain windows.', 'Manual bossing for first clears.'],
    sampleTeams: [
      {
        label: 'Late clear',
        members: ['Liter', 'Crown', 'Naga', 'Modernia', 'Alice'],
        notes: 'Strong burst DPS with cover.',
      },
    ],
  },
  {
    id: 'tower-tribe',
    mode: 'tower',
    chapter: 'Tribe Tower',
    name: 'Manufacturer floors',
    threat: 3,
    enemyNotes: 'Restricted by manufacturer — build depth matters.',
    tips: ['Invest in one carry per manufacturer.', 'B1 scarcity is the usual wall.'],
    sampleTeams: [
      {
        label: 'Tetra sample',
        members: ['Volume', 'Blanc', 'Noir', 'Alice', 'Sugar'],
        notes: 'Tetra-friendly tower line.',
      },
    ],
  },
  {
    id: 'union-raid',
    mode: 'union',
    chapter: 'Union Raid',
    name: 'Union Raid boss',
    threat: 5,
    enemyNotes: 'Long fights; element and OL gear matter.',
    tips: ['Optimize for boss element.', 'Save best B3 carries for your strongest squad.'],
    sampleTeams: [
      {
        label: 'Raid A',
        members: ['Liter', 'Crown', 'Naga', 'Scarlet: Black Shadow', 'Alice'],
        notes: 'High-end raid sample.',
      },
      {
        label: 'Raid budget',
        members: ['Liter', 'Centi', 'Helm', 'Modernia', 'Privaty'],
        notes: 'Serviceable if missing Crown/Pilgrims.',
      },
    ],
  },
  {
    id: 'solo-raid',
    mode: 'solo',
    chapter: 'Solo Raid',
    name: 'Solo Raid',
    threat: 5,
    enemyNotes: 'Multi-team DPS check across elements.',
    tips: ['Plan 3–5 teams by element.', 'Do not put all batteries on team 1.'],
    sampleTeams: [
      {
        label: 'Team 1',
        members: ['Dorothy', 'Crown', 'Tia', 'Red Hood', 'Modernia'],
        notes: 'Open with your strongest squad.',
      },
    ],
  },
]

export const stageById = Object.fromEntries(stages.map((s) => [s.id, s]))
