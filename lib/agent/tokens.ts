import { PRINCIPAL, SERVICE, type Agent } from './personas';

/**
 * Fills {first}, {name}, {key}, {role}, {people}, {state} and {agency} in CMS text with the
 * current agent's details, e.g. "Help your {state} clients" → "Help your Texas
 * clients". Unknown tokens are left as typed so an editor's typo is visible.
 *
 * Plain text in, plain text out: the result is rendered by React as text, never
 * as HTML, so an agent value can never inject markup.
 */
export function applyTokens(text: string | null | undefined, agent: Agent): string {
  if (!text) return '';
  const values: Record<string, string> = {
    first: agent.first,
    name: agent.name,
    // The agent's key ("dana"), for paths such as /agent/{key}.
    key: agent.key,
    role: agent.role,
    // "producers", "agencies" or "service teams", for headings like "Resources for Texas producers".
    people: agent.role === PRINCIPAL ? 'agencies' : agent.role === SERVICE ? 'service teams' : 'producers',
    state: agent.state,
    agency: agent.agency,
  };
  // A replacer function (not a replacement string) so "$&" and similar in a
  // value are never interpreted.
  return text.replace(/\{(first|name|key|role|people|state|agency)\}/g, (_m, key: string) => values[key]);
}
