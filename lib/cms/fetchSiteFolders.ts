import { getClient } from '@optimizely/cms-sdk';

const QUERY = `
  query SiteFolders($base: String!, $names: [String!]) {
    SysContentFolder(
      where: {
        _metadata: {
          url: { base: { eq: $base } }
          displayName: { in: $names }
        }
      }
    ) {
      items {
        _metadata {
          displayName
          key
          url { base }
        }
        _children {
          SysContentFolder {
            items {
              _metadata {
                displayName
                key
                url {
                  base
                }
              }
              _children {
                SysContentFolder {
                  items {
                    _metadata {
                      displayName
                      key
                      url { base }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export type FolderMeta = { key: string; displayName: string };
export type FolderWithChildren = FolderMeta & { children: FolderWithChildren[] };

type RawFolder = {
  _metadata?: { displayName?: string | null; key?: string | null; url?: { base?: string | null } | null } | null;
  _children?: {
    SysContentFolder?: {
      items?: Array<RawFolder | null> | null;
    } | null;
  } | null;
};

type QueryResult = {
  SysContentFolder?: { items?: Array<RawFolder | null> | null } | null;
};

export type FetchFolderResult =
  | { ok: true; folders: FolderWithChildren[] }
  | { ok: false; error: string };

function parseFolder(raw: RawFolder | null | undefined): FolderWithChildren | null {
  const key = raw?._metadata?.key;
  const displayName = raw?._metadata?.displayName;
  if (!key || !displayName) return null;
  const children = (raw._children?.SysContentFolder?.items ?? [])
    .flatMap((child) => { const f = parseFolder(child); return f ? [f] : []; });
  return { key, displayName, children };
}

/** Display names of the site folders to list. */
const FOLDER_NAMES = ['For This Application', 'SysSiteAssets'];

/** Returns the matching site folders (see FOLDER_NAMES) with their nested children. */
export async function fetchSiteFolder(base: string): Promise<FetchFolderResult> {
  try {
    const data = (await getClient().request(QUERY, { base, names: FOLDER_NAMES })) as QueryResult;
    const folders = (data?.SysContentFolder?.items ?? []).flatMap((raw) => {
      const f = parseFolder(raw);
      return f ? [f] : [];
    });
    if (folders.length === 0) return { ok: false, error: `No folder found for base: ${base}` };
    return { ok: true, folders };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
