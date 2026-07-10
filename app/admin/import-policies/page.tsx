import type { Metadata } from 'next';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import Link from 'next/link';
import { checkCredentials } from './actions';
import type { PolicyBlock } from './actions';
import ImportDashboard from './_components/ImportDashboard';

export const metadata: Metadata = { title: 'Import Policies · Admin' };
export const dynamic = 'force-dynamic';

export default async function ImportPoliciesPage() {
  const [raw, credentialsAvailable] = await Promise.all([
    readFile(
      join(process.cwd(), 'app', '[locale]', 'kb-workspace', '_data', 'policies.json'),
      'utf8',
    ),
    checkCredentials(),
  ]);

  const { blocks } = JSON.parse(raw) as { blocks: PolicyBlock[] };

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <header className="mb-10 border-b border-slate-200 pb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Policy Content Import
          </h1>
          <p className="mt-2 text-slate-500">
            {blocks.length} blocks from{' '}
            <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">
              policies.json
            </code>{' '}
            ready to import into Optimizely CMS.
          </p>
        </div>
        <Link
          href="/admin/policies-report"
          className="shrink-0 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
        >
          View Report →
        </Link>
      </header>

      {!credentialsAvailable && (
        <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-5">
          <p className="font-semibold text-amber-900">CMS credentials not configured</p>
          <p className="mt-1 text-sm text-amber-800">
            Set{' '}
            <code className="font-mono text-xs">OPTIMIZELY_CMS_CLIENT_ID</code> and{' '}
            <code className="font-mono text-xs">OPTIMIZELY_CMS_CLIENT_SECRET</code> in{' '}
            <code className="font-mono text-xs">.env</code> to enable importing.
          </p>
        </div>
      )}

      <ImportDashboard blocks={blocks} credentialsAvailable={credentialsAvailable} />
    </main>
  );
}
