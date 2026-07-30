import type { Metadata } from 'next';
import Link from 'next/link';
import { INTENT, PERSONA, GEO, SERVICE } from '@/lib/cms/taxonomy';
import { fetchByTaxonomy, type TaxonomyBlock } from '@/lib/cms/fetchByTaxonomy';
import { FilterForm } from './_components/FilterForm';

export const metadata: Metadata = { title: 'Content Library' };
export const dynamic = 'force-dynamic';

type SearchParams = Promise<{
  intent?:  string;
  persona?: string;
  geo?:     string;
  service?: string;
}>;

type Props = { searchParams: SearchParams };

// ─── helpers ────────────────────────────────────────────────────────────────

const TYPE_LABEL: Record<TaxonomyBlock['_type'], string> = {
  CardBlock:   'Card',
  Paragraph:   'Paragraph',
  ActionBlock: 'Action',
  HeroBlockv2: 'Hero',
};

const TYPE_COLOR: Record<TaxonomyBlock['_type'], string> = {
  CardBlock:   'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  Paragraph:   'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  ActionBlock: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  HeroBlockv2: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
};

function labelFor(map: Record<string, { displayName: string }>, code: string | null) {
  return code ? (map[code]?.displayName ?? code) : null;
}

function Tag({ label, muted = false }: { label: string; muted?: boolean }) {
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
        muted
          ? 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
          : 'bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-300'
      }`}
    >
      {label}
    </span>
  );
}

function ResultCard({ block }: { block: TaxonomyBlock }) {
  const services = (block.service ?? []).map((code) => SERVICE[code]?.displayName ?? code);
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded px-2 py-0.5 text-xs font-semibold ${TYPE_COLOR[block._type]}`}>
            {TYPE_LABEL[block._type]}
          </span>
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {block.displayName}
          </span>
        </div>
        <code className="break-all font-mono text-xs text-slate-400 dark:text-slate-500">
          {block.key}
        </code>
      </div>

      {block.preview && (
        <p className="mt-2 line-clamp-1 text-sm text-slate-600 dark:text-slate-400">
          {block.preview}
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {block.intent  && <Tag label={`Intent: ${labelFor(INTENT,  block.intent)}`} />}
        {block.persona && <Tag label={`Persona: ${labelFor(PERSONA, block.persona)}`} />}
        {block.geo     && <Tag label={`Geo: ${labelFor(GEO, block.geo)}`} />}
        {services.map((s) => <Tag key={s} label={`Service: ${s}`} />)}
        {!block.intent && !block.persona && !block.geo && services.length === 0 && (
          <Tag label="No taxonomy tags" muted />
        )}
      </div>
    </div>
  );
}

// ─── page ────────────────────────────────────────────────────────────────────

export default async function ContentLibraryPage({ searchParams }: Props) {
  const params = await searchParams;
  const filters = {
    intent:  params.intent  || undefined,
    persona: params.persona || undefined,
    geo:     params.geo     || undefined,
    service: params.service || undefined,
  };

  const hasFilter = Object.values(filters).some(Boolean);
  const { results, error } = hasFilter
    ? await fetchByTaxonomy(filters)
    : { results: [], error: undefined };

  const cardResults = results.filter((r) => r._type === 'CardBlock');
  const cardQs = hasFilter
    ? `?${new URLSearchParams(Object.entries(filters).filter(([, v]) => v) as [string, string][]).toString()}`
    : '';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* header */}
      <div className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                Content Library
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Find blocks by Intent, Persona, Service, and Geo taxonomy. Intent, Persona and Geo
                are filtered in Graph; Service is applied post-query.
              </p>
            </div>
            {/* view switcher */}
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-700">
              <span className="rounded-md bg-white px-4 py-1.5 text-sm font-semibold text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white">
                List
              </span>
              <Link
                href={`/content-library/cards${cardQs}`}
                className="rounded-md px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-white"
              >
                Cards
              </Link>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-5xl space-y-8 px-6 py-10">
        {/* filter form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Filters
          </h2>
          <FilterForm
            filters={filters}
            action="/content-library"
            clearHref="/content-library"
          />
        </div>

        {/* error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 dark:border-red-800 dark:bg-red-950">
            <p className="font-medium text-red-800 dark:text-red-300">Graph query failed</p>
            <p className="mt-1 font-mono text-xs text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {hasFilter && !error && (
          <section>
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {results.length === 0
                  ? 'No results'
                  : `${results.length} result${results.length !== 1 ? 's' : ''}`}
              </h2>
              {cardResults.length > 0 && (
                <Link
                  href={`/content-library/cards${cardQs}`}
                  className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                >
                  View {cardResults.length} card{cardResults.length !== 1 ? 's' : ''} rendered →
                </Link>
              )}
            </div>

            {results.length > 0 ? (
              <div className="space-y-3">
                {results.map((block) => (
                  <ResultCard key={block.key} block={block} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white px-6 py-10 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                No blocks match the selected filters.
              </div>
            )}
          </section>
        )}

        {!hasFilter && (
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-10 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
            Select at least one filter and click Search.
          </div>
        )}
      </main>
    </div>
  );
}
