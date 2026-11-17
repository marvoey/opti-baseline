import {
  createInstance,
  createPollingProjectConfigManager,
  createForwardingEventProcessor,
  eventDispatcher as defaultDispatcher,
} from '@optimizely/optimizely-sdk';

const PERSONALIZATION_FLAG = 'hrb_landing_personalization';
const HERO_TEST_FLAG = 'hrb_landing_hero_test';
const VARIABLE = 'cms-saas-content-variation';
const ORIGINAL = 'Original';

export type Visitor = { id: string; segment?: string | null };
export type Decision = {
  variation: string;
  source: 'personalization' | 'hero_test' | 'default';
};

const FALLBACK: Decision = { variation: ORIGINAL, source: 'default' };

/* Track events that are still being sent, so a serverless function
   (Vercel) can wait for them before it is frozen. */
const inflight = new Set<Promise<unknown>>();
const trackingDispatcher: typeof defaultDispatcher = {
  dispatchEvent(event) {
    const request = defaultDispatcher.dispatchEvent(event);
    inflight.add(request);
    const done = () => {
      inflight.delete(request);
    };
    request.then(done, done);
    return request;
  },
};

export async function flushEvents() {
  await Promise.allSettled([...inflight]);
}

type FxClient = ReturnType<typeof createInstance>;
let clientPromise: Promise<FxClient | null> | undefined;

function getFxClient(): Promise<FxClient | null> {
  if (clientPromise) return clientPromise;

  const sdkKey = process.env.OPTIMIZELY_FX_SDK_KEY;
  if (!sdkKey) {
    console.warn('[fx] OPTIMIZELY_FX_SDK_KEY is not set. Serving the Original content.');
    return Promise.resolve(null);
  }

  const client = createInstance({
    projectConfigManager: createPollingProjectConfigManager({
      sdkKey,
      autoUpdate: true,
      updateInterval: 60_000,
    }),
    eventProcessor: createForwardingEventProcessor(trackingDispatcher),
  });

  clientPromise = client
    .onReady({ timeout: 5000 })
    // onReady() is typed Promise<unknown> and, in practice, can resolve to undefined
    // when the config loaded. Only an explicit { success: false } means "not ready".
    .then((result) => {
      const r = result as { success?: boolean; reason?: string } | undefined;
      if (r?.success !== false) return client;
      console.warn('[fx] SDK not ready:', r.reason);
      clientPromise = undefined; // try again on the next request
      return null;
    })
    .catch((err) => {
      console.warn('[fx] SDK failed to initialise:', err);
      clientPromise = undefined;
      return null;
    });

  return clientPromise;
}

function userFor(client: FxClient, visitor: Visitor) {
  // hrb_segment is the attribute the "HRB DIY Abandoner" audience matches on.
  const attributes = visitor.segment ? { hrb_segment: visitor.segment } : {};
  return client.createUserContext(visitor.id, attributes);
}

function variationFrom(variables: Record<string, unknown> | undefined) {
  const value = variables?.[VARIABLE];
  return typeof value === 'string' && value ? value : undefined;
}

export async function decideVariation(visitor: Visitor): Promise<Decision> {
  const client = await getFxClient();
  if (!client) return FALLBACK;
  const user = userFor(client, visitor);
  if (!user) return FALLBACK;

  // 1. Personalization first. A matching visitor never enters the hero test.
  const personalization = user.decide(PERSONALIZATION_FLAG);
  const personalized = variationFrom(personalization.variables);
  if (personalization.enabled && personalized && personalized !== ORIGINAL) {
    return { variation: personalized, source: 'personalization' };
  }

  // 2. Everyone else goes into the hero test.
  const test = user.decide(HERO_TEST_FLAG);
  const tested = variationFrom(test.variables);
  if (test.enabled && tested) {
    return { variation: tested, source: 'hero_test' };
  }

  return FALLBACK;
}

export async function trackEvent(visitor: Visitor, eventKey: string) {
  const client = await getFxClient();
  if (!client) return;
  userFor(client, visitor)?.trackEvent(eventKey);
}