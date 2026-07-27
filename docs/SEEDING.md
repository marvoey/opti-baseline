# Seeding

Seed scripts populate a fresh CMS instance with demo experiences, hero images,
cards, and rich-text paragraphs. Run them after `npm run cms:push` to get a
working demo environment.

## Scripts

| Script | Command | What it seeds |
|---|---|---|
| `seed:experience` | `npm run seed:experience` | One `BlankExperience` from `seeds/example.json` |
| `seed:heroes:dr` | `npm run seed:heroes:dr` | Hero blocks (`seeds/library/heroes/items.json`) |
| `seed:cards:dr` | `npm run seed:cards:dr` | `CardBlock` items (`seeds/library/discover-recommend/cards/items.json`) |
| `seed:library:dr` | `npm run seed:library:dr` | `Paragraph` blocks for Discover & Recommend intent |
| `seed:library:eg` | `npm run seed:library:eg` | `Paragraph` blocks for Educate & Govern intent |
| `seed:library:st` | `npm run seed:library:st` | `Paragraph` blocks for Simulate & Transact intent |

All seed scripts authenticate against the CMS Management API using the same
`OPTIMIZELY_CMS_*` env vars as `npm run cms:push`.

## Seeds directory

```
seeds/
├── example.json                    Minimal BlankExperience (single Paragraph)
├── cibc-3014.json                  CIBC Mellon demo experience
├── mytree.json                     Alternative experience seed
├── layouts/
│   ├── feed.json                   FeedSection layout example
│   ├── grid.json                   Grid layout example
│   ├── hero.json                   HeroSection layout example
│   ├── sidebar.json                SidebarSection layout example
│   └── split.json                  SplitSection layout example
├── stacks/
│   ├── stack-1-strategic-briefing.json
│   ├── stack-2-regulatory-impact.json
│   └── stack-3-onboarding-workflow.json
└── library/
    ├── cibc-mellon-prose-content-packs.md   Authoring notes
    ├── heroes/
    │   └── items.json
    ├── discover-recommend/
    │   ├── cards/items.json
    │   └── paragraphs/html/         10 HTML content packs (pack-01 … pack-10)
    ├── educate-govern/
    │   ├── items.json
    │   └── html/                    14 HTML files (fund admin, custody, FX, ESG, …)
    └── simulate-transact/
        ├── items.json
        └── html/                    13 HTML files (onboarding, treasury, ETF, …)
```

## Stacks

The three pre-built demo stacks in `seeds/stacks/` are complete page
compositions demonstrating different buyer journeys:

| Stack | Audience focus |
|---|---|
| `stack-1-strategic-briefing.json` | C-suite / asset manager briefing page |
| `stack-2-regulatory-impact.json` | Compliance / regulatory impact page |
| `stack-3-onboarding-workflow.json` | Onboarding workflow / client operations page |

## Content library

`seeds/library/` is organised by **Intent** taxonomy value:

| Folder | Intent value | Content |
|---|---|---|
| `discover-recommend/` | `discover_recommend` | Introductory cards and paragraphs |
| `educate-govern/` | `educate_govern` | Service deep-dives, compliance, regulatory |
| `simulate-transact/` | `simulate_transact` | Operational workflows, transactional content |

### HTML packs

Each HTML file is a richText body for a `Paragraph` block. The corresponding
`items.json` carries the full block metadata (title, taxonomy fields, HTML
reference). `seed:library:*` scripts read `items.json` and POST each block
to the CMS via the Management API.

## Experience seed format

```jsonc
{
  "name": "My Experience",
  "type": "BlankExperience",
  "composition": {
    "sections": [
      {
        "type": "HeroSection",
        "columns": [
          {
            "elements": [
              { "type": "HeroBlockv2", "key": "<existing-cms-key>" }
            ]
          }
        ]
      }
    ]
  }
}
```

`scripts/seed-experience.mjs` and `lib/cms/seedExperience.ts` both consume this
format. Block references use the CMS content key of a previously seeded block —
run the library seeds before the experience seeds.
