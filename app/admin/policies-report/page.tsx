import type { Metadata } from 'next';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import Link from 'next/link';
import { fetchPoliciesReport } from './actions';
import { COPY_TYPES, type LocalBlock } from './_lib/constants';
import ReportTable from './_components/ReportTable';

export const metadata: Metadata = { title: 'Policies Report · Admin' };
export const dynamic = 'force-dynamic';

export default async function PoliciesReportPage() {
  const raw = await readFile(
    join(process.cwd(), 'app', '[locale]', 'kb-workspace', '_data', 'policies.json'),
    'utf8',
  );
  const { blocks } = JSON.parse(raw) as { blocks: LocalBlock[] };

  const result = await fetchPoliciesReport(blocks);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <header className="mb-10 border-b border-slate-200 pb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Policies Report</h1>
          <p className="mt-2 text-slate-500">
            Publish status for all {blocks.length} policy blocks across Optimizely CMS.
          </p>
        </div>
        <Link
          href="/admin/import-policies"
          className="shrink-0 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
        >
          ← Import Dashboard
        </Link>
      </header>

      {!result.ok ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5">
          <p className="font-semibold text-red-900">Could not load report</p>
          <p className="mt-1 text-sm text-red-700">{result.message}</p>
          <p className="mt-3 text-xs text-red-600">
            Ensure <code className="font-mono">OPTIMIZELY_GRAPH_SINGLE_KEY</code> is set in{' '}
            <code className="font-mono">.env</code>.
          </p>
        </div>
      ) : (
        <ReportTable items={result.items} copyTypes={COPY_TYPES} />
      )}
    </main>
  );
}
