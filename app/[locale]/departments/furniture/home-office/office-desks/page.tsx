import { cache } from 'react';
import type { Metadata } from 'next';
import { getClient } from '@optimizely/cms-sdk';
import { OptimizelyComponent, withAppContext } from '@optimizely/cms-sdk/react/server';
import { DEFAULT_LOCALE } from '@/lib/locales';
import { siteOrigin } from '@/lib/siteHost';
import { siteConfig } from '@/lib/siteConfig';
import OfficeDesksPLPPage from './OfficeDesksPLPPage';

type Props = {
  params: Promise<{ locale: string }>;
};

const PATH_SEGMENTS = ['departments', 'furniture', 'home-office', 'office-desks'];

const loadContent = cache(async (locale: string) => {
  const cleanPath = `/${PATH_SEGMENTS.join('/')}/`;
  const isDefault = locale === DEFAULT_LOCALE;
  const prefixedPath = `/${locale}${cleanPath}`;
  const path = isDefault ? cleanPath : prefixedPath;

  const client = getClient();
  const host = await siteOrigin();
  let content = await client.getContentByPath(path, { host });

  if (!content?.[0]) {
    content = await client.getContentByPath(isDefault ? prefixedPath : cleanPath, { host });
  }
  return content?.[0];
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const content = await loadContent(locale);
  const item = content as { MetaTitle?: string; _metadata?: { displayName?: string } } | undefined;
  const pageTitle = item?.MetaTitle || item?._metadata?.displayName;
  return {
    title: pageTitle ? `${pageTitle} | ${siteConfig.name}` : siteConfig.title,
  };
}

async function Page({ params }: Props) {
  const { locale } = await params;
  const content = await loadContent(locale);

  // CMS wins whenever content is published at this path.
  if (content) return <OptimizelyComponent content={content} />;

  // Fallback while CMS content is not yet published.
  return <OfficeDesksPLPPage />;
}

export default withAppContext(Page);
