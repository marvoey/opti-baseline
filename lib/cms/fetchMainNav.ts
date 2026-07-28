import { cache } from 'react';
import { getClient } from '@optimizely/cms-sdk';
import { siteOrigin } from '@/lib/siteHost';
import { siteConfig } from '@/lib/siteConfig';

const QUERY = `
  query GetMainNav($host: String) {
    MainNav(
      where: {
        MainNavLinks: {
          url: {
            base: {
              eq: $host}}}
        }
      }
      locale: $locale
      limit: 1
    ) {
      items {
        ... on MainNav {
          MainNavLinks { text default }
        }
      }
    }
  }
`;

export type MainNavLink = { text?: string | null; default?: string | null };

const fallback: MainNavLink[] = siteConfig.mainNavLinks.map((l) => ({ text: l.label, default: l.href }));

export const fetchMainNav = cache(async (locale = 'en'): Promise<MainNavLink[]> => {
  try {
    const host = await siteOrigin();
    const data = await getClient().request(QUERY, { locale: [locale], host });
    const links: MainNavLink[] | null = data?._Content?.items?.[0]?.MainNavLinks ?? null;
    return links?.length ? links : fallback;
  } catch {
    return fallback;
  }
});
