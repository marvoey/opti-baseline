import { DEFAULT_LOCALE, LOCALES } from '@/lib/locales';
import { absoluteUrl, getIndexablePages, type SitePage } from '@/lib/seo';
import { siteConfig } from '@/lib/siteConfig';
import { requestOrigin } from '@/lib/siteHost';
import { getSiteSettings } from '@/lib/siteSettings';

/**
 * /llms.txt: a plain-text, Markdown-style guide to the site for AI assistants and answer
 * engines (the llmstxt.org convention): who we are, then the pages worth reading, with a
 * one-line description each. Generated from the same CMS page list as the sitemap, so it
 * stays current without anyone editing it.
 */

const link = (page: SitePage, origin: string) =>
  `- [${page.title}](${absoluteUrl(page.path, origin)})${page.description ? `: ${page.description}` : ''}`;

export async function GET() {
  const origin = (await requestOrigin())?.origin;
  if (!origin) return new Response('Not found', { status: 404 });

  const [pages, settings] = await Promise.all([getIndexablePages(origin), getSiteSettings()]);

  const main = pages.filter((p) => p.locale === DEFAULT_LOCALE);
  const home = main.find((p) => p.path === '/');
  const sections = main.filter((p) => p !== home);

  const lines: string[] = [`# ${siteConfig.name}`, '', `> ${siteConfig.description}`, ''];

  lines.push('## Plans and coverage', ...sections.map((p) => link(p, origin)), '');
  if (home) lines.push('## Home page', link(home, origin), '');

  for (const locale of LOCALES.filter((l) => l.key !== DEFAULT_LOCALE)) {
    const translated = pages.filter((p) => p.locale === locale.key);
    if (translated.length) lines.push(`## ${locale.displayName}`, ...translated.map((p) => link(p, origin)), '');
  }

  lines.push('## Contact', `- Speak with a licensed insurance agent: ${settings.phone.label}`, '');

  return new Response(lines.join('\n'), {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
