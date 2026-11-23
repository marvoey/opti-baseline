/**
 * site:new:local — same as site:new, for a site that only runs on this machine.
 *
 *   yarn site:new:local <branch> --prefix <Prefix> --name "<Site Name>" [options]
 *
 * The CMS application gets ONE host, http://localhost:<port> (primary, https disabled), instead of the
 * public hostname, and DEPLOYED_URL in the new .env is http://localhost:<port>. Arguments are the same as
 * for site:new, except --host. See scripts/site-new.mjs.
 *
 * This is a separate entry point (not a --local flag) because the argument parser would read a flag placed
 * before the branch name as that flag's value.
 */
process.env.SITE_NEW_LOCAL = '1';
await import('./site-new.mjs');
