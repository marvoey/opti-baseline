import { getClient } from '@optimizely/cms-sdk';

export const PAGE_SIZE = 20;

export type ContentItem = {
  __typename: string;
  _metadata?: {
    displayName?: string | null;
    types?: string[] | null;
    url?: { default?: string | null } | null;
    published?: string | null;
    status?: string | null;
    locale?: string | null;
  };
};

export type ContentSearchResult = {
  items: ContentItem[];
  total: number;
  page: number;
  pageSize: number;
  error?: string;
};

export type ContentSearchParams = {
  q?: string;
  contentType?: string;
  locale?: string;
  status?: string;
  sort?: 'published_desc' | 'published_asc' | 'name_asc' | 'name_desc';
  page?: number;
};

function escape(s: string) {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function buildWhere(params: ContentSearchParams): string {
  const clauses: string[] = [];

  if (params.q?.trim()) {
    clauses.push(`{ _metadata: { displayName: { contains: "${escape(params.q.trim())}" } } }`);
  }
  if (params.contentType) {
    clauses.push(`{ _metadata: { types: { in: ["${escape(params.contentType)}"] } } }`);
  }
  if (params.status === 'published') {
    clauses.push(`{ _metadata: { status: { eq: "Published" } } }`);
  } else if (params.status === 'draft') {
    clauses.push(`{ _metadata: { status: { in: ["CheckedIn", "CheckedOut"] } } }`);
  }

  if (clauses.length === 0) return '';
  if (clauses.length === 1) return `where: ${clauses[0]}`;
  return `where: { _and: [${clauses.join(', ')}] }`;
}

function buildOrderBy(sort: ContentSearchParams['sort'] = 'published_desc'): string {
  switch (sort) {
    case 'published_asc':  return 'orderBy: { _metadata: { published: ASC } }';
    case 'name_asc':       return 'orderBy: { _metadata: { displayName: ASC } }';
    case 'name_desc':      return 'orderBy: { _metadata: { displayName: DESC } }';
    default:               return 'orderBy: { _metadata: { published: DESC } }';
  }
}

export async function fetchContent(params: ContentSearchParams = {}): Promise<ContentSearchResult> {
  const page    = Math.max(1, params.page ?? 1);
  const skip    = (page - 1) * PAGE_SIZE;
  const where   = buildWhere(params);
  const orderBy = buildOrderBy(params.sort);
  const locale  = params.locale ? `locale: [${params.locale}]` : '';

  const query = `
    {
      _Content(
        ${where}
        ${locale}
        ${orderBy}
        limit: ${PAGE_SIZE}
        skip: ${skip}
      ) {
        total
        items {
          __typename
          _metadata {
            displayName
            types
            url { default }
            published
            status
            locale
          }
        }
      }
    }
  `;

  try {
    const data = await getClient().request(query, {});
    return {
      items:    (data?._Content?.items ?? []) as ContentItem[],
      total:    data?._Content?.total ?? 0,
      page,
      pageSize: PAGE_SIZE,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[content-search] GraphQL error:', msg);
    return { items: [], total: 0, page, pageSize: PAGE_SIZE, error: msg };
  }
}
