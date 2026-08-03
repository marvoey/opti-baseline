import type { Metadata } from 'next';
import { fetchSiteFolder, type FolderWithChildren } from '@/lib/cms/fetchSiteFolders';
import { siteOrigin } from '@/lib/siteHost';
import CopyableId from './_components/CopyableId';

export const metadata: Metadata = {
  title: 'CMS Admin',
};

export const dynamic = 'force-dynamic';

function FolderRow({ folder, depth = 0 }: { folder: FolderWithChildren; depth?: number }) {
  const pl = 5 + depth * 5;
  return (
    <>
      <div
        className="flex items-center justify-between gap-4 border-b border-slate-100 py-3 text-sm last:border-0 dark:border-slate-700"
        style={{ paddingLeft: `${pl * 0.25}rem`, paddingRight: '1.25rem' }}
      >
        <span
          className={
            depth === 0
              ? 'font-medium text-slate-900 dark:text-slate-100'
              : depth === 1
                ? 'text-slate-700 dark:text-slate-300'
                : 'text-slate-500 dark:text-slate-400'
          }
        >
          {folder.displayName}
        </span>
        <CopyableId id={folder.key} />
      </div>
      {folder.children.map((child) => (
        <FolderRow key={child.key} folder={child} depth={depth + 1} />
      ))}
    </>
  );
}

export default async function CmsAdminPage() {
  const base = (await siteOrigin()) ?? '';
  const result = await fetchSiteFolder(base);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
            CMS Admin
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Internal administration tools and CMS folder structure.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Site Folder
          </h2>

          {result.ok ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <FolderRow folder={result.folder} />
            </div>
          ) : (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm dark:border-amber-800 dark:bg-amber-950">
              <p className="font-medium text-amber-800 dark:text-amber-300">Folder not found</p>
              <p className="mt-1 font-mono text-xs text-amber-700 dark:text-amber-400">{result.error}</p>
              <p className="mt-2 text-xs text-amber-600 dark:text-amber-500">
                base: <code className="font-mono">{base}</code>
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
