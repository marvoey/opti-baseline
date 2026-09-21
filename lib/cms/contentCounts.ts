/**
 * Item counts per content type, from Optimizely Graph (not the Management API
 * — that only describes schemas, not instances). Scoped to this site's host
 * via `_metadata.url.base`, the same field `getContentByPath({ host })` uses
 * (see lib/siteHost.ts), so counts match "this site" rather than the whole
 * multi-site CMS instance. `total(all: true)` counts items of any publish
 * status, not just published.
 */

import { getClient } from '@optimizely/cms-sdk';
import { siteOrigin } from '@/lib/siteHost';

export type ContentTypeCounts = Record<string, number | null>;

/**
 * One batched query for every key, using positional aliases (t0, t1, ...)
 * rather than the key itself — keys can contain characters that aren't valid
 * GraphQL alias names (e.g. "graph:cmp_Tag").
 */
function buildCountsQuery(keys: string[]): string {
  const fields = keys
    .map(
      (key, i) =>
        `t${i}: _Content(where: { _metadata: { types: { eq: ${JSON.stringify(key)} }, url: { base: { eq: $host } } } }) { total(all: true) }`,
    )
    .join('\n  ');
  return `query ContentTypeCounts($host: String) {\n  ${fields}\n}`;
}

/**
 * Fetch item counts for the given content-type keys in a single Graph request.
 * Fails soft: if the request errors, every key maps to `null` rather than
 * throwing, so a Graph hiccup degrades individual counts instead of the page.
 */
export async function fetchContentTypeCounts(keys: string[]): Promise<ContentTypeCounts> {
  if (keys.length === 0) return {};

  try {
    const host = await siteOrigin();
    const query = buildCountsQuery(keys);
    const data = await getClient().request(query, { host });

    const counts: ContentTypeCounts = {};
    keys.forEach((key, i) => {
      counts[key] = data?.[`t${i}`]?.total ?? null;
    });
    return counts;
  } catch {
    return Object.fromEntries(keys.map((k) => [k, null]));
  }
}
