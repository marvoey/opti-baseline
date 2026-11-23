/**
 * site:new — start a new site replica: a git worktree on its own branch cut from `main`, plus the
 * CMS side it needs (start page, application with hostname, asset folder) and a ready .env.
 *
 *   yarn site:new <branch> --prefix <Prefix> --name "<Site Name>" [options]
 *   yarn site:new acme --prefix Acme --name "Acme Corp" --dry        # plan only, no changes
 *
 * What it creates (in this order, each step idempotent so a failed run can simply be re-run):
 *   1. CMS start page   BlankExperience draft under the shared content root (deterministic key)
 *   2. CMS asset folder SysContentFolder under the shared assets root    (deterministic key)
 *   3. CMS application  hosts: https://<host> (primary) + http://localhost:<port> (preview);
 *                       entry point = the start page; NEVER the default application
 *   4. publish          the start page, AFTER the application exists (Graph files a page under the
 *                       application that owns it at publish time), then confirm Graph's URL base
 *   5. git worktree     <dir> on new branch <branch> from <from> (default main). No commit.
 *                       Only COMMITTED changes on <from> are in the new branch.
 *   6. .env             from .env.example + shared credentials of THIS checkout's .env + new site
 *                       values (SITE_BRANCH, SITE_PREFIX, PORT, DEPLOYED_URL, keys) + fresh secrets
 *   7. yarn install     in the worktree (skip with --no-install)
 *
 * Local variant: `yarn site:new:local <branch> --prefix ... --name ...` takes the same arguments, but the
 * application gets ONE host, http://localhost:<port> (primary, https disabled), instead of the public
 * hostname + a preview host, and DEPLOYED_URL becomes http://localhost:<port>. No DNS or hosting is needed.
 * --host is not accepted in this mode.
 *
 * Nothing is deployed and nothing is committed. Registering the hostname in the CMS does not make
 * it resolve: DNS / hosting for <host> is a separate, manual step.
 *
 * Options
 *   --prefix <Prefix>      content type prefix, e.g. Acme or acme (required; must be unused in the CMS). The first
 *                          letter is capitalised, because type keys are PascalCase: acme -> AcmeHeroBlock.
 *   --name "<Name>"        site display name (required): start page, application and asset folder
 *   --host <host>          public hostname (default: <branch>.<domain of this checkout's DEPLOYED_URL>)
 *   --port <n>             local dev port (default: lowest free port >= 3035)
 *   --opp <Folder>         opportunity folder under the demo-sites root. The site is created at
 *                          <demo-sites>/<Folder>/opti-baseline-<branch> (folder created when missing).
 *                          Default: a folder named like the branch.
 *   --dir <path>           exact worktree folder, absolute path (use instead of --opp)
 *   --from <ref>           branch to cut from (default: main)
 *   --content-root <key>   parent of start pages (default: HOME_PAGE_CONTENT_ID in the main checkout's
 *                          .env, which is the SaaS content root; a start page key also works: its container is used)
 *   --assets-root <key>    parent of asset folders (default: ASSET_BASE_FOLDER_ID in the main checkout's
 *                          .env, which is the SaaS assets root; a site folder key also works: its container is used)
 *   --resume               accept an existing branch/worktree created by an earlier run
 *   --no-install           skip yarn install
 *   --dry                  validate and print the plan; change nothing
 *
 * Run it from the main checkout: its .env holds the shared CMS/Graph credentials and points
 * HOME_PAGE_CONTENT_ID / ASSET_BASE_FOLDER_ID at the SaaS root containers. The `main` application is
 * the CMS default; new site applications never are.
 *
 * Folder layout: the main checkout is the permanent hub (<demo-sites>/<hub folder>/<checkout>); every site
 * is a git worktree of it, placed next to your other opportunities: <demo-sites>/<opportunity>/opti-baseline-<site>.
 * The demo-sites root is two levels above this checkout and can have any name (the setup guide suggests
 * demo-sites). It must be a folder of its own, not your home folder or a folder above it. Set the OPPS_ROOT
 * environment variable to its path if your checkout is laid out differently.
 * Port choice also reads the .env of every <demo-sites>/<opportunity>/<folder> checkout, so a new site never
 * reuses a port that one of your older clones already claims.
 */

import { randomBytes } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { basename, dirname, isAbsolute, join, parse, resolve, sep } from 'node:path';

import {
  BASE_BRANCH,
  ROOT,
  c,
  createCms,
  deterministicKey,
  fatal,
  git,
  graphQuery,
  normKey,
  ok,
  parseArgs,
  sleep,
  warn,
} from './lib/cms-api.mjs';

const args = parseArgs();
const DRY = Boolean(args.dry);
const LOCALE = process.env.OPTIMIZELY_DEFAULT_LOCALE || 'en';
const MIN_PORT = 3035;
// Set by scripts/site-new-local.mjs (yarn site:new:local): localhost:<port> is the primary host, over plain http.
const LOCAL = process.env.SITE_NEW_LOCAL === '1';
// The folder that holds the hub and every site can have any name, but it must be a folder of its own: never the
// filesystem root, your home folder, or a folder above it (that is what two levels up gives when the checkout is
// not inside <demo-sites>/<folder>/).
const isDemoSitesRoot = (dir) => dir !== parse(dir).root && dir !== homedir() && !homedir().startsWith(dir + sep);
const DEFAULT_PREVIEW_FORMATS = { any: '{host}/preview?key={key}&ver={version}&loc={locale}&ctx={context}' };

// Keys that belong to ONE site and are never copied from this checkout's .env.
const SITE_SPECIFIC_KEYS = new Set([
  'SITE_BRANCH', 'SITE_PREFIX', 'SITE_NAME', 'PORT', 'DEPLOYED_URL', 'HOME_PAGE_CONTENT_ID',
  'ASSET_BASE_FOLDER_ID', 'MARK_TOOLS_NAME_PREFIX', 'MARK_TOOLS_TOKEN', 'BASE_URL', 'DEV_HOSTS',
]);

const step = (s) => console.log(`\n${c.bold(s)}`);
const plan = [];
const say = (line) => {
  plan.push(line);
  console.log(`  ${line}`);
};

// ── .env parsing ────────────────────────────────────────────────────────────
function readEnvFile(file) {
  const out = new Map();
  if (!existsSync(file)) return out;
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = /^([A-Z_][A-Z0-9_]*)=(.*)$/.exec(line);
    if (m && !out.has(m[1])) out.set(m[1], m[2]);
  }
  return out;
}

// ── Port helpers ────────────────────────────────────────────────────────────
/** TCP ports something is already listening on (best effort: an empty set when the platform tool is missing). */
function listeningPorts() {
  const run = (cmd, cmdArgs) => {
    try {
      return execFileSync(cmd, cmdArgs, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    } catch {
      return '';
    }
  };
  let ports = [];
  if (process.platform === 'win32') {
    // "  TCP    0.0.0.0:3034    0.0.0.0:0    LISTENING    1234". A listening socket always has foreign port 0,
    // which also works on non-English Windows, where the word LISTENING is translated.
    ports = [...run('netstat', ['-ano', '-p', 'TCP']).matchAll(/^\s*TCP\s+\S+:(\d{2,5})\s+\S+:0\s/gim)].map((m) => Number(m[1]));
  } else if (process.platform === 'darwin') {
    // "node  1234 you  23u  IPv6 ...  TCP *:3034 (LISTEN)"
    ports = [...run('lsof', ['-nP', '-iTCP', '-sTCP:LISTEN']).matchAll(/:(\d{2,5})\s+\(LISTEN\)/g)].map((m) => Number(m[1]));
  } else {
    ports = [...run('ss', ['-ltnH']).matchAll(/:(\d{2,5})\s/g)].map((m) => Number(m[1]));
  }
  return new Set(ports);
}

function worktreePorts() {
  const ports = new Set();
  const list = git(['worktree', 'list', '--porcelain']) ?? '';
  for (const m of list.matchAll(/^worktree (.+)$/gm)) {
    const p = readEnvFile(join(m[1], '.env')).get('PORT');
    if (p && /^\d+$/.test(p.replace(/["']/g, ''))) ports.add(Number(p.replace(/["']/g, '')));
  }
  return ports;
}

// ── Ports claimed by other checkouts ─────────────────────────────────────────────────────────
/**
 * Ports in the .env of every <oppsRoot>/<opportunity>/<folder> checkout. Your older clones are not git
 * worktrees of this repo, so worktreePorts() cannot see them.
 */
function otherCheckoutPorts(oppsRoot) {
  const ports = new Map();
  let scanned = 0;
  const subdirs = (p) => {
    try {
      return readdirSync(p, { withFileTypes: true })
        .filter((d) => d.isDirectory() && !d.name.startsWith('.'))
        .map((d) => join(p, d.name));
    } catch {
      return [];
    }
  };
  for (const opp of subdirs(oppsRoot)) {
    for (const site of subdirs(opp)) {
      const file = join(site, '.env');
      if (!existsSync(file)) continue;
      scanned++;
      const raw = String(readEnvFile(file).get('PORT') ?? '').split('#')[0].replace(/["']/g, '').trim();
      const n = Number(raw);
      if (raw && Number.isInteger(n) && n > 0 && !ports.has(n)) ports.set(n, file);
    }
  }
  return { ports, scanned };
}

// ── Validation ──────────────────────────────────────────────────────────────
function validateInputs() {
  const problems = [];
  const branch = args._[0];
  if (!branch) problems.push('missing <branch> (first argument), e.g. yarn site:new acme --prefix Acme --name "Acme Corp"');
  else if (git(['check-ref-format', '--branch', branch]) === null || /[A-Z\s]/.test(branch)) {
    problems.push(`"${branch}" is not a valid branch name (use lowercase letters, digits and hyphens)`);
  } else if (branch === BASE_BRANCH) problems.push(`the branch cannot be the baseline "${BASE_BRANCH}"`);

  const prefix = typeof args.prefix === 'string' ? args.prefix : null;
  if (!prefix) problems.push('missing --prefix (content type prefix, e.g. --prefix acme)');
  else if (!/^[A-Za-z][A-Za-z0-9]{1,11}$/.test(prefix)) problems.push(`--prefix "${prefix}" must be 2-12 letters/digits starting with a letter, e.g. acme or Acme`);

  const name = typeof args.name === 'string' ? args.name.trim() : null;
  if (!name) problems.push('missing --name (site display name, e.g. --name "Acme Corp")');

  if (LOCAL && args.host !== undefined) problems.push('--host cannot be used with site:new:local (the primary host is localhost:<port>); use yarn site:new for a public hostname');
  if (args.port !== undefined && !/^\d{4,5}$/.test(String(args.port))) problems.push('--port must be a number');
  if (args.opp !== undefined) {
    const opp = typeof args.opp === 'string' ? args.opp.trim() : '';
    if (args.dir !== undefined) problems.push('use either --opp or --dir, not both');
    if (!opp || !/^[A-Za-z0-9][A-Za-z0-9 ._-]*$/.test(opp) || opp.includes('..')) {
      problems.push('--opp must be a folder name (letters, digits, spaces, dots, hyphens, underscores), e.g. --opp Acme');
    }
  }
  if (problems.length) throw new Error(`Invalid input:\n  - ${problems.join('\n  - ')}`);
  // Type keys are PascalCase (AcmeHeroBlock), so "acme" becomes "Acme". Anything after the first letter is kept as typed.
  return { branch, prefix: prefix && prefix[0].toUpperCase() + prefix.slice(1), name };
}

async function main() {
  const { branch, prefix, name } = validateInputs();
  const cms = createCms();
  const problems = [];
  const notes = [];

  console.log(c.bold(`\nsite:new — ${branch}${DRY ? c.yellow('  [DRY RUN — no changes]') : ''}`));

  // ── git: branch / base / worktree dir ──
  const top = git(['rev-parse', '--show-toplevel']);
  if (!top) throw new Error('Not inside a git checkout.');
  const from = typeof args.from === 'string' ? args.from : BASE_BRANCH;
  if (git(['rev-parse', '--verify', '--quiet', `${from}^{commit}`]) === null) problems.push(`base ref "${from}" does not exist`);
  const localBranch = git(['rev-parse', '--verify', '--quiet', `refs/heads/${branch}`]) !== null;
  const remoteBranch = git(['rev-parse', '--verify', '--quiet', `refs/remotes/origin/${branch}`]) !== null;
  const oppsRoot = resolve(process.env.OPPS_ROOT || dirname(dirname(top)));
  const hubName = basename(dirname(top));
  let oppFolder = null;
  let dir;
  if (typeof args.dir === 'string') {
    dir = resolve(isAbsolute(args.dir) ? args.dir : resolve(process.cwd(), args.dir));
  } else {
    oppFolder = typeof args.opp === 'string' ? args.opp.trim() : branch;
    dir = join(oppsRoot, oppFolder, 'opti-baseline-' + branch);
    if (!process.env.OPPS_ROOT && !isDemoSitesRoot(oppsRoot)) {
      problems.push('could not locate your demo-sites folder (expected this checkout at <demo-sites>/<folder>/<checkout>, but the root would be ' + oppsRoot + ', which is your home folder or above it). Set OPPS_ROOT, or pass --dir <absolute path>');
    }
    if (oppFolder === hubName) {
      problems.push('"' + oppFolder + '" is the folder that holds this main checkout; choose the opportunity folder for the new site with --opp');
    }
    if (typeof args.opp !== 'string') {
      notes.push('no --opp given: using an opportunity folder named like the branch ("' + oppFolder + '"). Pass --opp <Folder> to use an existing opportunity folder.');
    }
  }
  const worktrees = (git(['worktree', 'list', '--porcelain']) ?? '').split('\n\n');
  // git prints worktree paths with forward slashes (and any drive-letter case) on Windows.
  const norm = (p) => (process.platform === 'win32' ? p.replace(/\\/g, '/').toLowerCase() : p);
  const existingWt = worktrees.find((w) => norm(w.split('\n')[0].replace(/^worktree /, '')) === norm(dir));
  const wtOnBranch = existingWt?.includes(`branch refs/heads/${branch}`);
  if ((localBranch || remoteBranch) && !(args.resume && localBranch && wtOnBranch)) {
    problems.push(
      `branch "${branch}" already exists${remoteBranch ? ' on origin' : ' locally'}. Pick another name` +
        (localBranch && wtOnBranch ? ', or add --resume to continue an earlier site:new run' : ''),
    );
  }
  if (existsSync(dir) && !(args.resume && wtOnBranch)) problems.push(`folder ${dir} already exists`);
  const current = git(['rev-parse', '--abbrev-ref', 'HEAD']);
  const dirty = git(['status', '--porcelain', '--untracked-files=no']);
  if (current === from && dirty) notes.push(`this checkout of ${from} has UNCOMMITTED changes; they will NOT be in the new branch (commit them first if they are tooling).`);
  const ahead = git(['rev-list', '--count', `origin/${from}..${from}`]);
  if (ahead && ahead !== '0') notes.push(`${from} is ${ahead} commit(s) ahead of origin/${from}: the new branch includes them, which is what you want if they are the tooling.`);

  // ── CMS: shared roots ──
  const srcEnv = readEnvFile(join(ROOT, '.env'));
  const fetchItem = async (key, label) => {
    const r = await cms.get(`/v1/content/${normKey(key)}`, { allow: [404] });
    if (r.status === 404) throw new Error(`${label} ${key} was not found in the CMS`);
    return r.data;
  };
  // The main checkout points at the roots themselves. A site's .env points at its start page / folder:
  // accept that too (use its container), so the script also works from an older checkout.
  const resolveContentRoot = async (key) => {
    const item = await fetchItem(key, 'HOME_PAGE_CONTENT_ID');
    if (!item.contentType || item.contentType === 'SysContentFolder') return normKey(item.key);
    return normKey(item.container);
  };
  const resolveAssetsRoot = async (key, contentRootKey) => {
    const item = await fetchItem(key, 'ASSET_BASE_FOLDER_ID');
    if (!item.contentType || normKey(item.container ?? '') === contentRootKey) return normKey(item.key);
    return normKey(item.container);
  };
  let contentRoot = typeof args['content-root'] === 'string' ? normKey(args['content-root']) : null;
  let assetsRoot = typeof args['assets-root'] === 'string' ? normKey(args['assets-root']) : null;
  try {
    if (!contentRoot) {
      if (!process.env.HOME_PAGE_CONTENT_ID) throw new Error('HOME_PAGE_CONTENT_ID is not set in .env; pass --content-root <key>');
      contentRoot = await resolveContentRoot(process.env.HOME_PAGE_CONTENT_ID);
    }
    if (!assetsRoot) {
      if (!process.env.ASSET_BASE_FOLDER_ID) throw new Error('ASSET_BASE_FOLDER_ID is not set in .env; pass --assets-root <key>');
      assetsRoot = await resolveAssetsRoot(process.env.ASSET_BASE_FOLDER_ID, contentRoot);
    }
  } catch (e) {
    problems.push(e.message);
  }

  // ── CMS: applications, hosts, ports ──
  const apps = await cms.listAll('/v1/applications');
  const appKey = branch.toLowerCase().replace(/[^a-z0-9]/g, '');
  const startKey = deterministicKey('site-start', branch);
  const assetKey = deterministicKey('site-assets', branch);
  const entryPoint = `cms://content/${startKey}`;

  const existingApp = apps.find((a) => a.key === appKey);
  if (existingApp && normKey(existingApp.entryPoint.replace('cms://content/', '')) !== startKey) {
    problems.push(`CMS application "${appKey}" already exists for another site (${existingApp.displayName}). Pick another branch name`);
  }

  const other = (process.env.OPPS_ROOT || isDemoSitesRoot(oppsRoot)) ? otherCheckoutPorts(oppsRoot) : { ports: new Map(), scanned: 0 };
  const usedPorts = new Set([...listeningPorts(), ...worktreePorts(), ...other.ports.keys()]);
  for (const a of apps) for (const h of a.hosts ?? []) {
    const m = /^localhost:(\d+)$/.exec(h.authority);
    if (m && a.key !== appKey) usedPorts.add(Number(m[1]));
  }
  let port = args.port !== undefined ? Number(args.port) : null;
  const ownPreview = existingApp?.hosts?.find((h) => /^localhost:\d+$/.test(h.authority));
  if (!port && ownPreview) port = Number(ownPreview.authority.split(':')[1]); // resume keeps its port
  if (port && usedPorts.has(port) && !(ownPreview && port === Number(ownPreview.authority.split(':')[1]))) {
    const claimed = other.ports.get(port);
    problems.push('port ' + port + ' is already used' + (claimed ? ' by ' + claimed : " (a running server, another checkout's .env, or another CMS application)"));
  }
  if (!port) for (port = MIN_PORT; usedPorts.has(port); port++);

  // Public mode: https://<host> is the primary host and localhost:<port> a preview host.
  // Local mode: localhost:<port> is the primary host, over http (https disabled), and there is no other host.
  const srcHost = (() => {
    try {
      return new URL(process.env.DEPLOYED_URL).host;
    } catch {
      return null;
    }
  })();
  const host = LOCAL
    ? `localhost:${port}`
    : (typeof args.host === 'string' ? args.host : srcHost ? `${branch}.${srcHost.split('.').slice(1).join('.')}` : null)
        ?.toLowerCase()
        .replace(/^https?:\/\//, '')
        .replace(/\/.*$/, '');
  const scheme = LOCAL ? 'http' : 'https';
  const siteUrl = `${scheme}://${host}`;
  if (!host) problems.push('could not derive a hostname (DEPLOYED_URL is not set); pass --host <host>');
  else if (!LOCAL && !/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+(:\d+)?$/.test(host)) problems.push(`"${host}" is not a valid hostname`);

  const hostOwner = apps.find((a) => a.key !== appKey && (a.hosts ?? []).some((h) => h.authority.toLowerCase() === host));
  if (hostOwner) problems.push(`hostname ${host} is already used by application "${hostOwner.key}" (${hostOwner.displayName})`);
  if (LOCAL && existingApp && !existingApp.hosts?.some((h) => h.authority === host && h.type === 'primary')) {
    problems.push(`CMS application "${appKey}" already exists without ${host} as its primary host (an earlier run without site:new:local?). Pick another branch name, or fix the hosts in the CMS`);
  }

  // ── CMS: prefix must be unused ──
  const types = await cms.listAll('/v1/contenttypes');
  const clash = types.filter((t) => t.key.startsWith(prefix));
  if (clash.length) problems.push(`prefix "${prefix}" is already used by ${clash.length} content type(s), e.g. ${clash.slice(0, 3).map((t) => t.key).join(', ')}`);

  // ── Plan ──
  step('Plan');
  say(`branch        ${branch}  (from ${from})${localBranch ? c.dim('  exists, resuming') : ''}`);
  say('worktree      ' + dir + (oppFolder ? c.dim(existsSync(dirname(dir)) ? '  (opportunity folder exists)' : '  (opportunity folder will be created)') : ''));
  say(`site name     ${name}`);
  say(`prefix        ${prefix}  (types like ${prefix}HeroBlock, display names like [${prefix.toUpperCase()}] Hero Banner)`);
  say('port          ' + port + '  (http://localhost:' + port + c.dim('; also checked ' + other.scanned + ' other .env files under ' + oppsRoot) + ')');
  say(`DEPLOYED_URL  ${siteUrl}`);
  say(`start page    ${startKey}  BlankExperience "${name}" under ${contentRoot}`);
  say(`asset folder  ${assetKey}  "${name}" under ${assetsRoot}`);
  say(`application   ${appKey}${existingApp ? c.dim('  exists, resuming') : ''}  ` + (LOCAL
    ? `host ${siteUrl} (primary, ${LOCALE}, https disabled)`
    : `hosts ${siteUrl} (primary, ${LOCALE}) + http://localhost:${port} (preview)`));
  for (const n of notes) console.log(`  ${warn(n)}`);

  if (problems.length) {
    console.log(`\n${c.red('Cannot continue — nothing was changed:')}`);
    for (const p of problems) console.log(`  ${c.red('✗')} ${p}`);
    process.exitCode = 1;
    return;
  }
  if (DRY) {
    console.log(c.dim('\n  Dry run only. Re-run without --dry to create everything.'));
    return;
  }

  // ── 1. start page ──
  step('1/7 CMS start page (draft)');
  const sp = await cms.get(`/v1/content/${startKey}`, { allow: [404] });
  if (sp.status === 404) {
    const body = { key: startKey, contentType: 'BlankExperience', container: contentRoot, initialVersion: { displayName: name, locale: LOCALE, routeSegment: appKey } };
    try {
      await cms.post('/v1/content', body);
    } catch (e) {
      if (e.status !== 400) throw e;
      delete body.initialVersion.routeSegment; // older API versions reject routeSegment on create
      await cms.post('/v1/content', body);
    }
    console.log(`  ${ok(`created ${startKey}`)}`);
  } else if (sp.data.contentType !== 'BlankExperience') {
    throw new Error(`content ${startKey} exists but is a ${sp.data.contentType}`);
  } else console.log(`  ${ok('exists')}`);

  // ── 2. asset folder ──
  step('2/7 CMS asset folder');
  const af = await cms.get(`/v1/content/${assetKey}`, { allow: [404] });
  if (af.status === 404) {
    // SysContentFolder is not localized: no locale.
    await cms.post('/v1/content', { key: assetKey, contentType: 'SysContentFolder', container: assetsRoot, initialVersion: { displayName: name } });
    console.log(`  ${ok(`created ${assetKey}`)}`);
  } else if (af.data.contentType !== 'SysContentFolder') {
    throw new Error(`content ${assetKey} exists but is a ${af.data.contentType}`);
  } else console.log(`  ${ok('exists')}`);

  // ── 3. application ──
  step('3/7 CMS application + hostname');
  if (!existingApp) {
    const source = apps.find((a) => a.isDefault); // the `main` application
    await cms.post('/v1/applications', {
      key: appKey,
      displayName: name,
      type: 'website',
      entryPoint,
      isDefault: false, // never take over the instance default
      useApplicationSpecificAssets: false,
      hosts: LOCAL
        ? [{ authority: host, type: 'primary', locale: LOCALE, preferredUrlScheme: 'http' }]
        : [
            { authority: host, type: 'primary', locale: LOCALE, preferredUrlScheme: 'https' },
            { authority: `localhost:${port}`, type: 'preview', preferredUrlScheme: 'http' },
          ],
      usePreviewTokens: true,
      previewUrlFormats: source?.previewUrlFormats ?? DEFAULT_PREVIEW_FORMATS,
    });
    console.log(`  ${ok(`created application ${appKey}`)}`);
  } else console.log(`  ${ok('exists')}`);
  // A newly created application can take a moment to become readable (eventual consistency, like
  // content versions). Wait for it before publishing, so the page is filed under the new host.
  let check = null;
  for (let i = 0; i < 8 && !check; i++) {
    if (i) await sleep(700 * i);
    const r = await cms.get('/v1/applications/' + appKey, { allow: [404] });
    if (r.status !== 404) check = r.data;
  }
  if (!check) throw new Error('application ' + appKey + ' was created but is not readable yet; wait a moment and re-run with --resume');
  if (check.isDefault) console.log(`  ${warn('this application is marked as the instance default; change that in the CMS if it was not intended')}`);

  // ── 4. publish the start page (only now that the application exists) ──
  // Graph computes a page's URL base from the application that owns it AT PUBLISH TIME. Publishing
  // before the application exists files the page under the instance's default site instead.
  step('4/7 publish start page');
  let published = false;
  for (let i = 0; i < 6 && !published; i++) {
    if (i) await sleep(700 * i);
    const { data } = await cms.get(`/v1/content/${startKey}/versions`, { query: { locales: LOCALE, pageSize: 100 } });
    const items = data?.items ?? [];
    if (items.some((v) => v.status === 'published')) {
      published = true;
      break;
    }
    const latest = [...items].sort((a, b) => Number(b.version) - Number(a.version))[0];
    if (latest) {
      await cms.post(`/v1/content/${startKey}/versions/${latest.version}:publish`, {});
      published = true;
      console.log(`  ${ok(`published v${latest.version}`)}`);
    }
  }
  if (!published) throw new Error('start page was created but no version appeared to publish; re-run with --resume');
  // Confirm Graph filed the page under the new host.
  let indexed = null;
  for (let i = 0; i < 12 && !indexed; i++) {
    if (i) await sleep(5000);
    const d = await graphQuery(
      'query($k: [String]) { _Content(where: { _metadata: { key: { in: $k } } }) { items { _metadata { url { base default } } } } }',
      { k: [startKey] },
    ).catch(() => null);
    indexed = d?._Content?.items?.[0]?._metadata?.url ?? null;
  }
  if (!indexed) console.log(`  ${warn('Graph has not indexed the start page yet (check again with yarn cms:e2e --wait 120)')}`);
  else if ((indexed.base || '').replace(/\/$/, '') !== siteUrl) {
    console.log(`  ${warn(`Graph indexed the start page under ${indexed.base}${indexed.default}, not ${siteUrl}. Re-publish the start page in the CMS to refresh it.`)}`);
  } else console.log(`  ${ok(`Graph: ${indexed.base}${indexed.default}`)}`);

  // ── 5. worktree ──
  step('5/7 git worktree');
  if (!localBranch) {
    mkdirSync(dirname(dir), { recursive: true });
    const r = spawnSync('git', ['worktree', 'add', '--no-track', '-b', branch, dir, from], { cwd: ROOT, stdio: 'inherit' });
    if (r.status !== 0) throw new Error('git worktree add failed (the CMS objects exist; fix the problem and re-run with --resume)');
  } else console.log(`  ${ok(`exists at ${dir}`)}`);

  // ── 6. .env ──
  step('6/7 .env');
  const envFile = join(dir, '.env');
  if (existsSync(envFile) && args.resume) {
    console.log(`  ${ok('exists, left unchanged')}`);
  } else {
    const site = new Map([
      ['SITE_BRANCH', branch],
      ['SITE_PREFIX', prefix],
      ['SITE_NAME', JSON.stringify(name)],
      ['PORT', String(port)],
      ['DEPLOYED_URL', siteUrl],
      ['HOME_PAGE_CONTENT_ID', startKey],
      ['ASSET_BASE_FOLDER_ID', assetKey],
      ['MARK_TOOLS_NAME_PREFIX', branch],
      ['MARK_TOOLS_TOKEN', randomBytes(32).toString('base64url')],
    ]);
    const example = existsSync(join(dir, '.env.example')) ? readFileSync(join(dir, '.env.example'), 'utf8') : '';
    const written = new Set();
    const body = example.split(/\r?\n/).map((line) => {
      const m = /^([A-Z_][A-Z0-9_]*)=(.*)$/.exec(line);
      if (!m) return line;
      const k = m[1];
      written.add(k);
      if (['SITE_BRANCH', 'SITE_PREFIX', 'SITE_NAME'].includes(k)) return null; // written once, in the header
      if (site.has(k)) return `${k}=${site.get(k)}`;
      if (srcEnv.has(k) && !SITE_SPECIFIC_KEYS.has(k)) return `${k}=${srcEnv.get(k)}`;
      return line;
    }).filter((l) => l !== null);
    const header = [
      '# Written by `yarn site:new` — this file belongs to ONE site replica (gitignored).',
      '# --- Site identity (the scripts refuse to run when SITE_BRANCH != the checked-out branch) ---',
      ...['SITE_BRANCH', 'SITE_PREFIX', 'SITE_NAME'].map((k) => `${k}=${site.get(k)}`),
      '',
    ];
    const extra = [...srcEnv.entries()].filter(([k]) => !written.has(k) && !SITE_SPECIFIC_KEYS.has(k));
    const tail = extra.length ? ['', `# --- Copied from ${join(ROOT, '.env')} (shared credentials) ---`, ...extra.map(([k, v]) => `${k}=${v}`)] : [];
    const missingSite = [...site.keys()].filter((k) => !written.has(k) && !['SITE_BRANCH', 'SITE_PREFIX', 'SITE_NAME'].includes(k));
    const siteTail = missingSite.length ? ['', '# --- Site values ---', ...missingSite.map((k) => `${k}=${site.get(k)}`)] : [];
    writeFileSync(envFile, [...header, ...body, ...tail, ...siteTail].join('\n').replace(/\n*$/, '\n'));
    console.log(`  ${ok(`wrote ${envFile}`)} ${c.dim('(new MARK_TOOLS_TOKEN generated; not printed)')}`);
  }

  // ── 7. install ──
  step('7/7 dependencies');
  if (args['no-install']) console.log(c.dim('  skipped (--no-install). Run: yarn install'));
  else {
    // On Windows yarn is yarn.cmd, which Node only starts through a shell (arguments here are fixed).
    const r = spawnSync('yarn', ['install'], { cwd: dir, stdio: 'inherit', shell: process.platform === 'win32' });
    if (r.status !== 0) console.log(`  ${warn('yarn install failed; run it manually in the worktree')}`);
  }

  const BS = String.fromCharCode(92);
  const quoted = (p) => (p.includes(' ') ? '"' + p + '"' : p);
  const winPath = process.env.WSL_DISTRO_NAME ? BS + BS + 'wsl.localhost' + BS + process.env.WSL_DISTRO_NAME + dir.split('/').join(BS) : null;

  // ── Done ──
  console.log(`\n${ok(c.bold(`site ${branch} is ready`))}`);
  console.log(`
  Next:
    cd ${quoted(dir)}
    yarn dev                 # http://localhost:${port}  (${LOCAL ? 'registered in the CMS as the primary host' : 'CMS preview host is registered for this port'})
    yarn cms:align           # baseline types in sync; your ${prefix}* blocks will show up here

  Then follow the /site-replica playbook from Step 1 (Site Recon) in this worktree.
  In Mark Desktop, attach ${winPath ?? dir} as the working folder for this site.

  Not done for you (on purpose): ${LOCAL ? '' : `DNS / hosting for ${host}, `}deploying, committing.`);
}

main().catch((err) => fatal('site:new', err));
