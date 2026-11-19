/**
 * Technical-SEO building blocks shared by app/sitemap.ts, app/robots.ts and
 * app/llms.txt/route.ts.
 *
 * The page list comes straight from Optimizely Graph: every published BlankExperience in
 * every enabled language under the site's start page (siteConfig.nav.rootKey). Scoping by
 * the content-tree root (not just the host) matters because other demo sites are indexed
 * under the same hostname. Editors never maintain a sitemap by hand: publishing a page
 * adds it (within the cache window below), unpublishing removes it, and a page whose
 * Robots Directives say "noindex" (the paid landing pages) is left out.
 */
import { graphQuery } from '@/lib/graph';
import { LOCALES, publicPath } from '@/lib/locales';
import { parseRobots } from '@/lib/pageMeta';
import { siteConfig } from '@/lib/siteConfig';

// --- Crawler policy (robots.txt) ---------------------------------------------------------

/** Never crawled by anyone: the CMS preview, the admin tool, the API routes and the internal /demo pages. */
export const PRIVATE_PATHS = ['/admin/', '/api/', '/preview/', '/demo/'];

/**
 * AI crawlers that fetch pages to answer a person's question or to build an answer-engine
 * index. Allowed, so eHealth can be cited in AI answers. Vendors add and rename agents, so
 * review this list now and then.
 */
export const AI_ANSWER_CRAWLERS = [
  'OAI-SearchBot',
  'ChatGPT-User',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
];

/** AI crawlers that collect content to train models. Blocked unless ALLOW_AI_TRAINING is switched on. */
export const AI_TRAINING_CRAWLERS = [
  'GPTBot',
  'ClaudeBot',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
  'Bytespider',
  'Meta-ExternalAgent',
];

/**
 * The one switch for the training-crawler policy. A business decision for eHealth (legal and
 * brand teams), so it is deliberately a single visible constant.
 */
export const ALLOW_AI_TRAINING = false;

// --- Page list (sitemap.xml, llms.txt) ---------------------------------------------------

export type SitePage = {
  key: string;
  /** Locale key, e.g. "en" or "es". */
  locale: string;
  /** Public path: no trailing slash, default locale unprefixed ("/medicare", "/es"). */
  path: string;
  /** The page's Meta Title, else its CMS name. */
  title: string;
  description: string | null;
  lastModified: string | null;
  /** False when the page's Robots Directives say noindex. */
  indexable: boolean;
  /** The editor's Canonical URL override, if any. */
  canonical: string | null;
};

type Row = {
  MetaTitle: string | null;
  MetaDescription: string | null;
  RobotsDirectives: string | null;
  CanonicalUrl: { default: string | null } | null;
  _metadata: {
    key: string | null;
    locale: string | null;
    displayName: string | null;
    lastModified: string | null;
    url: { default: string | null } | null;
  };
};

type Result = { BlankExperience: { items: Row[] } | null };

/** Short, so a publish shows up in the sitemap within a minute or so; `revalidateTag('sitemap')` forces it. */
const REVALIDATE_SECONDS = 60;
/** Graph's maximum page size. */
const GRAPH_MAX_LIMIT = 100;

const QUERY = `
  query SitePages($root: String!, $locales: [String!], $limit: Int!) {
    BlankExperience(
      where: { _metadata: { path: { eq: $root }, status: { eq: "Published" }, locale: { in: $locales } } }
      orderBy: { _metadata: { sortOrder: ASC } }
      limit: $limit
    ) {
      items {
        MetaTitle MetaDescription RobotsDirectives
        CanonicalUrl { default }
        _metadata { key locale displayName lastModified url { default } }
      }
    }
  }`;

const clean = (value: string | null | undefined) => value?.trim() || null;

/**
 * Every published page of the site, in every language, in content-tree order. Throws when
 * Graph can't be reached: for a sitemap an error (crawlers retry) is better than an empty
 * list (crawlers could read it as "the whole site was removed").
 */
export async function getSitePages(): Promise<SitePage[]> {
  const data = await graphQuery<Result>(
    QUERY,
    { root: siteConfig.nav.rootKey, locales: LOCALES.map((l) => l.key), limit: GRAPH_MAX_LIMIT },
    { revalidate: REVALIDATE_SECONDS, tags: ['sitemap'] },
  );

  const pages: SitePage[] = [];
  for (const row of data.BlankExperience?.items ?? []) {
    const { key, locale, displayName, lastModified, url } = row._metadata;
    const href = clean(url?.default);
    if (!key || !locale || !href) continue;
    pages.push({
      key,
      locale,
      path: publicPath(href, locale),
      title: clean(row.MetaTitle) ?? clean(displayName) ?? siteConfig.name,
      description: clean(row.MetaDescription),
      lastModified: clean(lastModified),
      indexable: parseRobots(row.RobotsDirectives)?.index !== false,
      canonical: clean(row.CanonicalUrl?.default),
    });
  }
  return pages;
}

/** Absolute URL for a public path on this origin ("/" stays "/", "/medicare" stays without a slash). */
export function absoluteUrl(path: string, origin: string): string {
  return new URL(path, origin).toString();
}

/** True when the page's Canonical URL override points at a different URL (so it must not be listed). */
function canonicalElsewhere(page: SitePage, origin: string): boolean {
  if (!page.canonical) return false;
  try {
    const norm = (u: URL) => `${u.host}${u.pathname.replace(/\/+$/, '')}`;
    return norm(new URL(page.canonical, origin)) !== norm(new URL(page.path, origin));
  } catch {
    return false;
  }
}

/** The pages that belong in the sitemap and llms.txt: indexable, and canonical to themselves. */
export async function getIndexablePages(origin: string): Promise<SitePage[]> {
  const pages = await getSitePages();
  return pages.filter((page) => page.indexable && !canonicalElsewhere(page, origin));
}
