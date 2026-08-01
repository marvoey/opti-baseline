import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchCmsItems } from './actions';
import CmsItemsTable from './_components/CmsItemsTable';

export const metadata: Metadata = { title: 'Copy Types · Admin' };
export const dynamic = 'force-dynamic';

export default async function CopyTypesPage() {
  const result = await fetchCmsItems();

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <header className="mb-10 flex items-start justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">CMS Copy Types</h1>
          <p className="mt-2 text-slate-500">
            Published content items across all four copy type categories.
          </p>
        </div>
        <Link
          href="/admin/create-content"
          className="shrink-0 rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
        >
          + Create Item
        </Link>
      </header>

      {!result.ok ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5">
          <p className="font-semibold text-red-900">Could not load CMS content</p>
          <p className="mt-1 text-sm text-red-700">{result.message}</p>
          <p className="mt-3 text-xs text-red-600">
            Ensure <code className="font-mono">OPTIMIZELY_GRAPH_SINGLE_KEY</code> is set in{' '}
            <code className="font-mono">.env</code>.
          </p>
        </div>
      ) : (
        <CmsItemsTable items={result.items} />
      )}
    </main>
  );
}
