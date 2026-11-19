/**
 * Content groups: the "Product line" and "Channel" categories, and the one Graph
 * query that answers "which pages belong to this group?" (RFI 5.2-5.4 and 5.10).
 *
 * The category tree is authored in the CMS (Settings > Categories) and editors tag
 * pages with it. Optimizely Graph indexes each assignment as a term URI on the item
 * (`_itemMetadata.categories`, for example cms://taxonomy/categories/<term key>), but
 * it does not index the parent/child links between terms. So the tree is mirrored
 * here, with the term keys the CMS assigned. A page tagged with a child term (Dental)
 * is found by filtering on its parent (Dental & Vision) because the parent filter
 * expands to the parent plus all of its descendants.
 *
 * Scoped two ways. The host (`_metadata.url.base`) matches how the catch-all page scopes
 * its lookups. The content tree (`_metadata.path` contains the site root) is what truly
 * isolates the site: other demos that share this Graph instance can be indexed under the
 * same host, but they do not live under eHealth Home.
 */
import { graphQuery } from '@/lib/graph';
import { DEFAULT_LOCALE } from '@/lib/locales';
import { siteConfig } from '@/lib/siteConfig';

export type GroupTerm = {
  /** URL-friendly id used in the /demo/groups query string. */
  slug: string;
  /** Term key assigned by the CMS. */
  key: string;
  label: string;
  children?: GroupTerm[];
};

export const PRODUCT_LINES: GroupTerm[] = [
  { slug: 'medicare', key: 'm5e85980bfa1486c87967ca65388635b', label: 'Medicare' },
  { slug: 'individual-family', key: 'h0dd748782ca424f8c17874c1e133ee5', label: 'Individual & Family' },
  { slug: 'small-business', key: 'nb293ebba4c144709ca00886b398b9b0', label: 'Small Business' },
  {
    slug: 'dental-vision',
    key: 'm3f47de5c02d4981ab43591ccaa5a15f',
    label: 'Dental & Vision',
    children: [
      { slug: 'dental', key: 'n02011c4432b405d9bfd159c97cf6832', label: 'Dental' },
      { slug: 'vision', key: 'c7217a4c9495458ea2c3fd2325d24821', label: 'Vision' },
    ],
  },
  { slug: 'short-term', key: 'g93e78256ba24b49a15244da28620ebc', label: 'Short-term' },
];

export const CHANNELS: GroupTerm[] = [
  { slug: 'paid', key: 'fd5534224a5140f8a172737fd9c40f0d', label: 'Paid' },
  { slug: 'organic', key: 'p070aa28bd074dd3be85baf2d1ad405e', label: 'Organic' },
];

const URI_PREFIX = 'cms://taxonomy/categories/';
const termUri = (term: GroupTerm) => `${URI_PREFIX}${term.key}`;

/** A term followed by all of its descendants. */
export function withDescendants(term: GroupTerm): GroupTerm[] {
  return [term, ...(term.children ?? []).flatMap(withDescendants)];
}

/** Every term in display order, each with its nesting depth. */
export function flattenTerms(terms: GroupTerm[], depth = 0): { term: GroupTerm; depth: number }[] {
  return terms.flatMap((term) => [{ term, depth }, ...flattenTerms(term.children ?? [], depth + 1)]);
}

export function findTerm(terms: GroupTerm[], slug: string | undefined): GroupTerm | undefined {
  return slug ? terms.flatMap(withDescendants).find((t) => t.slug === slug) : undefined;
}

export type CategoryLabel = { group: 'product' | 'channel'; label: string };

/** Readable label for a category URI on a page ("Dental & Vision > Dental"), or null for terms outside these two groups. */
export function describeCategory(uri: string): CategoryLabel | null {
  const walk = (terms: GroupTerm[], trail: string[]): string | null => {
    for (const term of terms) {
      if (termUri(term) === uri) return [...trail, term.label].join(' > ');
      const hit = walk(term.children ?? [], [...trail, term.label]);
      if (hit) return hit;
    }
    return null;
  };
  const product = walk(PRODUCT_LINES, []);
  if (product) return { group: 'product', label: product };
  const channel = walk(CHANNELS, []);
  return channel ? { group: 'channel', label: channel } : null;
}

export type GroupFilter = { product?: GroupTerm; channel?: GroupTerm };

/**
 * The GraphQL for a group. Only the clauses that were chosen are added, so what the
 * view shows is exactly what ran. Product and channel are ANDed; the terms inside one
 * group are ORed (the term and its descendants).
 */
export function buildGroupQuery(host: string, filter: GroupFilter) {
  const declarations = ['$host: String!', '$locale: String!', '$root: String!'];
  const clauses = [
    '{ _metadata: { status: { eq: "Published" }, locale: { eq: $locale }, url: { base: { eq: $host } }, path: { eq: $root } } }',
  ];
  const variables: Record<string, unknown> = { host, locale: DEFAULT_LOCALE, root: siteConfig.nav.rootKey };

  if (filter.product) {
    declarations.push('$product: [String!]');
    clauses.push('{ _itemMetadata: { categories: { in: $product } } }');
    variables.product = withDescendants(filter.product).map(termUri);
  }
  if (filter.channel) {
    declarations.push('$channel: [String!]');
    clauses.push('{ _itemMetadata: { categories: { in: $channel } } }');
    variables.channel = withDescendants(filter.channel).map(termUri);
  }

  const query = `query ContentGroup(${declarations.join(', ')}) {
  _Page(
    where: { _and: [
      ${clauses.join('\n      ')}
    ] }
    limit: 50
  ) {
    total
    items {
      _metadata { key displayName types url { default } }
      _itemMetadata { categories }
    }
  }
}`;

  return { query, variables };
}

type Row = {
  _metadata: {
    key: string | null;
    displayName: string | null;
    types: string[] | null;
    url: { default: string | null } | null;
  };
  _itemMetadata: { categories: string[] | null } | null;
};

export type GroupPage = {
  key: string;
  name: string;
  path: string;
  type: string;
  categories: string[];
};

function toPage(row: Row): GroupPage | null {
  const { key, displayName, types, url } = row._metadata;
  if (!key) return null;
  return {
    key,
    name: displayName?.trim() || key,
    path: url?.default || '/',
    type: types?.[0] ?? 'Page',
    categories: row._itemMetadata?.categories ?? [],
  };
}

/** Pages in a group, newest data within 30 seconds. `revalidateTag('groups')` refreshes it on demand. */
export async function fetchGroupPages(host: string, filter: GroupFilter) {
  const { query, variables } = buildGroupQuery(host, filter);
  const data = await graphQuery<{ _Page: { total: number; items: Row[] } }>(query, variables, {
    revalidate: 30,
    tags: ['groups'],
  });

  const seen = new Set<string>();
  const pages: GroupPage[] = [];
  for (const row of data._Page.items) {
    const page = toPage(row);
    if (!page || seen.has(page.key)) continue;
    seen.add(page.key);
    pages.push(page);
  }
  pages.sort((a, b) => a.path.localeCompare(b.path));
  return { total: data._Page.total, pages };
}
