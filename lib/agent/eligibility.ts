import type { Agent } from './personas';
import { PRODUCER, PRINCIPAL, SERVICE, shortAgency } from './personas';

/**
 * Audience rules as stored on CMS content (see cms/agent/audience.ts for the
 * properties). Every field is optional because an editor may leave it empty,
 * and the CMS delivers empty values as null.
 *
 * An empty rule means "everyone": no role ticked = all roles, no states listed =
 * all states, no agencies listed = all agencies. A block with no rules at all is
 * therefore shown to every agent.
 */
export type AudienceRules = {
  ForProducers?: boolean | null;
  ForPrincipals?: boolean | null;
  ForServiceReps?: boolean | null;
  States?: ReadonlyArray<string | null> | null;
  Agencies?: ReadonlyArray<string | null> | null;
};

const norm = (s: string | null | undefined): string => (s ?? '').trim().toLowerCase();
const list = (l: AudienceRules['States']): string[] => (l ?? []).map(norm).filter(Boolean);

/** Agency names may be typed in full or short ("Harbor Light"), in any case. */
const agencyForms = (agency: string): string[] => {
  const full = norm(agency);
  const short = norm(agency.replace(/ (Insurance Group|Independent Agents|Independent Agency)$/, ''));
  return [full, short];
};

/** Roles an editor has ticked. Empty array = no restriction. */
export function allowedRoles(rules: AudienceRules): Agent['role'][] {
  const roles: Agent['role'][] = [];
  if (rules.ForProducers) roles.push(PRODUCER);
  if (rules.ForPrincipals) roles.push(PRINCIPAL);
  if (rules.ForServiceReps) roles.push(SERVICE);
  return roles;
}

/**
 * Does this agent match the rules? Role, state and agency must all match (each
 * dimension is skipped when it is empty). This is the single place the rule is
 * evaluated, so a dashboard card and a table row can never disagree.
 */
export function isEligible(rules: AudienceRules | null | undefined, agent: Agent): boolean {
  if (!rules) return true;

  const roles = allowedRoles(rules);
  if (roles.length > 0 && !roles.includes(agent.role)) return false;

  const states = list(rules.States);
  if (states.length > 0 && !states.includes(norm(agent.state))) return false;

  const agencies = list(rules.Agencies);
  if (agencies.length > 0 && !agencyForms(agent.agency).some((a) => agencies.includes(a))) return false;

  return true;
}

const ROLE_PLURAL: Record<Agent['role'], string> = {
  [PRODUCER]: 'Producers',
  [PRINCIPAL]: 'Principals',
  [SERVICE]: 'Service reps',
};

/** Short, readable version of the rules, for chips on the Priorities page. */
export type RuleSummary = {
  roles: string;
  states: string;
  agencies: string;
  /** True when the rule narrows by state / agency (shown highlighted). */
  specificStates: boolean;
  specificAgencies: boolean;
};

export function describeRules(rules: AudienceRules | null | undefined): RuleSummary {
  const roles = rules ? allowedRoles(rules) : [];
  const states = rules ? (rules.States ?? []).map((s) => (s ?? '').trim()).filter(Boolean) : [];
  const agencies = rules ? (rules.Agencies ?? []).map((s) => (s ?? '').trim()).filter(Boolean) : [];
  return {
    roles: roles.length === 0 || roles.length === 3 ? 'All roles' : roles.map((r) => ROLE_PLURAL[r]).join(', '),
    states: states.length ? states.join(', ') : 'All states',
    agencies: agencies.length ? `${agencies.join(', ')} only` : 'All agencies',
    specificStates: states.length > 0,
    specificAgencies: agencies.length > 0,
  };
}

/**
 * Why an agent does NOT match, in a few words ("Not for producers",
 * "Florida only", "Harbor Light agencies only"), or null when they match.
 * Checked in the same order as isEligible, so the reason is the first rule that fails.
 */
export function whyNotEligible(rules: AudienceRules | null | undefined, agent: Agent): string | null {
  if (!rules || isEligible(rules, agent)) return null;

  const roles = allowedRoles(rules);
  if (roles.length > 0 && !roles.includes(agent.role)) return `Not for ${ROLE_PLURAL[agent.role].toLowerCase()}`;

  const states = (rules.States ?? []).map((s) => (s ?? '').trim()).filter(Boolean);
  if (states.length > 0 && !list(rules.States).includes(norm(agent.state))) return `${states.join(', ')} only`;

  const agencies = (rules.Agencies ?? []).map((s) => (s ?? '').trim()).filter(Boolean);
  return `${agencies.map(shortAgency).join(', ')} agencies only`;
}
