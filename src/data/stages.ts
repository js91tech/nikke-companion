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

const soloRaidStages: Stage[] = [
  {
    id: 'sr-mother-whale',
    mode: 'solo',
    chapter: 'Solo Raid Museum',
    name: 'Mother Whale',
    threat: 5,
    element: 'Water',
    weakTo: 'Electric',
    drops: 'Harmony Cube batteries, Collection items, Museum ranking rewards',
    enemyNotes:
      'Museum Hall boss. Multi-squad DPS check (up to 5 teams). Core / port gimmicks and distributed damage matter.',
    tips: [
      'Spread B1 batteries across 5 squads — do not dump all on team 1.',
      'Electric codes and pierce / distributed DPS shine on classic Museum clears.',
      'Destroy cores/ports when the season gimmick requires it.',
    ],
    sampleTeams: [
      {
        label: 'Electric lead',
        members: ['Liter', 'Crown', 'Naga', 'Cinderella', 'Ein'],
        notes: 'Strong Electric B3 openers.',
      },
      {
        label: 'Flex DPS',
        members: ['Liter', 'Blanc', 'Noir', 'Alice', 'Scarlet'],
        notes: 'Generalist pierce / shotgun line for later squads.',
      },
    ],
  },
  {
    id: 'sr-black-smith',
    mode: 'solo',
    chapter: 'Solo Raid Museum',
    name: 'Black Smith',
    threat: 5,
    element: 'Fire',
    weakTo: 'Water',
    drops: 'Harmony Cube batteries, Collection items, Museum ranking rewards',
    enemyNotes: 'Museum Hall boss. High core value; armor-piercing pressure from behind.',
    tips: [
      'Stack Water codes across squads.',
      'Core damage OL lines pay off heavily.',
      'Watch rear shots — keep cover discipline.',
    ],
    sampleTeams: [
      {
        label: 'Water meta',
        members: ['Dorothy', 'Crown', 'Naga', 'Dorothy: Serendipity', 'Helm (Treasure)'],
        notes: 'Element-aligned Black Smith squad.',
      },
      {
        label: 'Alt Water',
        members: ['Liter', 'Crown', 'Naga', 'Ludmilla: Winter Owner', 'Bready'],
        notes: 'Alt Water B3s for squad 2–5.',
      },
    ],
  },
  {
    id: 'sr-ultra',
    mode: 'solo',
    chapter: 'Solo Raid Museum',
    name: 'Ultra',
    threat: 5,
    element: 'Electric',
    weakTo: 'Iron',
    drops: 'Harmony Cube batteries, Collection items, Museum ranking rewards',
    enemyNotes: 'Museum Hall boss. Same family as Anomaly Ultra — Iron codes preferred.',
    tips: [
      'Prioritize Iron B3s (Red Hood, Rapi: Red Hood, Snow White).',
      'Avoid over-investing Water DPS into this fight.',
    ],
    sampleTeams: [
      {
        label: 'Iron meta',
        members: ['Liter', 'Crown', 'Naga', 'Red Hood', 'Rapi: Red Hood'],
        notes: 'Iron carry openers.',
      },
      {
        label: 'Alt',
        members: ['Liter', 'Crown', 'Tia', 'Snow White', 'Milk: Blooming Bunny'],
        notes: 'Alt Iron / charge carries.',
      },
    ],
  },
  {
    id: 'sr-harvester',
    mode: 'solo',
    chapter: 'Solo Raid Museum',
    name: 'Harvester',
    threat: 5,
    element: 'Fire',
    weakTo: 'Water',
    drops: 'Harmony Cube batteries, Collection items, Museum Hall 3 rewards',
    enemyNotes: 'Museum Hall 3 (added Jul 2026). Water-weak Fire boss — same elemental lane as AI Harvester.',
    tips: [
      'Dorothy is often preferred B1 for elemental advantage.',
      'Spread Water DPS across multiple squads.',
    ],
    sampleTeams: [
      {
        label: 'Water meta',
        members: ['Dorothy', 'Crown', 'Naga', 'Dorothy: Serendipity', 'Ludmilla: Winter Owner'],
        notes: 'Hall 3 Water push.',
      },
      {
        label: 'Alt',
        members: ['Liter', 'Crown', 'Naga', 'Helm (Treasure)', 'Quency: Escape Queen'],
        notes: 'Alt Water / flexible B3s.',
      },
    ],
  },
  {
    id: 'sr-crystal-chamber',
    mode: 'solo',
    chapter: 'Solo Raid Museum',
    name: 'Crystal Chamber',
    threat: 5,
    element: 'Wind',
    weakTo: 'Electric',
    drops: 'Harmony Cube batteries, Collection items, Museum Hall 3 rewards',
    enemyNotes:
      'Museum Hall 3 (added Jul 2026). Crystal horn / spirit gimmicks — take cover on Crystal Spirit explosions.',
    tips: [
      'Electric codes preferred for Museum Hall 3 listing.',
      'Shotguns and pierce often perform well on crystal parts.',
      'Destroy horns when they move forward before Spirit detonations.',
    ],
    sampleTeams: [
      {
        label: 'Electric',
        members: ['Liter', 'Crown', 'Naga', 'Cinderella', 'Ein'],
        notes: 'Electric B3 openers.',
      },
      {
        label: 'Alt',
        members: ['Liter', 'Blanc', 'Noir', 'Anis: Sparkling Summer', 'Maiden: Ice Rose'],
        notes: 'SG / Electric alt squads.',
      },
    ],
  },
  {
    id: 'sr-indivilia',
    mode: 'solo',
    chapter: 'Solo Raid Museum',
    name: 'Indivilia',
    threat: 5,
    element: 'Wind',
    weakTo: 'Iron',
    drops: 'Harmony Cube batteries, Collection items, Museum Hall 3 rewards',
    enemyNotes: 'Museum Hall 3 (added Jul 2026). Iron-weak listing for Museum — plan Iron DPS depth.',
    tips: [
      'Build multiple Iron B3 squads.',
      'Does not always match Anomaly Indivilia Fire teams — check Museum listing.',
    ],
    sampleTeams: [
      {
        label: 'Iron meta',
        members: ['Liter', 'Crown', 'Naga', 'Red Hood', 'Snow White'],
        notes: 'Iron Museum Indivilia.',
      },
      {
        label: 'Alt',
        members: ['Liter', 'Crown', 'Tia', 'Rapi: Red Hood', 'Raven'],
        notes: 'Alt Iron carries.',
      },
    ],
  },
]

const unionRaidStages: Stage[] = [
  {
    id: 'ur-obelisk',
    mode: 'union',
    chapter: 'Union Raid',
    name: 'Obelisk',
    threat: 5,
    element: 'Iron',
    weakTo: 'Fire',
    drops: 'Union Chips',
    enemyNotes: 'Classic UR opener. Long-range stage. Healing parts on body — destroy to stop regen.',
    tips: [
      'Fire codes + RL splash help on body parts.',
      '3 attempts/day with unique Nikkes across attempts.',
    ],
    sampleTeams: [
      {
        label: 'Fire RL',
        members: ['Liter', 'Crown', 'Naga', 'Laplace', 'Alice'],
        notes: 'RL / Fire pressure on Obelisk.',
      },
      {
        label: 'Alt',
        members: ['Liter', 'Centi', 'Helm', 'Modernia', 'Privaty'],
        notes: 'Budget / generalist clear.',
      },
    ],
  },
  {
    id: 'ur-doctor',
    mode: 'union',
    chapter: 'Union Raid',
    name: 'Doctor',
    threat: 5,
    element: 'Iron',
    weakTo: 'Electric',
    drops: 'Union Chips',
    enemyNotes: 'Mid-range stage. Radiation debuffs (ATK down / heal cut). Prioritize healing parts.',
    tips: [
      'Electric codes preferred.',
      'Bring sustain — heal cut makes bare tanks risky.',
    ],
    sampleTeams: [
      {
        label: 'Electric',
        members: ['Liter', 'Crown', 'Naga', 'Cinderella', 'Ein'],
        notes: 'Electric Doctor push.',
      },
      {
        label: 'Sustain',
        members: ['Liter', 'Blanc', 'Noir', 'Alice', 'Rapunzel'],
        notes: 'Healer-friendly if radiation hurts.',
      },
    ],
  },
  {
    id: 'ur-halo',
    mode: 'union',
    chapter: 'Union Raid',
    name: 'Halo',
    threat: 5,
    element: 'Iron',
    weakTo: 'Water',
    drops: 'Union Chips',
    enemyNotes: 'Also called Angel Ring. Close-range stage. Water codes preferred.',
    tips: [
      'Water B3s and SG comps perform well at close range.',
      'Privaty S1 investment historically mattered for some Halo seasons.',
    ],
    sampleTeams: [
      {
        label: 'Water close',
        members: ['Dorothy', 'Crown', 'Naga', 'Dorothy: Serendipity', 'Helm (Treasure)'],
        notes: 'Water-aligned Halo.',
      },
      {
        label: 'SG',
        members: ['Liter', 'Blanc', 'Noir', 'Sugar', 'Drake'],
        notes: 'Close-range shotgun line.',
      },
    ],
  },
  {
    id: 'ur-modernia',
    mode: 'union',
    chapter: 'Union Raid',
    name: 'Modernia',
    threat: 5,
    element: 'Fire',
    weakTo: 'Wind',
    drops: 'Union Chips',
    enemyNotes: 'Tyrant Modernia. Mid-range. Missile intercept windows and heavy particle blades.',
    tips: [
      'Wind codes preferred.',
      'High synchro / OL recommended on later rounds.',
      'Save strong Wind DPS — do not burn them all on earlier bosses.',
    ],
    sampleTeams: [
      {
        label: 'Wind',
        members: ['Liter', 'Crown', 'Naga', 'Scarlet: Black Shadow', 'Alice'],
        notes: 'Wind / pierce Modernia line.',
      },
      {
        label: 'Alt',
        members: ['Liter', 'Crown', 'Tia', 'Liberalio', 'Nayuta'],
        notes: 'Alt Wind B3s.',
      },
    ],
  },
  {
    id: 'ur-stormbringer',
    mode: 'union',
    chapter: 'Union Raid',
    name: 'Stormbringer',
    threat: 5,
    element: 'Electric',
    weakTo: 'Iron',
    drops: 'Union Chips',
    enemyNotes: 'Long-range air boss. True damage / DEF checks — Iron codes preferred.',
    tips: [
      'Iron B3s and true-damage styles help on high DEF rounds.',
      'Destroy missile shoulders when possible.',
    ],
    sampleTeams: [
      {
        label: 'Iron',
        members: ['Liter', 'Crown', 'Naga', 'Red Hood', 'Cinderella'],
        notes: 'Iron / high burst Stormbringer.',
      },
      {
        label: 'Alt',
        members: ['Liter', 'Crown', 'Tia', 'Snow White', 'Rapi: Red Hood'],
        notes: 'Alt Iron carries.',
      },
    ],
  },
  {
    id: 'ur-sinister',
    mode: 'union',
    chapter: 'Union Raid',
    name: 'Sinister',
    threat: 5,
    weakTo: 'Wind',
    drops: 'Union Chips',
    enemyNotes: 'Rotating season boss (selectable in modern UR). Wind codes preferred.',
    tips: ['Bring Wind B3 depth.', 'Coordinate with Union — pick bosses your roster counters.'],
    sampleTeams: [
      {
        label: 'Wind',
        members: ['Liter', 'Crown', 'Naga', 'Scarlet: Black Shadow', 'Liberalio'],
        notes: 'Wind Sinister line.',
      },
    ],
  },
  {
    id: 'ur-red-shoes',
    mode: 'union',
    chapter: 'Union Raid',
    name: 'Red Shoes Replica',
    threat: 5,
    weakTo: 'Water',
    drops: 'Union Chips',
    enemyNotes: 'Rotating season boss. Water codes preferred.',
    tips: ['Water DPS across attempts.', 'Mock battle before spending daily attempts.'],
    sampleTeams: [
      {
        label: 'Water',
        members: ['Dorothy', 'Crown', 'Naga', 'Ludmilla: Winter Owner', 'Bready'],
        notes: 'Water Red Shoes line.',
      },
    ],
  },
  {
    id: 'ur-nihilister',
    mode: 'union',
    chapter: 'Union Raid',
    name: 'Nihilister',
    threat: 5,
    weakTo: 'Fire',
    drops: 'Union Chips',
    enemyNotes: 'Rotating season boss / story Tyrant. Fire codes preferred.',
    tips: ['Fire B3s (Alice, Rapi: Red Hood, Asuka).', 'Learn burn / phase patterns before Hard rounds.'],
    sampleTeams: [
      {
        label: 'Fire',
        members: ['Liter', 'Crown', 'Naga', 'Rapi: Red Hood', 'Alice'],
        notes: 'Fire Nihilister.',
      },
    ],
  },
  {
    id: 'ur-rebuild-torso',
    mode: 'union',
    chapter: 'Union Raid',
    name: 'Rebuild Big Torso',
    threat: 5,
    drops: 'Union Chips',
    enemyNotes: 'Rotating season boss. Large body / part break focus.',
    tips: ['Part-break and RL/SG splash often help.', 'Check season superior code before locking teams.'],
    sampleTeams: [
      {
        label: 'Generalist',
        members: ['Liter', 'Crown', 'Naga', 'Modernia', 'Alice'],
        notes: 'Flexible Torso clear.',
      },
    ],
  },
  {
    id: 'ur-ultra',
    mode: 'union',
    chapter: 'Union Raid',
    name: 'Ultra',
    threat: 5,
    weakTo: 'Electric',
    drops: 'Union Chips',
    enemyNotes: 'Appears in some UR seasons. Electric codes preferred when listed.',
    tips: ['Align with season superior code UI.', 'Reuse Anomaly Ultra practice for patterns.'],
    sampleTeams: [
      {
        label: 'Electric',
        members: ['Liter', 'Crown', 'Naga', 'Cinderella', 'Ein'],
        notes: 'Electric Ultra UR.',
      },
    ],
  },
  {
    id: 'ur-land-eater',
    mode: 'union',
    chapter: 'Union Raid',
    name: 'Land Eater',
    threat: 5,
    drops: 'Union Chips',
    enemyNotes: 'Often appears in Hard UR. Core-break then burst window.',
    tips: [
      'Check superior code separately from boss “code” label.',
      'Burst after core destroy for max damage.',
    ],
    sampleTeams: [
      {
        label: 'Burst window',
        members: ['Liter', 'Crown', 'Naga', 'Cinderella', 'Snow White'],
        notes: 'Core-break burst line.',
      },
    ],
  },
  {
    id: 'ur-alteisen',
    mode: 'union',
    chapter: 'Union Raid',
    name: 'Alteisen',
    threat: 5,
    weakTo: 'Fire',
    drops: 'Union Chips',
    enemyNotes: 'Also common in Co-Op. Fire-weak seasons — missile / tank patterns.',
    tips: ['Fire DPS preferred when season lists Fire-weak.', 'Practice missile timing in mock.'],
    sampleTeams: [
      {
        label: 'Fire',
        members: ['Liter', 'Crown', 'Naga', 'Alice', 'Rapi: Red Hood'],
        notes: 'Fire Alteisen.',
      },
    ],
  },
  {
    id: 'ur-chatterbox',
    mode: 'union',
    chapter: 'Union Raid',
    name: 'Chatterbox',
    threat: 5,
    drops: 'Union Chips',
    enemyNotes: 'Rotating / Co-Op crossover boss. Check season element each week.',
    tips: ['Verify superior code in-game each season.', 'Save attempts for bosses your Union needs.'],
    sampleTeams: [
      {
        label: 'Generalist',
        members: ['Liter', 'Crown', 'Naga', 'Scarlet: Black Shadow', 'Modernia'],
        notes: 'Flexible Chatterbox line.',
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
]

export const stages: Stage[] = [
  ...makeCampaignStages(),
  ...anomalyStages,
  ...soloRaidStages,
  ...unionRaidStages,
  ...otherStages,
]

export const stageById = Object.fromEntries(stages.map((s) => [s.id, s]))
