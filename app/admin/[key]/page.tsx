import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { registeredContentTypes } from '@/cms/registry';
import { fetchCmsContentType, type CmsContentType } from '@/lib/cms/contentTypes';
import { baseTypeLabel, describeType, statusBadge } from '../_lib/display';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ key: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const key = decodeURIComponent((await params).key);
  return { title: `${key} · Content Types · Admin` };
}

/**
 * /admin/[key] — full detail for one content type: description, badges,
 * composition behaviors, may-contain types, and the complete property table.
 * Keys may contain colons (e.g. graph:cmp_Tag); Next decodes the route segment.
 */
export default async function ContentTypeDetailPage({ params }: Props) {
  // Next leaves the route segment percent-encoded, so decode before use — keys
  // can contain reserved chars like ':' (e.g. graph:cmp_Tag). decodeURIComponent
  // is a no-op for plain keys.
  const key = decodeURIComponent((await params).key);
  const result = await fetchCmsContentType(key);

  // The codebase's own definition (if this type is registered with the SDK).
  const registeredDef = registeredContentTypes.find(
    (ct) => (ct as { key: string }).key === key,
  ) as CmsContentType | undefined;

  // Prefer the CMS as the source of truth; otherwise fall back to the code
  // definition so types registered-but-not-pushed ("Code only") still render.
  const view = result.ok
    ? { ct: result.contentType, inCms: true }
    : registeredDef
      ? { ct: registeredDef, inCms: false }
      : null;

  // Nothing to show: a genuinely unknown key 404s; a CMS error (creds/down) for
  // a key we also don't have in code surfaces the error.
  if (!view && !result.ok && result.reason === 'not-found') notFound();

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <Link
        href="/admin"
        className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-slate-900"
      >
        <ChevronLeft size={16} />
        All content types
      </Link>

      {view ? (
        <ContentTypeDetail ct={view.ct} registered={!!registeredDef} inCms={view.inCms} />
      ) : (
        <div
          className={`rounded-2xl border p-6 ${
            !result.ok && result.reason === 'missing-credentials'
              ? 'border-amber-200 bg-amber-50 text-amber-800'
              : 'border-red-200 bg-red-50 text-red-800'
          }`}
        >
          <p className="font-medium">
            {!result.ok && result.reason === 'missing-credentials'
              ? 'CMS credentials not configured'
              : 'Could not load this content type'}
          </p>
          <p className="mt-1 text-sm">{!result.ok ? result.message : ''}</p>
        </div>
      )}
    </main>
  );
}

function ContentTypeDetail({
  ct,
  registered,
  inCms,
}: {
  ct: CmsContentType;
  registered: boolean;
  inCms: boolean;
}) {
  const properties = Object.entries(ct.properties ?? {}).sort(
    ([, a], [, b]) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );
  const mayContain = ct.mayContainTypes ?? [];
  const badge = statusBadge({ registered, inCms });

  return (
    <article>
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{ct.displayName}</h1>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}>
          {badge.label}
        </span>
        {ct.source && (
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
            {ct.source}
          </span>
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
        <code className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600">
          {ct.key}
        </code>
        {ct.baseType && <span>{baseTypeLabel(ct.baseType)}</span>}
      </div>

      {ct.description && <p className="mt-4 text-slate-600">{ct.description}</p>}

      <div className="mt-4 flex flex-wrap gap-2">
        {ct.compositionBehaviors?.map((b) => (
          <span
            key={b}
            className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-500"
          >
            {b}
          </span>
        ))}
        {mayContain.length > 0 && (
          <span className="rounded-full bg-blue-400/15 px-2.5 py-0.5 text-xs font-medium text-blue-700">
            may contain: {mayContain.join(', ')}
          </span>
        )}
      </div>

      <h2 className="mt-8 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Properties
      </h2>
      {properties.length > 0 ? (
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400">
              <th className="py-2 pr-4 font-medium">Property</th>
              <th className="py-2 pr-4 font-medium">Type</th>
              <th className="py-2 font-medium">Flags</th>
            </tr>
          </thead>
          <tbody>
            {properties.map(([name, prop]) => (
              <tr key={name} className="border-b border-slate-100 last:border-0">
                <td className="py-2 pr-4 align-top">
                  <span className="font-mono text-slate-900">{name}</span>
                  {prop.displayName && prop.displayName !== name && (
                    <span className="ml-2 text-slate-400">{prop.displayName}</span>
                  )}
                  {prop.description && (
                    <p className="mt-0.5 text-xs text-slate-500">{prop.description}</p>
                  )}
                </td>
                <td className="py-2 pr-4 align-top font-mono text-xs text-slate-600">
                  {describeType(prop)}
                </td>
                <td className="py-2 align-top text-xs text-slate-500">
                  {[prop.isRequired && 'required', prop.isLocalized && 'localized']
                    .filter(Boolean)
                    .join(', ') || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-sm italic text-slate-400">No custom properties.</p>
      )}
    </article>
  );
}
