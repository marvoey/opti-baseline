'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import type { CmsDisplayTemplateSummary } from '@/lib/cms/displayTemplates';

function appliesTo(t: CmsDisplayTemplateSummary): { label: string; value: string } {
  if (t.contentType) return { label: 'Content type', value: t.contentType };
  if (t.baseType) return { label: 'Base type', value: t.baseType };
  if (t.nodeType) return { label: 'Node type', value: t.nodeType };
  return { label: '—', value: '—' };
}

export default function DisplayTemplateExplorer({
  templates,
}: {
  templates: CmsDisplayTemplateSummary[];
}) {
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return templates;
    return templates.filter(
      (t) =>
        t.displayName.toLowerCase().includes(q) ||
        t.key.toLowerCase().includes(q) ||
        (t.contentType ?? '').toLowerCase().includes(q) ||
        (t.baseType ?? '').toLowerCase().includes(q) ||
        (t.nodeType ?? '').toLowerCase().includes(q),
    );
  }, [templates, query]);

  return (
    <div>
      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search display templates…"
          className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-[1.2fr_1fr_1fr_auto] gap-4 border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-slate-400">
          <span>Display name</span>
          <span>Key</span>
          <span>Applies to</span>
          <span className="text-right">Settings</span>
        </div>

        {visible.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-slate-400">
            No display templates match the current search.
          </p>
        ) : (
          visible.map((t) => {
            const applies = appliesTo(t);
            const settingCount = Object.keys(t.settings ?? {}).length;
            return (
              <Link
                key={t.key}
                href={`/admin/display-templates/${encodeURIComponent(t.key)}`}
                className="grid grid-cols-[1.2fr_1fr_1fr_auto] items-center gap-4 border-b border-slate-100 px-4 py-3 text-sm transition-colors last:border-0 hover:bg-slate-50"
              >
                <span className="flex items-center gap-2 truncate font-medium text-slate-900">
                  {t.displayName}
                  {t.isDefault && (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      default
                    </span>
                  )}
                </span>
                <code className="truncate font-mono text-xs text-slate-500">{t.key}</code>
                <span className="truncate text-slate-500">
                  <span className="mr-1 text-xs text-slate-400">{applies.label}:</span>
                  <code className="font-mono text-xs">{applies.value}</code>
                </span>
                <span className="text-right text-xs text-slate-400">
                  {settingCount > 0 ? `${settingCount} setting${settingCount === 1 ? '' : 's'}` : '—'}
                </span>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
