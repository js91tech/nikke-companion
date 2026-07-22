import type { Stage } from '../types'
import { META_SOURCE } from './metaSource'

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

/** Campaign BiS by chapter band — Prydwen Story meta for late chapters ({@link META_SOURCE}). */
function bandTeams(chapter: number, hard: boolean): Team[] {
  if (chapter <= 6) {
    return [
      {
        label: 'BiS',
        members: ['Neon', 'Anis', 'Rapi', 'Mary', 'N102'],
        notes: hard ? 'Hard early — counters + free healers.' : 'Story BiS: counters core + free healers (Prydwen starter).',
      },
      {
        label: 'Sub 1',
        members: ['Neon', 'Anis', 'Rapi', 'Pepper', 'Product-12'],
        notes: 'Swap healers if Mary / N102 are thin.',
      },
      {
        label: 'Sub 2',
        members: ['Delta', 'Anis', 'Rapi', 'Mary', 'Neon'],
        notes: 'Extra taunt / budget B1 flex.',
      },
    ]
  }
  if (chapter <= 12) {
    return [
      {
        label: 'BiS',
        members: ['Liter', 'Anis', 'Rapi', 'Neon', 'Privaty'],
        notes: 'Liter battery unlocks real full-burst clears.',
      },
      {
        label: 'Sub 1',
        members: ['N102', 'Anis', 'Rapi', 'Pepper', 'Neon'],
        notes: 'Budget if Liter is missing.',
      },
      {
        label: 'Sub 2',
        members: ['Liter', 'Centi', 'Helm', 'Rapi', 'Privaty'],
        notes: 'Sustain-heavy comfort clear.',
      },
    ]
  }
  if (chapter <= 18) {
    return [
      {
        label: 'BiS',
        members: ['Liter', 'Blanc', 'Noir', 'Alice', 'Scarlet'],
        notes: 'Classic bunny duo + dual B3 (still strong mid-game).',
      },
      {
        label: 'Sub 1',
        members: ['Liter', 'Centi', 'Helm', 'Modernia', 'Privaty'],
        notes: 'Sustain mid clear when bunny is incomplete.',
      },
      {
        label: 'Sub 2',
        members: ['Dorothy', 'Blanc', 'Noir', 'Alice', 'Maxwell'],
        notes: 'Dorothy battery + charge / pierce flex.',
      },
    ]
  }
  if (chapter <= 22) {
    return [
      {
        label: 'BiS',
        members: ['Liter', 'Crown', 'Naga', 'Modernia', 'Alice'],
        notes: 'Ch.22 boss push — unlocks Anomaly Interception.',
      },
      {
        label: 'Sub 1',
        members: ['Dorothy', 'Blanc', 'Noir', 'Scarlet', 'Alice'],
        notes: 'Strong if Crown is missing.',
      },
      {
        label: 'Sub 2',
        members: ['Liter', 'Crown', 'Tia', 'Scarlet', 'Modernia'],
        notes: 'Tia enable + dual B3 generalists.',
      },
      {
        label: 'Sub 3',
        members: ['Liter', 'Centi', 'Helm', 'Alice', 'Privaty'],
        notes: 'Budget / sustain when meta B2s are missing.',
      },
    ]
  }
  if (chapter <= 30) {
    return [
      {
        label: 'BiS',
        members: ['Anis: Star', 'Crown', 'Naga', 'Rapi: Red Hood', 'Scarlet: Black Shadow'],
        notes: 'Prydwen Story — Anis: Star B1 + Crown enable (late Ch.23–30).',
      },
      {
        label: 'Sub 1',
        members: ['Siren', 'Crown', 'Naga', 'Modernia', 'Alice'],
        notes: 'Siren if Anis: Star missing.',
      },
      {
        label: 'Sub 2',
        members: ['Liter', 'Blanc', 'Noir', 'Scarlet: Black Shadow', 'Alice'],
        notes: 'Bunny enable if Crown / Naga incomplete.',
      },
      {
        label: 'Sub 3',
        members: ['Anis: Star', 'Mast: Romantic Maid', 'Anchor: Innocent Maid', 'Rapi: Red Hood', 'Alice'],
        notes: 'Duo Maids enable (Prydwen).',
      },
    ]
  }
  if (chapter <= 38) {
    return [
      {
        label: 'BiS',
        members: ['Anis: Star', 'Crown', 'Mast: Romantic Maid', 'Rapi: Red Hood', 'Scarlet: Black Shadow'],
        notes: hard
          ? 'Hard — Prydwen Story BiS; invest OL on carries.'
          : 'Prydwen Story BiS (Anis: Star + Crown + Maid Mast).',
      },
      {
        label: 'Sub 1',
        members: ['Anis: Star', 'Crown', 'Mast: Romantic Maid', 'Vesti: Tactical Upgrade', 'Ada Wong'],
        notes: 'Vesgod / Ada Wong SSS B3 carries.',
      },
      {
        label: 'Sub 2',
        members: ['Siren', 'Crown', 'Naga', 'Scarlet: Black Shadow', 'Alice'],
        notes: 'Siren + Crown/Naga if no Anis: Star / Maid Mast.',
      },
      {
        label: 'Sub 3',
        members: ['Anis: Star', 'Mint', 'Prika', 'Rapi: Red Hood', 'Scarlet: Black Shadow'],
        notes: 'Duo Idols (Mint-ka) from Prydwen meta teams.',
      },
    ]
  }
  return [
    {
      label: 'BiS',
      members: ['Anis: Star', 'Crown', 'Mast: Romantic Maid', 'Rapi: Red Hood', 'Scarlet: Black Shadow'],
      notes: hard
        ? 'Hard Ch.40+ — Prydwen Story SSS/SS core.'
        : `Current campaign BiS (Prydwen ${META_SOURCE.asOf}).`,
    },
    {
      label: 'Sub 1',
      members: ['Anis: Star', 'Crown', 'Mast: Romantic Maid', 'Ada Wong', 'Vesti: Tactical Upgrade'],
      notes: 'Ada + Vesgod SSS B3 alternate.',
    },
    {
      label: 'Sub 2',
      members: ['Siren', 'Nayuta', 'Mast: Romantic Maid', 'Scarlet: Black Shadow', 'Snow White: Heavy Arms'],
      notes: 'Siren / Nayuta wind-leaning high deficit flex.',
    },
    {
      label: 'Sub 3',
      members: ['Anis: Star', 'Mast: Romantic Maid', 'Anchor: Innocent Maid', 'Privaty (Treasure)', 'Alice'],
      notes: 'Full Maids + PrivatyT when Crown is spent.',
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
                'Invest a real B1 (Anis: Star / Siren / Liter) before pushing further.',
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
      'Prefer Wind B3 DPS (SBS, Liberalio, Asuka: Wille, Nayuta).',
      'Avoid Electric Nikkes — boss deals massive extra damage to them.',
      'Anis: Star is Prydwen BiS B1 for Wind teams; Siren is #2.',
      'Clear stage 7+ for max module rate; shards are unique to Kraken.',
    ],
    sampleTeams: [
      {
        label: 'BiS',
        members: ['Anis: Star', 'Nayuta', 'Mast: Romantic Maid', 'Scarlet: Black Shadow', 'Liberalio'],
        notes: 'Prydwen Kraken Team 53 — Liberalio CS-buffs SBS; Nayuta can replace Crown.',
      },
      {
        label: 'Sub 1',
        members: ['Anis: Star', 'Crown', 'Mast: Romantic Maid', 'Scarlet: Black Shadow', 'Asuka Shikinami Langley: Wille'],
        notes: 'Crown survivability line (Prydwen Team 54).',
      },
      {
        label: 'Sub 2',
        members: ['Anis: Star', 'Mast: Romantic Maid', 'Anchor: Innocent Maid', 'Scarlet: Black Shadow', 'Liberalio'],
        notes: 'Maids vs Octopus — no Crown (Prydwen Team 55).',
      },
      {
        label: 'Sub 3',
        members: ['Liter', 'Blanc', 'Noir', 'Scarlet: Black Shadow', 'Alice'],
        notes: 'Beginner bunny Wind (Prydwen Team 58).',
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
      'Bring Electric B3s (Cinderella, Ein, Ada Wong, S.Anis, Maiden: Ice Rose).',
      'Avoid Fire DPS for this boss.',
    ],
    sampleTeams: [
      {
        label: 'BiS',
        members: ['Anis: Star', 'Crown', 'Anis: Sparkling Summer', 'Cinderella', 'Maiden: Ice Rose'],
        notes: 'Prydwen Electric funnel — Ice Rose bursts late as 3rd B3.',
      },
      {
        label: 'Sub 1',
        members: ['Anis: Star', 'Crown', 'Mast: Romantic Maid', 'Cinderella', 'Ein'],
        notes: 'Cindy + Ein with Maid Mast flex.',
      },
      {
        label: 'Sub 2',
        members: ['Rouge', 'Crown', 'Anis: Sparkling Summer', 'Cinderella', 'Ada Wong'],
        notes: 'Rouge B1 buffer for Cindy / Ice Rose (Prydwen Mirror).',
      },
      {
        label: 'Sub 3',
        members: ['Liter', 'Blanc', 'Noir', 'Anis: Sparkling Summer', 'Isabel'],
        notes: 'Bunny Electric beginner line.',
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
      'Fire B3s: Rapi: Red Hood, Mihara: Bonding Chain, Alice, Asuka.',
      'Time Crown S2 for Phase 2 team laser.',
    ],
    sampleTeams: [
      {
        label: 'BiS',
        members: ['Anis: Star', 'Crown', 'Mast: Romantic Maid', 'Rapi: Red Hood', 'Mihara: Bonding Chain'],
        notes: 'Prydwen Indivilia Team 83 — Burst Mast on Crown→Crown→Mast.',
      },
      {
        label: 'Sub 1',
        members: ['Anis: Star', 'Mast: Romantic Maid', 'Anchor: Innocent Maid', 'Rapi: Red Hood', 'Mihara: Bonding Chain'],
        notes: 'No Crown — Maids (Prydwen Team 61).',
      },
      {
        label: 'Sub 2',
        members: ['Anis: Star', 'Crown', 'Mast: Romantic Maid', 'Rapi: Red Hood', 'Helm (Treasure)'],
        notes: 'Wheelchair HelmT line (Prydwen Team 84).',
      },
      {
        label: 'Sub 3',
        members: ['Siren', 'Crown', 'Naga', 'Alice', 'Asuka Shikinami Langley'],
        notes: 'Siren + pierce Fire alts.',
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
      'Iron B3s: Red Hood B3, Rapi: Red Hood, Snow White, Milk: Blooming Bunny, Raven.',
      'Avoid Water DPS for this fight.',
    ],
    sampleTeams: [
      {
        label: 'BiS',
        members: ['Anis: Star', 'Crown', 'Mast: Romantic Maid', 'Red Hood B3', 'Rapi: Red Hood'],
        notes: 'Prydwen Ultra DPS table — RH B3 + RRH.',
      },
      {
        label: 'Sub 1',
        members: ['Anis: Star', 'Crown', 'Naga', 'Snow White', 'Raven'],
        notes: 'Alt Iron / charge carries.',
      },
      {
        label: 'Sub 2',
        members: ['Siren', 'Crown', 'Mast: Romantic Maid', 'Milk: Blooming Bunny', 'Snow White: Heavy Arms'],
        notes: 'Siren + Iron SG / SWHA flex.',
      },
      {
        label: 'Sub 3',
        members: ['Liter', 'Blanc', 'Noir', 'Red Hood B3', 'Modernia'],
        notes: 'Bunny Iron for mid stages.',
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
    enemyNotes: 'Fire code. Farm boots. Punishes Wind codes. Destroy Head ASAP for permanent core.',
    tips: [
      'Prydwen BiS Water DPS is Snow White: Heavy Arms; Dorothy: Serendipity needs Tove (Treasure).',
      'Kill mobs before Helm (Treasure) / Elegg: Boom and Shock bursts.',
      'Anis: Star is preferred B1; Siren is #2 but dies easily.',
    ],
    sampleTeams: [
      {
        label: 'BiS',
        members: ['Anis: Star', 'Crown', 'Mast: Romantic Maid', 'Snow White: Heavy Arms', 'Helm (Treasure)'],
        notes: 'Prydwen Harvester Team 80 — Spider Slayer.',
      },
      {
        label: 'Sub 1',
        members: ['Anis: Star', 'Crown', 'Mast: Romantic Maid', 'Bready', 'Liberalio'],
        notes: 'Bread vs Spider — Bready needs Maid Mast (Prydwen Team 81).',
      },
      {
        label: 'Sub 2',
        members: ['Anis: Star', 'Crown', 'Mast: Romantic Maid', 'Dorothy: Serendipity', 'Privaty (Treasure)'],
        notes: 'Doro:S + PrivatyT Water alt.',
      },
      {
        label: 'Sub 3',
        members: ['Liter', 'Mast: Romantic Maid', 'Anchor: Innocent Maid', 'Ludmilla: Winter Owner', 'Quency: Escape Queen'],
        notes: 'No Pilgrims beginner Water (Prydwen Team 82).',
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
        label: 'BiS',
        members: ['Anis: Star', 'Crown', 'Mast: Romantic Maid', 'Cinderella', 'Ein'],
        notes: 'Electric BiS opener — Prydwen Mirror DPS core.',
      },
      {
        label: 'Sub 1',
        members: ['Anis: Star', 'Blanc', 'Noir', 'Anis: Sparkling Summer', 'Maiden: Ice Rose'],
        notes: 'Electric SG / Ice Rose for later squads.',
      },
      {
        label: 'Sub 2',
        members: ['Siren', 'Crown', 'Tia', 'Ada Wong', 'Isabel'],
        notes: 'Siren + Ada Wong Electric depth.',
      },
      {
        label: 'Sub 3',
        members: ['Liter', 'Crown', 'Naga', 'Alice', 'Scarlet'],
        notes: 'Generalist pierce for squad depth.',
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
      'Stack Water codes across squads — Prydwen ranks SWHA as top Water DPS.',
      'Core damage OL lines pay off heavily.',
      'Watch rear shots — keep cover discipline.',
    ],
    sampleTeams: [
      {
        label: 'BiS',
        members: ['Anis: Star', 'Crown', 'Mast: Romantic Maid', 'Snow White: Heavy Arms', 'Helm (Treasure)'],
        notes: 'Water BiS aligned with Prydwen Harvester Spider Slayer.',
      },
      {
        label: 'Sub 1',
        members: ['Anis: Star', 'Crown', 'Naga', 'Dorothy: Serendipity', 'Privaty (Treasure)'],
        notes: 'Doro:S Water alt for squads 2–5.',
      },
      {
        label: 'Sub 2',
        members: ['Siren', 'Blanc', 'Noir', 'Bready', 'Liberalio'],
        notes: 'Bready needs CS/distributed buff (Liberalio / Maid).',
      },
      {
        label: 'Sub 3',
        members: ['Liter', 'Crown', 'Tia', 'Ludmilla: Winter Owner', 'Quency: Escape Queen'],
        notes: 'Alt Water B3 depth.',
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
      'Prioritize Iron B3s (Red Hood B3, Rapi: Red Hood, Snow White).',
      'Avoid over-investing Water DPS into this fight.',
    ],
    sampleTeams: [
      {
        label: 'BiS',
        members: ['Anis: Star', 'Crown', 'Mast: Romantic Maid', 'Red Hood B3', 'Rapi: Red Hood'],
        notes: 'Iron BiS — Prydwen Ultra table.',
      },
      {
        label: 'Sub 1',
        members: ['Anis: Star', 'Crown', 'Tia', 'Snow White', 'Milk: Blooming Bunny'],
        notes: 'Alt Iron / charge carries.',
      },
      {
        label: 'Sub 2',
        members: ['Siren', 'Crown', 'Naga', 'Snow White: Heavy Arms', 'Raven'],
        notes: 'Siren + SWHA Iron depth.',
      },
      {
        label: 'Sub 3',
        members: ['Liter', 'Blanc', 'Noir', 'Red Hood B3', 'Modernia'],
        notes: 'Bunny Iron for later squads.',
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
      'Prydwen: Anis: Star B1 + Snow White: Heavy Arms Water carry.',
      'Spread Water DPS across multiple squads.',
    ],
    sampleTeams: [
      {
        label: 'BiS',
        members: ['Anis: Star', 'Crown', 'Mast: Romantic Maid', 'Snow White: Heavy Arms', 'Helm (Treasure)'],
        notes: 'Hall 3 Water BiS (Prydwen Spider Slayer).',
      },
      {
        label: 'Sub 1',
        members: ['Anis: Star', 'Crown', 'Mast: Romantic Maid', 'Bready', 'Liberalio'],
        notes: 'Bready + Liberalio Water.',
      },
      {
        label: 'Sub 2',
        members: ['Siren', 'Blanc', 'Noir', 'Dorothy: Serendipity', 'Privaty (Treasure)'],
        notes: 'Doro:S bunny Water depth.',
      },
      {
        label: 'Sub 3',
        members: ['Liter', 'Crown', 'Tia', 'Ludmilla: Winter Owner', 'Quency: Escape Queen'],
        notes: 'Alt Water when meta B1s are spent.',
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
        label: 'BiS',
        members: ['Anis: Star', 'Crown', 'Anis: Sparkling Summer', 'Cinderella', 'Ein'],
        notes: 'Electric BiS openers (Prydwen Mirror core).',
      },
      {
        label: 'Sub 1',
        members: ['Anis: Star', 'Blanc', 'Noir', 'Maiden: Ice Rose', 'Ada Wong'],
        notes: 'SG / Electric alt squads.',
      },
      {
        label: 'Sub 2',
        members: ['Siren', 'Crown', 'Tia', 'Isabel', 'Maxwell'],
        notes: 'Electric RL / charge depth.',
      },
      {
        label: 'Sub 3',
        members: ['Liter', 'Crown', 'Naga', 'Cinderella', 'Alice'],
        notes: 'Liter + Electric / pierce flex.',
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
      'Build multiple Iron B3 squads (RH B3, RRH, Snow White).',
      'Does not always match Anomaly Indivilia Fire teams — check Museum listing.',
    ],
    sampleTeams: [
      {
        label: 'BiS',
        members: ['Anis: Star', 'Crown', 'Mast: Romantic Maid', 'Red Hood B3', 'Snow White'],
        notes: 'Iron Museum Indivilia BiS.',
      },
      {
        label: 'Sub 1',
        members: ['Anis: Star', 'Crown', 'Tia', 'Rapi: Red Hood', 'Raven'],
        notes: 'Alt Iron carries.',
      },
      {
        label: 'Sub 2',
        members: ['Siren', 'Crown', 'Naga', 'Milk: Blooming Bunny', 'Snow White: Heavy Arms'],
        notes: 'Siren + Iron SG / SWHA.',
      },
      {
        label: 'Sub 3',
        members: ['Liter', 'Blanc', 'Noir', 'Red Hood B3', 'Modernia'],
        notes: 'Bunny Iron for later Museum squads.',
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
        label: 'BiS',
        members: ['Anis: Star', 'Crown', 'Mast: Romantic Maid', 'Alice', 'Rapi: Red Hood'],
        notes: 'Fire / pierce BiS for Obelisk parts.',
      },
      {
        label: 'Sub 1',
        members: ['Anis: Star', 'Crown', 'Naga', 'Laplace', 'Modernia'],
        notes: 'RL splash + generalist B3.',
      },
      {
        label: 'Sub 2',
        members: ['Siren', 'Blanc', 'Noir', 'Alice', 'Asuka Shikinami Langley'],
        notes: 'Bunny Fire line for attempt 2–3.',
      },
      {
        label: 'Sub 3',
        members: ['Liter', 'Centi', 'Helm', 'Privaty', 'Maxwell'],
        notes: 'Budget / sustain if meta B2s are spent.',
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
        label: 'BiS',
        members: ['Anis: Star', 'Crown', 'Anis: Sparkling Summer', 'Cinderella', 'Ein'],
        notes: 'Electric Doctor BiS (Prydwen Mirror DPS).',
      },
      {
        label: 'Sub 1',
        members: ['Anis: Star', 'Blanc', 'Noir', 'Alice', 'Rapunzel'],
        notes: 'Sustain-friendly if radiation hurts.',
      },
      {
        label: 'Sub 2',
        members: ['Siren', 'Crown', 'Tia', 'Maiden: Ice Rose', 'Ada Wong'],
        notes: 'Electric SG / Ada alt attempts.',
      },
      {
        label: 'Sub 3',
        members: ['Liter', 'Crown', 'Naga', 'Isabel', 'Maxwell'],
        notes: 'Liter Electric depth.',
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
      'Prydwen ranks SWHA as top Water DPS.',
    ],
    sampleTeams: [
      {
        label: 'BiS',
        members: ['Anis: Star', 'Crown', 'Mast: Romantic Maid', 'Snow White: Heavy Arms', 'Helm (Treasure)'],
        notes: 'Water Halo BiS (Prydwen Spider Slayer core).',
      },
      {
        label: 'Sub 1',
        members: ['Anis: Star', 'Blanc', 'Noir', 'Sugar', 'Drake'],
        notes: 'Close-range shotgun line.',
      },
      {
        label: 'Sub 2',
        members: ['Siren', 'Crown', 'Tia', 'Dorothy: Serendipity', 'Privaty (Treasure)'],
        notes: 'Alt Water B3s for later attempts.',
      },
      {
        label: 'Sub 3',
        members: ['Liter', 'Mast: Romantic Maid', 'Anchor: Innocent Maid', 'Bready', 'Liberalio'],
        notes: 'Maids Water when Crown is on other bosses.',
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
      'Wind codes preferred — Prydwen Kraken Wind DPS translate well.',
      'High synchro / OL recommended on later rounds.',
      'Save strong Wind DPS — do not burn them all on earlier bosses.',
    ],
    sampleTeams: [
      {
        label: 'BiS',
        members: ['Anis: Star', 'Nayuta', 'Mast: Romantic Maid', 'Scarlet: Black Shadow', 'Liberalio'],
        notes: 'Wind Modernia BiS (Prydwen Kraken Team 53 core).',
      },
      {
        label: 'Sub 1',
        members: ['Anis: Star', 'Crown', 'Mast: Romantic Maid', 'Scarlet: Black Shadow', 'Alice'],
        notes: 'Crown survivability Wind line.',
      },
      {
        label: 'Sub 2',
        members: ['Siren', 'Crown', 'Naga', 'Asuka Shikinami Langley: Wille', 'Ark Ranger Black'],
        notes: 'Siren + Wind collab / ARB depth.',
      },
      {
        label: 'Sub 3',
        members: ['Liter', 'Blanc', 'Noir', 'Scarlet: Black Shadow', 'Alice'],
        notes: 'Bunny Wind when Crown teams are spent.',
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
      'Iron B3s (RH B3, RRH, Snow White) help on high DEF rounds.',
      'Destroy missile shoulders when possible.',
    ],
    sampleTeams: [
      {
        label: 'BiS',
        members: ['Anis: Star', 'Crown', 'Mast: Romantic Maid', 'Red Hood B3', 'Rapi: Red Hood'],
        notes: 'Iron BiS for Stormbringer (Prydwen Ultra).',
      },
      {
        label: 'Sub 1',
        members: ['Anis: Star', 'Crown', 'Tia', 'Snow White', 'Cinderella'],
        notes: 'Alt Iron / high-burst carries.',
      },
      {
        label: 'Sub 2',
        members: ['Siren', 'Crown', 'Naga', 'Snow White: Heavy Arms', 'Raven'],
        notes: 'Siren Iron depth.',
      },
      {
        label: 'Sub 3',
        members: ['Liter', 'Blanc', 'Noir', 'Red Hood B3', 'Modernia'],
        notes: 'Bunny Iron for attempt depth.',
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
        label: 'BiS',
        members: ['Anis: Star', 'Nayuta', 'Mast: Romantic Maid', 'Scarlet: Black Shadow', 'Liberalio'],
        notes: 'Wind Sinister BiS.',
      },
      {
        label: 'Sub 1',
        members: ['Anis: Star', 'Crown', 'Tia', 'Alice', 'Ark Ranger Black'],
        notes: 'Alt Wind / pierce.',
      },
      {
        label: 'Sub 2',
        members: ['Siren', 'Crown', 'Naga', 'Scarlet: Black Shadow', 'Asuka Shikinami Langley: Wille'],
        notes: 'Siren Wind depth.',
      },
      {
        label: 'Sub 3',
        members: ['Liter', 'Blanc', 'Noir', 'Scarlet: Black Shadow', 'Alice'],
        notes: 'Bunny Wind substitute.',
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
        label: 'BiS',
        members: ['Anis: Star', 'Crown', 'Mast: Romantic Maid', 'Snow White: Heavy Arms', 'Helm (Treasure)'],
        notes: 'Water Red Shoes BiS.',
      },
      {
        label: 'Sub 1',
        members: ['Anis: Star', 'Crown', 'Naga', 'Dorothy: Serendipity', 'Privaty (Treasure)'],
        notes: 'Alt Water B3s.',
      },
      {
        label: 'Sub 2',
        members: ['Siren', 'Blanc', 'Noir', 'Bready', 'Liberalio'],
        notes: 'Bready Water substitute.',
      },
      {
        label: 'Sub 3',
        members: ['Liter', 'Crown', 'Tia', 'Ludmilla: Winter Owner', 'Quency: Escape Queen'],
        notes: 'Liter Water depth.',
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
    tips: ['Fire B3s (RRH, Mihara: BC, Alice, Asuka).', 'Learn burn / phase patterns before Hard rounds.'],
    sampleTeams: [
      {
        label: 'BiS',
        members: ['Anis: Star', 'Crown', 'Mast: Romantic Maid', 'Rapi: Red Hood', 'Mihara: Bonding Chain'],
        notes: 'Fire Nihilister BiS (Prydwen Indivilia).',
      },
      {
        label: 'Sub 1',
        members: ['Anis: Star', 'Crown', 'Naga', 'Alice', 'Asuka Shikinami Langley'],
        notes: 'Pierce Fire alts.',
      },
      {
        label: 'Sub 2',
        members: ['Siren', 'Brid: Silent Track', 'Mast: Romantic Maid', 'Diesel: Winter Sweets', 'Alice'],
        notes: 'Winter Fire line if available.',
      },
      {
        label: 'Sub 3',
        members: ['Liter', 'Blanc', 'Noir', 'Rapi: Red Hood', 'Alice'],
        notes: 'Bunny Fire substitute.',
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
        label: 'BiS',
        members: ['Anis: Star', 'Crown', 'Mast: Romantic Maid', 'Modernia', 'Alice'],
        notes: 'Flexible Torso BiS — adjust to season code.',
      },
      {
        label: 'Sub 1',
        members: ['Anis: Star', 'Crown', 'Naga', 'Laplace', 'Scarlet: Black Shadow'],
        notes: 'RL / pierce part-break line.',
      },
      {
        label: 'Sub 2',
        members: ['Liter', 'Blanc', 'Noir', 'Sugar', 'Drake'],
        notes: 'SG splash for body parts.',
      },
      {
        label: 'Sub 3',
        members: ['Siren', 'Crown', 'Tia', 'Cinderella', 'Maxwell'],
        notes: 'Alt battery + high burst.',
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
        label: 'BiS',
        members: ['Anis: Star', 'Crown', 'Anis: Sparkling Summer', 'Cinderella', 'Ein'],
        notes: 'Electric Ultra UR BiS.',
      },
      {
        label: 'Sub 1',
        members: ['Anis: Star', 'Blanc', 'Noir', 'Maiden: Ice Rose', 'Ada Wong'],
        notes: 'Bunny Electric / Ada.',
      },
      {
        label: 'Sub 2',
        members: ['Siren', 'Crown', 'Tia', 'Isabel', 'Maxwell'],
        notes: 'Alt Electric / charge.',
      },
      {
        label: 'Sub 3',
        members: ['Liter', 'Crown', 'Naga', 'Cinderella', 'Alice'],
        notes: 'Liter Electric depth.',
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
        label: 'BiS',
        members: ['Anis: Star', 'Crown', 'Mast: Romantic Maid', 'Cinderella', 'Snow White'],
        notes: 'Core-break burst BiS.',
      },
      {
        label: 'Sub 1',
        members: ['Anis: Star', 'Crown', 'Tia', 'Red Hood B3', 'Alice'],
        notes: 'High single-target after core.',
      },
      {
        label: 'Sub 2',
        members: ['Siren', 'Blanc', 'Noir', 'Scarlet: Black Shadow', 'Modernia'],
        notes: 'Bunny generalist burst window.',
      },
      {
        label: 'Sub 3',
        members: ['Liter', 'Crown', 'Naga', 'Maxwell', 'Raven'],
        notes: 'Liter + charge / Iron flex.',
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
        label: 'BiS',
        members: ['Anis: Star', 'Crown', 'Mast: Romantic Maid', 'Alice', 'Rapi: Red Hood'],
        notes: 'Fire Alteisen BiS.',
      },
      {
        label: 'Sub 1',
        members: ['Anis: Star', 'Crown', 'Naga', 'Asuka Shikinami Langley', 'Mihara: Bonding Chain'],
        notes: 'Collab / Bonding Chain Fire.',
      },
      {
        label: 'Sub 2',
        members: ['Siren', 'Brid: Silent Track', 'Mast: Romantic Maid', 'Diesel: Winter Sweets', 'Laplace'],
        notes: 'Winter Fire + RL splash.',
      },
      {
        label: 'Sub 3',
        members: ['Liter', 'Blanc', 'Noir', 'Alice', 'Rapi: Red Hood'],
        notes: 'Bunny Fire substitute.',
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
        label: 'BiS',
        members: ['Anis: Star', 'Crown', 'Mast: Romantic Maid', 'Scarlet: Black Shadow', 'Modernia'],
        notes: 'Flexible Chatterbox BiS — retune to season code.',
      },
      {
        label: 'Sub 1',
        members: ['Anis: Star', 'Crown', 'Naga', 'Alice', 'Cinderella'],
        notes: 'Pierce / Electric flex.',
      },
      {
        label: 'Sub 2',
        members: ['Siren', 'Blanc', 'Noir', 'Red Hood B3', 'Ada Wong'],
        notes: 'Bunny generalist attempts.',
      },
      {
        label: 'Sub 3',
        members: ['Liter', 'Crown', 'Tia', 'Rapi: Red Hood', 'Scarlet: Black Shadow'],
        notes: 'Liter depth when Anis: Star is spent.',
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
    tips: ['Invest one carry per brand.', 'B1 scarcity walls many towers — Anis: Star / Siren help.'],
    sampleTeams: [
      {
        label: 'BiS Tetra',
        members: ['Anis: Star', 'Blanc', 'Noir', 'Alice', 'Sugar'],
        notes: 'Tetra-friendly line with modern B1.',
      },
      {
        label: 'Sub Elysion',
        members: ['Neon', 'Rapi', 'Privaty', 'Maxwell', 'Diesel'],
        notes: 'Elysion tower sample.',
      },
      {
        label: 'Sub Missilis',
        members: ['Liter', 'Novel', 'Pepper', 'Laplace', 'Drake'],
        notes: 'Missilis tower sample.',
      },
      {
        label: 'Sub Pilgrim',
        members: ['Siren', 'Crown', 'Scarlet: Black Shadow', 'Red Hood B3', 'Modernia'],
        notes: 'Pilgrim tower / late floors.',
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
