import { cache } from 'react';
import { getClient } from '@optimizely/cms-sdk';
import { DEFAULT_LOCALE } from '@/lib/locales';
import { siteOrigin } from '@/lib/siteHost';
import KbWorkspaceShell, { type KbCmsContent } from './_KbWorkspaceShell';

type Props = {
  params: Promise<{ locale: string; slug?: string[] }>;
};

const loadKbContent = cache(async (locale: string, slug: string[]) => {
  const subPath = slug.join('/');
  const cleanPath = subPath ? `/kb-workspace/${subPath}/` : '/kb-workspace/';
  const isDefault = locale === DEFAULT_LOCALE;
  const prefixedPath = `/${locale}${cleanPath}`;
  const path = isDefault ? cleanPath : prefixedPath;

  try {
    const client = getClient();
    const host = await siteOrigin();
    let result = await client.getContentByPath(path, { host });
    if (!result?.[0] && isDefault) {
      result = await client.getContentByPath(prefixedPath, { host });
    }
    return (result?.[0] ?? null) as KbCmsContent | null;
  } catch {
    return null;
  }
});

export default async function Page({ params }: Props) {
  const { locale, slug = [] } = await params;
  const content = await loadKbContent(locale, slug);
  return <KbWorkspaceShell cmsContent={content} />;
}
