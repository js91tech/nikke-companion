import type { Stage } from '../types'

/** Current campaign ceiling (Normal + Hard). Ch. 47–48 planned Aug 2026. */
export const CAMPAIGN_MAX_CHAPTER = 46

const CHAPTER_TITLES: Record<number, string> = {
  1: 'Catastrophic',
  2: 'First Contact',
  3: 'Rescue',
  4: 'The Ark',
  5: 'Capture',
  6: 'Awakening',
  7: 'Heaven',
  8: 'The Path',
  9: 'Pursuit',
  10: 'The Surface',
  11: 'Reunion',
  12: 'Hometown',
  13: 'Comeback',
  14: 'Journey',
  15: 'Luck',
  16: 'Brand',
  17: 'The Goddess',
  18: 'Hero',
  19: 'Eden',
  20: 'Flame Dragon',
  21: 'The Queen',
  22: 'Invasion',
  23: 'Prison',
  24: 'Banishment',
  25: 'Tracking',
  26: 'Return',
  27: 'Exploration',
  28: 'The Unknown',
  29: 'Rescue',
  30: 'Treasure',
  31: 'Mabeast',
  32: 'Advance',
  33: 'Collapse',
  34: 'Truth',
  35: 'Conspiracy',
  36: 'Rebellion',
  37: 'Overture',
  38: 'Dissonance',
  39: 'Crescendo',
  40: 'Finale',
  41: 'Echo',
  42: 'Reprise',
  43: 'The Key',
  44: 'The Path Forward',
  45: 'Price of Sin',
  46: 'Reborn',
}

type Team = { label: string; members: string[]; notes: string }

function bandTeams(chapter: number, hard: boolean): Team[] {
  if (chapter <= 6) {
    return [
      {
        label: hard ? 'Hard clear' : 'Story clear',
        members: ['Neon', 'Anis', 'Rapi', 'Mary', 'N102'],
        notes: 'Counters core + free healers.',
      },
    ]
  }
  if (chapter <= 12) {
    return [
      {
        label: 'Comfort',
        members: ['Liter', 'Anis', 'Rapi', 'Neon', 'Privaty'],
        notes: 'Real B1 battery makes full burst reliable.',
      },
      {
        label: 'Budget',
        members: ['N102', 'Anis', 'Rapi', 'Pepper', 'Neon'],
        notes: 'Works if Liter is missing.',
      },
    ]
  }
  if (chapter <= 18) {
    return [
      {
        label: 'Gunboat',
        members: ['Liter', 'Blanc', 'Noir', 'Alice', 'Scarlet'],
        notes: 'Classic bunny duo + dual B3.',
      },
      {
        label: 'Safe',
        members: ['Liter', 'Centi', 'Helm', 'Modernia', 'Privaty'],
        notes: 'Sustain-heavy mid clear.',
      },
    ]
  }
  if (chapter <= 22) {
    return [
      {
        label: 'Boss push',
        members: ['Liter', 'Crown', 'Naga', 'Modernia', 'Alice'],
        notes: 'Chapter 22 unlocks Anomaly Interception.',
      },
      {
        label: 'Alt',
        members: ['Dorothy', 'Blanc', 'Noir', 'Scarlet', 'Alice'],
        notes: 'Strong if Crown is missing.',
      },
    ]
  }
  if (chapter <= 30) {
    return [
      {
        label: 'Meta clear',
        members: ['Liter', 'Crown', 'Naga', 'Scarlet: Black Shadow', 'Alice'],
        notes: 'Late-story pressure; OL gear helps.',
      },
      {
        label: 'Alt DPS',
        members: ['Dorothy', 'Tia', 'Naga', 'Modernia', 'Red Hood'],
        notes: 'Flex B3s for stubborn bosses.',
      },
    ]
  }
  if (chapter <= 38) {
    return [
      {
        label: 'Endgame',
        members: ['Liter', 'Crown', 'Naga', 'Rapi: Red Hood', 'Alice'],
        notes: hard
          ? 'Hard mode — bring invested OL and manual bossing.'
          : 'High synchro + OL recommended.',
      },
      {
        label: 'Pilgrim',
        members: ['Dorothy', 'Crown', 'Scarlet: Black Shadow', 'Red Hood', 'Modernia'],
        notes: 'Pilgrim-heavy burst windows.',
      },
    ]
  }
  return [
    {
      label: 'Current meta',
      members: ['Liter', 'Crown', 'Naga', 'Scarlet: Black Shadow', 'Alice'],
      notes: hard
        ? 'Hard Ch.40+ — expect strict CP and element checks.'
        : 'Latest chapters; invest OL on carries.',
    },
    {
      label: 'Alt battery',
      members: ['Liter', 'Crown', 'Helm (Treasure)', 'Rapi: Red Hood', 'Modernia'],
      notes: 'Strong generalist if LM / SBS unavailable.',
    },
  ]
}

function threatFor(chapter: number, hard: boolean): number {
  const base = Math.min(5, Math.max(1, Math.ceil(chapter / 10)))
  return hard ? Math.min(5, base + 1) : base
}

function makeCampaignStages(): Stage[] {
  const out: Stage[] = []
  for (const hard of [false, true]) {
    for (let ch = 1; ch <= CAMPAIGN_MAX_CHAPTER; ch++) {
      const title = CHAPTER_TITLES[ch] || `Chapter ${ch}`
      const mode = hard ? 'campaign-hard' : 'campaign'
      const pad = String(ch).padStart(2, '0')
      out.push({
        id: `${hard ? 'hard' : 'norm'}-${pad}`,
        mode,
        chapter: hard ? `Hard Ch. ${ch}` : `Normal Ch. ${ch}`,
        name: `Ch. ${ch} — ${title}`,
        threat: threatFor(ch, hard),
        enemyNotes: hard
          ? `Hard Mode chapter ${ch}. Higher enemy CP and tighter burst windows than Normal.`
          : `Normal Mode chapter ${ch}. Clear the map and chapter boss to unlock Hard.`,
        tips:
          ch === 22 && !hard
            ? [
                'Clearing 22 boss unlocks Anomaly Interception.',
                'Invest a real B1 (Liter / Dorothy / LM) before pushing further.',
              ]
            : hard
              ? [
                  'Hard Mode rewards extra resources — clear when ~recommended CP.',
                  'Manual the chapter boss if auto fails at the last node.',
                ]
              : [
                  'Follow recommended CP before forcing clears.',
                  'Keep one healer / taunt B2 for comfort.',
                ],
        sampleTeams: bandTeams(ch, hard),
      })
    }
  }
  return out
}

const anomalyStages: Stage[] = [
  {
    id: 'ai-kraken',
    mode: 'anomaly',
    chapter: 'Anomaly Interception',
    name: 'Kraken',
    threat: 5,
    element: 'Iron',
    weakTo: 'Wind',
    strongAgainst: 'Electric',
    drops: 'Custom Modules, Custom Module Shards, Custom Locks, T9 gear',
    enemyNotes: 'Endgame AI farm for modules/shards. Level capped at 400. Punishes Electric codes.',
    tips: [
      'Prefer Wind B3 DPS (SBS, Liberalio, Asuka: Wille).',
      'Avoid Electric Nikkes — boss deals massive extra damage to them.',
      'Clear stage 7+ for max module rate; shards are unique to Kraken.',
    ],
    sampleTeams: [
      {
        label: 'Meta Wind',
        members: ['Liter', 'Crown', 'Naga', 'Scarlet: Black Shadow', 'Alice'],
        notes: 'Crown enable + SBS carry. Swap Naga if she dies to Iron.',
      },
      {
        label: 'Alt',
        members: ['Liter', 'Crown', 'Helm (Treasure)', 'Scarlet: Black Shadow', 'Liberalio'],
        notes: 'Liter battery if LM missing.',
      },
    ],
  },
  {
    id: 'ai-mirror',
    mode: 'anomaly',
    chapter: 'Anomaly Interception',
    name: 'Mirror Container',
    threat: 5,
    element: 'Water',
    weakTo: 'Electric',
    strongAgainst: 'Fire',
    drops: 'Custom Modules, T9 Gloves (Manufacturer), Custom Locks, Manufacturer Arms',
    enemyNotes: 'Water code boss. Farm gloves. Punishes Fire codes.',
    tips: [
      'Bring Electric / Water-strong B3s (Cinderella, Ein, S.Anis, Maiden: Ice Rose).',
      'Avoid Fire DPS for this boss.',
    ],
    sampleTeams: [
      {
        label: 'Electric / Water',
        members: ['Liter', 'Crown', 'Naga', 'Cinderella', 'Ein'],
        notes: 'Strong AI Mirror clear.',
      },
      {
        label: 'Alt',
        members: ['Liter', 'Blanc', 'Noir', 'Anis: Sparkling Summer', 'Isabel'],
        notes: 'Bunny enable + Electric SG / RL carries.',
      },
    ],
  },
  {
    id: 'ai-indivilia',
    mode: 'anomaly',
    chapter: 'Anomaly Interception',
    name: 'Indivilia',
    threat: 5,
    element: 'Wind',
    weakTo: 'Fire',
    strongAgainst: 'Iron',
    drops: 'Custom Modules, T9 Armor (Manufacturer), Custom Locks, Manufacturer Arms',
    enemyNotes: 'Wind code (also called Indivilla). Farm torso armor. Punishes Iron codes.',
    tips: [
      'Fire B3s shine: Rapi: Red Hood, Alice, Asuka, Mihara: Bonding Chain.',
      'Watch Iron supports (Crown still used carefully / with cover).',
    ],
    sampleTeams: [
      {
        label: 'Fire meta',
        members: ['Liter', 'Crown', 'Naga', 'Rapi: Red Hood', 'Alice'],
        notes: 'Standard Indivilia push.',
      },
      {
        label: 'Alt',
        members: ['D: Killer Wife', 'Crown', 'Naga', 'Asuka Shikinami Langley', 'Modernia'],
        notes: 'Collab / alt Fire DPS.',
      },
    ],
  },
  {
    id: 'ai-ultra',
    mode: 'anomaly',
    chapter: 'Anomaly Interception',
    name: 'Ultra',
    threat: 5,
    element: 'Electric',
    weakTo: 'Iron',
    strongAgainst: 'Water',
    drops: 'Custom Modules, T9 Helmet (Manufacturer), Custom Locks, Manufacturer Arms',
    enemyNotes: 'Electric code. Farm helmets. Punishes Water codes.',
    tips: [
      'Iron B3s: Red Hood B3, Rapi: Red Hood, Snow White, Milk: Blooming Bunny.',
      'Avoid Water DPS for this fight.',
    ],
    sampleTeams: [
      {
        label: 'Iron meta',
        members: ['Liter', 'Crown', 'Naga', 'Red Hood', 'Rapi: Red Hood'],
        notes: 'Helmet farm lineup.',
      },
      {
        label: 'Alt',
        members: ['Liter', 'Crown', 'Tia', 'Snow White', 'Raven'],
        notes: 'Alt Iron / charge carries.',
      },
    ],
  },
  {
    id: 'ai-harvester',
    mode: 'anomaly',
    chapter: 'Anomaly Interception',
    name: 'Harvester',
    threat: 5,
    element: 'Fire',
    weakTo: 'Water',
    strongAgainst: 'Wind',
    drops: 'Custom Modules, T9 Boots (Manufacturer), Custom Locks, Manufacturer Arms',
    enemyNotes: 'Fire code. Farm boots. Punishes Wind codes. Dorothy is often BiS B1 here.',
    tips: [
      'Water B3s: Dorothy: Serendipity, Helm (Treasure), Ludmilla: Winter Owner, Bready.',
      'Prefer Dorothy over Liter for elemental advantage on B1.',
    ],
    sampleTeams: [
      {
        label: 'Water meta',
        members: ['Dorothy', 'Crown', 'Naga', 'Dorothy: Serendipity', 'Helm (Treasure)'],
        notes: 'Element-aligned Harvester clear.',
      },
      {
        label: 'Alt',
        members: ['Dorothy', 'Crown', 'Naga', 'Ludmilla: Winter Owner', 'Quency: Escape Queen'],
        notes: 'Alt Water / strong generalist B3s.',
      },
    ],
  },
]

const otherStages: Stage[] = [
  {
    id: 'tower-tribe',
    mode: 'tower',
    chapter: 'Tribe Tower',
    name: 'Manufacturer floors',
    threat: 3,
    enemyNotes: 'Restricted by manufacturer — roster depth matters.',
    tips: ['Invest one carry per brand.', 'B1 scarcity walls many towers.'],
    sampleTeams: [
      {
        label: 'Tetra sample',
        members: ['Volume', 'Blanc', 'Noir', 'Alice', 'Sugar'],
        notes: 'Tetra-friendly line.',
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
    tips: ['Optimize for boss element.', 'Save best B3s for your strongest squad.'],
    sampleTeams: [
      {
        label: 'Raid A',
        members: ['Liter', 'Crown', 'Naga', 'Scarlet: Black Shadow', 'Alice'],
        notes: 'High-end sample.',
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
    tips: ['Plan 3–5 teams by element.', 'Spread B1 batteries across squads.'],
    sampleTeams: [
      {
        label: 'Team 1',
        members: ['Dorothy', 'Crown', 'Tia', 'Red Hood', 'Modernia'],
        notes: 'Open with your strongest squad.',
      },
    ],
  },
]

export const stages: Stage[] = [...makeCampaignStages(), ...anomalyStages, ...otherStages]

export const stageById = Object.fromEntries(stages.map((s) => [s.id, s]))
