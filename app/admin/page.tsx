import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { registeredContentTypes } from '@/cms/registry';
import { fetchCmsContentTypes, type CmsContentType } from '@/lib/cms/contentTypes';
import { baseTypeLabel, orderBaseTypes } from './_lib/display';
import ContentTypeExplorer, {
  type ExplorerGroup,
  type ExplorerType,
} from './_components/ContentTypeExplorer';

export const metadata: Metadata = {
  title: 'Content Types · Admin',
  description: 'Content types defined in the Optimizely CMS.',
};

// Admin data is environment-specific and shouldn't be cached at build time.
export const dynamic = 'force-dynamic';

/**
 * /admin — a read-only inspector for every content type defined in the live CMS
 * (fetched via the Content Management API). Types are grouped into tabs by base
 * type and listed in a compact table; click a row for the full property
 * breakdown (/admin/[key]). Types this codebase registers with the SDK
 * (cms/registry.ts) are flagged "Code + CMS".
 */
type Props = { searchParams: Promise<{ type?: string }> };

export default async function AdminPage({ searchParams }: Props) {
  const { type: typeParam } = await searchParams;
  const result = await fetchCmsContentTypes();
  const registeredKeys = new Set(
    registeredContentTypes.map((ct) => (ct as { key: string }).key),
  );

  if (!result.ok) {
    return (
      <main className="mx-auto w-full max-w-5xl px-6 py-12">
        <PageHeader subtitle="Content types defined in the CMS." />
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
              : 'Could not load content types from the CMS'}
          </p>
          <p className="mt-1 text-sm">{result.message}</p>
        </div>

        <RegisteredFallback />
      </main>
    );
  }

  const contentTypes = result.contentTypes;
  const registeredCount = contentTypes.filter((ct) => registeredKeys.has(ct.key)).length;

  // Types defined in code but not (yet) present in the CMS — e.g. not pushed.
  const cmsKeys = new Set(contentTypes.map((ct) => ct.key));
  const notInCms = [...registeredKeys].filter((k) => !cmsKeys.has(k));

  // Group into base-type buckets and shape into the explorer's serializable payload.
  const byBaseType = new Map<string, ExplorerType[]>();
  const pushToGroup = (ct: CmsContentType, inCms: boolean) => {
    const baseType = ct.baseType ?? 'other';
    const list = byBaseType.get(baseType) ?? [];
    list.push({
      key: ct.key,
      displayName: ct.displayName,
      description: ct.description,
      registered: registeredKeys.has(ct.key),
      inCms,
      source: ct.source,
    });
    byBaseType.set(baseType, list);
  };

  for (const ct of contentTypes) pushToGroup(ct, true);

  // Also surface types registered in code but not (yet) present in the CMS, so
  // every modelled type is visible — flagged "Code only" in their base-type tab.
  for (const ct of registeredContentTypes as unknown as CmsContentType[]) {
    if (!cmsKeys.has(ct.key)) pushToGroup(ct, false);
  }

  const groups: ExplorerGroup[] = orderBaseTypes(byBaseType.keys()).map((baseType) => ({
    baseType,
    label: baseTypeLabel(baseType),
    types: byBaseType
      .get(baseType)!
      .slice()
      .sort((a, b) => a.displayName.localeCompare(b.displayName)),
  }));

  // Resolve the active tab from ?type= (shared/back-navigation), else the first group.
  const initialBaseType =
    typeParam && groups.some((g) => g.baseType === typeParam)
      ? typeParam
      : groups[0]?.baseType ?? '';

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <PageHeader
        subtitle={
          <>
            {contentTypes.length} type{contentTypes.length === 1 ? '' : 's'} in the CMS ·{' '}
            <span className="font-medium text-indigo-700">{registeredCount} registered</span> in
            this codebase.
          </>
        }
      />

      {notInCms.length > 0 && (
        <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <span className="font-medium">Defined in code but not found in the CMS:</span>{' '}
          {notInCms.map((k) => (
            <code key={k} className="mr-1 rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">
              {k}
            </code>
          ))}
          <span className="ml-1 text-amber-700">— run `npm run config:push` to publish them.</span>
        </div>
      )}

      <ContentTypeExplorer groups={groups} initialBaseType={initialBaseType} />
    </main>
  );
}

function PageHeader({ subtitle }: { subtitle: React.ReactNode }) {
  return (
    <header className="mb-10 border-b border-slate-200 pb-6">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Content Types</h1>
        <Link
          href="/admin/display-templates"
          className="inline-flex shrink-0 items-center gap-1 text-sm text-slate-500 transition-colors hover:text-slate-900"
        >
          Display Templates
          <ChevronRight size={16} />
        </Link>
      </div>
      <p className="mt-2 text-slate-600">{subtitle}</p>
    </header>
  );
}

/** When the CMS API is unavailable, still show what the codebase registers. */
function RegisteredFallback() {
  const types = registeredContentTypes as unknown as {
    key: string;
    displayName: string;
    description?: string;
  }[];
  return (
    <section className="mt-8">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Registered in this codebase ({types.length})
      </h2>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {types.map((ct) => (
          <div
            key={ct.key}
            className="flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-3 text-sm last:border-0"
          >
            <span className="font-medium text-slate-900">{ct.displayName}</span>
            <code className="font-mono text-xs text-slate-500">{ct.key}</code>
          </div>
        ))}
      </div>
    </section>
  );
}
