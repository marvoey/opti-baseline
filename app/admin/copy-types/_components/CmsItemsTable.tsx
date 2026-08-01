'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { CmsItem } from '../actions';

const COPY_TYPE_LABELS = [
  'Base Policy',
  'Jurisdictional Override',
  'Handling Procedure',
  'Statutory Disclosure',
] as const;

type Props = { items: CmsItem[] };

export default function CmsItemsTable({ items }: Props) {
  const [typeFilter, setTypeFilter] = useState('all');
  const [lobFilter, setLobFilter]   = useState('all');
  const [topicFilter, setTopicFilter] = useState('all');
  const [search, setSearch]         = useState('');

  const lobOptions   = useMemo(() => [...new Set(items.map(i => i.lob).filter(Boolean))].sort(), [items]);
  const topicOptions = useMemo(() => [...new Set(items.map(i => i.topic).filter(Boolean))].sort(), [items]);

  const filtered = useMemo(() => {
    return items.filter(item => {
      if (typeFilter !== 'all'  && item.copyType !== typeFilter)   return false;
      if (lobFilter   !== 'all' && item.lob       !== lobFilter)   return false;
      if (topicFilter !== 'all' && item.topic     !== topicFilter) return false;
      if (search && !item.internalName.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [items, typeFilter, lobFilter, topicFilter, search]);

  const countsByType = useMemo(() => {
    const map: Record<string, number> = {};
    for (const item of items) map[item.copyType] = (map[item.copyType] ?? 0) + 1;
    return map;
  }, [items]);

  return (
    <div className="space-y-6">

      {/* Stat cards */}
      <div className="grid grid-cols-5 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <p className="text-2xl font-bold text-slate-900">{items.length}</p>
          <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-slate-400">Total</p>
        </div>
        {COPY_TYPE_LABELS.map(label => (
          <div key={label} className="rounded-xl border border-indigo-100 bg-indigo-50 px-5 py-4 shadow-sm">
            <p className="text-2xl font-bold text-indigo-700">{countsByType[label] ?? 0}</p>
            <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-indigo-400 truncate" title={label}>
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Search by name…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-56 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All types</option>
          {COPY_TYPE_LABELS.map(l => <option key={l} value={l}>{l}</option>)}
        </select>

        <select
          value={lobFilter}
          onChange={e => setLobFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All LOBs</option>
          {lobOptions.map(o => <option key={o} value={o}>{o}</option>)}
        </select>

        <select
          value={topicFilter}
          onChange={e => setTopicFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All topics</option>
          {topicOptions.map(o => <option key={o} value={o}>{o}</option>)}
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
              <th className="px-4 py-3 text-left">Internal Name</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">LOB</th>
              <th className="px-4 py-3 text-left">Topic</th>
              <th className="px-4 py-3 text-left">Jurisdiction</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                  No items match the current filters.
                </td>
              </tr>
            ) : (
              filtered.map((item, idx) => (
                <tr key={`${item.contentTypeKey}:${item.internalName}:${idx}`} className="hover:bg-slate-50 transition-colors">
                  <td className="max-w-xs truncate px-4 py-2.5 font-medium text-slate-900">
                    {item.internalName}
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                      {item.copyType}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-600">{item.lob || '—'}</td>
                  <td className="px-4 py-2.5 text-slate-600">{item.topic || '—'}</td>
                  <td className="px-4 py-2.5 text-slate-600">{item.jurisdiction ?? '—'}</td>
                  <td className="px-4 py-2.5 text-right">
                    {item.cmsKey ? (
                      <Link
                        href={`/admin/copy-types/${item.cmsKey}/edit`}
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                      >
                        Edit
                      </Link>
                    ) : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
