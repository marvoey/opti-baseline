import type { MetadataRoute } from 'next';
import { requestOrigin } from '@/lib/siteHost';
import { AI_ANSWER_CRAWLERS, AI_TRAINING_CRAWLERS, ALLOW_AI_TRAINING, PRIVATE_PATHS } from '@/lib/seo';

/**
 * /robots.txt: one policy for everyone, written out explicitly for the AI crawlers so the
 * intent is visible (and editable in lib/seo.ts):
 *   - search engines and everyone else: allowed, except the private paths
 *   - AI answer / search crawlers (ChatGPT search, Claude search, Perplexity): allowed
 *   - AI training crawlers: blocked, unless ALLOW_AI_TRAINING is switched on
 * It also points crawlers at the sitemap on the host actually being served. The paid
 * landing pages are NOT blocked here: a crawler has to be able to fetch a page to see its
 * noindex meta tag, which is what keeps them out of search results.
 */

type Rule = { userAgent: string | string[]; allow?: string | string[]; disallow?: string | string[] };

export default async function robots(): Promise<MetadataRoute.Robots> {
  const origin = await requestOrigin();

  const rules: Rule[] = [
    { userAgent: '*', allow: '/', disallow: PRIVATE_PATHS },
    { userAgent: AI_ANSWER_CRAWLERS, allow: '/', disallow: PRIVATE_PATHS },
  ];
  if (!ALLOW_AI_TRAINING) rules.push({ userAgent: AI_TRAINING_CRAWLERS, disallow: '/' });

  return {
    rules,
    ...(origin ? { sitemap: new URL('/sitemap.xml', origin).toString() } : {}),
  };
}
