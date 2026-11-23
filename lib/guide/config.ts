import 'server-only';

/**
 * Configuration for the /setup-guide accounts. Read at request time (never at build time), so a
 * missing value fails the request with a clear message instead of breaking the build.
 * `yarn guide:setup` writes GUIDE_USERS_FOLDER_ID and GUIDE_SESSION_SECRET into .env.
 */
export type GuideConfig = {
  sessionSecret: string;
  usersFolder: string;
  allowedDomain: string;
  facilitators: Set<string>;
  locale: string;
};

const normKey = (k: string) => k.replace(/-/g, '').toLowerCase();

export function guideConfig(): GuideConfig {
  const sessionSecret = process.env.GUIDE_SESSION_SECRET?.trim() ?? '';
  if (sessionSecret.length < 32) {
    throw new Error('GUIDE_SESSION_SECRET is missing or shorter than 32 characters. Run `yarn guide:setup`.');
  }
  const usersFolder = normKey(process.env.GUIDE_USERS_FOLDER_ID?.trim() ?? '');
  if (!/^[0-9a-f]{32}$/.test(usersFolder)) {
    throw new Error('GUIDE_USERS_FOLDER_ID is missing or not a content key. Run `yarn guide:setup`.');
  }
  if (!process.env.OPTIMIZELY_CMS_CLIENT_ID?.trim() || !process.env.OPTIMIZELY_CMS_CLIENT_SECRET?.trim()) {
    throw new Error('OPTIMIZELY_CMS_CLIENT_ID / OPTIMIZELY_CMS_CLIENT_SECRET are required for /setup-guide accounts.');
  }
  return {
    sessionSecret,
    usersFolder,
    allowedDomain: (process.env.GUIDE_ALLOWED_EMAIL_DOMAIN?.trim() || 'optimizely.com').toLowerCase().replace(/^@/, ''),
    facilitators: new Set(
      (process.env.GUIDE_FACILITATOR_EMAILS ?? '')
        .split(',')
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean),
    ),
    locale: process.env.OPTIMIZELY_DEFAULT_LOCALE?.trim() || 'en',
  };
}
