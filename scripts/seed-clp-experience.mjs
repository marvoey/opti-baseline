/**
 * Seed Phase 2 of "Floor & Decor - CLP Build Guide & Stakeholder Rationale.md":
 * the Tile & Stone category landing page, as ONE BlankExperience made of six
 * section blocks, created as a sub item of the Floor & Decor Home page.
 *
 * Run `npm run seed:blocks` (Phase 1) first — this script links to those blocks.
 *
 * HOW IT WORKS (the API calls live in scripts/_cms-seed-lib.mjs — read ensureItem()):
 *   1. Make sure the two small experiment blocks exist in ASSET_BASE_FOLDER_ID
 *      (the guide says "link a standard / urgent CTA" but never creates them).
 *   2. Look up the CMS keys of everything the page links to:
 *        - Phase 1 blocks    -> from scripts/.seed-shared-blocks.state.json
 *        - existing products -> by display name, through Optimizely Graph
 *   3. Build the page composition: an `experience` root whose children are the six
 *      section blocks (all six are `sectionEnabled`, so they sit directly under the
 *      root, in the same shape Visual Builder saves them).
 *   4. POST /v1/content  { contentType: 'BlankExperience', container: <Home page>, ... }
 *      then publish it.
 *
 * NO DUPLICATES: the created keys go in scripts/.seed-clp-experience.state.json. A
 * re-run skips tracked items, recreates one that was deleted in the CMS, retries a
 * failed publish, and adopts an existing child with the same route instead of
 * creating a second one.
 *
 * Property value shapes (see cms-openapi.json -> PropertyData):
 *   string/number/bool   { value: 'x' }
 *   a `content` link     { value: { reference: 'cms://content/<key>' } }
 *   list of components   { value: [{ properties: {...} }] }
 *
 * Usage:
 *   npm run seed:clp                  create + publish anything not yet created
 *   npm run seed:clp -- --dry-run     print the composition, change nothing
 *   npm run seed:clp -- --no-publish  leave everything as drafts
 *   npm run seed:clp -- --force       ignore the state file (WILL duplicate)
 *   npm run seed:clp -- --reset       delete the state file (CMS content is kept)
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
  ref,
  ensureItem,
} from './_cms-seed-lib.mjs';

const STATE_FILE = join(ROOT, 'scripts', '.seed-clp-experience.state.json');
const PHASE1_STATE_FILE = join(ROOT, 'scripts', '.seed-shared-blocks.state.json');
const DRY_RUN = cliArgs.has('--dry-run');
const PUBLISH = !cliArgs.has('--no-publish');
const FORCE = cliArgs.has('--force');

/** Parent of the experience: the "Floor & Decor Home" page (key = id without dashes). */
const PARENT_ID = (process.env.CLP_PARENT_ID || '7a5a03b59a4046a9aa55eea5bc673218').replace(/-/g, '');
/** Folder for the shared blocks (same as Phase 1). */
const ASSET_FOLDER = process.env.ASSET_BASE_FOLDER_ID?.trim().replace(/-/g, '');

const EXPERIENCE = {
  id: 'experience-tile-clp',
  displayName: 'Tile & Stone CLP',
  // "tile" is already taken by the existing "Tile & Stone" Page under Home.
  routeSegment: 'tile-clp',
  metaTitle: 'Tile & Stone Flooring | Floor & Decor',
};

// ── Extra blocks (experiment control / challenger) ────────────────────────────
const EXTRA_BLOCKS = [
  {
    id: 'clp-control-cta',
    contentType: 'FdPromoSplit',
    displayName: 'Tile CLP - Standard CTA',
    properties: {
      Eyebrow: 'Everyday Low Warehouse Prices',
      Heading: 'Find the Right Tile for Your Project',
      Body: 'Browse thousands of porcelain, ceramic and natural stone styles in stock and ready to take home.',
      CtaLabel: 'Shop All Tile',
      CtaUrl: '#products',
      ImageUrl:
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    },
  },
  {
    id: 'clp-variation-a-cta',
    contentType: 'FdPromoSplit',
    displayName: 'Tile CLP - Urgent In-Store Pickup CTA',
    properties: {
      Eyebrow: 'Today Only: In-Store Pickup',
      Heading: '🔴 Order Online, Pick Up In Store Today',
      Body: 'Reserve your tile now and collect it from your local warehouse store within hours.',
      CtaLabel: 'Reserve For Pickup Now',
      CtaUrl: '#products',
      ImageUrl:
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    },
  },
];

// ── Looking up the keys the page links to ─────────────────────────────────────

/** Phase 1 block key by its seed id, from the Phase 1 state file. */
function phase1Key(phase1State, id) {
  const hit = Object.entries(phase1State).find(([k]) => k.endsWith(`:${id}`));
  return hit?.[1]?.key;
}

/** Display name -> CMS key through Optimizely Graph (published content only). */
async function graphKeyByName(contentType, name) {
  const gateway = process.env.OPTIMIZELY_GRAPH_GATEWAY?.trim() || 'https://cg.optimizely.com/content/v2';
  const auth = process.env.OPTIMIZELY_GRAPH_SINGLE_KEY?.trim();
  if (!auth) throw new Error('OPTIMIZELY_GRAPH_SINGLE_KEY is not set in .env (needed to look up products by name).');
  const res = await fetch(`${gateway}?auth=${encodeURIComponent(auth)}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      query: `query ($n: String!) { ${contentType}(where: { _metadata: { displayName: { eq: $n } } }) { items { _metadata { key } } } }`,
      variables: { n: name },
    }),
  });
  if (!res.ok) throw new Error(`Graph lookup of "${name}" failed (${res.status}).`);
  const json = await res.json();
  if (json.errors?.length) throw new Error(`Graph lookup of "${name}" failed: ${json.errors[0].message}`);
  const keys = [...new Set((json.data?.[contentType]?.items ?? []).map((i) => i._metadata.key))];
  if (keys.length === 0) throw new Error(`No published ${contentType} named "${name}" found in Graph.`);
  if (keys.length > 1) throw new Error(`${keys.length} ${contentType} items are named "${name}" (${keys.join(', ')}) — rename one so the lookup is unambiguous.`);
  return keys[0];
}

// ── The page ──────────────────────────────────────────────────────────────────

/** A `content` link property value. */
const link = (key) => ({ reference: ref(key) });

/**
 * The six sections, in guide order. `r` holds the resolved keys. Values come from
 * the guide's Section 1–6 steps.
 */
function buildComposition(r) {
  const section = (displayName, contentType, properties) => ({
    nodeType: 'component',
    displayName,
    component: { contentType, properties },
  });

  return {
    nodeType: 'experience',
    layoutType: 'outline',
    displayName: EXPERIENCE.displayName,
    nodes: [
      // Section 1 — Rachel & Dawn: time-boxed slot with an automatic fallback.
      // NB: the guide's campaign window ends 2026-10-04T23:59:59Z; after that the
      // slot shows the fallback hero. Edit the dates here to extend the demo.
      section('Scheduled Campaign Slot', 'FdScheduledSlot', {
        ...toApiProperties({
          SlotName: 'CLP_Tile_TopPromo_Slot',
          CampaignStart: '2026-10-02T00:00:00Z',
          CampaignEnd: '2026-10-04T23:59:59Z',
        }),
        ActiveContent: { value: link(r.promo) },
        FallbackContent: { value: link(r.evergreenHero) },
      }),

      // Section 2 — Feature grid: sub-category navigation.
      section('Sub-Category Visual Navigation', 'FdFeatureGrid', {
        ...toApiProperties({ Layout: 'tiles', Heading: 'Shop by Popular Look & Trend' }),
        Items: {
          // array items are typed by the property (FdFeatureItem), so no contentType here
          value: ['Marble Look', 'Wood Look', 'Subway Tile', 'Hexagon', 'Large Format Slabs'].map((Title) => ({
            properties: toApiProperties({ Title, Href: '#products' }),
          })),
        },
      }),

      // Section 3 — Allycia & Rachel: product listing with the facet sidebar.
      section('Catalog Listing & Facet Filtering', 'FdProductGrid', {
        ...toApiProperties({
          Eyebrow: 'Everyday Low Warehouse Prices',
          Heading: 'Porcelain & Ceramic Tile Flooring',
          ShowFilters: true,
        }),
        Products: { value: [r.venato, r.andover, r.emporio, r.artisan].map(link) },
      }),

      // Section 4 — Trey: collection selling kit.
      section('Collection Selling Project Bundle', 'FdProjectBundle', {
        ...toApiProperties({ Heading: 'Complete Your Installation Kit' }),
        PrimaryProduct: { value: link(r.venato) },
        RecommendedGrout: { value: link(r.mapei) },
        RecommendedTrim: { value: link(r.schluter) },
      }),

      // Section 5 — Allycia: Graph-driven content feed.
      section('Automated Content Syndication', 'FdContentDistributionFeed', toApiProperties({
        Heading: 'Installation Inspiration & Pro Video Guides',
        Subheading: 'Content automatically syndicated via Optimizely Graph tags',
        TargetTaxonomyTag: 'Tile',
        ItemLimit: 3,
      })),

      // Section 6 — Ben: experiment inside a mutual-exclusion group + holdout.
      section('Collision-Free Experimentation & Holdout', 'FdExperimentContainer', {
        ...toApiProperties({
          ExperimentKey: 'exp_clp_conversion_v1',
          MutualExclusionGroupId: '#MEG-402 (Checkout Protection)',
          HoldoutPercentage: 5.0,
        }),
        ControlVariation: { value: link(r.controlCta) },
        ChallengerVariationA: { value: link(r.variationACta) },
      }),
    ],
  };
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  if (cliArgs.has('--reset')) {
    await rm(STATE_FILE, { force: true });
    console.log('State file deleted. (Content already in the CMS was NOT touched.)');
    return;
  }
  if (!ASSET_FOLDER) throw new Error('ASSET_BASE_FOLDER_ID is not set in .env.');

  const phase1 = await loadState(PHASE1_STATE_FILE);
  const state = FORCE ? {} : await loadState(STATE_FILE);
  const missingP1 = ['promo-weekend-flash-sale', 'hero-tile-evergreen', 'product-mapei-avalanche', 'product-schluter-schiene'].filter(
    (id) => !phase1Key(phase1, id),
  );
  if (missingP1.length) {
    throw new Error(`Phase 1 blocks not found (${missingP1.join(', ')}). Run "npm run seed:blocks" first.`);
  }

  // Step 2: resolve what we link to.
  const resolved = {
    promo: phase1Key(phase1, 'promo-weekend-flash-sale'),
    evergreenHero: phase1Key(phase1, 'hero-tile-evergreen'),
    mapei: phase1Key(phase1, 'product-mapei-avalanche'),
    schluter: phase1Key(phase1, 'product-schluter-schiene'),
    venato: await graphKeyByName('FdProduct', 'Venato White Polished Porcelain Tile'),
    andover: await graphKeyByName('FdProduct', 'Andover White Matte Marble Look Porcelain'),
    emporio: await graphKeyByName('FdProduct', 'Emporio Black Marble Look Hexagon Porcelain'),
    artisan: await graphKeyByName('FdProduct', 'Artisan Greige Handmade Ceramic Subway Tile'),
  };

  const blockVersion = (b) => ({ displayName: b.displayName, locale: LOCALE, properties: toApiProperties(b.properties) });
  const blockSpec = (b) => ({
    stateKey: `${ASSET_FOLDER}:${b.id}`,
    label: b.displayName,
    contentType: b.contentType,
    container: ASSET_FOLDER,
    initialVersion: blockVersion(b),
    matches: (v) => v.displayName === b.displayName,
  });
  const experienceVersion = (r) => ({
    displayName: EXPERIENCE.displayName,
    locale: LOCALE,
    routeSegment: EXPERIENCE.routeSegment,
    properties: toApiProperties({ MetaTitle: EXPERIENCE.metaTitle }),
    composition: buildComposition(r),
  });

  if (DRY_RUN) {
    const r = {
      ...resolved,
      controlCta: state[`${ASSET_FOLDER}:clp-control-cta`]?.key ?? '<created on a real run>',
      variationACta: state[`${ASSET_FOLDER}:clp-variation-a-cta`]?.key ?? '<created on a real run>',
    };
    console.log(`DRY RUN — nothing will be created. Parent: ${PARENT_ID}, locale: ${LOCALE}\n`);
    console.log('Extra blocks to ensure in', ASSET_FOLDER);
    for (const b of EXTRA_BLOCKS) console.log(' -', b.displayName);
    console.log('\nResolved references:', JSON.stringify(resolved, null, 2));
    console.log('\nPOST /v1/content');
    console.log(
      JSON.stringify({ contentType: 'BlankExperience', container: PARENT_ID, initialVersion: experienceVersion(r) }, null, 2),
    );
    return;
  }

  requireCmsCredentials();
  const ctx = { token: await getToken(), state, stateFile: STATE_FILE, publish: PUBLISH };

  // Step 1: the two experiment blocks (published, so the page can link to them).
  const extra = {};
  for (const b of EXTRA_BLOCKS) extra[b.id] = await ensureItem({ ...ctx, publish: true }, blockSpec(b));

  // Steps 3–4: the experience itself.
  const r = { ...resolved, controlCta: extra['clp-control-cta'].key, variationACta: extra['clp-variation-a-cta'].key };
  const exp = await ensureItem(ctx, {
    stateKey: `${PARENT_ID}:${EXPERIENCE.id}`,
    label: `${EXPERIENCE.displayName} (experience)`,
    contentType: 'BlankExperience',
    container: PARENT_ID,
    initialVersion: experienceVersion(r),
    // an existing child with this route is "the same page" — adopt, don't duplicate
    matches: (v) => v.routeSegment === EXPERIENCE.routeSegment,
  });

  console.log(`\nDone. Experience key ${exp.key} (${exp.outcome}). State: ${STATE_FILE}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
