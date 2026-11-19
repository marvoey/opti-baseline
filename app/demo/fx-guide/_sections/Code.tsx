// Section #code of /demo/fx-guide.
// Generated from the ehealth_fx_implementation_guide.html canvas. See ../page.tsx before editing by hand.

export default function Code() {
  return (
    <section id="code" className="sec">
      <div className="sec-head">
        <div>
          <span className="tag-eyebrow">Section 07</span>
          <h2 className="h2">The code, trimmed for reading</h2>
          <p className="lead">Excerpts from the <span className="mono">opti-baseline-ehealth</span> repo. Click a file to open it.</p>
        </div>
      </div>
      <details className="code" open>
        <summary><svg className="ico chev"><use href="#i-chev" /></svg><span className="mono plain">lib/fx.ts</span> the client, fail-open and the decision</summary>
        <pre className="codeblock"><code>{`export const HOME_HERO_FLAG = `}<span className="st">{`'ehealth_home_hero'`}</span>{`;
export const CMS_VARIATION_VARIABLE = `}<span className="st">{`'cms-saas-content-variation'`}</span>{`;
export const FX_EVENTS = [`}<span className="st">{`'plan_finder_submit'`}</span>{`, `}<span className="st">{`'agent_call_click'`}</span>{`] as const;
const CAMPAIGN_ATTRIBUTE = `}<span className="st">{`'ehealth_campaign'`}</span>{`;
const NO_CAMPAIGN = `}<span className="st">{`'none'`}</span>{`;
const ORIGINAL = `}<span className="st">{`'Original'`}</span>{`;
const READY_TIMEOUT_MS = 2500;

function getClient() {
  const sdkKey = process.env.OPTIMIZELY_FX_SDK_KEY?.trim();
  if (!sdkKey) return null;                       `}<span className="cm">{`// fail open`}</span>{`
  if (globalForFx.__ehFxClient) return globalForFx.__ehFxClient;
  const client = createInstance({
    projectConfigManager: createPollingProjectConfigManager({
      sdkKey, autoUpdate: true, updateInterval: 10_000,
    }),
    `}<span className="cm">{`// batchSize 1: send each impression/conversion immediately (serverless-safe)`}</span>{`
    eventProcessor: createBatchEventProcessor({ batchSize: 1, flushInterval: 1000 }),
  });
  globalForFx.__ehFxClient = client;              `}<span className="cm">{`// one poller per process`}</span>{`
  return client;
}

function userContext(client, visitor) {
  `}<span className="cm">{`// ALWAYS send the attribute: a missing value makes NOT(aca OR t65) "unknown"`}</span>{`
  `}<span className="cm">{`// and the A/B rule would never match.`}</span>{`
  return client.createUserContext(visitor.id, {
    [CAMPAIGN_ATTRIBUTE]: visitor.campaign ?? NO_CAMPAIGN,
  });
}

export async function decideCmsVariation(flagKey, visitor) {
  try {
    const client = await readyClient();           `}<span className="cm">{`// onReady({ timeout: 2500 })`}</span>{`
    if (!client) return null;
    const decision = userContext(client, visitor).decide(flagKey);
    const value = decision.variables?.[CMS_VARIATION_VARIABLE];
    const variation = typeof value === `}<span className="st">{`'string'`}</span>{` ? value.trim() : `}<span className="st">{`''`}</span>{`;
    return variation && variation !== ORIGINAL ? variation : null;
  } catch { return null; }                        `}<span className="cm">{`// fail open`}</span>{`
}`}</code></pre>
      </details>
      <details className="code">
        <summary><svg className="ico chev"><use href="#i-chev" /></svg><span className="mono plain">proxy.ts</span> identity, cookies and spoof-proof headers</summary>
        <pre className="codeblock"><code>{`function identify(request) {
  const params = request.nextUrl.searchParams;
  const reset = params.has(`}<span className="st">{`'fx_reset'`}</span>{`);
  const existingId = reset ? null : parseVid(request.cookies.get(`}<span className="st">{`'eh_vid'`}</span>{`)?.value);
  const id = existingId ?? crypto.randomUUID();
  const fromUrl = parseCampaign(params.get(`}<span className="st">{`'utm_campaign'`}</span>{`));
  const fromCookie = reset ? null : parseCampaign(request.cookies.get(`}<span className="st">{`'eh_campaign'`}</span>{`)?.value);
  return { id, campaign: fromUrl ?? fromCookie, setId: !existingId, ... };
}

function forwardedHeaders(request, visitor) {
  const headers = new Headers(request.headers);
  headers.set(`}<span className="st">{`'x-eh-vid'`}</span>{`, visitor.id);            `}<span className="cm">{`// always overwritten`}</span>{`
  if (visitor.campaign) headers.set(`}<span className="st">{`'x-eh-campaign'`}</span>{`, visitor.campaign);
  else headers.delete(`}<span className="st">{`'x-eh-campaign'`}</span>{`);
  return headers;
}
`}<span className="cm">{`// cookies: eh_vid (1 yr), eh_campaign (30 d), httpOnly, SameSite=Lax, Secure in prod`}</span></code></pre>
      </details>
      <details className="code">
        <summary><svg className="ico chev"><use href="#i-chev" /></svg><span className="mono plain">app/[locale]/[[...slug]]/page.tsx</span> from decision to Graph variation query</summary>
        <pre className="codeblock"><code>{`const resolveHomeVariation = cache(async () => {
  const h = await headers();
  const visitorId = parseVid(h.get(`}<span className="st">{`'x-eh-vid'`}</span>{`));
  if (!visitorId || isLikelyBot(h.get(`}<span className="st">{`'user-agent'`}</span>{`))) return null;
  return decideCmsVariation(HOME_HERO_FLAG, {
    id: visitorId, campaign: parseCampaign(h.get(`}<span className="st">{`'x-eh-campaign'`}</span>{`)),
  });
});

`}<span className="cm">{`// inside loadContent(locale, slug)`}</span>{`
const variation = slug.length === 0 && isDefault ? await resolveHomeVariation() : null;
const items = await client.getContentByPath(path, {
  host,
  ...(variation
    ? { variation: { include: `}<span className="st">{`'SOME'`}</span>{`, value: [variation], includeOriginal: true } }
    : {}),
});
`}<span className="cm">{`// pickItem: matching _metadata.variation -> else original -> else items[0]`}</span></code></pre>
      </details>
      <details className="code">
        <summary><svg className="ico chev"><use href="#i-chev" /></svg><span className="mono plain">app/api/fx/track/route.ts</span> + <span className="mono plain">PlanFinderWidget.tsx</span> conversions</summary>
        <pre className="codeblock"><code><span className="cm">{`// Browser (client component): fire-and-forget`}</span>{`
function trackFx(event) {
  void fetch(`}<span className="st">{`'/api/fx/track'`}</span>{`, {
    method: `}<span className="st">{`'POST'`}</span>{`, headers: { `}<span className="st">{`'Content-Type'`}</span>{`: `}<span className="st">{`'application/json'`}</span>{` },
    body: JSON.stringify({ event }), keepalive: true,
  }).catch(() => {});
}
`}<span className="cm">{`// onSubmit: valid 5-digit ZIP -> trackFx('plan_finder_submit') -> navigate`}</span>{`
`}<span className="cm">{`// phone link onClick -> trackFx('agent_call_click')`}</span>{`

`}<span className="cm">{`// Server route`}</span>{`
export async function POST(request) {
  const visitorId = parseVid(request.cookies.get(`}<span className="st">{`'eh_vid'`}</span>{`)?.value);
  if (!visitorId) return new NextResponse(null, { status: 204 });  `}<span className="cm">{`// nothing to attribute`}</span>{`
  const { event } = await request.json();
  if (!FX_EVENTS.includes(event)) return new NextResponse(null, { status: 400 });
  await trackFxEvent(event, {
    id: visitorId, campaign: parseCampaign(request.cookies.get(`}<span className="st">{`'eh_campaign'`}</span>{`)?.value),
  });
  return new NextResponse(null, { status: 204 });
}`}</code></pre>
      </details>
    </section>
  );
}
