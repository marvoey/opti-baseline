import type { Metadata } from 'next';
import { Suspense } from 'react';
import { registeredContentTypes } from '@/cms/registry';
import { fetchContent } from './_lib/fetchContent';
import ContentSearchClient from './_components/ContentSearchClient';

export const metadata: Metadata = {
  title: 'Content Items · Admin',
  description: 'Search and filter published content items across the Optimizely CMS.',
};

export const dynamic = 'force-dynamic';

type SearchParams = {
  q?: string;
  contentType?: string;
  locale?: string;
  status?: string;
  sort?: string;
  page?: string;
};

type Props = { searchParams: Promise<SearchParams> };

export default async function ContentSearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const page   = Math.max(1, parseInt(params.page ?? '1', 10) || 1);

  const result = await fetchContent({
    q:           params.q,
    contentType: params.contentType,
    locale:      params.locale,
    status:      params.status,
    sort:        params.sort as Parameters<typeof fetchContent>[0]['sort'],
    page,
  });

  // Build the type filter options from registered types, sorted alphabetically.
  const contentTypeOptions = (registeredContentTypes as unknown as { key: string }[])
    .map(ct => ct.key)
    .sort();

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <header className="mb-10 border-b border-slate-200 pb-6">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Content Items</h1>
            <p className="mt-2 text-slate-600">
              Search and filter all published content across the CMS.
            </p>
          </div>
          <a
            href="/admin"
            className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
          >
            ← Content Types
          </a>
        </div>
      </header>

      {result.error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-medium">Could not load content items</p>
          <p className="mt-1 font-mono text-xs text-red-600">{result.error}</p>
        </div>
      )}

      <Suspense>
        <ContentSearchClient initial={result} contentTypes={contentTypeOptions} />
      </Suspense>
    </main>
  );
}
