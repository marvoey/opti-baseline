import type { Metadata } from 'next';
import Link from 'next/link';
import { siteOrigin } from '@/lib/siteHost';
import {
  CHANNELS,
  PRODUCT_LINES,
  buildGroupQuery,
  describeCategory,
  fetchGroupPages,
  findTerm,
  flattenTerms,
  type GroupPage,
  type GroupTerm,
} from '@/lib/groups';

/**
 * /demo/groups - the Graph query view behind "one CMS, grouped by product line and
 * channel" (RFI 5.2-5.4 and 5.10). Pick a product line and a channel; the page runs
 * one Optimizely Graph query (lib/groups.ts) that filters on category assignments and
 * the site host, lists the pages it found and shows the query it ran.
 *
 * Lives outside app/[locale]: proxy.ts already excludes /demo from the locale rewrite,
 * so this is a plain route, not CMS content. It is internal demo material, so it is
 * noindex and not linked from site navigation.
 */

export const metadata: Metadata = {
  title: 'Content groups: Graph query view',
  description: 'Filter eHealth pages by product line and channel category with one Optimizely Graph query.',
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

const PRESETS: { label: string; product?: string; channel?: string }[] = [
  { label: 'All organic Medicare pages', product: 'medicare', channel: 'organic' },
  { label: 'All paid ACA landing pages', product: 'individual-family', channel: 'paid' },
  { label: 'Everything under Dental & Vision', product: 'dental-vision' },
];

function groupHref(product?: string, channel?: string): string {
  const params = new URLSearchParams();
  if (product) params.set('product', product);
  if (channel) params.set('channel', channel);
  const qs = params.toString();
  return qs ? `/demo/groups?${qs}` : '/demo/groups';
}

const chipBase =
  'inline-block rounded-full border-[1.5px] border-[#08251A] px-3 py-1 text-sm font-medium transition-colors';
const chipClass = (active: boolean) => `${chipBase} ${active ? 'bg-[#ABFF44]' : 'bg-white hover:bg-[#EFF6E9]'}`;
const card = 'rounded-3xl border-2 border-[#08251A] bg-white p-6 md:p-8';

function FilterRow({
  title,
  terms,
  activeSlug,
  hrefFor,
}: {
  title: string;
  terms: GroupTerm[];
  activeSlug?: string;
  hrefFor: (slug?: string) => string;
}) {
  return (
    <div>
      <p className="mb-2 font-mono text-xs uppercase tracking-wider">{title}</p>
      <div className="flex flex-wrap gap-2">
        <Link href={hrefFor(undefined)} className={chipClass(!activeSlug)}>
          All
        </Link>
        {flattenTerms(terms).map(({ term, depth }) => (
          <Link key={term.key} href={hrefFor(term.slug)} className={chipClass(activeSlug === term.slug)}>
            {depth > 0 ? `↳ ${term.label}` : term.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function labelsFor(page: GroupPage, group: 'product' | 'channel'): string[] {
  const labels: string[] = [];
  for (const uri of page.categories) {
    const hit = describeCategory(uri);
    if (hit?.group === group) labels.push(hit.label);
  }
  return labels;
}

function Labels({ values }: { values: string[] }) {
  if (values.length === 0) return <span className="text-[#08251A]/50">None</span>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {values.map((value) => (
        <span
          key={value}
          className="inline-block rounded-full border border-[#08251A] bg-[#EFF6E9] px-2.5 py-0.5 text-xs"
        >
          {value}
        </span>
      ))}
    </div>
  );
}

export default async function GroupsPage({ searchParams }: Props) {
  const params = await searchParams;
  const productSlug = first(params.product);
  const channelSlug = first(params.channel);
  const product = findTerm(PRODUCT_LINES, productSlug);
  const channel = findTerm(CHANNELS, channelSlug);
  const host = await siteOrigin();

  let result: Awaited<ReturnType<typeof fetchGroupPages>> | null = null;
  let error: string | null = null;
  if (host) {
    try {
      result = await fetchGroupPages(host, { product, channel });
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }
  }
  const request = host ? buildGroupQuery(host, { product, channel }) : null;

  return (
    <main className="min-h-screen bg-[#E4F0DA] px-5 py-10 text-[#08251A]">
      <div className="mx-auto max-w-6xl space-y-8">
        <header>
          <span className="inline-block rounded-full border-[1.5px] border-[#08251A] bg-[#ABFF44] px-3 py-1 font-mono text-xs">
            eHealth · RFI 5.2–5.4 and 5.10
          </span>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight text-[#08251A] md:text-5xl">
            One CMS, grouped by product line and channel
          </h1>
          <p className="mt-3 max-w-3xl">
            Pick a product line and a channel. This page runs one Optimizely Graph query that filters on category
            assignments and the site host, then shows the query it ran.
          </p>
        </header>

        <section className={`${card} space-y-6`}>
          <div>
            <p className="mb-2 font-mono text-xs uppercase tracking-wider">Quick questions</p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset) => (
                <Link
                  key={preset.label}
                  href={groupHref(preset.product, preset.channel)}
                  className={chipClass(productSlug === preset.product && channelSlug === preset.channel)}
                >
                  {preset.label}
                </Link>
              ))}
            </div>
          </div>
          <FilterRow
            title="Product line"
            terms={PRODUCT_LINES}
            activeSlug={product?.slug}
            hrefFor={(slug) => groupHref(slug, channel?.slug)}
          />
          <FilterRow
            title="Channel"
            terms={CHANNELS}
            activeSlug={channel?.slug}
            hrefFor={(slug) => groupHref(product?.slug, slug)}
          />
        </section>

        <section className={card}>
          {error && (
            <p className="rounded-xl border border-[#08251A] bg-[#FFE08A] p-4 text-sm">
              Graph returned an error: {error}
            </p>
          )}
          {!host && !error && (
            <p className="rounded-xl border border-[#08251A] bg-[#FFE08A] p-4 text-sm">
              Could not work out the site host for this request, so the query cannot be scoped to it.
            </p>
          )}
          {result && (
            <>
              <h2 className="font-display text-2xl font-extrabold text-[#08251A]">
                {result.total} {result.total === 1 ? 'page' : 'pages'} in this group
              </h2>
              <p className="mt-1 text-sm">
                Product line: <strong>{product?.label ?? 'any'}</strong> · Channel:{' '}
                <strong>{channel?.label ?? 'any'}</strong>
              </p>

              {result.pages.length === 0 ? (
                <p className="mt-4 text-sm">No pages match. Check that the pages are tagged and published.</p>
              ) : (
                <div className="mt-4 overflow-x-auto rounded-2xl border-2 border-[#08251A]">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-[#ABFF44] text-left">
                        {['Page', 'Path', 'Product line', 'Channel', 'Type'].map((heading) => (
                          <th key={heading} className="whitespace-nowrap border-b-2 border-[#08251A] px-4 py-3 font-bold">
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.pages.map((page) => (
                        <tr key={page.key} className="border-t border-[#CFDCC4] align-top even:bg-[#EFF6E9]">
                          <td className="px-4 py-3 font-semibold">
                            <Link href={page.path} className="underline decoration-[#197050]">
                              {page.name}
                            </Link>
                          </td>
                          <td className="px-4 py-3 font-mono text-xs">{page.path}</td>
                          <td className="px-4 py-3">
                            <Labels values={labelsFor(page, 'product')} />
                          </td>
                          <td className="px-4 py-3">
                            <Labels values={labelsFor(page, 'channel')} />
                          </td>
                          <td className="px-4 py-3 font-mono text-xs">{page.type}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </section>

        {request && (
          <section className={card}>
            <h2 className="font-display text-2xl font-extrabold text-[#08251A]">The GraphQL behind this view</h2>
            <p className="mt-1 text-sm">
              Scoped to <span className="font-mono text-xs">{host}</span> and to the content tree under eHealth Home,
              so other demos that share this Graph instance never appear. Filtering on a parent term also matches its
              children.
            </p>
            <h3 className="mt-5 font-mono text-xs uppercase tracking-wider text-[#08251A]">Query</h3>
            <pre className="mt-2 overflow-x-auto rounded-2xl bg-[#08251A] p-4 font-mono text-xs leading-relaxed text-[#E4F0DA]">
              {request.query}
            </pre>
            <h3 className="mt-5 font-mono text-xs uppercase tracking-wider text-[#08251A]">Variables</h3>
            <pre className="mt-2 overflow-x-auto rounded-2xl bg-[#08251A] p-4 font-mono text-xs leading-relaxed text-[#E4F0DA]">
              {JSON.stringify(request.variables, null, 2)}
            </pre>
          </section>
        )}

        <section className={card}>
          <h2 className="font-display text-2xl font-extrabold text-[#08251A]">What this answers in the RFI</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-sm">
            <li>
              <strong>5.2 Grouping construct.</strong> Categories are the grouping. Product line and Channel are two
              independent groups, authored in the CMS rather than in code.
            </li>
            <li>
              <strong>5.3 Many groups, nested.</strong> A page carries one term from each group. Dental &amp; Vision
              contains Dental and Vision, so the parent filter also returns pages tagged with either child.
            </li>
            <li>
              <strong>5.4 Per-app scoping.</strong> The host and content-tree filters limit the query to one site, so
              each front end fetches only its own content.
            </li>
            <li>
              <strong>5.10 Reporting by group.</strong> The same query, with different category filters, answers
              questions such as all organic Medicare pages or all paid ACA landing pages.
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
