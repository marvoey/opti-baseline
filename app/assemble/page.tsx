import type { Metadata } from 'next';
import { INTENT } from '@/lib/cms/taxonomy';
import { PERMUTATIONS } from '@/lib/cms/permutations';
import { AssembleWizard } from './_components/AssembleWizard';

export const metadata: Metadata = { title: 'Page Assembly' };

function toOpts(map: Record<string, { displayName: string }>) {
  return Object.entries(map).map(([value, { displayName }]) => ({ value, displayName }));
}

export default function AssemblePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Page Assembly
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Select an audience profile to automatically assemble a CMS page from matching content
            blocks in Optimizely Graph.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <AssembleWizard
          intents={toOpts(INTENT)}
          permutations={PERMUTATIONS}
        />
      </main>
    </div>
  );
}
