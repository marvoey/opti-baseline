import 'server-only';
import { createHash } from 'node:crypto';
import { cmsRequest, CmsError } from './cms';
import { guideConfig } from './config';

/**
 * Guide accounts stored in the CMS as GuideUser items (see cms/GuideUser.tsx).
 *
 * - One item per person. Its content key is derived from the email address, so finding an account
 *   is one direct read (no search, no Graph), and the CMS itself refuses a second account for the
 *   same email.
 * - Items stay drafts. Each write patches the one open draft version in place (merge-patch only
 *   sends the fields being changed, so a progress save never overwrites a view count).
 */

export const CONTENT_TYPE = 'GuideUser';

export type StoredProgress = { checks: string[]; os?: 'mac' | 'win'; shell?: 'zsh' | 'bash'; updatedAt?: string };

export type GuideUser = {
  key: string;
  version: string;
  status: string;
  email: string;
  fullName: string;
  passwordHash: string;
  disabled: boolean;
  progress: StoredProgress;
  progressPercent: number;
  pageViews: number;
  visits: number;
  lastSeenAt: string | null;
  signedUpAt: string | null;
  failedLogins: number;
  lockedUntil: string | null;
};

type Version = {
  version: string | number;
  status: string;
  locale?: string;
  displayName?: string;
  properties?: Record<string, unknown>;
};

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

export function userKeyFor(email: string): string {
  return createHash('sha256').update(`${CONTENT_TYPE}::${normalizeEmail(email)}`).digest('hex').slice(0, 32);
}

const wrap = (props: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(props).map(([k, v]) => [k, { value: v }]));

function value(props: Record<string, unknown> | undefined, name: string): unknown {
  const v = props?.[name];
  return v && typeof v === 'object' && 'value' in v ? (v as { value: unknown }).value : v;
}

const str = (v: unknown) => (typeof v === 'string' ? v : '');
const int = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? Math.trunc(v) : 0);

function parseProgress(raw: unknown): StoredProgress {
  try {
    const p = JSON.parse(str(raw) || '{}') as Partial<StoredProgress>;
    return {
      checks: Array.isArray(p.checks) ? p.checks.filter((c): c is string => typeof c === 'string') : [],
      os: p.os === 'mac' || p.os === 'win' ? p.os : undefined,
      shell: p.shell === 'zsh' || p.shell === 'bash' ? p.shell : undefined,
      updatedAt: typeof p.updatedAt === 'string' ? p.updatedAt : undefined,
    };
  } catch {
    return { checks: [] };
  }
}

function toUser(key: string, v: Version): GuideUser {
  const p = v.properties;
  return {
    key,
    version: String(v.version),
    status: v.status,
    email: str(value(p, 'Email')),
    fullName: str(value(p, 'FullName')),
    passwordHash: str(value(p, 'PasswordHash')),
    disabled: value(p, 'Disabled') === true,
    progress: parseProgress(value(p, 'Progress')),
    progressPercent: int(value(p, 'ProgressPercent')),
    pageViews: int(value(p, 'PageViews')),
    visits: int(value(p, 'Visits')),
    lastSeenAt: str(value(p, 'LastSeenAt')) || null,
    signedUpAt: str(value(p, 'SignedUpAt')) || null,
    failedLogins: int(value(p, 'FailedLogins')),
    lockedUntil: str(value(p, 'LockedUntil')) || null,
  };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** The account with this content key, or null. Retries briefly: the versions list can lag a new item. */
export async function getUserByKey(key: string): Promise<GuideUser | null> {
  const { locale } = guideConfig();
  for (let attempt = 0; attempt < 4; attempt++) {
    if (attempt) await sleep(400 * attempt);
    const { status, data } = await cmsRequest<{ items?: Version[] }>('GET', `/v1/content/${key}/versions`, {
      query: { locales: locale, pageSize: 100 },
      allow: [404],
    });
    if (status === 404) return null;
    const items = (data?.items ?? []).filter((v) => !v.locale || v.locale === locale);
    const latest = items.sort((a, b) => Number(b.version) - Number(a.version))[0];
    if (latest) return toUser(key, latest);
  }
  return null;
}

export const getUserByEmail = (email: string) => getUserByKey(userKeyFor(email));

export class AccountExistsError extends Error {}

export async function createUser(input: { email: string; fullName: string; passwordHash: string }): Promise<string> {
  const { usersFolder, locale } = guideConfig();
  const email = normalizeEmail(input.email);
  const key = userKeyFor(email);

  const existing = await cmsRequest('GET', `/v1/content/${key}`, { allow: [404] });
  if (existing.status !== 404) throw new AccountExistsError();

  try {
    await cmsRequest('POST', '/v1/content', {
      body: {
        key,
        contentType: CONTENT_TYPE,
        container: usersFolder,
        initialVersion: {
          displayName: `${input.fullName} (${email})`,
          locale,
          properties: wrap({
            Email: email,
            FullName: input.fullName,
            PasswordHash: input.passwordHash,
            Disabled: false,
            Progress: JSON.stringify({ checks: [] }),
            ProgressPercent: 0,
            PageViews: 0,
            Visits: 0,
            SignedUpAt: new Date().toISOString(),
            FailedLogins: 0,
          }),
        },
      },
    });
  } catch (err) {
    // Two sign-ups for the same email at the same moment: the second one loses.
    if (err instanceof CmsError && (err.status === 409 || err.status === 400)) {
      const again = await cmsRequest('GET', `/v1/content/${key}`, { allow: [404] });
      if (again.status !== 404) throw new AccountExistsError();
    }
    throw err;
  }
  return key;
}

/** Writes only the given fields. Edits the open draft in place; if someone published the item in the CMS, starts a new draft. */
export async function updateUser(user: GuideUser, changes: Record<string, unknown>): Promise<void> {
  if (!Object.keys(changes).length) return;
  if (['draft', 'ready'].includes(user.status)) {
    await cmsRequest('PATCH', `/v1/content/${user.key}/versions/${user.version}`, { body: { properties: wrap(changes) } });
    return;
  }
  const { locale } = guideConfig();
  await cmsRequest('POST', `/v1/content/${user.key}/versions`, {
    body: { locale, displayName: `${user.fullName} (${user.email})`, properties: wrap(changes) },
  });
}

const VISIT_GAP_MS = 30 * 60 * 1000;

/** One page view. Counts a new visit when the person has been inactive for 30 minutes. */
export function viewChanges(user: GuideUser, now = new Date()) {
  const last = user.lastSeenAt ? Date.parse(user.lastSeenAt) : 0;
  const newVisit = !last || now.getTime() - last >= VISIT_GAP_MS;
  return {
    PageViews: user.pageViews + 1,
    ...(newVisit ? { Visits: user.visits + 1 } : {}),
    LastSeenAt: now.toISOString(),
  };
}

export const LOCK_AFTER_FAILURES = 5;
export const LOCK_MINUTES = 15;

export function isLocked(user: GuideUser, now = Date.now()): boolean {
  return Boolean(user.lockedUntil && Date.parse(user.lockedUntil) > now);
}

export function failedLoginChanges(user: GuideUser, now = new Date()) {
  const failures = user.failedLogins + 1;
  if (failures >= LOCK_AFTER_FAILURES) {
    return { FailedLogins: 0, LockedUntil: new Date(now.getTime() + LOCK_MINUTES * 60 * 1000).toISOString() };
  }
  return { FailedLogins: failures };
}

/** All accounts, newest activity first (for the facilitator view). */
export async function listUsers(): Promise<GuideUser[]> {
  const { usersFolder } = guideConfig();
  const children: { key: string; contentType?: string }[] = [];
  for (let pageIndex = 0; pageIndex < 20; pageIndex++) {
    const { data } = await cmsRequest<{ items?: { key: string; contentType?: string }[]; totalCount?: number }>(
      'GET',
      `/v1/content/${usersFolder}/items`,
      { query: { pageIndex, pageSize: 100 } },
    );
    const items = data?.items ?? [];
    children.push(...items);
    if (items.length < 100) break;
  }
  const keys = children.filter((c) => !c.contentType || c.contentType === CONTENT_TYPE).map((c) => c.key.replace(/-/g, '').toLowerCase());

  const users: GuideUser[] = [];
  for (let i = 0; i < keys.length; i += 4) {
    const batch = await Promise.all(keys.slice(i, i + 4).map((k) => getUserByKey(k)));
    users.push(...batch.filter((u): u is GuideUser => u !== null));
  }
  return users.sort((a, b) => (b.lastSeenAt ?? b.signedUpAt ?? '').localeCompare(a.lastSeenAt ?? a.signedUpAt ?? ''));
}
