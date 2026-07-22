# Nikke Companion

Local-first PWA for **Goddess of Victory: Nikke** — roster checklist, burst-aware team builder, stage coverage, and sync codes.

Fan-made. Not affiliated with Shift Up / Level Infinite.

## Character data

| Source | Status |
| --- | --- |
| [Prydwen characters](https://www.prydwen.gg/nikke/characters) | **Master list** — all known playable Nikkes (incl. Treasure), refreshed via `scripts/prydwen-names.json` |
| [@sancti0n/nikke-utils](https://www.npmjs.com/package/@sancti0n/nikke-utils) | **Metadata** — rarity / burst / class / weapon / element / specialties |
| [fuwaguwa/NikkeAPI](https://github.com/fuwaguwa/NikkeAPI) | Broken (Prydwen scrape) |

Refresh catalog:

```bash
npm run data:build
```

To add newly released Nikkes, append the English name to `scripts/prydwen-names.json` then rebuild.
## Features

- Roster checklist + paste import + `NKC1.…` sync codes
- Team builder (campaign / boss / tower / raid) using owned Nikkes
- Template coverage and stage clear estimates
- Progression tips by game stage
- Installable PWA (data stays on-device)

## Dev

```bash
npm install
npm run data:build
npm run dev
npm run build
```
