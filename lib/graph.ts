/**
 * Minimal server-side Optimizely Graph client for lookups the SDK doesn't
 * expose: metadata-only tree queries (the header nav) and fields that aren't
 * part of a content type's SDK definition (e.g. the `ogimage` property on
 * BlankExperience, see lib/ogImage.ts).
 *
 * Plain `fetch` with Next's data cache. Callers choose how long a response is
 * cached (`revalidate`, in seconds) and may tag it so `revalidateTag()` can
 * refresh it on demand, e.g. from a publish webhook.
 */
import { requireEnv } from '@/lib/env';

const DEFAULT_GATEWAY = 'https://cg.optimizely.com/content/v2';

export type GraphCacheOptions = {
  /** Seconds before Next revalidates the cached response. */
  revalidate: number;
  /** Cache tags, for `revalidateTag()`. */
  tags?: string[];
};

/** POST a GraphQL query to Optimizely Graph and return its `data`. Throws on HTTP or GraphQL errors. */
export async function graphQuery<T>(
  query: string,
  variables: Record<string, unknown>,
  options: GraphCacheOptions,
): Promise<T> {
  const env = requireEnv();
  const base = env.OPTIMIZELY_GRAPH_GATEWAY?.trim() || DEFAULT_GATEWAY;
  const res = await fetch(`${base}?auth=${encodeURIComponent(env.OPTIMIZELY_GRAPH_SINGLE_KEY)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: options.revalidate, tags: options.tags },
  });
  if (!res.ok) throw new Error(`Graph responded ${res.status}`);

  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join('; '));
  if (!json.data) throw new Error('Graph returned no data');
  return json.data;
}
