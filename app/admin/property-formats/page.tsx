import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { fetchCmsPropertyFormats } from '@/lib/cms/propertyFormats';

export const metadata: Metadata = {
  title: 'Property Formats · Admin',
  description: 'Property formats registered in the Optimizely CMS.',
};

// CMS data — don't cache at build time.
export const dynamic = 'force-dynamic';

/**
 * /admin/property-formats — a read-only view of GET /v1/propertyformats, the
 * live list of semantic `format` values (e.g. `selectMany`, `LinkCollection`)
 * a content type property can reference. This isn't documented or enumerated
 * in @optimizely/cms-sdk or @optimizely/cms-cli — both treat `format` as an
 * opaque string — so the CMS itself is the only source of truth for it.
 */
export default async function PropertyFormatsPage() {
  const result = await fetchCmsPropertyFormats();

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <Link
        href="/admin"
        className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-slate-900"
      >
        <ChevronLeft size={16} />
        Content types
      </Link>

      <header className="mb-10 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Property Formats</h1>
        <p className="mt-2 text-slate-600">
          {result.ok
            ? `${result.formats.length} format${result.formats.length === 1 ? '' : 's'} registered in the CMS.`
            : 'Semantic formats a property’s `format` string can reference.'}
        </p>
      </header>

      {!result.ok ? (
        <div
          className={`rounded-2xl border p-6 ${
            result.reason === 'missing-credentials'
              ? 'border-amber-200 bg-amber-50 text-amber-800'
              : 'border-red-200 bg-red-50 text-red-800'
          }`}
        >
          <p className="font-medium">
            {result.reason === 'missing-credentials'
              ? 'CMS credentials not configured'
              : 'Could not load property formats from the CMS'}
          </p>
          <p className="mt-1 text-sm">{result.message}</p>
        </div>
      ) : result.formats.length > 0 ? (
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400">
              <th className="py-2 pr-4 font-medium">Key</th>
              <th className="py-2 pr-4 font-medium">Display name</th>
              <th className="py-2 pr-4 font-medium">Data type</th>
              <th className="py-2 font-medium">Item type</th>
            </tr>
          </thead>
          <tbody>
            {result.formats
              .slice()
              .sort((a, b) => a.key.localeCompare(b.key))
              .map((f) => (
                <tr key={f.key} className="border-b border-slate-100 last:border-0">
                  <td className="py-2 pr-4 align-top font-mono text-slate-900">{f.key}</td>
                  <td className="py-2 pr-4 align-top text-slate-600">{f.displayName ?? '—'}</td>
                  <td className="py-2 pr-4 align-top font-mono text-xs text-slate-600">{f.dataType}</td>
                  <td className="py-2 align-top font-mono text-xs text-slate-600">{f.itemType ?? '—'}</td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <p className="text-sm italic text-slate-400">No property formats registered.</p>
      )}
    </main>
  );
}
