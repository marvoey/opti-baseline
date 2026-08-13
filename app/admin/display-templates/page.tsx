import type { Metadata } from 'next';
import { fetchCmsDisplayTemplates } from '@/lib/cms/displayTemplates';
import DisplayTemplateExplorer from './_components/DisplayTemplateExplorer';

export const metadata: Metadata = {
  title: 'Display Templates · Admin',
  description: 'Display templates defined in the Optimizely CMS.',
};

export const dynamic = 'force-dynamic';

export default async function DisplayTemplatesPage() {
  const result = await fetchCmsDisplayTemplates();

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <header className="mb-10 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Display Templates</h1>
        <p className="mt-2 text-slate-600">
          {result.ok
            ? `${result.templates.length} template${result.templates.length === 1 ? '' : 's'} in the CMS.`
            : 'Templates defined in the CMS.'}
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
              : 'Could not load display templates from the CMS'}
          </p>
          <p className="mt-1 text-sm">{result.message}</p>
        </div>
      ) : (
        <DisplayTemplateExplorer templates={result.templates} />
      )}
    </main>
  );
}
