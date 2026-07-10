/**
 * Fetch CMS content folders from Optimizely Content Graph.
 *
 * Uses the read-only single key (epi-single auth) — no OAuth token exchange.
 * Fails soft: callers receive a typed result rather than a thrown error.
 */

const DEFAULT_GRAPH_GATEWAY = 'https://cg.optimizely.com/content/v2';

const FOLDERS_QUERY = `{
  SysContentFolder(limit: 100) {
    items {
      _metadata {
        key
        displayName
        url {
          hierarchical
        }
      }
    }
  }
}`;

export type CmsFolder = {
  key: string;
  displayName: string;
  /** Hierarchical path, e.g. "/Content/Policy Blocks/". Null when absent. */
  path: string | null;
};

export type ListFoldersResult =
  | { ok: true; folders: CmsFolder[] }
  | { ok: false; reason: 'missing-key' | 'error'; message: string };

export async function listFolders(): Promise<ListFoldersResult> {
  const singleKey = process.env.OPTIMIZELY_GRAPH_SINGLE_KEY?.trim();
  if (!singleKey) {
    return {
      ok: false,
      reason: 'missing-key',
      message: 'OPTIMIZELY_GRAPH_SINGLE_KEY is not configured.',
    };
  }

  const gateway = (
    process.env.OPTIMIZELY_GRAPH_GATEWAY?.trim() || DEFAULT_GRAPH_GATEWAY
  ).replace(/\/$/, '');

  try {
    const res = await fetch(gateway, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `epi-single ${singleKey}`,
      },
      body: JSON.stringify({ query: FOLDERS_QUERY }),
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Graph request failed (${res.status} ${res.statusText})`);
    }

    const json = (await res.json()) as {
      data?: {
        SysContentFolder?: {
          items?: Array<{
            _metadata?: {
              key?: string | null;
              displayName?: string | null;
              url?: { hierarchical?: string | null } | null;
            } | null;
          } | null> | null;
        } | null;
      } | null;
      errors?: Array<{ message: string }>;
    };

    if (json.errors?.length) {
      throw new Error(json.errors.map(e => e.message).join('; '));
    }

    const raw = json.data?.SysContentFolder?.items ?? [];

    const folders: CmsFolder[] = raw
      .flatMap(item => {
        const meta = item?._metadata;
        if (!meta?.key) return [];
        return [
          {
            key: meta.key,
            displayName: meta.displayName || meta.key,
            path: meta.url?.hierarchical ?? null,
          },
        ];
      })
      .sort((a, b) => {
        // Shallower paths first, then alphabetical within depth
        const depthA = a.path ? a.path.split('/').filter(Boolean).length : 0;
        const depthB = b.path ? b.path.split('/').filter(Boolean).length : 0;
        if (depthA !== depthB) return depthA - depthB;
        return a.displayName.localeCompare(b.displayName);
      });

    return { ok: true, folders };
  } catch (err) {
    return {
      ok: false,
      reason: 'error',
      message: err instanceof Error ? err.message : String(err),
    };
  }
}
