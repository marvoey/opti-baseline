import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { headers } from 'next/headers';
import { cx } from '@/app/_components_liberty/utils';
import { getAgent } from '@/lib/agent/getAgent';
import { applyTokens } from '@/lib/agent/tokens';
import { LM_MODE_HEADER, modeAllowed, parseMode } from '@/lib/mockLm';
import { blockSpacing, choice, str } from '../liberty/shared';
import AgentBlockFrame, { isEditing } from './AgentBlockFrame';
import { AccentRule, Heading } from './AgentBlocks';

/**
 * Agent: Renewals card. The CMS holds only the card's configuration and copy
 * (heading, how many rows, the empty and error text). The renewals themselves
 * come from Liberty Mutual's OAuth-protected API when the page is rendered, and
 * never enter the CMS or the page cache.
 *
 * Demo build: LM's API is the mock under app/api/mock-lm. To use the real one,
 * change the four LM_* environment variables (all server-only) and use token
 * exchange with the agent's own token instead of client credentials.
 */
export const AgentRenewalsCardContentType = contentType({
  key: 'AgentRenewalsCard',
  baseType: '_component',
  displayName: 'Agent: Renewals card',
  description: "Configuration only. The renewals come from LM's API at request time.",
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...blockSpacing(),
    Heading: str('Heading', 10),
    MaxItems: { type: 'integer' as const, displayName: 'Max items', sortOrder: 20 },
    DataSource: {
      ...choice(
        'Data source',
        30,
        [
          ['renewals-v2', 'Liberty Mutual Renewals API v2 (external)'],
          // Listed so the field looks real. They have no entry in DATA_SOURCES below, so choosing one shows the error text.
          ['renewals-v1', 'Liberty Mutual Renewals API v1 (external, legacy)'],
          ['policy-admin-v3', 'Liberty Mutual Policy Administration API v3 (external)'],
          ['book-of-business-v1', 'Liberty Mutual Book of Business API v1 (external)'],
        ],
        "The Liberty Mutual system the renewals are fetched from when the page loads. Nothing is stored in the CMS.",
      ),
      format: 'selectOne' as const, // a dropdown; without it the CMS shows a plain text box
    },
    EmptyStateText: str('Empty-state text', 40),
    ErrorText: str('Error text', 50),
  },
});

type Renewal = { client: string; policy: string; date: string };

// Table layout shared with "Agent: Table": first column bold, last column narrower.
const COLUMNS = 'grid grid-cols-[190px_1fr_170px]';
const COLUMN_HEADINGS = ['Client', 'Policy', 'Renewal date'];

/**
 * What each "Data source" choice in the CMS means: the API path under LM_API_BASE.
 * The editor only picks a name; the path is fixed here, so no text typed in the
 * CMS ever reaches a request URL. To offer another source, add a choice to the
 * content type above AND a line here (then push that content type to the CMS).
 */
const DATA_SOURCES: Record<string, string> = {
  'renewals-v2': '/renewals',
};
const DEFAULT_DATA_SOURCE = 'renewals-v2';

/** A slow or failing API may degrade this card, never the page. */
const TIMEOUT_MS = 1500;
const MAX_ROWS = 25;

/** Keep only well-formed rows from the API response; anything else is treated as a failure. */
function parseRenewals(body: unknown): Renewal[] | null {
  const items = (body as { items?: unknown } | null)?.items;
  if (!Array.isArray(items)) return null;
  const rows: Renewal[] = [];
  for (const r of items.slice(0, MAX_ROWS)) {
    const { client, policy, date } = (r ?? {}) as Record<string, unknown>;
    if (typeof client !== 'string' || typeof policy !== 'string' || typeof date !== 'string') return null;
    rows.push({ client: client.slice(0, 120), policy: policy.slice(0, 60), date: date.slice(0, 40) });
  }
  return rows;
}

type Loaded = {
  /** null = the call failed (or is not configured). */
  items: Renewal[] | null;
  /** The renewals URL as called, for the editing badge. Never holds a secret, token or credentials. */
  endpoint: string | null;
};

/** One 1.5 second budget for the token request and the renewals request together. */
async function loadRenewals(agentKey: string, dataSource: string | null | undefined): Promise<Loaded> {
  const failed = (endpoint: string | null = null): Loaded => ({ items: null, endpoint });

  // Not chosen yet = the default; a value we don't know is treated as a failure.
  const path = Object.hasOwn(DATA_SOURCES, dataSource || DEFAULT_DATA_SOURCE)
    ? DATA_SOURCES[dataSource || DEFAULT_DATA_SOURCE]
    : undefined;
  if (!path) return failed();

  const tokenUrl = process.env.LM_OAUTH_TOKEN_URL?.trim();
  const apiBase = process.env.LM_API_BASE?.trim();
  const clientId = process.env.LM_OAUTH_CLIENT_ID?.trim();
  const clientSecret = process.env.LM_OAUTH_CLIENT_SECRET?.trim();
  if (!tokenUrl || !apiBase || !clientId || !clientSecret) return failed();

  let url: URL;
  try {
    url = new URL(`${apiBase.replace(/\/$/, '')}${path}`);
  } catch {
    return failed();
  }
  url.searchParams.set('agent', agentKey);
  // Rehearsal switch (?mode=empty|error|slow on the page), never on Production.
  const mode = modeAllowed() ? parseMode((await headers()).get(LM_MODE_HEADER)) : undefined;
  if (mode) url.searchParams.set('mode', mode);
  // origin + path + query only: no credentials that might be embedded in LM_API_BASE.
  const endpoint = `${url.origin}${url.pathname}${url.search}`;

  const signal = AbortSignal.timeout(TIMEOUT_MS);
  try {
    // OAuth 2.0 client credentials: the secret stays on the server.
    const tokenRes = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'client_credentials', client_id: clientId, client_secret: clientSecret }),
      cache: 'no-store',
      signal,
    });
    if (!tokenRes.ok) return failed(endpoint);
    const accessToken = ((await tokenRes.json()) as { access_token?: unknown }).access_token;
    if (typeof accessToken !== 'string' || !accessToken) return failed(endpoint);

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store', // per agent: never cached
      signal,
    });
    if (!res.ok) return failed(endpoint);
    return { items: parseRenewals(await res.json()), endpoint };
  } catch {
    // Timeout, network error or bad JSON. Nothing is logged: the response may hold client names.
    return failed(endpoint);
  }
}

export default async function AgentRenewalsCard({ content }: { content: ContentProps<typeof AgentRenewalsCardContentType> }) {
  const agent = await getAgent();
  const { items, endpoint } = await loadRenewals(agent.key, content.DataSource);
  const max = content.MaxItems && content.MaxItems > 0 ? content.MaxItems : 5;
  const t = (s: string | null | undefined) => applyTokens(s, agent);
  const rows = (items ?? []).slice(0, max);

  return (
    <AgentBlockFrame content={content}>
      <Heading>{t(content.Heading)}</Heading>
      <AccentRule />
      {items === null && <p className="mt-6 text-sm text-gray-600">{t(content.ErrorText)}</p>}
      {items?.length === 0 && <p className="mt-6 text-sm text-gray-600">{t(content.EmptyStateText)}</p>}
      {rows.length > 0 && (
        // Same table look as "Agent: Table" (cms/agent/AgentBlocks.tsx).
        <div className="mt-6 overflow-x-auto">
          <div className="min-w-[560px] overflow-hidden rounded-lg border border-gray-200 text-sm">
            <div className={cx(COLUMNS, 'bg-[#F5F5F5] font-medium text-navy')}>
              {COLUMN_HEADINGS.map((h) => (
                <div key={h} className="p-4">
                  {h}
                </div>
              ))}
            </div>
            {rows.map((r, i) => (
              <div key={`${r.policy}-${i}`} className={cx(COLUMNS, 'border-t', i % 2 === 1 && 'bg-[#FAFAFA]')}>
                <div className="p-4 font-medium text-navy">{r.client}</div>
                <div className="p-4">{r.policy}</div>
                <div className="p-4">{r.date}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {isEditing(content) && (
        // Editors only: shows which API this card really calls (visitors never see it).
        <p className="mt-4 inline-block max-w-full break-all rounded-full bg-mist px-3 py-1 font-mono text-[11px] text-lmtd">
          <span className="font-sans font-bold uppercase tracking-wider">API</span>{' '}
          {endpoint ? `GET ${endpoint}` : 'not configured'}
        </p>
      )}
    </AgentBlockFrame>
  );
}
