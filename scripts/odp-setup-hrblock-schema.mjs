#!/usr/bin/env node
/**
 * setup-hrblock-schema.mjs
 *
 * Creates the hrb_* custom fields on the ODP `customers` object. Run this once before
 * scripts/import-hrblock-profiles.mjs. Safe to re-run: fields that already exist are skipped.
 * Field names cannot be renamed once created.
 *
 * Config (ODP_PRIVATE_API_KEY, ODP_REGION, ODP_BASE_URL) comes from .env, see odp-client.mjs.
 *
 * Usage:
 *   node scripts/setup-hrblock-schema.mjs
 *   node scripts/setup-hrblock-schema.mjs --dry-run    # list the fields, send nothing
 */

import { parseArgs } from 'node:util';
import { BASE_URL, odp, requireConfig, sleep, fail } from './odp-client.mjs';

const { values: args } = parseArgs({
  options: {
    'dry-run': { type: 'boolean', default: false },
    help: { type: 'boolean', short: 'h', default: false },
  },
});

if (args.help) {
  console.log('See the header comment of this file for usage.');
  process.exit(0);
}

// Keep in sync with the attributes written by import-hrblock-profiles.mjs (deriveAttributes).
const CUSTOM_FIELDS = [
  { name: 'hrb_filing_preference', display_name: 'HRB Filing Preference', type: 'string', description: 'tax_pro | diy | undecided | researching, derived from hrblock.optimoey.com click events' },
  { name: 'hrb_appointment_cta_clicks', display_name: 'HRB Appointment CTA Clicks', type: 'number', description: 'Count of appointment_cta_click events' },
  { name: 'hrb_diy_start_clicks', display_name: 'HRB DIY Start Clicks', type: 'number', description: 'Count of diy_start_click events' },
  { name: 'hrb_pages_viewed', display_name: 'HRB Pages Viewed', type: 'number', description: 'Count of pageviews on hrblock.optimoey.com' },
  { name: 'hrb_last_site_event', display_name: 'HRB Last Site Event', type: 'string', description: 'Most recent click event, or pageview if none' },
  { name: 'hrb_import_batch', display_name: 'HRB Import Batch', type: 'string', description: 'Run id of the import script (use to find/clean up imported profiles)' },
];

if (args['dry-run']) {
  console.log(`DRY RUN: would create ${CUSTOM_FIELDS.length} fields on "customers":`);
  for (const f of CUSTOM_FIELDS) console.log(`  - ${f.name} (${f.type})`);
  process.exit(0);
}

requireConfig();
console.log(`Target: ${BASE_URL}`);
console.log(`Creating ${CUSTOM_FIELDS.length} custom fields on "customers" ...`);

try {
  for (const field of CUSTOM_FIELDS) {
    try {
      await odp('POST', '/v3/schema/objects/customers/fields', field, 0);
      console.log(`  + created ${field.name}`);
    } catch (e) {
      if (e.status === 400 || e.status === 409) {
        console.log(`  ~ ${field.name}: not created (probably exists already) -> ${e.message.split('->')[1]?.trim()}`);
      } else throw e;
    }
  }
  console.log('Waiting 5s for the schema to settle ...');
  await sleep(5000);
  console.log('\nDone. You can now run: node scripts/import-hrblock-profiles.mjs');
} catch (e) {
  fail(e.message);
}
