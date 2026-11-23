import { contentType } from '@optimizely/cms-sdk';

/**
 * One colleague account for the /setup-guide page: login details, progress and visits.
 *
 * Privacy rules (all enforced by lib/guide/users.ts, which is the only code that writes these):
 *  - Every property has indexingType "disabled", so none of them exist in the Optimizely Graph
 *    schema and they can never be returned by a Graph query.
 *  - Records are created as drafts in the "Guide Users" asset folder and never published.
 *  - PasswordHash holds a salted scrypt hash (one-way). The password itself is never stored, so
 *    nobody with CMS access can read or recover it. To lock someone out, tick Disabled or clear
 *    PasswordHash: their session ends on their next request.
 *
 * Never rendered on the site: the component below renders nothing.
 */
export const GuideUserContentType = contentType({
  key: 'GuideUser',
  baseType: '_component',
  displayName: '[GUIDE] Setup Guide User',
  description: 'A colleague account for the /setup-guide page. Created by sign-up; do not publish.',
  properties: {
    Email: {
      type: 'string',
      displayName: 'Email',
      description: 'Work email, lower-case. Used to sign in.',
      indexingType: 'disabled',
      sortOrder: 1,
    },
    FullName: {
      type: 'string',
      displayName: 'Full name',
      indexingType: 'disabled',
      sortOrder: 2,
    },
    PasswordHash: {
      type: 'string',
      displayName: 'Password hash',
      description: 'Salted scrypt hash, never the password. Clear it to force the person out.',
      indexingType: 'disabled',
      sortOrder: 3,
    },
    Disabled: {
      type: 'boolean',
      displayName: 'Disabled',
      description: 'Tick to block this account. Takes effect on their next request.',
      indexingType: 'disabled',
      sortOrder: 4,
    },
    Progress: {
      type: 'string',
      displayName: 'Progress (JSON)',
      description: 'Ticked steps and chosen computer/shell, saved by the guide.',
      indexingType: 'disabled',
      sortOrder: 10,
    },
    ProgressPercent: {
      type: 'integer',
      displayName: 'Progress %',
      indexingType: 'disabled',
      minimum: 0,
      maximum: 100,
      sortOrder: 11,
    },
    PageViews: {
      type: 'integer',
      displayName: 'Page views',
      description: 'Every time the guide is opened or reloaded.',
      indexingType: 'disabled',
      sortOrder: 12,
    },
    Visits: {
      type: 'integer',
      displayName: 'Visits',
      description: 'Separate sessions: a view after at least 30 minutes of no activity.',
      indexingType: 'disabled',
      sortOrder: 13,
    },
    LastSeenAt: {
      type: 'string',
      displayName: 'Last seen (UTC, ISO 8601)',
      indexingType: 'disabled',
      sortOrder: 14,
    },
    SignedUpAt: {
      type: 'string',
      displayName: 'Signed up (UTC, ISO 8601)',
      indexingType: 'disabled',
      sortOrder: 15,
    },
    FailedLogins: {
      type: 'integer',
      displayName: 'Failed sign-ins in a row',
      indexingType: 'disabled',
      sortOrder: 20,
    },
    LockedUntil: {
      type: 'string',
      displayName: 'Locked until (UTC, ISO 8601)',
      description: 'Set after 5 wrong passwords in a row. Clear it to unlock early.',
      indexingType: 'disabled',
      sortOrder: 21,
    },
  },
});

/** Data-only type: nothing to render. */
export default function GuideUser() {
  return null;
}
