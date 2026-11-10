/**
 * The demo agents of the Independent Agent Portal (copied from
 * public/use-case-2-agent-portal.html).
 *
 * DEMO ONLY. In a real portal the role, state and agency of the signed-in agent
 * come from the verified identity (SSO claims), never from a cookie or a URL.
 * Everything here stands in for those claims so the audience rules on the CMS
 * content can be shown working. Nothing in the portal content is secret.
 */

export const PRODUCER = 'Producer';
export const PRINCIPAL = 'Agency Principal';
export const SERVICE = 'Service Representative';

export type AgentRole = typeof PRODUCER | typeof PRINCIPAL | typeof SERVICE;

export type Agent = {
  key: AgentKey;
  first: string;
  name: string;
  initials: string;
  role: AgentRole;
  state: string;
  agency: string;
  email: string;
};

export const AGENT_KEYS = ['dana', 'tyler', 'marcus', 'elena'] as const;
export type AgentKey = (typeof AGENT_KEYS)[number];

export const DEFAULT_AGENT_KEY: AgentKey = 'dana';

/** Cookie set by POST /api/agent (the "view as" switch). */
export const AGENT_COOKIE = 'lm_agent';
/** Request header set by proxy.ts from `?agent=`. One request only, never stored. */
export const AGENT_HEADER = 'x-agent';

export const AGENTS: Record<AgentKey, Agent> = {
  dana: {
    key: 'dana',
    first: 'Dana',
    name: 'Dana Whitfield',
    initials: 'DW',
    role: PRODUCER,
    state: 'Texas',
    agency: 'Harbor Light Insurance Group',
    email: 'dana.whitfield@harborlightins.com',
  },
  tyler: {
    key: 'tyler',
    first: 'Tyler',
    name: 'Tyler Brooks',
    initials: 'TB',
    role: PRODUCER,
    state: 'Texas',
    agency: 'Lone Star Independent Agents',
    email: 'tyler.brooks@lonestarindependent.com',
  },
  marcus: {
    key: 'marcus',
    first: 'Marcus',
    name: 'Marcus Chen',
    initials: 'MC',
    role: PRINCIPAL,
    state: 'Florida',
    agency: 'Sunrise Coast Insurance Group',
    email: 'marcus.chen@sunrisecoastins.com',
  },
  elena: {
    key: 'elena',
    first: 'Elena',
    name: 'Elena Ruiz',
    initials: 'ER',
    role: SERVICE,
    state: 'Ohio',
    agency: 'Buckeye Independent Agency',
    email: 'elena.ruiz@buckeyeagency.com',
  },
};

/** Allow-list check for any value that arrives from a cookie, header or request body. */
export function isAgentKey(value: unknown): value is AgentKey {
  return typeof value === 'string' && (AGENT_KEYS as readonly string[]).includes(value);
}

/** "Harbor Light Insurance Group" → "Harbor Light". */
export function shortAgency(agency: string): string {
  return agency.replace(/ (Insurance Group|Independent Agents|Independent Agency)$/, '');
}

/**
 * The agent a URL is for, when it is one of the per-agent dashboards
 * (/agent/dana, /agent/marcus/..., also with a locale prefix like /fr/agent/dana),
 * or null. Allow-listed: only the four agent keys match.
 */
const AGENT_PATH_RE = new RegExp(`^/(?:[a-z]{2}(?:-[A-Za-z0-9]+)?/)?agent/(${AGENT_KEYS.join('|')})(?:/|$)`);

export function agentKeyFromPath(pathname: string | null | undefined): AgentKey | null {
  const key = AGENT_PATH_RE.exec(pathname ?? '')?.[1];
  return isAgentKey(key) ? key : null;
}
