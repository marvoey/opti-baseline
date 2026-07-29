import { cache } from 'react';
import { getClient } from '@optimizely/cms-sdk';
import { siteConfig } from '@/lib/siteConfig';

const QUERY = `
  query GetMainNav {
    MainNav(limit: 1) {
      items {
        ... on MainNav {
          MainNavLinks { text url { default } }
        }
      }
    }
  }
`;

export type MainNavLink = { text?: string | null; url?: { default?: string | null } | null };

const fallback: MainNavLink[] = siteConfig.mainNavLinks.map((l) => ({ text: l.label, url: { default: l.href } }));

export const fetchMainNav = cache(async (): Promise<MainNavLink[]> => {
  try {
    const data = await getClient().request(QUERY, undefined);
    const links: MainNavLink[] | null = data?.MainNav?.items?.[0]?.MainNavLinks ?? null;
    return links?.length ? links : fallback;
  } catch {
    return fallback;
  }
});
