'use client';

import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search, ExternalLink, ChevronLeft, ChevronRight,
  ArrowUpDown, ArrowUp, ArrowDown, FileText, Loader2,
} from 'lucide-react';
import type { ContentItem, ContentSearchResult } from '../_lib/fetchContent';

const SORT_OPTIONS = [
  { value: 'published_desc', label: 'Newest first'  },
  { value: 'published_asc',  label: 'Oldest first'  },
  { value: 'name_asc',       label: 'Name A → Z'    },
  { value: 'name_desc',      label: 'Name Z → A'    },
] as const;

type SortKey = (typeof SORT_OPTIONS)[number]['value'];

const STATUS_OPTIONS = [
  { value: '',          label: 'All statuses'  },
  { value: 'published', label: 'Published'     },
  { value: 'draft',     label: 'Draft'         },
];

const LOCALE_OPTIONS = [
  { value: '',   label: 'All locales' },
  { value: 'en', label: 'English (en)' },
  { value: 'es', label: 'Spanish (es)' },
];

function statusBadge(status?: string | null) {
  switch (status?.toLowerCase()) {
    case 'published':
      return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200';
    case 'checkedin':
    case 'checkedout':
      return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200';
    default:
      return 'bg-slate-100 text-slate-500';
  }
}

function statusLabel(status?: string | null) {
  switch (status?.toLowerCase()) {
    case 'published':  return 'Published';
    case 'checkedin':  return 'Checked In';
    case 'checkedout': return 'Checked Out';
    default:           return status ?? '—';
  }
}

function formatDate(iso?: string | null) {
  if (!iso) return '—';
  try {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(iso));
  } catch { return iso; }
}

function primaryType(types?: string[] | null) {
  if (!types?.length) return '—';
  return types.find(t => !t.startsWith('_')) ?? types[0];
}

type Props = {
  initial: ContentSearchResult;
  contentTypes: string[];
};

export default function ContentSearchClient({ initial, contentTypes }: Props) {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Mirror URL params to local state on mount
  const [q,           setQ]           = useState(searchParams.get('q')           ?? '');
  const [contentType, setContentType] = useState(searchParams.get('contentType') ?? '');
  const [locale,      setLocale]      = useState(searchParams.get('locale')      ?? '');
  const [status,      setStatus]      = useState(searchParams.get('status')      ?? '');
  const [sort,        setSort]        = useState<SortKey>((searchParams.get('sort') as SortKey) ?? 'published_desc');

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigate = useCallback((overrides: Record<string, string>) => {
    const params = new URLSearchParams({
      q, contentType, locale, status, sort,
      page: '1',
      ...overrides,
    });
    // Strip empty values
    for (const [k, v] of [...params]) { if (!v) params.delete(k); }
    startTransition(() => { router.push(`/admin/content?${params}`); });
  }, [q, contentType, locale, status, sort, router]);

  // Debounce the text search
  function handleQueryChange(value: string) {
    setQ(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => navigate({ q: value }), 400);
  }

  function handleFilter(key: string, value: string) {
    navigate({ [key]: value, page: '1' });
  }

  function handleSort(value: SortKey) {
    setSort(value);
    navigate({ sort: value, page: '1' });
  }

  function handlePage(newPage: number) {
    const params = new URLSearchParams({ q, contentType, locale, status, sort, page: String(newPage) });
    for (const [k, v] of [...params]) { if (!v) params.delete(k); }
    startTransition(() => { router.push(`/admin/content?${params}`); });
  }

  // Sync state when URL changes (e.g. browser back)
  useEffect(() => {
    setQ(searchParams.get('q') ?? '');
    setContentType(searchParams.get('contentType') ?? '');
    setLocale(searchParams.get('locale') ?? '');
    setStatus(searchParams.get('status') ?? '');
    setSort((searchParams.get('sort') as SortKey) ?? 'published_desc');
  }, [searchParams]);

  const { items, total, page, pageSize, error } = initial;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to   = Math.min(page * pageSize, total);

  return (
    <div className="space-y-5">

      {/* Filter bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">

        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={q}
            onChange={e => handleQueryChange(e.target.value)}
            placeholder="Search by name…"
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </div>

        {/* Content type */}
        <select
          value={contentType}
          onChange={e => { setContentType(e.target.value); handleFilter('contentType', e.target.value); }}
          className="rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm text-slate-700 focus:border-slate-400 focus:outline-none"
        >
          <option value="">All types</option>
          {contentTypes.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        {/* Locale */}
        <select
          value={locale}
          onChange={e => { setLocale(e.target.value); handleFilter('locale', e.target.value); }}
          className="rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm text-slate-700 focus:border-slate-400 focus:outline-none"
        >
          {LOCALE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        {/* Status */}
        <select
          value={status}
          onChange={e => { setStatus(e.target.value); handleFilter('status', e.target.value); }}
          className="rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm text-slate-700 focus:border-slate-400 focus:outline-none"
        >
          {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={e => handleSort(e.target.value as SortKey)}
          className="rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm text-slate-700 focus:border-slate-400 focus:outline-none"
        >
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

      </div>

      {/* Result count + spinner */}
      <div className="flex items-center justify-between text-sm text-slate-500">
        {isPending ? (
          <span className="flex items-center gap-2 text-slate-400">
            <Loader2 size={14} className="animate-spin" /> Searching…
          </span>
        ) : (
          <span>
            {total === 0
              ? 'No results'
              : `Showing ${from}–${to} of ${total.toLocaleString()} item${total === 1 ? '' : 's'}`}
          </span>
        )}
        {error && (
          <span className="rounded-full bg-red-50 px-3 py-0.5 text-xs font-medium text-red-700 ring-1 ring-red-200">
            Query error — check console
          </span>
        )}
      </div>

      {/* Table */}
      <div className={`overflow-x-auto overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-opacity ${isPending ? 'opacity-50' : ''}`}>
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium uppercase tracking-wider text-slate-400">
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Content Type</th>
              <th className="px-4 py-3 text-left">Locale</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Published</th>
              <th className="px-4 py-3 text-right">URL</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                  <FileText size={32} className="mx-auto mb-3 opacity-30" />
                  <p>No content items match the current filters.</p>
                </td>
              </tr>
            ) : (
              items.map((item, i) => <ContentRow key={i} item={item} />)
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => handlePage(page - 1)}
            disabled={page <= 1 || isPending}
            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={15} /> Previous
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              let p: number;
              if (totalPages <= 7) {
                p = i + 1;
              } else if (page <= 4) {
                p = i + 1;
              } else if (page >= totalPages - 3) {
                p = totalPages - 6 + i;
              } else {
                p = page - 3 + i;
              }
              return (
                <button
                  key={p}
                  onClick={() => handlePage(p)}
                  disabled={isPending}
                  className={`h-8 min-w-[32px] rounded-lg px-2 text-sm font-medium transition-colors ${
                    p === page
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePage(page + 1)}
            disabled={page >= totalPages || isPending}
            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

function ContentRow({ item }: { item: ContentItem }) {
  const name   = item._metadata?.displayName ?? item.__typename;
  const type   = primaryType(item._metadata?.types);
  const locale = item._metadata?.locale ?? '—';
  const status = item._metadata?.status;
  const pub    = item._metadata?.published;
  const url    = item._metadata?.url?.default;

  return (
    <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
      <td className="max-w-[240px] px-4 py-3">
        <div className="flex items-center gap-2">
          <FileText size={14} className="shrink-0 text-slate-300" />
          <span className="truncate font-medium text-slate-900" title={name ?? undefined}>{name || '—'}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-600">{type}</code>
      </td>
      <td className="px-4 py-3 font-mono text-xs text-slate-500">{locale}</td>
      <td className="px-4 py-3">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge(status)}`}>
          {statusLabel(status)}
        </span>
      </td>
      <td className="px-4 py-3 text-xs text-slate-500">{formatDate(pub)}</td>
      <td className="px-4 py-3 text-right">
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title={url}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-500 hover:border-blue-300 hover:text-blue-700 transition-colors"
          >
            <ExternalLink size={12} /> Open
          </a>
        ) : (
          <span className="text-xs text-slate-300">—</span>
        )}
      </td>
    </tr>
  );
}
