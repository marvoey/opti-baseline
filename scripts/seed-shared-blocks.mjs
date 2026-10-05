/**
 * Seed the Phase 1 shared building blocks from
 * "Floor & Decor - CLP Build Guide & Stakeholder Rationale.md".
 *
 * Creates four blocks (FdPromoSplit, HeroBlock, 2x FdProduct) inside the CMS
 * folder whose key is ASSET_BASE_FOLDER_ID, then publishes them. It talks to the
 * same Content Management REST API that @optimizely/cms-cli and the /admin
 * inspector use (see lib/cms/contentTypes.ts, spec in cms-openapi.json).
 *
 * HOW IT WORKS (the API calls live in scripts/_cms-seed-lib.mjs — read ensureItem()):
 *   1. POST /oauth/token                              -> bearer token
 *   2. POST /v1/content                               -> create block in the folder
 *      body: { contentType, container, initialVersion: { displayName, locale, properties } }
 *      reply: { key, initialVersion: { version, ... } }   (a new DRAFT)
 *   3. POST /v1/content/{key}/versions/{version}:publish -> make the draft live
 *
 * NO DUPLICATES: every block has a stable `id` below. After each block is created
 * its CMS key is written to scripts/.seed-shared-blocks.state.json. On the next run
 * a tracked block is skipped. If a tracked block was deleted in the CMS (GET returns
 * 404) it is recreated; if it exists but was never published, only the publish is
 * retried.
 *
 * NOT COVERED: HeroBlock.BackgroundImage is a reference to an image asset (not a
 * URL), so this script only fills the text fields. Upload the image into the same
 * folder and link it in the CMS (or via the cms_upload_media MCP tool).
 *
 * Usage:
 *   npm run seed:blocks                  create + publish anything not yet created
 *   npm run seed:blocks -- --dry-run     print the payloads, change nothing
 *   npm run seed:blocks -- --no-publish  leave the blocks as drafts
 *   npm run seed:blocks -- --force       ignore the state file (WILL duplicate)
 *   npm run seed:blocks -- --reset       delete the state file (CMS content is kept)
 */


import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import {
  ROOT,
  LOCALE,
  cliArgs,
  requireCmsCredentials,
  getToken,
  loadState,
  toApiProperties,
  ensureItem,
} from './_cms-seed-lib.mjs';

const STATE_FILE = join(ROOT, 'scripts', '.seed-shared-blocks.state.json');
const DRY_RUN = cliArgs.has('--dry-run');
const PUBLISH = !cliArgs.has('--no-publish');
const FORCE = cliArgs.has('--force');

// ── The blocks to create ──────────────────────────────────────────────────────
// `id` is OUR stable handle for tracking (never sent to the CMS). `properties`
// are plain values keyed by the content type's property names; toApiProperties()
// wraps them the way the API expects ({ value }).
const BLOCKS = [
  {
    id: 'promo-weekend-flash-sale',
    contentType: 'FdPromoSplit',
    displayName: 'Tile Promo - Weekend Flash Sale',
    properties: {
      Eyebrow: 'Limited Time Event',
      Heading: '⚡ Weekend Flash Sale: Extra 10% Off All Porcelain Slabs',
      Body: 'Transform your kitchen or bath with commercial-grade porcelain. Everyday low warehouse prices with same-day store pickup.',
      // "Checklist": one item per line
      Bullets: [
        'Over 1,000,000+ sq. ft. ready in warehouse',
        'Rectified edges for slim 1/16-in grout lines',
        'Impervious to water and staining',
      ].join('\n'),
      CtaLabel: 'Shop Porcelain Deals',
      CtaUrl: '#products',
      ImageUrl:
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    },
  },
  {
    id: 'hero-tile-evergreen',
    contentType: 'HeroBlock',
    displayName: 'Tile Category - Standard Evergreen Hero',
    properties: {
      Eyebrow: 'Unmatched Selection. Unbelievable Prices.',
      Headline: 'High Quality Tile & Stone Flooring',
      Subheadline:
        'Shop first-quality porcelain, marble, and handcrafted zellige directly from the warehouse.',
      PrimaryCtaLabel: 'Explore All Tile',
      PrimaryCtaUrl: '#products',
      // BackgroundImage: an image asset reference — added manually, see header.
    },
  },
  {
    id: 'product-mapei-avalanche',
    contentType: 'FdProduct',
    displayName: 'Mapei Ultracolor Plus FA (Avalanche #38)',
    properties: {
      Name: 'Mapei Ultracolor Plus FA (Avalanche #38)',
      Sku: '3001899',
      Brand: 'Mapei',
      PriceSqft: 18.99,
      Size: '10 lb Bag',
      // Images: DAM image references — added in the CMS; the UI falls back to Unsplash.
    },
  },
  {
    id: 'product-schluter-schiene',
    contentType: 'FdProduct',
    displayName: 'Schluter Schiene Satin Nickel Profile',
    properties: {
      Name: 'Schluter Schiene Satin Nickel Profile',
      Sku: '4001449',
      Brand: 'Schluter Systems',
      PriceSqft: 14.49,
      Size: '3/8 in. x 8 ft.',
      // Images: DAM image references — added in the CMS; the UI falls back to Unsplash.
    },
  },
];

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  if (cliArgs.has('--reset')) {
    await rm(STATE_FILE, { force: true });
    console.log('State file deleted. (Content already in the CMS was NOT touched.)');
    return;
  }

  const container = process.env.ASSET_BASE_FOLDER_ID?.trim();
  if (!container) {
    throw new Error('ASSET_BASE_FOLDER_ID is not set in .env — it is the folder the blocks are created in.');
  }

  // What gets POSTed to /v1/content for one block.
  const initialVersion = (b) => ({
    displayName: b.displayName,
    locale: LOCALE,
    properties: toApiProperties(b.properties),
  });

  if (DRY_RUN) {
    console.log(`DRY RUN — nothing will be created. Target folder: ${container}, locale: ${LOCALE}\n`);
    for (const b of BLOCKS) {
      console.log('POST /v1/content');
      console.log(JSON.stringify({ contentType: b.contentType, container, initialVersion: initialVersion(b) }, null, 2));
      console.log('');
    }
    return;
  }

  requireCmsCredentials();
  const ctx = {
    token: await getToken(),
    state: FORCE ? {} : await loadState(STATE_FILE),
    stateFile: STATE_FILE,
    publish: PUBLISH,
  };

  const counts = { created: 0, skipped: 0, adopted: 0 };
  for (const b of BLOCKS) {
    const { outcome } = await ensureItem(ctx, {
      // keyed by block id + folder, so pointing ASSET_BASE_FOLDER_ID at a different
      // folder seeds the blocks there instead of skipping them
      stateKey: `${container}:${b.id}`,
      label: b.displayName,
      contentType: b.contentType,
      container,
      initialVersion: initialVersion(b),
      matches: (v) => v.displayName === b.displayName,
    });
    counts[outcome]++;
  }

  console.log(
    `\nDone: ${counts.created} created, ${counts.adopted} adopted, ${counts.skipped} skipped. State: ${STATE_FILE}`,
  );
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
