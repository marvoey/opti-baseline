/**
 * Optimizely Feature Experimentation (server side) for the eHealth demo.
 *
 * Flow: proxy.ts identifies the visitor -> the catch-all page calls
 * decideCmsVariation() -> FX evaluates the flag's rules (campaign audiences,
 * then the 50/50 A/B test) -> the flag variable `cms-saas-content-variation`
 * names the CMS (SaaS) content variation -> the page asks Optimizely Graph for
 * that variation. See docs in the FX "Configure the Optimizely CMS (SaaS)
 * integration" article.
 *
 * Everything here FAILS OPEN: with no SDK key, no datafile yet, or any error,
 * the functions return null / false and the page renders the default content.
 *
 * Env: OPTIMIZELY_FX_SDK_KEY - the SDK key of the FX environment to use
 * (Marvin Demo project -> Development). Server only; never NEXT_PUBLIC_.
 */
import {
  createBatchEventProcessor,
  createInstance,
  createPollingProjectConfigManager,
} from '@optimizely/optimizely-sdk';

/** Flag whose rules choose the CMS content variation of the home page. */
export const HOME_HERO_FLAG = 'ehealth_home_hero';

/** Flag variable that holds the CMS content variation key (case-sensitive). */
export const CMS_VARIATION_VARIABLE = 'cms-saas-content-variation';

/** Conversion events defined in the FX project. */
export const FX_EVENTS = ['plan_finder_submit', 'agent_call_click'] as const;
export type FxEvent = (typeof FX_EVENTS)[number];

/** Custom attribute the "ACA" / "Turning 65" audiences evaluate. */
const CAMPAIGN_ATTRIBUTE = 'ehealth_campaign';

/** Attribute value for visitors who arrived without a campaign (see userContext). */
const NO_CAMPAIGN = 'none';

/** The value the flag variable defaults to: serve the unmodified page. */
const ORIGINAL = 'Original';

/** How long a request may wait for the first datafile download. */
const READY_TIMEOUT_MS = 2500;

export type Visitor = { id: string; campaign: string | null };

type FxClient = NonNullable<ReturnType<typeof createInstance>>;

// One client per server process. Kept on globalThis so dev HMR doesn't spin up
// a new datafile poller on every file change.
const globalForFx = globalThis as unknown as { __ehFxClient?: FxClient };

function getClient(): FxClient | null {
  const sdkKey = process.env.OPTIMIZELY_FX_SDK_KEY?.trim();
  if (!sdkKey) return null;
  if (globalForFx.__ehFxClient) return globalForFx.__ehFxClient;

  const client = createInstance({
    projectConfigManager: createPollingProjectConfigManager({
      sdkKey,
      autoUpdate: true,
      updateInterval: 10_000,
    }),
    // batchSize 1 sends each impression/conversion right away; a batching
    // interval could be lost when a serverless instance is frozen after the
    // response.
    eventProcessor: createBatchEventProcessor({ batchSize: 1, flushInterval: 1000 }),
  });
  if (!client) return null;

  globalForFx.__ehFxClient = client;
  return client;
}

async function readyClient(): Promise<FxClient | null> {
  const client = getClient();
  if (!client) return null;
  try {
    // v6: resolves (with no value) once the datafile is loaded, rejects on
    // timeout or failure.
    await client.onReady({ timeout: READY_TIMEOUT_MS });
    return client;
  } catch (error) {
    console.warn('[fx] SDK not ready; serving default content.', error);
    return null;
  }
}

function userContext(client: FxClient, visitor: Visitor) {
  // Always send the attribute. The A/B rule's audience is NOT(aca OR t65). When
  // the attribute is missing the SDK evaluates those audiences as "unknown",
  // NOT(unknown) is still unknown, and the rule never matches - so visitors
  // without a campaign would silently skip the A/B test.
  return client.createUserContext(visitor.id, {
    [CAMPAIGN_ATTRIBUTE]: visitor.campaign ?? NO_CAMPAIGN,
  });
}

/**
 * Evaluates `flagKey` for the visitor and returns the CMS content variation key
 * to request from Graph, or null for "serve the default (original) page".
 * Calling decide() also records the decision impression for any A/B rule.
 */
export async function decideCmsVariation(flagKey: string, visitor: Visitor): Promise<string | null> {
  try {
    const client = await readyClient();
    if (!client) return null;

    const user = userContext(client, visitor);
    if (!user) return null;

    const decision = user.decide(flagKey);
    const value = decision.variables?.[CMS_VARIATION_VARIABLE];
    const variation = typeof value === 'string' ? value.trim() : '';

    if (process.env.NODE_ENV !== 'production') {
      console.log(
        `[fx] ${flagKey} -> rule=${decision.ruleKey ?? '-'} flagVariation=${decision.variationKey ?? '-'} ` +
          `cms=${variation || '-'} campaign=${visitor.campaign ?? '-'}`,
      );
    }
    return variation && variation !== ORIGINAL ? variation : null;
  } catch (error) {
    console.error('[fx] Decision failed; serving default content.', error);
    return null;
  }
}

/** Records a conversion event for the visitor. Never throws. */
export async function trackFxEvent(event: FxEvent, visitor: Visitor): Promise<boolean> {
  try {
    const client = await readyClient();
    if (!client) return false;
    const user = userContext(client, visitor);
    if (!user) return false;
    user.trackEvent(event);
    return true;
  } catch (error) {
    console.error('[fx] trackEvent failed.', error);
    return false;
  }
}

/** Crawlers always get the default content: stable SEO and clean experiment data. */
export function isLikelyBot(userAgent: string | null | undefined): boolean {
  return !userAgent || /bot|crawl|spider|slurp|facebookexternalhit|embedly|preview|headless|lighthouse/i.test(userAgent);
}
