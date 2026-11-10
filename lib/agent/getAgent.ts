import { cache } from 'react';
import { cookies, headers } from 'next/headers';
import { AGENTS, AGENT_COOKIE, AGENT_HEADER, DEFAULT_AGENT_KEY, isAgentKey, type Agent, type AgentKey } from './personas';

/**
 * The demo switch can be turned off with AGENT_DEMO_SWITCH=off (e.g. on a
 * deployment that must not let visitors pick an identity). Then every request
 * is the default agent.
 */
export const demoSwitchEnabled = (): boolean => process.env.AGENT_DEMO_SWITCH !== 'off';

/** The viewer's own agent: `?agent=` (this request only), then the cookie, then the default. */
const viewerAgent = cache(async (): Promise<Agent> => {
  if (!demoSwitchEnabled()) return AGENTS[DEFAULT_AGENT_KEY];

  const fromHeader = (await headers()).get(AGENT_HEADER);
  if (isAgentKey(fromHeader)) return AGENTS[fromHeader];

  const fromCookie = (await cookies()).get(AGENT_COOKIE)?.value;
  if (isAgentKey(fromCookie)) return AGENTS[fromCookie];

  return AGENTS[DEFAULT_AGENT_KEY];
});

/** One slot per request (React.cache), set by a page that is "for" a given agent. */
const override = cache(() => ({ key: null as AgentKey | null }));

/**
 * Make every block on this page, and anything rendered after it, use `key` as
 * the agent. Used by a dashboard page whose "Show as agent" is set, and by the
 * CMS preview route for `?agent=`. Call it at the top of a server component,
 * before its children render. Values that are not one of the four agent keys
 * are ignored.
 */
export function setAgentOverride(key: unknown): void {
  if (isAgentKey(key)) override().key = key;
}

/**
 * The agent whose portal this request renders.
 *
 * DEMO ONLY: the identity is taken from the page's override (if any), then
 * `?agent=` (this request only, so a side-by-side preview can show two agents
 * without touching the visitor's own choice), then the cookie, then the default.
 * Everything is checked against the fixed list of four agents, so any other
 * value is ignored. Replace this one function with the verified SSO identity
 * for a real portal.
 *
 * The viewer lookup is wrapped in React.cache: the header, the cards and every
 * block on a page share one lookup per request.
 */
export async function getAgent(): Promise<Agent> {
  const forced = override().key;
  return forced ? AGENTS[forced] : viewerAgent();
}
