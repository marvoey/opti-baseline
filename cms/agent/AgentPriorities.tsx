import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import AgentCompare, { type CompareAgent } from '@/app/_components_portal/AgentCompare';
import PriorityIcon from '@/app/_components_portal/PriorityIcon';
import { cx, safeHref } from '@/app/_components_liberty/utils';
import { describeRules } from '@/lib/agent/eligibility';
import { AGENTS, AGENT_KEYS } from '@/lib/agent/personas';
import { flag, str } from '../liberty/shared';
import { AgentPriorityContentType } from './AgentPriority';

const listOf = (displayName: string, sortOrder: number, description: string) => ({
  type: 'array' as const,
  displayName,
  description,
  sortOrder,
  maxItems: 12,
  items: {
    type: 'content' as const,
    allowedTypes: ['_component', AgentPriorityContentType],
    restrictedTypes: [],
  },
});

/**
 * Agent Priorities (`_page`): the one place marketing decides what agents are
 * pointed at. Two ordered lists of shared Agent Priority blocks. Each agent sees
 * the first few that are turned on and match their role, state and agency, so
 * moving a priority up or down, or turning it off, changes every agent's
 * dashboard after one publish. The page itself shows what is currently set.
 */
export const AgentPrioritiesContentType = contentType({
  key: 'AgentPriorities',
  baseType: '_page',
  displayName: 'Agent Priorities',
  description: 'The ordered products, bundles and service tasks agents are pointed at.',
  mayContainTypes: ['*'],
  properties: {
    MetaTitle: str('Meta Title', 5, 'Browser tab / SEO title. Falls back to the page name.'),
    MetaDescription: str('Meta Description', 6),
    Heading: str('Heading', 10),
    Intro: str('Intro', 20, 'One or two sentences under the heading.'),
    ProductPriorities: listOf(
      'Products and bundles',
      30,
      'Agent Priority blocks, most important first. Drag to reorder. Each agent sees the first few that are on and match.',
    ),
    ServicePriorities: listOf(
      'Service tasks',
      40,
      'Agent Priority blocks for service representatives, most important first.',
    ),
    FeaturedCount: {
      type: 'integer' as const,
      displayName: 'Cards shown per agent',
      description: 'How many priorities each agent sees on the dashboard. Default 3.',
      sortOrder: 50,
    },
    QuoteLabel: str(
      'Quote button text',
      60,
      'Text of the teal button on product cards, e.g. "Start a quote". Set here once and every card follows.',
    ),
    HideTags: flag('Hide the card tags', 70, 'Hides "Top priority" and "Featured" on the cards.'),
  },
});

type Props = { content: ContentProps<typeof AgentPrioritiesContentType> };
type Priority = ContentProps<typeof AgentPriorityContentType>;

const priorities = (list: unknown): Priority[] =>
  ((list ?? []) as unknown[]).filter(
    (p): p is Priority => (p as { __typename?: string } | null)?.__typename === 'AgentPriority',
  );

const chip = (text: string, specific: boolean) => (
  <span
    className={cx(
      'rounded-full px-2.5 py-0.5 text-[11px]',
      specific ? 'border border-creamb bg-cream text-navy' : 'bg-[#F1F3F7] text-gray-600',
    )}
  >
    {text}
  </span>
);

function PriorityList({ title, items, featured }: { title: string; items: Priority[]; featured: number }) {
  // The first `featured` priorities that are on: these are what an agent can see.
  const featuredIdx = new Set(
    items.flatMap((p, i) => (p.Hidden ? [] : [i])).slice(0, featured),
  );
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-light text-navy">{title}</h2>
      <ol className="mt-4 space-y-3">
        {items.map((p, i) => {
          const on = !p.Hidden;
          const isFeatured = featuredIdx.has(i);
          const r = describeRules(p);
          return (
            <li
              key={`${p.Title}-${i}`}
              className={cx('flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4', !on && 'opacity-70')}
            >
              <span
                className={cx(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-medium',
                  !on ? 'bg-gray-200 text-gray-500' : isFeatured ? 'bg-navy text-white' : 'bg-navy/40 text-white',
                )}
              >
                {i + 1}
              </span>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mist text-lmt">
                <PriorityIcon name={p.Icon} className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-navy">{p.Title?.trim() || 'Untitled priority'}</span>
                  {!on && (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-600">
                      Off
                    </span>
                  )}
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  {chip(r.roles, false)}
                  {chip(r.states, r.specificStates)}
                  {chip(r.agencies, r.specificAgencies)}
                </div>
              </div>
              {p.LinkUrl?.trim() && safeHref(p.LinkUrl) !== '#' && (
                <a href={safeHref(p.LinkUrl)} className="hidden shrink-0 text-sm text-lmt underline underline-offset-2 sm:block">
                  Open
                </a>
              )}
            </li>
          );
        })}
        {items.length === 0 && <li className="text-sm text-gray-500">Nothing here yet.</li>}
      </ol>
    </section>
  );
}

/** The four demo agents, as plain data for the compare panel. */
const compareAgents: CompareAgent[] = AGENT_KEYS.map((k) => ({
  key: k,
  name: AGENTS[k].name,
  role: AGENTS[k].role,
  state: AGENTS[k].state,
  agency: AGENTS[k].agency,
}));

export default function AgentPriorities({ content }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { pa } = getPreviewUtils(content as any);
  const featured = Math.min(12, Math.max(1, Math.round(content.FeaturedCount ?? 3)));

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <main {...pa(content as any)} className="bg-white pb-4">
      <div className="mx-auto max-w-4xl px-6 pt-6">
        <h1 {...pa('Heading')} className="text-[28px] font-light text-navy">
          {content.Heading}
        </h1>
        <p {...pa('Intro')} className="mt-1 text-sm text-gray-600">
          {content.Intro}
        </p>
        <PriorityList title="Products and bundles" items={priorities(content.ProductPriorities)} featured={featured} />
        <PriorityList title="Service tasks" items={priorities(content.ServicePriorities)} featured={featured} />
        <p className="mt-8 text-xs text-gray-500">
          Each agent sees the top {featured} that are on and match their role, state and agency. To change this, edit
          the page in the CMS: reorder the lists, turn a priority off, then publish.
        </p>
      </div>

      {/* Wider than the lists above, so two dashboards fit side by side. */}
      <section aria-labelledby="compare-heading" className="mx-auto mt-14 max-w-6xl border-t border-gray-100 px-6 pt-10">
        <h2 id="compare-heading" className="text-2xl font-light text-navy">
          Preview by agent audience
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          See the dashboard the way different agents see it: pick an agent in each view. This shows what agents see
          today (the published dashboards). Change the priorities above, publish, and reload to see the difference.
        </p>
        <AgentCompare agents={compareAgents} initial={['dana', 'marcus']} />
      </section>
    </main>
  );
}
