/**
 * guide:setup — one-time setup for /setup-guide accounts in this site worktree.
 *
 *   yarn guide:setup [--dry]
 *
 * Idempotent. It:
 *   1. creates the "Guide Users" folder (SysContentFolder) under this site's ASSET_BASE_FOLDER_ID,
 *   2. writes GUIDE_USERS_FOLDER_ID and a fresh GUIDE_SESSION_SECRET into .env when missing
 *      (never prints secrets; never replaces an existing secret, which would sign everyone out),
 *   3. removes the old GUIDE_FACILITATOR_EMAILS key (facilitators are now a tick box on each account:
 *      `yarn guide:facilitator <email>`),
 *   4. checks the GuideUser content type exists (push it with `yarn cms:push`) and that every
 *      property has indexingType "disabled", so no account data can appear in Optimizely Graph.
 */

import { randomBytes } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { ROOT, assertSiteContext, c, createCms, deterministicKey, fatal, finish, normKey, parseArgs, siteBanner } from './lib/cms-api.mjs';

const args = parseArgs();
const DRY = Boolean(args.dry);
const FOLDER_NAME = 'Guide Users';
const ENV_FILE = join(ROOT, '.env');

/** Set KEY=value in .env: replace the line if present, else append. Returns true when the file changed. */
function setEnv(lines, key, value) {
  const i = lines.findIndex((l) => l.startsWith(`${key}=`));
  const next = `${key}=${value}`;
  if (i === -1) {
    lines.push(next);
    return true;
  }
  if (lines[i] === next) return false;
  lines[i] = next;
  return true;
}

const getEnv = (lines, key) => lines.find((l) => l.startsWith(`${key}=`))?.slice(key.length + 1).trim() ?? '';

async function main() {
  const site = assertSiteContext({ write: !DRY });
  console.log(c.bold(`\nguide:setup${DRY ? c.yellow('  [DRY RUN — no changes]') : ''}`));
  console.log(siteBanner(site) + '\n');

  const assetsRoot = normKey(process.env.ASSET_BASE_FOLDER_ID ?? '');
  if (!/^[0-9a-f]{32}$/.test(assetsRoot)) throw new Error('ASSET_BASE_FOLDER_ID is not set in .env (site:new writes it).');
  const cms = createCms();
  let failures = 0;
  let warnings = 0;

  // 1. Folder
  const folderKey = deterministicKey('folder', assetsRoot, FOLDER_NAME);
  const folder = await cms.get(`/v1/content/${folderKey}`, { allow: [404] });
  if (folder.status === 404) {
    if (!DRY) {
      // SysContentFolder is non-localized: no locale.
      await cms.post('/v1/content', { key: folderKey, contentType: 'SysContentFolder', container: assetsRoot, initialVersion: { displayName: FOLDER_NAME } });
    }
    console.log(`  ${c.green('+')} folder "${FOLDER_NAME}" ${folderKey} ${DRY ? '(would be created)' : 'created'}`);
  } else {
    console.log(`  ${c.green('✓')} folder "${FOLDER_NAME}" ${folderKey} exists`);
  }

  // 2–3. .env
  const lines = readFileSync(ENV_FILE, 'utf8').replace(/\n+$/, '').split('\n');
  const before = lines.join('\n');
  if (!lines.some((l) => l.startsWith('# --- Setup guide accounts'))) lines.push('', '# --- Setup guide accounts (yarn guide:setup) ---');
  setEnv(lines, 'GUIDE_USERS_FOLDER_ID', folderKey);
  if (getEnv(lines, 'GUIDE_SESSION_SECRET').length < 32) {
    setEnv(lines, 'GUIDE_SESSION_SECRET', randomBytes(48).toString('base64url'));
    console.log(`  ${c.green('+')} GUIDE_SESSION_SECRET generated (not printed)`);
  } else {
    console.log(`  ${c.green('✓')} GUIDE_SESSION_SECRET already set (kept, so nobody is signed out)`);
  }
  if (!getEnv(lines, 'GUIDE_ALLOWED_EMAIL_DOMAIN')) setEnv(lines, 'GUIDE_ALLOWED_EMAIL_DOMAIN', 'optimizely.com');
  const oldKey = lines.findIndex((l) => l.startsWith('GUIDE_FACILITATOR_EMAILS='));
  if (oldKey !== -1) {
    lines.splice(oldKey, 1);
    console.log(`  ${c.green('✓')} removed GUIDE_FACILITATOR_EMAILS (no longer used: run \`yarn guide:facilitator <email>\`)`);
  }
  if (args.facilitator) {
    console.log(c.yellow('  ! --facilitator is no longer supported here: run `yarn guide:facilitator <email>` instead'));
    warnings++;
  }
  const after = lines.join('\n');
  if (after !== before) {
    if (!DRY) writeFileSync(ENV_FILE, after + '\n');
    console.log(`  ${c.green('✓')} .env ${DRY ? 'would be updated' : 'updated'} (GUIDE_* keys)`);
  } else {
    console.log(`  ${c.green('✓')} .env already up to date`);
  }

  // 4. Content type
  const type = await cms.get('/v1/contenttypes/GuideUser', { allow: [404] });
  if (type.status === 404) {
    console.log(c.yellow('  ! content type GuideUser is not in the CMS yet: run `yarn cms:push --dry`, then `yarn cms:push`'));
    warnings++;
  } else {
    const props = Object.entries(type.data?.properties ?? {});
    const exposed = props.filter(([, p]) => p.indexingType !== 'disabled').map(([k]) => k);
    if (exposed.length) {
      console.log(c.red(`  ✗ GuideUser properties not excluded from Graph: ${exposed.join(', ')} (set indexingType "disabled")`));
      failures++;
    } else {
      console.log(`  ${c.green('✓')} GuideUser: all ${props.length} properties have indexingType "disabled" (not in Graph)`);
    }
  }

  console.log('');
  finish('guide:setup', { failures, warnings });
  if (!DRY && after !== before) console.log(c.dim('  Restart `yarn dev` so it picks up the new .env values.\n'));
}

main().catch((err) => fatal('guide:setup', err));
