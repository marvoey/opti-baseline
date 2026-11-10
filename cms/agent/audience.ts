// Audience rules for the Independent Agent Portal content. Kept as `.ts` (not
// `.tsx`) so the `./cms/**/*.tsx` push glob skips it: it defines no content type.

import { flag } from '../liberty/shared';

/**
 * Spread into the `properties` of any type that can be targeted at agents
 * (priorities and the dashboard blocks). The rule itself is evaluated by
 * `isEligible` in lib/agent/eligibility.ts.
 *
 *  - No role ticked      = all roles
 *  - No states listed    = all states
 *  - No agencies listed  = all agencies
 *
 * Deliberately NOT localized: a rule must apply to every language version of
 * the content. sortOrder 900+ puts the rules after the content fields.
 */
export function audienceRules(sortOrder = 900) {
  return {
    ForProducers: flag('Show to producers', sortOrder, 'Tick the roles that should see this. Tick none to show it to every role.'),
    ForPrincipals: flag('Show to agency principals', sortOrder + 1),
    ForServiceReps: flag('Show to service representatives', sortOrder + 2),
    States: {
      type: 'array' as const,
      displayName: 'Only these states',
      description: 'One state per line, e.g. "Texas". Leave empty to show in every state.',
      sortOrder: sortOrder + 3,
      maxItems: 50,
      items: { type: 'string' as const },
    },
    Agencies: {
      type: 'array' as const,
      displayName: 'Only these agencies',
      description:
        'One agency per line, e.g. "Harbor Light Insurance Group" (the short name "Harbor Light" also works). Leave empty to show to every agency.',
      sortOrder: sortOrder + 4,
      maxItems: 50,
      items: { type: 'string' as const },
    },
  };
}
