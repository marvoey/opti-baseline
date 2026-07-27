# Seed Files & Seeding Process

This document covers the `seeds/` directory structure and how the seeding scripts work together to populate Optimizely CMS with CIBC Mellon demo content.

---

## Directory Structure

```
seeds/
├── cibc-3014.json                         # Manual experiment/scratchpad experience
├── example.json                           # Minimal experience skeleton for reference
├── mytree.json
├── layouts/                               # Named layout experiences (Visual Builder demos)
│   ├── hero.json
│   ├── sidebar.json
│   ├── grid.json
│   ├── split.json
│   └── feed.json
├── stacks/                                # Full-page demo experiences (hero + sidebar + grid + CTA)
│   ├── stack-1-strategic-briefing.json
│   ├── stack-2-regulatory-impact.json
│   └── stack-3-onboarding-workflow.json
└── library/                               # Standalone CMS content items (not experiences)
    ├── heroes/
    │   └── items.json                     # HeroBlockv2 items — 4 geo-specific hero variants
    ├── discover-recommend/
    │   ├── cards/
    │   │   └── items.json                 # 35+ CardBlock items tagged by persona/service/geo
    │   └── paragraphs/
    │       └── html/
    │           ├── items.json             # 10 Paragraph items (prose packs 01–10)
    │           └── pack-01.html … pack-10.html
    ├── educate-govern/
    │   ├── items.json
    │   └── html/                          # HTML prose files for educate_govern intent
    └── simulate-transact/
        ├── items.json
        └── html/                          # HTML prose files for simulate_transact intent
```

---

## Two Kinds of Seed Files

### 1. Experience seeds (`layouts/`, `stacks/`, `cibc-3014.json`)

JSON files that describe a full Visual Builder **experience** — sections, rows, columns, and inline component definitions. Run with `seed-experience.mjs`.

Top-level shape:

```json
{
  "displayName": "Stack 1: Strategic Expansion Briefing",
  "routeSegment": "stack-strategic-briefing",
  "locale": "en",
  "composition": {
    "nodeType": "experience",
    "layoutType": "outline",
    "nodes": [ ... ]
  }
}
```

The script does three API calls: `POST /v1/content` to create the experience, `PATCH` to apply the composition, then publish.

### 2. Library item seeds (`library/**/items.json`)

JSON arrays (or an **envelope** object) of standalone CMS content items — `Paragraph`, `CardBlock`, `HeroBlockv2`, `ComplianceBlock`. These are not experiences; they live in CMS folders and get referenced by experiences at runtime.

Plain array format:

```json
[
  { "contentType": "Paragraph", "key": "...", "displayName": "...", "locale": "en", "properties": { ... } }
]
```

Envelope format (lets you share a default `container` across all items):

```json
{
  "container": { "$env": "FOLDER_DISCOVER_RECOMMEND_PROSE_BLOCKS" },
  "items": [ ... ]
}
```

---

## Reference Types in `properties`

Library seed files support three special reference types resolved at runtime by the seeding script:

| Syntax | Resolves to |
|---|---|
| `{ "$file": "path/to/file.html" }` | File contents as a plain string |
| `{ "$richTextFile": "path/to/file.html" }` | `{ "value": { "html": "..." } }` — the CMS richText property shape |
| `{ "$env": "VAR_NAME" }` | The value of that environment variable |

`$richTextFile` is used for `Text` properties on `Paragraph` items (the main prose content). `$file` is used for shorter string properties. `$env` is used for container/folder keys that differ between environments.

---

## Scripts

### `seed-paragraphs.mjs` — library items (Paragraphs, Cards, ComplianceBlocks)

Handles any content type that sets properties directly (no composition step needed).

```bash
node scripts/seed-paragraphs.mjs <path-to-items.json> [--dry-run] [--limit <n>]
```

Behaviour:
- **409 conflict** → logs `SKIP` and moves on (idempotent).
- **`--dry-run`** → resolves all `$file`/`$env` refs and prints the resolved payload; no API calls.
- **`--limit <n>`** → processes only the first `n` items — useful to test one item before a full run.

### `seed-heroes.mjs` — HeroBlockv2 items

Same logic as `seed-paragraphs.mjs` but defaults to `seeds/library/heroes/items.json` if no path is given.

```bash
node scripts/seed-heroes.mjs [path-to-items.json] [--dry-run] [--limit <n>]
```

### `seed-experience.mjs` — Visual Builder experiences

Creates and publishes a single experience from a JSON seed file.

```bash
node scripts/seed-experience.mjs <path-to-seed.json>
```

- On **409** (experience already exists), the script skips creation and returns the existing `key`/`version` — it still patches composition and publishes.
- Requires `displayName` and `composition` fields in the seed file.

---

## npm Shorthand Commands

| Command | What it seeds |
|---|---|
| `npm run seed:heroes:dr` | Hero blocks (discover/recommend) |
| `npm run seed:cards:dr` | Card blocks (discover/recommend) |
| `npm run seed:library:dr` | Paragraph prose packs (discover/recommend) |
| `npm run seed:library:eg` | Paragraph items (educate/govern) |
| `npm run seed:library:st` | Paragraph items (simulate/transact) |
| `npm run seed:experience -- seeds/layouts/hero.json` | A single layout experience |
| `npm run seed:experience -- seeds/stacks/stack-1-strategic-briefing.json` | A full demo stack |

---

## Required Environment Variables

All seeding scripts authenticate via OAuth client credentials against the CMS API.

```
OPTIMIZELY_CMS_CLIENT_ID=<your-api-client-id>
OPTIMIZELY_CMS_CLIENT_SECRET=<your-api-client-secret>
OPTIMIZELY_CMS_API_URL=https://api.cms.optimizely.com   # optional, this is the default
ROOT_CONTAINER=<cms-content-key>                         # optional, defaults to 43f936c99b234ea397b261c538ad07c9
```

Create the API client in CMS admin → **Settings → API Clients**.

The library item seeds also require folder keys for their containers:

```
FOLDER_DISCOVER_RECOMMEND_HERO_BLOCKS=<cms-content-key>
FOLDER_DISCOVER_RECOMMEND_CARD_BLOCKS=<cms-content-key>
FOLDER_DISCOVER_RECOMMEND_PROSE_BLOCKS=<cms-content-key>
```

Add these to `.env` — the scripts load it automatically via `@next/env`.

---

## Content Taxonomy

Library items carry structured metadata properties used for runtime filtering (the Optimizely Graph `where` clause). All three library sections (`discover-recommend`, `educate-govern`, `simulate-transact`) use the same shape:

| Property | Values |
|---|---|
| `Intent` | `discover_recommend`, `educate_govern`, `simulate_transact` |
| `Persona` | `asset_manager`, `pension_fund`, `corporate_sponsor`, `foreign_institution`, `insurance_provider` |
| `Geo` | `canada`, `europe`, `united_states`, `global` |
| `Service` | `fund_administration`, `foreign_exchange`, `treasury_services`, `etf_services`, `alternative_investments`, `securities_lending`, `global_custody`, `recordkeeping`, `esg`, `regulatory`, `tax`, `onboarding`, `compliance` |

`Service` is a multi-value array; all others are single-value strings.

---

## Generating a CMS-Compatible Key

Items should have a stable `key` (UUID without hyphens) so re-seeding is idempotent:

```bash
node -e "const {randomUUID}=require('crypto'); console.log(randomUUID().replaceAll('-',''))"
```

Items without a `key` field will get one assigned by the CMS, but then re-seeding creates duplicates.

---

## Seeding Order

There are no hard dependencies between library items, but experiences that embed content references (e.g. `cms://content/...` image refs in stacks) assume those assets already exist in CMS. Recommended order:

1. Seed library items (`heroes`, `cards`, `library:dr/eg/st`)
2. Upload any media assets manually or via `cms:push`
3. Seed layouts and stacks (`seed:experience`)
