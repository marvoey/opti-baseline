'use client';

import { useState, useMemo, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { ReportItem, ItemStatus, CopyType } from '../_lib/constants';
import { publishAllDrafts, publishItem } from '../actions';

const STATUS_LABEL: Record<ItemStatus, string> = {
  published: 'Published',
  draft: 'Draft',
  'not-imported': 'Not Imported',
};

const STATUS_CLASS: Record<ItemStatus, string> = {
  published: 'bg-green-100 text-green-800',
  draft: 'bg-amber-100 text-amber-800',
  'not-imported': 'bg-gray-100 text-gray-500',
};

type Props = {
  items: ReportItem[];
  copyTypes: readonly CopyType[];
};

export default function ReportTable({ items, copyTypes }: Props) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<ItemStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<CopyType | 'all'>('all');
  const [search, setSearch] = useState('');

  const [publishAllPending, startPublishAll] = useTransition();
  const [publishAllResult, setPublishAllResult] = useState<string | null>(null);

  // Track per-row pending/published state
  const [rowPending, setRowPending] = useState<Set<string>>(new Set());
  const [rowPublished, setRowPublished] = useState<Set<string>>(new Set());
  const [rowErrors, setRowErrors] = useState<Map<string, string>>(new Map());

  const rowKey = (item: ReportItem) => `${item.copyType}:${item.internalName}`;

  const filtered = useMemo(() => {
    return items.filter(item => {
      const effectiveStatus: ItemStatus = rowPublished.has(rowKey(item)) ? 'published' : item.status;
      if (statusFilter !== 'all' && effectiveStatus !== statusFilter) return false;
      if (typeFilter !== 'all' && item.copyType !== typeFilter) return false;
      if (search && !item.internalName.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [items, statusFilter, typeFilter, search, rowPublished]);

  const counts = useMemo(() => ({
    published: items.filter(i => i.status === 'published' || rowPublished.has(rowKey(i))).length,
    draft: items.filter(i => i.status === 'draft' && !rowPublished.has(rowKey(i))).length,
    'not-imported': items.filter(i => i.status === 'not-imported').length,
  }), [items, rowPublished]);

  function handlePublishAll() {
    setPublishAllResult(null);
    startPublishAll(async () => {
      const result = await publishAllDrafts();
      if (result.ok) {
        setPublishAllResult(
          result.published === 0
            ? 'No draft versions found to publish.'
            : `Published ${result.published} item${result.published !== 1 ? 's' : ''}${result.errors > 0 ? ` (${result.errors} error${result.errors !== 1 ? 's' : ''})` : ''}.`,
        );
        router.refresh();
      } else {
        setPublishAllResult(`Error: ${result.message}`);
      }
    });
  }

  async function handlePublishItem(item: ReportItem) {
    const key = rowKey(item);
    setRowPending(prev => new Set(prev).add(key));
    setRowErrors(prev => { const m = new Map(prev); m.delete(key); return m; });

    const result = await publishItem(item.internalName, item.copyType);

    setRowPending(prev => { const s = new Set(prev); s.delete(key); return s; });
    if (result.ok) {
      setRowPublished(prev => new Set(prev).add(key));
      router.refresh();
    } else {
      setRowErrors(prev => new Map(prev).set(key, result.message));
    }
  }

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total', value: items.length, cls: 'border-slate-200 bg-white text-slate-900' },
          { label: 'Published', value: counts.published, cls: 'border-green-200 bg-green-50 text-green-800' },
          { label: 'Draft', value: counts.draft, cls: 'border-amber-200 bg-amber-50 text-amber-800' },
          { label: 'Not Imported', value: counts['not-imported'], cls: 'border-gray-200 bg-gray-50 text-gray-600' },
        ].map(({ label, value, cls }) => (
          <div key={label} className={`rounded-xl border px-5 py-4 shadow-sm ${cls}`}>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs font-medium uppercase tracking-wider mt-0.5 opacity-70">{label}</p>
          </div>
        ))}
      </div>

      {/* Publish All */}
      {counts.draft > 0 && (
        <div className="flex items-center gap-4 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-900">
              {counts.draft} item{counts.draft !== 1 ? 's' : ''} in draft — ready to publish
            </p>
            {publishAllResult && (
              <p className={`mt-1 text-xs ${publishAllResult.startsWith('Error') ? 'text-red-700' : 'text-amber-700'}`}>
                {publishAllResult}
              </p>
            )}
          </div>
          <button
            onClick={handlePublishAll}
            disabled={publishAllPending}
            className="shrink-0 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {publishAllPending ? 'Publishing…' : 'Publish All Drafts'}
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Search by name…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-56"
        />

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as ItemStatus | 'all')}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="not-imported">Not Imported</option>
        </select>

        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value as CopyType | 'all')}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All types</option>
          {copyTypes.map(ct => (
            <option key={ct} value={ct}>{ct}</option>
          ))}
        </select>

        <span className="ml-auto self-center text-sm text-slate-500">
          {filtered.length} of {items.length} items
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">LOB</th>
              <th className="px-4 py-3 text-left">Topic</th>
              <th className="px-4 py-3 text-left">Jurisdiction</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  No items match the current filters.
                </td>
              </tr>
            ) : (
              filtered.map(item => {
                const key = rowKey(item);
                const isOptimisticallyPublished = rowPublished.has(key);
                const isPending = rowPending.has(key);
                const effectiveStatus: ItemStatus = isOptimisticallyPublished ? 'published' : item.status;
                const rowError = rowErrors.get(key);

                return (
                  <tr key={key} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-2.5 font-medium text-slate-900 max-w-xs truncate">
                      {item.internalName}
                    </td>
                    <td className="px-4 py-2.5 text-slate-500 whitespace-nowrap">{item.copyType}</td>
                    <td className="px-4 py-2.5 text-slate-600">{item.lob}</td>
                    <td className="px-4 py-2.5 text-slate-600">{item.topic}</td>
                    <td className="px-4 py-2.5 text-slate-600">{item.jurisdiction || '—'}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_CLASS[effectiveStatus]}`}>
                          {isPending ? 'Publishing…' : STATUS_LABEL[effectiveStatus]}
                        </span>
                        {item.status === 'draft' && !isOptimisticallyPublished && (
                          <button
                            onClick={() => handlePublishItem(item)}
                            disabled={isPending || publishAllPending}
                            className="text-xs text-indigo-600 hover:text-indigo-800 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                          >
                            {isPending ? '…' : 'Publish'}
                          </button>
                        )}
                        {rowError && (
                          <span className="text-xs text-red-600" title={rowError}>⚠ failed</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
