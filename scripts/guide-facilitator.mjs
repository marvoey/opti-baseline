/**
 * guide:facilitator — give or remove access to Team progress (/setup-guide/facilitator).
 *
 *   yarn guide:facilitator you@optimizely.com            # tick Facilitator on that account
 *   yarn guide:facilitator you@optimizely.com --remove   # untick it
 *   yarn guide:facilitator --list                        # every account and whether it is a facilitator
 *   add --dry to see what would change
 *
 * The person must have signed up first. Same effect as ticking or clearing the Facilitator box on
 * their item in the CMS (Assets → Setup Guide → Guide Users). Takes effect on their next request.
 * Records stay drafts: the open draft is edited in place, so nothing is published.
 */

import { createHash } from 'node:crypto';
import { assertSiteContext, c, createCms, fatal, normKey, parseArgs, pool, siteBanner, sleep } from './lib/cms-api.mjs';

const args = parseArgs();
const DRY = Boolean(args.dry);
const LOCALE = process.env.OPTIMIZELY_DEFAULT_LOCALE || 'en';
const unwrap = (v) => (v && typeof v === 'object' && 'value' in v ? v.value : v);
// Must match lib/guide/users.ts userKeyFor().
const userKeyFor = (email) => createHash('sha256').update(`GuideUser::${email.trim().toLowerCase()}`).digest('hex').slice(0, 32);

async function latestVersion(cms, key) {
  const { status, data } = await cms.get(`/v1/content/${key}/versions`, { query: { locales: LOCALE, pageSize: 100 }, allow: [404] });
  if (status === 404) return null;
  return (data?.items ?? []).filter((v) => !v.locale || v.locale === LOCALE).sort((a, b) => Number(b.version) - Number(a.version))[0] ?? null;
}

async function list(cms) {
  const folder = normKey(process.env.GUIDE_USERS_FOLDER_ID ?? '');
  if (!folder) throw new Error('GUIDE_USERS_FOLDER_ID is not set (run yarn guide:setup).');
  const kids = (await cms.listAll(`/v1/content/${folder}/items`)).filter((k) => !k.contentType || k.contentType === 'GuideUser');
  const rows = (await pool(kids, 4, async (k) => latestVersion(cms, normKey(k.key)))).filter(Boolean).map((v) => ({
    email: unwrap(v.properties?.Email) ?? '?',
    name: unwrap(v.properties?.FullName) ?? '',
    facilitator: unwrap(v.properties?.Facilitator) === true,
    disabled: unwrap(v.properties?.Disabled) === true,
  }));
  rows.sort((a, b) => Number(b.facilitator) - Number(a.facilitator) || a.email.localeCompare(b.email));
  console.log(c.bold(`\n${rows.length} account(s), ${rows.filter((r) => r.facilitator).length} facilitator(s)\n`));
  for (const r of rows) {
    const tag = r.facilitator ? c.green('facilitator') : c.dim('participant');
    console.log(`  ${tag.padEnd(22)} ${r.email}${r.name ? c.dim(`  (${r.name})`) : ''}${r.disabled ? c.yellow('  [disabled]') : ''}`);
  }
  console.log('');
}

async function main() {
  const site = assertSiteContext({ write: !DRY && !args.list });
  console.log(siteBanner(site));
  const cms = createCms();

  const type = await cms.get('/v1/contenttypes/GuideUser', { allow: [404] });
  if (type.status === 404 || !type.data?.properties?.Facilitator) {
    throw new Error('The GuideUser content type has no Facilitator property in the CMS yet. Update the content type first.');
  }
  if (args.list) return list(cms);

  const email = String(args._[0] ?? '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+$/.test(email)) throw new Error('Usage: yarn guide:facilitator <email> [--remove] [--dry]   |   yarn guide:facilitator --list');
  const want = !args.remove;
  const key = userKeyFor(email);
  const v = await latestVersion(cms, key);
  if (!v) throw new Error(`No account for ${email}. They need to sign up at /setup-guide/signup first.`);

  const has = unwrap(v.properties?.Facilitator) === true;
  if (has === want) {
    console.log(`  ${c.green('✓')} ${email} ${want ? 'is already a facilitator' : 'is already not a facilitator'} (nothing to change)`);
    return;
  }
  console.log(`  ${email}: Facilitator ${has} → ${want}${DRY ? c.yellow('  [dry run: no change made]') : ''}`);
  if (DRY) return;

  if (['draft', 'ready'].includes(v.status)) {
    await cms.patch(`/v1/content/${key}/versions/${v.version}`, { properties: { Facilitator: { value: want } } });
  } else {
    // Someone published it in the CMS: start a new draft that keeps every other field.
    const properties = { ...(v.properties ?? {}), Facilitator: { value: want } };
    await cms.post(`/v1/content/${key}/versions`, { locale: LOCALE, displayName: v.displayName, properties });
  }
  for (let i = 0; i < 6; i++) {
    await sleep(500 * (i + 1));
    const after = await latestVersion(cms, key);
    if (unwrap(after?.properties?.Facilitator) === want) {
      console.log(`  ${c.green('✓')} saved (v${after.version}, ${after.status}). Takes effect on their next page load.`);
      return;
    }
  }
  throw new Error('The change was sent but the read-back does not show it yet. Check the item in the CMS.');
}

main().catch((err) => fatal('guide:facilitator', err));
