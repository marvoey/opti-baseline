import type { Metadata } from 'next';
import Link from 'next/link';
import CardBlock from '@/cms/BasicBlocks/CardBlock';
import type { ContentOf } from '@/app/styleguide/_blocks';
import { fetchCardBlocks } from '@/lib/cms/fetchCardBlocks';
import { INTENT, PERSONA, GEO, SERVICE } from '@/lib/cms/taxonomy';
import { FilterForm } from '../_components/FilterForm';

export const metadata: Metadata = { title: 'Card Block Library' };
export const dynamic = 'force-dynamic';

type SearchParams = Promise<{
  intent?: string;
  persona?: string;
  geo?: string;
  service?: string;
}>;

type Props = { searchParams: SearchParams };

function TaxonomyBadge({ label }: { label: string }) {
  return (
    <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-700 dark:text-slate-400">
      {label}
    </span>
  );
}

function labelFor(map: Record<string, { displayName: string }>, code: string | null) {
  return code ? (map[code]?.displayName ?? code) : null;
}

export default async function CardLibraryPage({ searchParams }: Props) {
  const params = await searchParams;
  const filters = {
    intent:  params.intent  || undefined,
    persona: params.persona || undefined,
    geo:     params.geo     || undefined,
    service: params.service || undefined,
  };

  const hasFilter = Object.values(filters).some(Boolean);
  const { items, error } = hasFilter
    ? await fetchCardBlocks(filters)
    : { items: [], error: undefined };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* header */}
      <div className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                Card Block Library
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Live renders of CardBlock items from the CMS, filtered by taxonomy.
              </p>
            </div>
            {/* view switcher */}
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-700">
              <Link
                href={`/content-library${hasFilter ? `?intent=${params.intent ?? ''}&persona=${params.persona ?? ''}&geo=${params.geo ?? ''}&service=${params.service ?? ''}` : ''}`}
                className="rounded-md px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-white"
              >
                List
              </Link>
              <span className="rounded-md bg-white px-4 py-1.5 text-sm font-semibold text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white">
                Cards
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
        {/* filters */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Filters
          </h2>
          <FilterForm
            filters={filters}
            action="/content-library/cards"
            clearHref="/content-library/cards"
          />
        </div>

        {/* error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 dark:border-red-800 dark:bg-red-950">
            <p className="font-medium text-red-800 dark:text-red-300">Graph query failed</p>
            <p className="mt-1 font-mono text-xs text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* results */}
        {hasFilter && !error && (
          <section>
            <p className="mb-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {items.length === 0
                ? 'No results'
                : `${items.length} card${items.length !== 1 ? 's' : ''}`}
            </p>

            {items.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => {
                  const services = (item.Service ?? []).map(
                    (c) => SERVICE[c]?.displayName ?? c,
                  );
                  return (
                    <div key={item.key} className="flex flex-col gap-3">
                      {/* rendered block — same as in an experience */}
                      <CardBlock
                        content={
                          {
                            _metadata:    { key: item.key, displayName: item.displayName },
                            Title:        item.Title,
                            Body:         item.Body,
                            Link:         item.Link,
                          } as ContentOf<typeof CardBlock>
                        }
                      />
                      {/* taxonomy tags beneath each card */}
                      <div className="flex flex-wrap gap-1.5">
                        {item.Intent  && <TaxonomyBadge label={`Intent: ${labelFor(INTENT,  item.Intent)}`}  />}
                        {item.Persona && <TaxonomyBadge label={`Persona: ${labelFor(PERSONA, item.Persona)}`} />}
                        {item.Geo     && <TaxonomyBadge label={`Geo: ${labelFor(GEO, item.Geo)}`}            />}
                        {services.map((s) => <TaxonomyBadge key={s} label={`Service: ${s}`} />)}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white px-6 py-10 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                No cards match the selected filters.
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
