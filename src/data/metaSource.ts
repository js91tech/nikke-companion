/**
 * Meta reference snapshot for team builder / BiS lists.
 * Primary: Prydwen Institute (tier list + AI guides + meta teams), Jul 2026.
 * Secondary: r/NikkeMobile community consensus (manual; Reddit API blocked).
 * Not auto-scraped — refresh when Prydwen changelogs move the meta.
 */
export const META_SOURCE = {
  primary: 'https://www.prydwen.gg/nikke/tier-list/',
  anomaly: 'https://www.prydwen.gg/nikke/guides/game-modes-anomaly-interception/',
  storyTeams: 'https://www.prydwen.gg/nikke/guides/meta-teams',
  asOf: '2026-07',
  notes:
    'Anis: Star / Siren B1, Crown / Mast: Romantic Maid / Nayuta B2, RRH / SBS / Ada / Vesgod / SWHA B3 lead Story+AI.',
} as const

/** Prydwen Story tier boosts used by the inventory team builder. */
export const STORY_TIER_SCORE: Record<string, number> = {
  // SSS
  'Anis: Star': 22,
  Crown: 22,
  'Ada Wong': 22,
  'Rapi: Red Hood': 22,
  'Vesti: Tactical Upgrade': 22,
  // SS
  'Moran (Treasure)': 18,
  Siren: 18,
  'Mast: Romantic Maid': 18,
  Nayuta: 18,
  'Takina Inoue': 18,
  'Cinderella: Crystal Wave': 18,
  'Privaty (Treasure)': 18,
  'Scarlet: Black Shadow': 18,
  'Snow White: Heavy Arms': 18,
  // S
  'Anchor: Innocent Maid': 14,
  Mint: 14,
  Prika: 14,
  Alice: 14,
  Ein: 14,
  'Helm (Treasure)': 14,
  Liberalio: 14,
  'Milk: Blooming Bunny': 14,
  'Neon: Vision Eye': 14,
  'Red Hood B3': 14,
  // A (still very usable)
  'D: Killer Wife': 10,
  'Emma: Tactical Upgrade': 10,
  Liter: 10,
  'Miranda (Treasure)': 10,
  Rouge: 10,
  'Soline: Frost Ticket': 10,
  Tia: 10,
  'Ade: Agent Bunny': 10,
  Blanc: 10,
  'Brid: Silent Track': 10,
  'Eunhwa: Tactical Upgrade': 10,
  Grave: 10,
  'Mari Makinami Illustrious': 10,
  Naga: 10,
  Velvet: 10,
  'Ark Ranger Black': 10,
  'Asuka Shikinami Langley': 10,
  'Asuka Shikinami Langley: Wille': 10,
  Cinderella: 10,
  'Dorothy: Serendipity': 10,
  Maxwell: 10,
  Modernia: 10,
  'Rei Ayanami': 10,
  Scarlet: 10,
  'Anis: Sparkling Summer': 10,
  // Common carry aliases
  'Little Mermaid (Siren)': 18,
  'Red Hood': 12,
  Dorothy: 8,
  Noir: 8,
}
