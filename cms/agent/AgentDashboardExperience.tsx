import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { OptimizelyComposition, getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { safeHref } from '@/app/_components_liberty/utils';
import { getAgent, setAgentOverride } from '@/lib/agent/getAgent';
import { AGENTS, AGENT_KEYS, PRINCIPAL, SERVICE, shortAgency } from '@/lib/agent/personas';
import { applyTokens } from '@/lib/agent/tokens';
import { ComponentWrapper } from '../wrappers';
import { choice, str } from '../liberty/shared';

/**
 * Agent Dashboard (`_experience`): the landing page of the Independent Agent
 * Portal. The greeting band (the agent's role, state and agency, a welcome and
 * one line per role) is part of the page type; everything below it is a normal
 * Visual Builder canvas of blocks.
 *
 * "Show as agent" is optional. Left empty the page is for whoever is viewing it
 * (the "view as" switch picks the agent in the demo). Set, the page is always
 * shown as that agent, which gives one dashboard page per agent.
 */
export const AgentDashboardExperienceContentType = contentType({
  key: 'AgentDashboardExperience',
  baseType: '_experience',
  displayName: 'Agent Dashboard',
  description: 'Independent Agent Portal landing page: greeting for the agent, then a canvas of blocks.',
  mayContainTypes: ['*'],
  properties: {
    MetaTitle: str('Meta Title', 5, 'Browser tab / SEO title. Falls back to the page name.'),
    MetaDescription: str('Meta Description', 6),
    ForAgent: {
      ...choice(
        'Show as agent',
        8,
        AGENT_KEYS.map((k) => [k, `${AGENTS[k].name} · ${AGENTS[k].role} · ${AGENTS[k].state}`] as const),
        'Optional. Pick an agent to always show this page as that agent. To use the page for whoever is viewing it, clear the choice.',
      ),
      format: 'selectOne' as const,
    },
    Greeting: str('Greeting', 10, 'Before the first name, e.g. "Good morning".'),
    TaglineProducer: str(
      'Tagline for producers',
      20,
      'You can use {first}, {state}, {agency} and {role}, e.g. "Here’s what to focus on with your {state} clients this quarter."',
    ),
    TaglinePrincipal: str('Tagline for agency principals', 30, 'Same tokens as above.'),
    TaglineServiceRep: str('Tagline for service representatives', 40, 'Same tokens as above.'),
    PrimaryButtonLabel: str('Primary button text', 50),
    PrimaryButtonUrl: str('Primary button URL', 60),
    SecondaryButtonLabel: str('Secondary button text', 70),
    SecondaryButtonUrl: str('Secondary button URL', 80),
  },
});

type Props = { content: ContentProps<typeof AgentDashboardExperienceContentType> };

export default async function AgentDashboardExperience({ content }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { pa } = getPreviewUtils(content as any);
  // "Show as agent": every block below uses this agent too (set before they render).
  setAgentOverride(content.ForAgent);
  const agent = await getAgent();
  const nodes = content.composition?.nodes ?? [];

  const tagline =
    agent.role === SERVICE ? content.TaglineServiceRep : agent.role === PRINCIPAL ? content.TaglinePrincipal : content.TaglineProducer;

  // pt-6 on <main>: breathing room between the header and the greeting band (the mockup's 1.5rem).
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <main {...pa(content as any)} className="bg-white pb-4 pt-6">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-mist px-6 py-8 md:px-10 md:py-9">
          <div>
            <div className="flex flex-wrap gap-2 text-xs">
              {[agent.role, agent.state, shortAgency(agent.agency)].map((chip) => (
                <span key={chip} className="rounded-full bg-white px-3 py-1 font-medium text-lmtd">
                  {chip}
                </span>
              ))}
            </div>
            <h1 className="mt-4 text-[32px] font-light leading-tight text-navy md:text-[36px]">
              <span {...pa('Greeting')}>{content.Greeting}</span>, <span className="font-bold">{agent.first}</span>
            </h1>
            <p {...pa('TaglineProducer')} className="mt-2 text-gray-600">
              {applyTokens(tagline, agent)}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {content.PrimaryButtonLabel && (
              <a
                href={safeHref(content.PrimaryButtonUrl)}
                className="rounded-md bg-lmt px-6 py-3 font-medium text-white hover:bg-lmtd"
              >
                {content.PrimaryButtonLabel}
              </a>
            )}
            {content.SecondaryButtonLabel && (
              <a
                href={safeHref(content.SecondaryButtonUrl)}
                className="rounded-md border border-lmt bg-white px-6 py-3 font-medium text-lmt"
              >
                {content.SecondaryButtonLabel}
              </a>
            )}
          </div>
        </div>
      </div>
      {nodes.length > 0 && <OptimizelyComposition nodes={nodes} ComponentWrapper={ComponentWrapper} />}
    </main>
  );
}
