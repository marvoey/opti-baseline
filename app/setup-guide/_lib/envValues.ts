/**
 * The fixed lines every reader types into the main .env in Step 10, part e. Nobody has to hand these out: they
 * are the same for every reader, or (the CMS address) read from the reader's own browser.
 *
 * HOME_PAGE_CONTENT_ID / ASSET_BASE_FOLDER_ID are the CMS's two system roots: the top of the page tree, and the
 * shared-assets folder directly under it. They exist in every CMS (SaaS) instance. Checked against one instance
 * (the root has no parent; the assets root is a SysContentFolder whose container is the root). On any other
 * instance `yarn site:new:local ... --dry` fails with "... was not found in the CMS" if they differ, and the
 * Troubleshooting entry for that message tells the reader what to do.
 *
 * With `yarn site:new:local` each site's address is http://localhost:<port>, so the main DEPLOYED_URL is not used
 * to work out new sites' addresses: it only has to be a valid address for the main project itself.
 */
export const ENV_PORT = '3034';
export const ENV_DEPLOYED_URL = `http://localhost:${ENV_PORT}`;
export const ENV_CONTENT_ROOT = '43f936c99b234ea397b261c538ad07c9';
export const ENV_ASSETS_ROOT = 'e56f85d0e8334e02976a2d11fe4d598c';
export const ENV_SITE_BRANCH = 'main';
