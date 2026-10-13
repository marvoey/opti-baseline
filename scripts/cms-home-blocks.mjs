/**
 * Copies each section of the home page into a standalone, published block in the
 * CMS asset folder, so the sections can be reused on other pages.
 *
 * The home page (HOME_PAGE_CONTENT_ID) is a BlankExperience whose sections are
 * inline components with no content key of their own. This reads its composition
 * through the CMS REST API and creates one block per section inside the folder
 * ASSET_BASE_FOLDER_ID (default locale only), then publishes it. The home page
 * itself is NOT modified.
 *
 * Re-runnable: a block with the same displayName + contentType already in the
 * folder is skipped.
 *
 *   npm run cms:home-blocks            # create + publish
 *   npm run cms:home-blocks -- --dry   # show what would be created, write nothing
 */

const DRY_MODE = process.argv.includes('--dry');
const GATEWAY = (process.env.OPTIMIZELY_CMS_API_URL || 'https://api.cms.optimizely.com').replace(/\/$/, '');
const API = `${GATEWAY}/v1`;
const LOCALE = process.env.OPTIMIZELY_DEFAULT_LOCALE || 'en';
const { OPTIMIZELY_CMS_CLIENT_ID, OPTIMIZELY_CMS_CLIENT_SECRET } = process.env;

// The REST API addresses content by its dashless 32-char key.
const stripDashes = (s) => (s ?? '').replace(/-/g, '');
const FOLDER = stripDashes(process.env.ASSET_BASE_FOLDER_ID);
const HOME = stripDashes(process.env.HOME_PAGE_CONTENT_ID);

const c = {
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
};

async function getToken() {
  const res = await fetch(`${GATEWAY}/oauth/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: OPTIMIZELY_CMS_CLIENT_ID,
      client_secret: OPTIMIZELY_CMS_CLIENT_SECRET,
    }),
  });
  if (!res.ok) throw new Error(`Token request failed: ${res.status} ${res.statusText}`);
  const data = await res.json();
  if (!data?.access_token) throw new Error('Token endpoint returned no access_token');
  return data.access_token;
}

async function api(token, method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      authorization: `Bearer ${token}`,
      ...(body ? { 'content-type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status} ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : null;
}

/** The home page's current default-locale version, with its composition. */
async function readHome(token) {
  const { items = [] } = await api(token, 'GET', `/content/${HOME}/versions?locales=${LOCALE}&pageSize=20`);
  const version = items.find((v) => v.status === 'published') ?? items[0];
  if (!version) throw new Error(`No "${LOCALE}" version found for home page ${HOME}`);
  return api(token, 'GET', `/content/${HOME}/versions/${version.version}`);
}

/**
 * Every item already in the target folder, keyed by contentType + displayName.
 * The folder listing carries no displayName/status, so read each item's
 * default-locale version.
 */
async function existingBlocks(token) {
  const found = new Map();
  for (let pageIndex = 0; ; pageIndex++) {
    const { items = [] } = await api(token, 'GET', `/content/${FOLDER}/items?pageIndex=${pageIndex}&pageSize=100`);
    for (const item of items) {
      const { items: versions = [] } = await api(
        token,
        'GET',
        `/content/${item.key}/versions?locales=${LOCALE}&pageSize=20`,
      );
      const v = versions.find((x) => x.status === 'published') ?? versions[0];
      if (v) found.set(`${item.contentType}::${v.displayName}`, { key: item.key, version: v.version, status: v.status });
    }
    if (items.length < 100) return found;
  }
}

async function main() {
  const missing = Object.entries({
    OPTIMIZELY_CMS_CLIENT_ID,
    OPTIMIZELY_CMS_CLIENT_SECRET,
    ASSET_BASE_FOLDER_ID: FOLDER,
    HOME_PAGE_CONTENT_ID: HOME,
  })
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (missing.length) {
    console.error(`Set ${missing.join(', ')} in .env.`);
    process.exit(2);
  }

  const token = await getToken();
  const home = await readHome(token);
  const sections = (home.composition?.nodes ?? []).filter((n) => n.component?.contentType);
  const existing = await existingBlocks(token);

  console.log(
    `Home page "${home.displayName}" (${LOCALE}): ${sections.length} sections → folder ${FOLDER}` +
      (DRY_MODE ? c.yellow('  [dry run]') : '') +
      '\n',
  );

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const node of sections) {
    const contentType = node.component.contentType;
    const displayName = node.displayName || contentType;
    const label = `${displayName} ${c.dim(`(${contentType})`)}`;

    const key = `${contentType}::${displayName}`;
    const have = existing.get(key);
    if (have?.status === 'published') {
      console.log(`${c.yellow('skip   ')} ${label} — already published in folder`);
      skipped++;
      continue;
    }
    if (DRY_MODE) {
      console.log(`${c.green(have ? 'publish' : 'create ')} ${label}`);
      continue;
    }

    try {
      let block = have;
      if (!block) {
        await api(token, 'POST', '/content', {
          contentType,
          container: FOLDER,
          initialVersion: {
            locale: LOCALE,
            displayName,
            properties: node.component.properties ?? {},
          },
        });
        // The create call returns no body, so look the new block up.
        block = (await existingBlocks(token)).get(key);
        if (!block) throw new Error('Block was created but could not be found in the folder');
      }
      await api(token, 'POST', `/content/${block.key}/versions/${block.version}:publish`, {});
      console.log(`${c.green(have ? 'publish' : 'created')} ${label} ${c.dim(block.key)}`);
      created++;
    } catch (err) {
      console.error(`${c.red('failed ')} ${label}\n         ${err.message}`);
      failed++;
    }
  }

  console.log(`\n${created} created/published, ${skipped} skipped, ${failed} failed`);
  if (failed) process.exit(1);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
