'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { statusBadge } from '../_lib/display';

export type ExplorerType = {
  key: string;
  displayName: string;
  description?: string;
  registered: boolean;
  /** Whether the type exists in the CMS (false ⇒ registered in code only). */
  inCms: boolean;
  source?: string;
};

export type ExplorerGroup = {
  baseType: string;
  label: string;
  types: ExplorerType[];
};

/** Filter bucket for types with no `source` (CMS user-defined and code-only). */
const SOURCE_NONE = '(none)';

/**
 * Client-side explorer for the /admin overview. All content types are fetched
 * once on the server and passed in as `groups` (already ordered), so switching
 * tabs and searching are instant with no CMS refetch.
 *
 * The active tab is mirrored to the URL (`?type=<baseType>`) via the History API
 * — no server round-trip, but the tab is shareable and restored when the user
 * navigates back from a detail page (the server resolves `?type=` to
 * `initialBaseType`, so SSR and hydration agree without an effect).
 */
export default function ContentTypeExplorer({
  groups,
  initialBaseType,
}: {
  groups: ExplorerGroup[];
  initialBaseType: string;
}) {
  const [active, setActive] = useState(initialBaseType);
  const [query, setQuery] = useState('');
  // Selected source filters. Empty ⇒ no filtering (show all sources).
  const [selectedSources, setSelectedSources] = useState<Set<string>>(new Set());

  function selectTab(baseType: string) {
    setActive(baseType);
    setQuery('');
    setSelectedSources(new Set());
    const url = new URL(window.location.href);
    url.searchParams.set('type', baseType);
    window.history.replaceState(null, '', url);
  }

  function toggleSource(source: string) {
    setSelectedSources((prev) => {
      const next = new Set(prev);
      if (next.has(source)) next.delete(source);
      else next.add(source);
      return next;
    });
  }

  const activeGroup = groups.find((g) => g.baseType === active) ?? groups[0];

  // Distinct sources within the active tab, with counts (sourceless types — CMS
  // user-defined and code-only — bucket under SOURCE_NONE).
  const sourceOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const t of activeGroup?.types ?? []) {
      const s = t.source ?? SOURCE_NONE;
      counts.set(s, (counts.get(s) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort(([a], [b]) =>
        a === SOURCE_NONE ? 1 : b === SOURCE_NONE ? -1 : a.localeCompare(b),
      )
      .map(([source, count]) => ({ source, count }));
  }, [activeGroup]);

  const visible = useMemo(() => {
    if (!activeGroup) return [];
    const q = query.trim().toLowerCase();
    return activeGroup.types.filter((t) => {
      if (
        q &&
        !t.displayName.toLowerCase().includes(q) &&
        !t.key.toLowerCase().includes(q)
      ) {
        return false;
      }
      if (selectedSources.size && !selectedSources.has(t.source ?? SOURCE_NONE)) {
        return false;
      }
      return true;
    });
  }, [activeGroup, query, selectedSources]);

  if (!activeGroup) return null;

  return (
    <div>
      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {groups.map((g) => {
          const isActive = g.baseType === active;
          return (
            <button
              key={g.baseType}
              type="button"
              onClick={() => selectTab(g.baseType)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {g.label}
              <span
                className={`ml-1.5 text-xs ${isActive ? 'text-blue-300' : 'text-slate-400'}`}
              >
                {g.types.length}
              </span>
            </button>
          );
        })}
      </div>

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
          placeholder={`Search ${activeGroup.label.toLowerCase()}…`}
          className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
        />
      </div>

      {/* Source filter — checkboxes; none checked ⇒ all sources shown. */}
      {sourceOptions.length > 1 && (
        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Source
          </span>
          {sourceOptions.map(({ source, count }) => (
            <label
              key={source}
              className="flex cursor-pointer items-center gap-1.5 text-sm text-slate-600"
            >
              <input
                type="checkbox"
                checked={selectedSources.has(source)}
                onChange={() => toggleSource(source)}
                className="rounded border-slate-300 text-slate-900 focus:ring-slate-400"
              />
              <span>{source}</span>
              <span className="text-xs text-slate-400">{count}</span>
            </label>
          ))}
        </div>
      )}

      {/* Compact table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-[1.2fr_1fr_auto] gap-4 border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-slate-400 sm:grid-cols-[1.2fr_1fr_2fr_auto]">
          <span>Display name</span>
          <span>Key</span>
          <span className="hidden sm:block">Description</span>
          <span className="text-right">Source</span>
        </div>

        {visible.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-slate-400">
            No content types match the current filters.
          </p>
        ) : (
          visible.map((t) => (
            <Link
              key={t.key}
              href={`/admin/${encodeURIComponent(t.key)}`}
              className="grid grid-cols-[1.2fr_1fr_auto] items-center gap-4 border-b border-slate-100 px-4 py-3 text-sm transition-colors last:border-0 hover:bg-slate-50 sm:grid-cols-[1.2fr_1fr_2fr_auto]"
            >
              <span className="truncate font-medium text-slate-900">{t.displayName}</span>
              <code className="truncate font-mono text-xs text-slate-500">{t.key}</code>
              <span className="hidden truncate text-slate-500 sm:block">
                {t.description || '—'}
              </span>
              <span className="flex items-center justify-end gap-1.5">
                {t.source && (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                    {t.source}
                  </span>
                )}
                {(() => {
                  const badge = statusBadge(t);
                  return (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  );
                })()}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
