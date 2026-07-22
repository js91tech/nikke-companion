# Nikke Companion

Local-first PWA for **Goddess of Victory: Nikke** — roster checklist, burst-aware team builder, stage coverage, and sync codes.

Fan-made. Not affiliated with Shift Up / Level Infinite.

## Character data

| Source | Status |
| --- | --- |
| [fuwaguwa/NikkeAPI](https://github.com/fuwaguwa/NikkeAPI) (`nikke-api.vercel.app`) | **Broken** — Prydwen character-list JSON moved/blocked; endpoints return `No NIKKE Found!` / 500 |
| [@sancti0n/nikke-utils](https://www.npmjs.com/package/@sancti0n/nikke-utils) | **Used** — offline static catalog (~194 Nikkes) baked in at build time |

Refresh catalog:

```bash
npm run data:build
```

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
