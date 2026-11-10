import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import PriorityCard from '@/app/_components_portal/PriorityCard';
import { cx } from '@/app/_components_liberty/utils';
import { isEligible, whyNotEligible } from '@/lib/agent/eligibility';
import { getAgent } from '@/lib/agent/getAgent';
import { shortAgency, type Agent } from '@/lib/agent/personas';
import { applyTokens } from '@/lib/agent/tokens';
import { expandReferences, previewContextOf } from '../expandRefs';
import { blockSpacing, choice, flag, lines, str } from '../liberty/shared';
import { audienceRules } from './audience';
import AgentBlockFrame, { isEditing } from './AgentBlockFrame';
import { AgentPrioritiesContentType } from './AgentPriorities';
import { AgentPriorityContentType } from './AgentPriority';

/**
 * The agent's focus cards: the first few priorities, from the Agent Priorities
 * page, that are turned on and match the agent's role, state and agency. Put one
 * for products and one for service tasks on the dashboard and give each its own
 * role rule. Includes a "Why am I seeing these?" panel that shows the match.
 */
export const AgentPriorityCardsContentType = contentType({
  key: 'AgentPriorityCards',
  baseType: '_component',
  displayName: 'Agent: Priority cards',
  description: 'The agent’s focus cards, taken from the Agent Priorities page and matched to role, state and agency.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...blockSpacing(),
    Heading: str('Heading', 10, 'e.g. "Focus products this quarter". Tokens: {first} {state} {agency} {role}.'),
    Group: {
      ...choice('Which list', 20, [
        ['product', 'Products and bundles'],
        ['service', 'Service tasks'],
      ]),
      format: 'selectOne' as const,
    },
    PrioritiesPage: {
      type: 'contentReference' as const,
      displayName: 'Agent Priorities page',
      description: 'The page that holds the ordered priorities.',
      sortOrder: 30,
      allowedTypes: [AgentPrioritiesContentType],
    },
    WhyLabel: str('"Why" link text', 40, 'e.g. "Why am I seeing these?"'),
    WhyTitle: str('"Why" panel title', 50, 'e.g. "Matched to your role, state and agency"'),
    NotMatchedLabel: str('"Not matched" heading', 60, 'e.g. "Not matched for you"'),
    HideWhy: flag('Hide the "why" panel', 70),
    SkipLinkedTo: {
      type: 'string' as const,
      displayName: 'Leave out the priority that links to',
      description:
        'A page path such as /agent/home-auto-bundle. Use it on a product page so "More ways to bundle" does not list the page you are already on.',
      sortOrder: 80,
    },
    HideCardTags: flag('Hide the card tags', 85, 'No "Top priority" / "Featured" tag, and no yellow top rule.'),
    ...audienceRules(900),
  },
});

type Props = { content: ContentProps<typeof AgentPriorityCardsContentType> };
type Priority = ContentProps<typeof AgentPriorityContentType>;
type PrioritiesPage = ContentProps<typeof AgentPrioritiesContentType>;

/** "/Agent/Home-Auto-Bundle/" → "/agent/home-auto-bundle", for comparing page paths. */
const pathKey = (u: string | null | undefined): string => (u ?? '').trim().toLowerCase().replace(/\/+$/, '');

const asPriorities = (list: unknown): Priority[] =>
  ((list ?? []) as unknown[]).filter(
    (p): p is Priority => (p as { __typename?: string } | null)?.__typename === 'AgentPriority',
  );

function Chip({ label, value, special }: { label: string; value: string; special: boolean }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs',
        special ? 'border border-creamb bg-cream text-navy' : 'bg-mist text-lmtd',
      )}
    >
      <span className="opacity-70">{label}</span> <span className="font-medium">{value}</span>
    </span>
  );
}

function WhyPanel({
  content,
  agent,
  featured,
  notMatched,
}: {
  content: Props['content'];
  agent: Agent;
  featured: Priority[];
  notMatched: Array<[string, string]>;
}) {
  return (
    <details className="mt-3">
      <summary className="inline-block cursor-pointer text-sm text-lmt underline underline-offset-2">
        {content.WhyLabel}
      </summary>
      <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6">
        <div className="font-medium text-navy">{content.WhyTitle}</div>
        <ul className="mt-4 divide-y divide-gray-100">
          {featured.map((p, i) => {
            const stateSpecific = (p.States ?? []).some(Boolean);
            const agencySpecific = (p.Agencies ?? []).some(Boolean);
            return (
              <li key={`${p.Title}-${i}`} className="flex flex-wrap items-center gap-2 py-3">
                <span className="w-full shrink-0 font-medium text-navy sm:w-56">{p.Title}</span>
                <Chip label="Role" value={agent.role} special={false} />
                <Chip label="State" value={stateSpecific ? agent.state : 'Any state'} special={stateSpecific} />
                <Chip
                  label="Agency"
                  value={agencySpecific ? `${shortAgency(agent.agency)} only` : 'Any agency'}
                  special={agencySpecific}
                />
              </li>
            );
          })}
        </ul>
        {notMatched.length > 0 && (
          <div className="mt-2 border-t border-gray-100 pt-4">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500">{content.NotMatchedLabel}</div>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              {notMatched.map(([title, why]) => (
                <li key={title} className="flex items-center gap-3">
                  <span className="h-4 w-4 rounded-full border-2 border-gray-300" aria-hidden="true" />
                  <span className="text-navy">{title}</span>
                  <span className="text-gray-500">· {why}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </details>
  );
}

export default async function AgentPriorityCards({ content }: Props) {
  const agent = await getAgent();
  const [page] = await expandReferences<PrioritiesPage>([content.PrioritiesPage], previewContextOf(content));

  const service = content.Group === 'service';
  const all = asPriorities(service ? page?.ServicePriorities : page?.ProductPriorities);
  const count = Math.min(12, Math.max(1, Math.round(page?.FeaturedCount ?? 3)));

  // A priority whose link goes to this page is left out ("More ways to bundle").
  const skip = pathKey(content.SkipLinkedTo);
  const on = all.filter((p) => !p.Hidden && !(skip && pathKey(p.LinkUrl) === skip));
  const featured = on.filter((p) => isEligible(p, agent)).slice(0, count);
  const notMatched = on.flatMap((p): Array<[string, string]> => {
    const why = whyNotEligible(p, agent);
    return why ? [[p.Title?.trim() || 'Untitled priority', why]] : [];
  });

  // Nothing matches this agent (e.g. a service rep has no product priorities): show
  // no heading over an empty row. Editors still see the block, with a note.
  if (featured.length === 0 && !isEditing(content)) return null;

  return (
    <AgentBlockFrame content={content}>
      <h2 className="text-[26px] font-light text-navy md:text-[28px]">{applyTokens(content.Heading, agent)}</h2>
      {!page && isEditing(content) && (
        <p className="mt-3 text-sm text-gray-500">Choose the Agent Priorities page for this block.</p>
      )}
      {page && featured.length === 0 && (
        <p className="mt-3 text-sm text-gray-500">No priority matches {agent.first}, so visitors see nothing here.</p>
      )}
      {featured.length > 0 && !content.HideWhy && (
        <WhyPanel content={content} agent={agent} featured={featured} notMatched={notMatched} />
      )}
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {featured.map((p, i) => (
          <PriorityCard
            key={`${p.Title}-${i}`}
            icon={p.Icon}
            title={applyTokens(p.Title?.trim(), agent)}
            description={applyTokens(p.Description?.trim(), agent) || undefined}
            benefits={lines(p.Benefits).map((b) => applyTokens(b, agent))}
            linkLabel={p.LinkLabel?.trim() || undefined}
            linkHref={p.LinkUrl?.trim() || undefined}
            buttonLabel={p.ButtonLabel?.trim() || (service ? undefined : page?.QuoteLabel?.trim()) || undefined}
            tag={
              page?.HideTags || content.HideCardTags
                ? undefined
                : service
                  ? i === 0
                    ? 'Most used'
                    : 'Service'
                  : i === 0
                    ? 'Top priority'
                    : 'Featured'
            }
            top={i === 0 && !content.HideCardTags}
          />
        ))}
      </div>
    </AgentBlockFrame>
  );
}
