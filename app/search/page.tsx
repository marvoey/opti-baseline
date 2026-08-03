import Link from 'next/link';
import { Search, SlidersHorizontal, ChevronDown, FileText, AlertTriangle, Mic, BookOpen, FileCheck, X } from 'lucide-react';
import FilterForm from './_components/FilterForm';
import { fetchPrgvBlocks, type PrgvBlock, type BlockType } from './_actions';
import {
  LINE_OF_BUSINESS, US_JURISDICTION, RULE_CATEGORY,
  SEVERITY_LEVEL, TARGET_AUDIENCE, taxonomyEnums, labelFor, abbrFor,
} from '@/lib/cms/taxonomy';

// ── Search params ─────────────────────────────────────────────────────────────

type SP = {
  q?: string;
  ftype?: string | string[];
  flob?: string | string[];
  fstate?: string | string[];
  fsev?: string | string[];
  fcat?: string | string[];
  faud?: string | string[];
};

type Props = { searchParams: Promise<SP> };

function toArr(v: string | string[] | undefined): string[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

// ── Block type metadata ───────────────────────────────────────────────────────

const BLOCK_META: Record<BlockType, { label: string; shortKey: string; icon: React.ElementType; color: string; border: string; bg: string }> = {
  prgv_GlobalComplianceDisclosure: {
    label: 'Global Compliance',
    shortKey: 'disc',
    icon: FileCheck,
    color: 'text-red-700',
    border: 'border-red-300',
    bg: 'bg-red-50',
  },
  prgv_HandlingNoteBlock: {
    label: 'Handling Note',
    shortKey: 'note',
    icon: AlertTriangle,
    color: 'text-amber-700',
    border: 'border-amber-300',
    bg: 'bg-amber-50',
  },
  prgv_ScriptingBlock: {
    label: 'Scripting Block',
    shortKey: 'script',
    icon: Mic,
    color: 'text-blue-700',
    border: 'border-blue-300',
    bg: 'bg-blue-50',
  },
  prgv_StandardInstructionBlock: {
    label: 'Standard Instruction',
    shortKey: 'instr',
    icon: BookOpen,
    color: 'text-emerald-700',
    border: 'border-emerald-300',
    bg: 'bg-emerald-50',
  },
};

const SHORT_TO_TYPE: Record<string, BlockType> = Object.fromEntries(
  (Object.entries(BLOCK_META) as [BlockType, (typeof BLOCK_META)[BlockType]][]).map(([k, v]) => [v.shortKey, k]),
);

// ── Severity badge colours ────────────────────────────────────────────────────

const SEV_STYLE: Record<string, { bg: string; text: string }> = {
  '0': { bg: 'bg-slate-100', text: 'text-slate-600' },
  '1': { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  '2': { bg: 'bg-orange-100', text: 'text-orange-700' },
  '3': { bg: 'bg-red-100', text: 'text-red-700' },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function stripHtml(html: string, maxLen = 220): string {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length > maxLen ? text.slice(0, maxLen) + '…' : text;
}

function blockTitle(b: PrgvBlock): string {
  if (b.blockType === 'prgv_GlobalComplianceDisclosure' && b.DisclosureName) return b.DisclosureName;
  return b._metadata.displayName ?? b._metadata.key ?? '—';
}

// ── Filtering ─────────────────────────────────────────────────────────────────

type ActiveFilters = {
  ftype: string[]; // short keys: disc | note | script | instr
  flob: string[];
  fstate: string[];
  fsev: string[];
  fcat: string[];
  faud: string[];
};

function applyFilters(blocks: PrgvBlock[], f: ActiveFilters): PrgvBlock[] {
  return blocks.filter(b => {
    const meta = BLOCK_META[b.blockType];
    if (f.ftype.length && !f.ftype.includes(meta.shortKey)) return false;
    if (f.flob.length && !b.LineOfBusiness?.some(lob => f.flob.includes(lob))) return false;
    if (f.fstate.length) {
      const stateMatch = (b.ApplicableState && f.fstate.includes(b.ApplicableState)) ||
        (b.Jurisdiction && f.fstate.includes(b.Jurisdiction));
      if (!stateMatch) return false;
    }
    if (f.fsev.length && b.SeverityLevel != null && !f.fsev.includes(b.SeverityLevel)) return false;
    if (f.fcat.length && b.RuleCategory != null && !f.fcat.includes(b.RuleCategory)) return false;
    if (f.faud.length && b.TargetAudience != null && !f.faud.includes(b.TargetAudience)) return false;
    return true;
  });
}

// Count results for a single facet option, holding all OTHER active filters fixed.
function optionCount(
  blocks: PrgvBlock[],
  facet: keyof ActiveFilters,
  value: string,
  activeFilters: ActiveFilters,
): number {
  const others = { ...activeFilters, [facet]: [] };
  return applyFilters(blocks, others).filter(b => {
    const meta = BLOCK_META[b.blockType];
    switch (facet) {
      case 'ftype':  return meta.shortKey === value;
      case 'flob':   return b.LineOfBusiness?.includes(value) ?? false;
      case 'fstate': return b.ApplicableState === value || b.Jurisdiction === value;
      case 'fsev':   return b.SeverityLevel === value;
      case 'fcat':   return b.RuleCategory === value;
      case 'faud':   return b.TargetAudience === value;
    }
  }).length;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SearchBar({ query, compact = false }: { query: string; compact?: boolean }) {
  if (compact) {
    return (
      <form method="GET" action="/search" className="relative flex-1 max-w-xl">
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Search PRGV blocks…"
          className="w-full rounded border border-slate-300 py-2 pl-9 pr-20 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
        <button type="submit" className="absolute right-0 top-0 h-full rounded-r bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700">
          Search
        </button>
      </form>
    );
  }
  return (
    <form method="GET" action="/search" className="relative w-full max-w-2xl">
      <input
        type="text"
        name="q"
        defaultValue={query}
        placeholder="Search PRGV compliance blocks…"
        className="w-full rounded-lg border border-slate-300 py-4 pl-12 pr-28 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <Search size={22} className="absolute left-4 top-4 text-slate-400" />
      <button type="submit" className="absolute right-3 top-2.5 rounded bg-blue-600 px-5 py-1.5 text-sm font-semibold text-white hover:bg-blue-700">
        Search
      </button>
    </form>
  );
}

function FacetSection({
  label,
  paramKey,
  options,
  active,
  blocks,
  allFilters,
  scrollable = false,
}: {
  label: string;
  paramKey: keyof ActiveFilters;
  options: { label: string; value: string }[];
  active: string[];
  blocks: PrgvBlock[];
  allFilters: ActiveFilters;
  scrollable?: boolean;
}) {
  return (
    <div className="border-b border-slate-100 pb-4">
      <p className="mb-3 flex items-center justify-between text-xs font-bold uppercase tracking-wide text-slate-600">
        {label}
        <ChevronDown size={12} className="text-slate-400" />
      </p>
      <div className={`space-y-2 ${scrollable ? 'max-h-48 overflow-y-auto pr-1' : ''}`}>
        {options.map(o => {
          const count = optionCount(blocks, paramKey, o.value, allFilters);
          const checked = active.includes(o.value);
          return (
            <label key={o.value} className={`flex cursor-pointer items-center gap-2 group ${count === 0 && !checked ? 'opacity-40' : ''}`}>
              <input
                type="checkbox"
                name={paramKey}
                value={o.value}
                defaultChecked={checked}
                disabled={count === 0 && !checked}
                className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600"
              />
              <span className="flex-1 text-sm text-slate-600 group-hover:text-slate-900">{o.label}</span>
              <span className="text-xs text-slate-400">({count})</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function ActiveFilterPills({ filters, q }: { filters: ActiveFilters; q: string }) {
  const pills: { label: string; clearHref: string }[] = [];

  const makeHref = (next: ActiveFilters) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    for (const [k, vals] of Object.entries(next) as [keyof ActiveFilters, string[]][]) {
      for (const v of vals) params.append(k, v);
    }
    return `/search?${params.toString()}`;
  };

  for (const key of filters.ftype)  pills.push({ label: BLOCK_META[SHORT_TO_TYPE[key]]?.label ?? key,   clearHref: makeHref({ ...filters, ftype:  filters.ftype.filter(v => v !== key)  }) });
  for (const key of filters.flob)   pills.push({ label: labelFor(LINE_OF_BUSINESS, key) ?? key,          clearHref: makeHref({ ...filters, flob:   filters.flob.filter(v => v !== key)   }) });
  for (const key of filters.fstate) pills.push({ label: abbrFor(US_JURISDICTION, key) ?? key,            clearHref: makeHref({ ...filters, fstate: filters.fstate.filter(v => v !== key) }) });
  for (const key of filters.fsev)   pills.push({ label: labelFor(SEVERITY_LEVEL, key) ?? key,            clearHref: makeHref({ ...filters, fsev:   filters.fsev.filter(v => v !== key)   }) });
  for (const key of filters.fcat)   pills.push({ label: labelFor(RULE_CATEGORY, key) ?? key,             clearHref: makeHref({ ...filters, fcat:   filters.fcat.filter(v => v !== key)   }) });
  for (const key of filters.faud)   pills.push({ label: labelFor(TARGET_AUDIENCE, key) ?? key,           clearHref: makeHref({ ...filters, faud:   filters.faud.filter(v => v !== key)   }) });

  if (!pills.length) return null;
  return (
    <div className="flex flex-wrap gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2.5 md:px-8">
      {pills.map((p, i) => (
        <a key={i} href={p.clearHref} className="flex items-center gap-1 rounded-full border border-slate-300 bg-white px-2.5 py-0.5 text-xs text-slate-600 hover:border-red-300 hover:text-red-600 transition-colors">
          {p.label} <X size={10} />
        </a>
      ))}
      <a href={q ? `/search?q=${encodeURIComponent(q)}` : '/search'} className="text-xs text-blue-500 hover:underline self-center ml-1">
        Clear all
      </a>
    </div>
  );
}

function ResultCard({ block }: { block: PrgvBlock }) {
  const meta = BLOCK_META[block.blockType];
  const Icon = meta.icon;
  const title = blockTitle(block);
  const excerpt = stripHtml(block.contentHtml);

  return (
    <div className={`rounded-xl border ${meta.border} ${meta.bg} p-4 hover:shadow-sm transition-shadow`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 rounded-lg border ${meta.border} bg-white p-1.5 shrink-0`}>
          <Icon size={14} className={meta.color} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className={`text-xs font-bold uppercase tracking-wide ${meta.color}`}>{meta.label}</span>
            {block.SeverityLevel != null && (
              <span className={`rounded px-1.5 py-0.5 text-xs font-semibold ${SEV_STYLE[block.SeverityLevel]?.bg} ${SEV_STYLE[block.SeverityLevel]?.text}`}>
                {labelFor(SEVERITY_LEVEL, block.SeverityLevel)}
              </span>
            )}
            {block.RuleCategory != null && (
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">
                {labelFor(RULE_CATEGORY, block.RuleCategory)}
              </span>
            )}
            {block.TargetAudience != null && (
              <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-xs font-medium text-indigo-700">
                {labelFor(TARGET_AUDIENCE, block.TargetAudience)}
              </span>
            )}
          </div>

          <p className="text-sm font-semibold text-slate-800 mb-1">{title}</p>

          {excerpt && (
            <p className="text-sm text-slate-500 leading-relaxed mb-2">{excerpt}</p>
          )}

          <div className="flex flex-wrap gap-1.5">
            {(block.Jurisdiction ?? block.ApplicableState) != null && (
              <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-500">
                {abbrFor(US_JURISDICTION, block.Jurisdiction ?? block.ApplicableState)}
              </span>
            )}
            {block.EffectiveDate && (
              <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-400">
                Effective {new Date(block.EffectiveDate).toLocaleDateString()}
              </span>
            )}
            {(block.LineOfBusiness ?? []).map(lob => (
              <span key={lob} className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-500">
                {labelFor(LINE_OF_BUSINESS, lob)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── LOB quick-filter strip (shared between home + results views) ──────────────

const LOB_ENTRIES = Object.entries(LINE_OF_BUSINESS) as [string, { displayName: string }][];

function LobQuickFilters({ activeLobs, q }: { activeLobs: string[]; q: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {LOB_ENTRIES.map(([code, { displayName }]) => {
        const active = activeLobs.includes(code);
        const nextLobs = active
          ? activeLobs.filter(v => v !== code)
          : [...activeLobs, code];
        const params = new URLSearchParams();
        if (q) params.set('q', q);
        for (const v of nextLobs) params.append('flob', v);
        const href = `/search?${params.toString()}`;
        return (
          <a
            key={code}
            href={href}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              active
                ? 'border-blue-500 bg-blue-600 text-white hover:bg-blue-700'
                : 'border-slate-300 bg-white text-slate-600 hover:border-blue-400 hover:text-blue-700'
            }`}
          >
            {displayName}
          </a>
        );
      })}
    </div>
  );
}

// ── Home view ─────────────────────────────────────────────────────────────────

function HomeView() {
  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center bg-slate-50 px-4 py-16">
      <div className="h-12 mb-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="Progressive Insurance" className="h-full w-auto object-contain" />
      </div>
      <p className="mb-8 text-slate-500">Search across compliance, handling, scripting, and instruction blocks</p>
      <SearchBar query="" />

      {/* Block type shortcuts */}
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {(Object.entries(BLOCK_META) as [BlockType, (typeof BLOCK_META)[BlockType]][]).map(([, m]) => {
          const Icon = m.icon;
          return (
            <a
              key={m.shortKey}
              href={`/search?ftype=${m.shortKey}`}
              className={`flex flex-col items-center gap-2 rounded-xl border ${m.border} ${m.bg} px-5 py-4 text-center hover:shadow-sm transition-shadow`}
            >
              <Icon size={20} className={m.color} />
              <span className={`text-xs font-semibold ${m.color}`}>{m.label}</span>
            </a>
          );
        })}
      </div>

      {/* LOB quick filters */}
      <div className="mt-8 w-full max-w-2xl">
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
          Browse by Line of Business
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <LobQuickFilters activeLobs={[]} q="" />
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = sp.q ?? '';
  const filters: ActiveFilters = {
    ftype:  toArr(sp.ftype),
    flob:   toArr(sp.flob),
    fstate: toArr(sp.fstate),
    fsev:   toArr(sp.fsev),
    fcat:   toArr(sp.fcat),
    faud:   toArr(sp.faud),
  };

  const isActive = !!q || Object.values(filters).some(f => f.length > 0);

  if (!isActive) {
    return (
      <div className="w-full font-sans">
        <HomeView />
      </div>
    );
  }

  let allBlocks: PrgvBlock[] = [];
  let fetchError: string | null = null;
  try {
    allBlocks = await fetchPrgvBlocks(q || undefined);
  } catch (err) {
    fetchError = err instanceof Error ? err.message : String(err);
  }

  const filtered = applyFilters(allBlocks, filters);
  const hasFilters = Object.values(filters).some(f => f.length > 0);
  const clearHref = q ? `/search?q=${encodeURIComponent(q)}` : '/search';

  const BLOCK_TYPE_FACET = (Object.entries(BLOCK_META) as [BlockType, (typeof BLOCK_META)[BlockType]][]).map(([, m]) => ({
    label: m.label,
    value: m.shortKey,
  }));

  const LOB_FACET   = taxonomyEnums(LINE_OF_BUSINESS).map(e => ({ label: e.displayName, value: e.value }));
  const STATE_FACET = taxonomyEnums(US_JURISDICTION).map(e => ({ label: `${e.displayName} (${US_JURISDICTION[e.value]?.abbr ?? ''})`, value: e.value }));
  const SEV_FACET   = taxonomyEnums(SEVERITY_LEVEL).map(e => ({ label: e.displayName, value: e.value }));
  const CAT_FACET   = taxonomyEnums(RULE_CATEGORY).map(e => ({ label: e.displayName, value: e.value }));
  const AUD_FACET   = taxonomyEnums(TARGET_AUDIENCE).map(e => ({ label: e.displayName, value: e.value }));

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Header */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-4 md:px-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="h-7 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <Link href="/search"><img src="/logo.svg" alt="Progressive Insurance" className="h-full w-auto object-contain" /></Link>
            </div>
            <SearchBar query={q} compact />
          </div>
        </div>
      </div>

      {/* Active filter pills */}
      <ActiveFilterPills filters={filters} q={q} />

      {/* LOB quick-filter strip */}
      <div className="border-b border-slate-100 bg-white px-4 py-3 md:px-8">
        <LobQuickFilters activeLobs={filters.flob} q={q} />
      </div>

      {/* Count bar */}
      <div className="border-b border-slate-100 bg-white px-4 py-2.5 md:px-8 flex items-center justify-between text-sm text-slate-500">
        <span>
          {fetchError != null
            ? <span className="text-red-600">Error fetching results.</span>
            : <><strong className="text-slate-700">{filtered.length}</strong> block{filtered.length !== 1 ? 's' : ''} {hasFilters ? 'match filters' : 'found'} {q && <> for <em>&ldquo;{q}&rdquo;</em></>}</>
          }
        </span>
        {hasFilters && (
          <a href={clearHref} className="text-blue-500 hover:underline text-xs">Clear filters</a>
        )}
      </div>

      <div className="flex max-w-7xl mx-auto">

        {/* Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 border-r border-slate-100 px-5 py-6 space-y-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
            <SlidersHorizontal size={12} /> Filter Results
          </div>

          <FilterForm>
            {q && <input type="hidden" name="q" value={q} />}

            <FacetSection
              label="Block Type"
              paramKey="ftype"
              options={BLOCK_TYPE_FACET}
              active={filters.ftype}
              blocks={allBlocks}
              allFilters={filters}
            />
            <FacetSection
              label="Line of Business"
              paramKey="flob"
              options={LOB_FACET}
              active={filters.flob}
              blocks={allBlocks}
              allFilters={filters}
            />
            <FacetSection
              label="State / Jurisdiction"
              paramKey="fstate"
              options={STATE_FACET}
              active={filters.fstate}
              blocks={allBlocks}
              allFilters={filters}
              scrollable
            />
            <FacetSection
              label="Severity Level"
              paramKey="fsev"
              options={SEV_FACET}
              active={filters.fsev}
              blocks={allBlocks}
              allFilters={filters}
            />
            <FacetSection
              label="Rule Category"
              paramKey="fcat"
              options={CAT_FACET}
              active={filters.fcat}
              blocks={allBlocks}
              allFilters={filters}
            />
            <FacetSection
              label="Target Audience"
              paramKey="faud"
              options={AUD_FACET}
              active={filters.faud}
              blocks={allBlocks}
              allFilters={filters}
            />
          </FilterForm>
        </aside>

        {/* Results */}
        <main className="flex-1 min-w-0 px-4 py-6 md:px-8">
          {fetchError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 space-y-1">
              <p className="font-semibold">Failed to fetch blocks from Optimizely Graph.</p>
              <p className="font-mono text-xs break-all">{fetchError}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <FileText size={36} className="mx-auto mb-3 opacity-30" />
              <p className="font-semibold text-slate-600 text-sm">No blocks match the selected filters.</p>
              {hasFilters && (
                <p className="mt-1 text-sm">
                  <a href={clearHref} className="text-blue-500 hover:underline">Clear filters</a> to see all results.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(b => (
                <ResultCard key={b._metadata.key} block={b} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
