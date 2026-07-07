import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { registeredDisplayTemplates } from '@/cms/registry';
import {
  fetchCmsDisplayTemplates,
  type CmsDisplayTemplate,
} from '@/lib/cms/displayTemplates';
import { fetchCmsContentTypes } from '@/lib/cms/contentTypes';
import { statusBadge } from '../_lib/display';
import TemplateActions from './_components/TemplateActions';

export const metadata: Metadata = {
  title: 'Display Templates · Admin',
  description: 'Display templates defined in the Optimizely CMS.',
};

// Admin data is environment-specific and shouldn't be cached at build time.
export const dynamic = 'force-dynamic';

/**
 * /admin/display-templates — a read-only inspector for every display template
 * defined in the live CMS (fetched via the Content Management API). Each
 * template is listed with everything it applies to: a content-type template
 * targets a single type; a base-type template applies to *every* content type
 * with that base type (so those are expanded); a structural template targets a
 * row/column node. Templates this codebase registers with the SDK
 * (cms/registry.ts) are flagged "Code + CMS"; templates registered in code but
 * not yet pushed are "Code only"; everything else is "CMS only".
 */

// The kind of thing a template targets.
type Kind = 'contentType' | 'baseType' | 'nodeType' | 'other';

type ContentTypeRef = { key: string; displayName: string };

type Row = {
  key: string;
  displayName: string;
  isDefault: boolean;
  registered: boolean;
  inCms: boolean;
  kind: Kind;
  /** The raw target value (content type key, base type, or node type). */
  target: string;
  /** Content types this template applies to (resolved; empty for structural). */
  contentTypes: ContentTypeRef[];
};

function classify(t: CmsDisplayTemplate): { kind: Kind; target: string } {
  if (t.contentType) return { kind: 'contentType', target: t.contentType };
  if (t.baseType) return { kind: 'baseType', target: t.baseType };
  if (t.nodeType) return { kind: 'nodeType', target: t.nodeType };
  return { kind: 'other', target: '—' };
}

export default async function DisplayTemplatesPage() {
  // Templates gate the page; content types are supplementary (used to expand
  // base-type templates), so a content-types failure degrades gracefully.
  const [result, ctResult] = await Promise.all([
    fetchCmsDisplayTemplates(),
    fetchCmsContentTypes(),
  ]);

  const registered = registeredDisplayTemplates as unknown as CmsDisplayTemplate[];
  const registeredKeys = new Set(registered.map((t) => t.key));

  if (!result.ok) {
    return (
      <main className="mx-auto w-full max-w-5xl px-6 py-12">
        <BackLink />
        <PageHeader subtitle="Display templates defined in the CMS." />
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

        <RegisteredFallback templates={registered} />
      </main>
    );
  }

  const templates = result.displayTemplates;
  const registeredCount = templates.filter((t) => registeredKeys.has(t.key)).length;

  // Types defined in code but not (yet) present in the CMS — e.g. not pushed.
  const cmsKeys = new Set(templates.map((t) => t.key));
  const notInCms = registered.filter((t) => !cmsKeys.has(t.key)).map((t) => t.key);

  // Index content types so we can resolve display names and expand base-type
  // templates to every content type that shares that base type.
  const contentTypes = ctResult.ok ? ctResult.contentTypes : [];
  const ctByKey = new Map<string, ContentTypeRef>();
  const ctByBase = new Map<string, ContentTypeRef[]>();
  for (const ct of contentTypes) {
    const ref = { key: ct.key, displayName: ct.displayName };
    ctByKey.set(ct.key, ref);
    const base = ct.baseType ?? 'other';
    ctByBase.set(base, [...(ctByBase.get(base) ?? []), ref]);
  }

  const resolveContentTypes = (kind: Kind, target: string): ContentTypeRef[] => {
    if (kind === 'contentType') {
      return [ctByKey.get(target) ?? { key: target, displayName: target }];
    }
    if (kind === 'baseType') {
      return (ctByBase.get(target) ?? [])
        .slice()
        .sort((a, b) => a.displayName.localeCompare(b.displayName));
    }
    return [];
  };

  const toRow = (t: CmsDisplayTemplate, inCms: boolean): Row => {
    const { kind, target } = classify(t);
    return {
      key: t.key,
      displayName: t.displayName,
      isDefault: !!t.isDefault,
      registered: registeredKeys.has(t.key),
      inCms,
      kind,
      target,
      contentTypes: resolveContentTypes(kind, target),
    };
  };

  const rows: Row[] = [
    ...templates.map((t) => toRow(t, true)),
    // Also surface templates registered in code but not (yet) present in the CMS.
    ...registered.filter((t) => !cmsKeys.has(t.key)).map((t) => toRow(t, false)),
  ].sort((a, b) => a.displayName.localeCompare(b.displayName));

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <BackLink />
      <PageHeader
        subtitle={
          <>
            {templates.length} template{templates.length === 1 ? '' : 's'} in the CMS ·{' '}
            <span className="font-medium text-indigo-700">{registeredCount} registered</span> in
            this codebase.
          </>
        }
      />

      {notInCms.length > 0 && (
        <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <p className="font-medium">Defined in code but not found in the CMS:</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {notInCms.map((k) => (
              <code key={k} className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">
                {k}
              </code>
            ))}
          </div>
          <p className="mt-2 text-amber-700">— run `npm run cms:push` to publish them.</p>
        </div>
      )}

      {!ctResult.ok && (
        <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Could not load content types, so base-type templates can’t be expanded to the
          content types they apply to. {ctResult.message}
        </div>
      )}

      <div className="space-y-4">
        {rows.map((r) => (
          <TemplateCard key={r.key} row={r} />
        ))}
      </div>
    </main>
  );
}

function BackLink() {
  return (
    <Link
      href="/admin"
      className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-slate-900"
    >
      <ChevronLeft size={16} />
      Content Types
    </Link>
  );
}

function PageHeader({ subtitle }: { subtitle: React.ReactNode }) {
  return (
    <header className="mb-10 border-b border-slate-200 pb-6">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Display Templates</h1>
      <p className="mt-2 text-slate-600">{subtitle}</p>
    </header>
  );
}

function TemplateCard({ row }: { row: Row }) {
  const badge = statusBadge(row);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate font-medium text-slate-900">{row.displayName}</span>
            {row.isDefault && (
              <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                default
              </span>
            )}
          </div>
          <code className="font-mono text-xs text-slate-500">{row.key}</code>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${badge.className}`}
          >
            {badge.label}
          </span>
          {/* Only CMS-present templates can be deleted from the CMS. */}
          {row.inCms && (
            <TemplateActions
              templateKey={row.key}
              displayName={row.displayName}
              registered={row.registered}
            />
          )}
        </div>
      </div>

      <AppliesTo row={row} />
    </div>
  );
}

function AppliesTo({ row }: { row: Row }) {
  return (
    <div className="mt-3 border-t border-slate-100 pt-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          Applies to
        </span>

        {/* Structural templates target a node type, not content. */}
        {row.kind === 'nodeType' && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
            {row.target} (structural)
          </span>
        )}

        {/* Base-type templates apply to every content type with that base type. */}
        {row.kind === 'baseType' && (
          <span className="rounded-full bg-indigo-50 px-2 py-0.5 font-mono text-xs font-medium text-indigo-700">
            {row.target}
            <span className="ml-1 font-sans text-indigo-400">base type</span>
          </span>
        )}

        {row.contentTypes.map((ct) => (
          <span
            key={ct.key}
            className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
            title={ct.key}
          >
            {ct.displayName}
          </span>
        ))}

        {row.kind === 'contentType' && row.contentTypes.length === 0 && (
          <span className="text-xs text-slate-400">{row.target}</span>
        )}

        {row.kind === 'baseType' && row.contentTypes.length === 0 && (
          <span className="text-xs text-slate-400">
            no content types with this base type
          </span>
        )}
      </div>

      {row.kind === 'baseType' && row.contentTypes.length > 0 && (
        <p className="mt-1.5 text-xs text-slate-400">
          {row.contentTypes.length} content type
          {row.contentTypes.length === 1 ? '' : 's'} with base type{' '}
          <code className="font-mono">{row.target}</code>
        </p>
      )}
    </div>
  );
}

/** When the CMS API is unavailable, still show what the codebase registers. */
function RegisteredFallback({ templates }: { templates: CmsDisplayTemplate[] }) {
  return (
    <section className="mt-8">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Registered in this codebase ({templates.length})
      </h2>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {templates.map((t) => (
          <div
            key={t.key}
            className="flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-3 text-sm last:border-0"
          >
            <span className="font-medium text-slate-900">{t.displayName}</span>
            <code className="font-mono text-xs text-slate-500">{t.key}</code>
          </div>
        ))}
      </div>
    </section>
  );
}
