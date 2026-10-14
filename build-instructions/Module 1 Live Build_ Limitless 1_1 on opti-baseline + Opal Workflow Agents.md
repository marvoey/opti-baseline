# Module 1 live build: Limitless 1:1 on opti-baseline

**Goal:** Replace the simulated **CMS**, **Opal** and **Live microsite** tabs with real systems. Clicking **Run Limitless** in the CRM triggers an Opal workflow agent. The agent creates or updates a real CMS (SaaS) page, and opti-baseline renders it live.

**Based on:** `marvoey/opti-baseline` (Next.js 16.2.9, `@optimizely/cms-sdk` v2, `@optimizely/cms-cli` v2), plus the current Opal and CMS (SaaS) docs (Oct 2026).

> **Be accurate on camera (this is scored under Technical accuracy).** The real Limitless 1:1 Personalization is a set of purpose-built Opal agents that a Field Delivery Engineer configures. This build is a **faithful replica** made with standard Opal workflow agents and CMS (SaaS) tools. Say so in the recording, for example: *"This is a demo build of the Limitless workflow on our own CMS instance. In production, an FDE configures the purpose-built agents against your CRM, CMS, CMP and ODP."* Confirm with your assessor that a replica is acceptable.

---

## 0. What you're building

```
┌──────────────────────┐   POST    ┌──────────────────────────┐   POST + auth header   ┌─────────────────────────────┐
│ Northstar CRM (mock) │ ────────▶ │ opti-baseline            │ ─────────────────────▶ │ Opal workflow agent          │
│ /demo/crm            │           │ /api/limitless/trigger   │                        │ "Limitless ABM Orchestrator" │
└──────────────────────┘           └──────────────────────────┘                        │  Webhook trigger             │
          ▲  polls /api/limitless/status                                               │   → Router (Graph lookup)    │
          │                                                                            │   → Condition: create/update │
          │                                                                            │   ├ Researcher → Creator     │
          │                                                                            │   └ Updater (patch fields)   │
          │                                                                            └──────────────┬──────────────┘
          │                                                                                           │ cms_* tools
          │        ┌───────────────────────────┐   publish (human)   ┌────────────────────────────┐  ▼
          └─────── │ Optimizely Graph          │ ◀────────────────── │ CMS (SaaS)                  │
                   │ (published content)       │                     │ AbmLandingPage draft (v1/v2)│
                   └─────────────┬─────────────┘                     └────────────────────────────┘
                                 ▼
                   opti-baseline renders /abm/helix-freight-group/
```

| Piece | Real or mock | Why |
|---|---|---|
| CRM (Northstar) | **Mock**, hosted inside opti-baseline | No CRM access. The mock sends realistic CRM data in the webhook payload. |
| Opal workflow + agents | **Real** | Runs live, and you show the workflow run logs |
| Web research | **Real** (industry context) + simulated account signals | The accounts are fictional, so research targets the industry and the account signals come from the CRM payload |
| ODP behavioural data | **Simulated** in the payload | Unless you have an ODP sandbox to connect |
| CMS (SaaS) page | **Real** | Created, patched and published in your instance |
| Live microsite | **Real** | Rendered by opti-baseline via Graph |
| CMP approval | **Option A:** human publish in CMS (recommended)<br>**Option B:** real CMP task + webhook | B is more impressive but has more moving parts (see section 6) |

---

## 1. Prerequisites checklist

- [ ] CMS (SaaS) instance with an **API client** (Settings → API Clients) for `cms:push`
- [ ] Optimizely Graph **single key** in `.env`
- [ ] opti-baseline **deployed to Vercel** with `DEPLOYED_URL` set, and a CMS **Application** whose hostname matches it. The catch-all scopes Graph lookups by host (`lib/siteHost.ts`), so pages must live under that application's start page.
- [ ] Opal instance **connected to that CMS (SaaS) instance**. This enables the `cms_*` and `graph_*` tools.
- [ ] Opal **Agent Builder** or **Admin** role
- [ ] Optional: CMP connected to Opal (Option B approval), ODP connected (real behavioural data)
- [ ] Opal credits available. Each live run consumes credits, and you'll rehearse several times.

---

## 2. Extend opti-baseline (code)

Create a branch: `git checkout -b limitless-demo`

> The README mentions `npm run config:push`, but the actual script in `package.json` is **`npm run cms:push`**. It only pushes types that don't exist yet. Use `npm run cms:push:all` after changing an existing type.

### 2.1 New content type: `cms/AbmLandingPage.tsx`

**Why a fixed-layout `_page` with flat fields, not a Visual Builder experience:**
- **Reliable agent writes.** `cms_update_content_item` uses JSON Merge Patch, and flat properties are the most predictable thing for an agent to patch.
- **Update mode becomes visible.** The update agent patches only the affected fields. That is literally "rewrites only what changed," and you can show it field by field in the CMS.
- **On-page editing still works.** Every field is wrapped with `pa()` for the `/preview` overlay.

```tsx
import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { RichText as RichTextRenderer } from '@optimizely/cms-sdk/react/richText';
import PersonaTabs from '@/app/_components/PersonaTabs';

/**
 * AbmLandingPage — an account-specific landing page that the Limitless workflow creates (create mode)
 * and patches section by section (update mode). Flat properties on purpose, so an
 * agent can JSON-Merge-Patch only the fields a new signal affects.
 */
export const AbmLandingPageContentType = contentType({
  key: 'AbmLandingPage',
  baseType: '_page',
  displayName: 'ABM Landing Page (Limitless)',
  description: 'Account-specific landing page generated and maintained by the Limitless workflow.',
  properties: {
    // SEO (MetaTitle feeds generateMetadata in the catch-all)
    MetaTitle: { type: 'string', displayName: 'Meta Title', sortOrder: 1 },
    MetaDescription: { type: 'string', displayName: 'Meta Description', sortOrder: 2 },

    // Account + Limitless governance
    AccountId: { type: 'string', displayName: 'CRM Account ID', indexingType: 'queryable', sortOrder: 10 },
    AccountName: { type: 'string', displayName: 'Account Name', sortOrder: 11 },
    Industry: { type: 'string', displayName: 'Industry', sortOrder: 12 },
    LimitlessMode: {
      type: 'string',
      displayName: 'Last Limitless Mode',
      enum: [
        { value: 'create', displayName: 'Create' },
        { value: 'update', displayName: 'Update' },
      ],
      sortOrder: 13,
    },
    PageVersionNote: { type: 'string', displayName: 'Version Note', sortOrder: 14 },
    SignalsSummary: { type: 'string', displayName: 'Signals Used', sortOrder: 15 },
    LastRefreshed: { type: 'dateTime', displayName: 'Last Refreshed', sortOrder: 16 },

    // Hero
    HeroEyebrow: { type: 'string', displayName: 'Hero Eyebrow', sortOrder: 20 },
    HeroHeadline: { type: 'string', displayName: 'Hero Headline', sortOrder: 21 },
    HeroSubhead: { type: 'string', displayName: 'Hero Subhead', sortOrder: 22 },
    PrimaryCtaLabel: { type: 'string', displayName: 'CTA Label', sortOrder: 23 },
    PrimaryCtaUrl: { type: 'string', displayName: 'CTA URL', sortOrder: 24 },

    // Problem
    ProblemHeadline: { type: 'string', displayName: 'Problem Headline', sortOrder: 30 },
    ProblemBody: { type: 'richText', displayName: 'Problem Body', sortOrder: 31 },

    // Buying committee
    EconomicBuyerTitle: { type: 'string', displayName: 'Economic Buyer – Headline', sortOrder: 40 },
    EconomicBuyerBody: { type: 'richText', displayName: 'Economic Buyer – Body', sortOrder: 41 },
    TechnicalEvaluatorTitle: { type: 'string', displayName: 'Technical Evaluator – Headline', sortOrder: 42 },
    TechnicalEvaluatorBody: { type: 'richText', displayName: 'Technical Evaluator – Body', sortOrder: 43 },
    ChampionTitle: { type: 'string', displayName: 'Champion – Headline', sortOrder: 44 },
    ChampionBody: { type: 'richText', displayName: 'Champion – Body', sortOrder: 45 },

    // Proof
    ProofStats: { type: 'json', displayName: 'Proof Stats', description: 'JSON array of {"value":"38%","label":"…"}', sortOrder: 50 },
    CaseStudyHeadline: { type: 'string', displayName: 'Case Study Headline', sortOrder: 51 },
    CaseStudyBody: { type: 'richText', displayName: 'Case Study Body', sortOrder: 52 },
    FaqItems: { type: 'json', displayName: 'FAQ Items', description: 'JSON array of {"Question":"…","Answer":"…"}', sortOrder: 60 },
  },
});

type Props = { content: ContentProps<typeof AbmLandingPageContentType> };

/** Accepts rich text (Graph returns { json, html }) or a plain string fallback. */
function Body({ value }: { value: unknown }) {
  if (!value) return null;
  if (typeof value === 'string') return <p>{value}</p>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <RichTextRenderer content={(value as any).json} />;
}

function jsonArray<T>(v: unknown): T[] {
  if (Array.isArray(v)) return v as T[];
  if (typeof v === 'string') {
    try { const p = JSON.parse(v); return Array.isArray(p) ? p : []; } catch { return []; }
  }
  return [];
}

export default function AbmLandingPage({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const stats = jsonArray<{ value: string; label: string }>(content.ProofStats);
  const faqs = jsonArray<{ Question: string; Answer: string }>(content.FaqItems);

  const personas = [
    { id: 'finance', label: 'For Finance', title: content.EconomicBuyerTitle, body: content.EconomicBuyerBody, t: 'EconomicBuyerTitle', b: 'EconomicBuyerBody' },
    { id: 'it', label: 'For IT & Architecture', title: content.TechnicalEvaluatorTitle, body: content.TechnicalEvaluatorBody, t: 'TechnicalEvaluatorTitle', b: 'TechnicalEvaluatorBody' },
    { id: 'ops', label: 'For Operations', title: content.ChampionTitle, body: content.ChampionBody, t: 'ChampionTitle', b: 'ChampionBody' },
  ] as const;

  return (
    <main className="w-full">
      {/* Hero */}
      <section className="bg-blue-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-5xl">
          <p {...pa('HeroEyebrow')} className="text-sm uppercase tracking-widest text-blue-200">{content.HeroEyebrow}</p>
          <h1 {...pa('HeroHeadline')} className="mt-3 text-4xl font-bold md:text-5xl">{content.HeroHeadline}</h1>
          <p {...pa('HeroSubhead')} className="mt-5 max-w-3xl text-lg text-blue-100">{content.HeroSubhead}</p>
          {content.PrimaryCtaLabel && (
            <a {...pa('PrimaryCtaLabel')} href={content.PrimaryCtaUrl || '#'} className="mt-8 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-blue-950">
              {content.PrimaryCtaLabel}
            </a>
          )}
        </div>
      </section>

      {/* Problem */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 {...pa('ProblemHeadline')} className="text-3xl font-bold text-blue-950">{content.ProblemHeadline}</h2>
          <div {...pa('ProblemBody')} className="prose mt-4 max-w-none"><Body value={content.ProblemBody} /></div>
        </div>
      </section>

      {/* Buying committee */}
      <section className="bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-blue-950">What this means for your team</h2>
          <PersonaTabs
            tabs={personas.map((p) => ({
              id: p.id,
              label: p.label,
              panel: (
                <div>
                  <h3 {...pa(p.t)} className="text-xl font-semibold text-blue-950">{p.title}</h3>
                  <div {...pa(p.b)} className="prose mt-3 max-w-none"><Body value={p.body} /></div>
                </div>
              ),
            }))}
          />
        </div>
      </section>

      {/* Proof */}
      {stats.length > 0 && (
        <section {...pa('ProofStats')} className="px-6 py-16">
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
            {stats.map((s, i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-6 text-center">
                <div className="text-4xl font-bold text-blue-800">{s.value}</div>
                <div className="mt-2 text-sm text-slate-600">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="px-6 pb-16">
        <div className="mx-auto max-w-3xl">
          <h2 {...pa('CaseStudyHeadline')} className="text-2xl font-bold text-blue-950">{content.CaseStudyHeadline}</h2>
          <div {...pa('CaseStudyBody')} className="prose mt-4 max-w-none"><Body value={content.CaseStudyBody} /></div>
        </div>
      </section>

      {faqs.length > 0 && (
        <section {...pa('FaqItems')} className="bg-slate-50 px-6 py-16">
          <div className="mx-auto max-w-3xl space-y-4">
            {faqs.map((f, i) => (
              <details key={i} className="rounded-lg bg-white p-4 shadow-sm">
                <summary className="cursor-pointer font-medium text-blue-950">{f.Question}</summary>
                <p className="mt-2 text-slate-700">{f.Answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Limitless governance strip: makes create vs update visible on camera */}
      <footer className="border-t border-slate-200 px-6 py-4 text-center text-xs text-slate-500">
        Personalized for <span {...pa('AccountName')}>{content.AccountName}</span> ·{' '}
        <span {...pa('PageVersionNote')}>{content.PageVersionNote}</span>
        {content.LastRefreshed && <> · refreshed {new Date(content.LastRefreshed as string).toLocaleDateString()}</>}
      </footer>
    </main>
  );
}
```

### 2.2 Client component: `app/_components/PersonaTabs.tsx`

All panels stay in the DOM (hidden with `hidden`), so on-page-editing overlays attach to every persona field. `?persona=it` preselects a tab, which supports the per-persona sales URLs.

```tsx
'use client';
import { useEffect, useState, type ReactNode } from 'react';

type Tab = { id: string; label: string; panel: ReactNode };

export default function PersonaTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0]?.id);

  useEffect(() => {
    // Preselect from ?persona=… (used by persona-specific sales URLs)
    const p = new URLSearchParams(window.location.search).get('persona');
    if (p && tabs.some((t) => t.id === p)) setActive(p);
  }, [tabs]);

  return (
    <div className="mt-6">
      <div role="tablist" className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={t.id === active}
            onClick={() => setActive(t.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${t.id === active ? 'bg-blue-800 text-white' : 'bg-white text-blue-950 ring-1 ring-slate-200'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div key={t.id} role="tabpanel" hidden={t.id !== active} className="mt-6 rounded-xl bg-white p-6 shadow-sm">
          {t.panel}
        </div>
      ))}
    </div>
  );
}
```

### 2.3 Register it in `cms/registry.ts`

```ts
import AbmLandingPage, { AbmLandingPageContentType } from './AbmLandingPage';

export const registeredContentTypes = [
  BlankExperienceContentType,
  BlankSectionContentType,
  PageContentType,
  AbmLandingPageContentType, // ← add
  RichTextContentType,
];

initReactComponentRegistry({
  resolver: {
    BlankExperience,
    BlankSection,
    Page,
    AbmLandingPage, // ← add (key === content-type key)
    RichTextBlock: RichText,
  },
});
```

`Page` already has `mayContainTypes: ['*']`, so an `AbmLandingPage` can sit under a normal `Page`.

### 2.4 Push the content type

```bash
npm run cms:push -- --dry   # preview: should list → AbmLandingPage
npm run cms:push            # push missing types only
npm run cms:check           # verify
```

### 2.5 API routes (keep the Opal secret server-side)

**`app/api/limitless/trigger/route.ts`** forwards the CRM payload to the Opal webhook trigger.

```ts
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const url = process.env.OPAL_LIMITLESS_WEBHOOK_URL;
  const secret = process.env.OPAL_LIMITLESS_WEBHOOK_SECRET;
  const header = process.env.OPAL_LIMITLESS_WEBHOOK_HEADER || 'X-Limitless-Secret';
  if (!url || !secret) {
    return NextResponse.json({ ok: false, error: 'Opal webhook not configured' }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  if (!body?.account?.id) {
    return NextResponse.json({ ok: false, error: 'account.id is required' }, { status: 400 });
  }

  const payload = {
    event: 'crm.abm_account.sync',
    source: 'northstar-crm-demo',
    campaign: 'Q4 Tier-1 ABM',
    triggeredAt: new Date().toISOString(),
    ...body,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      [header]: secret,
      'Time-Zone': 'America/New_York', // Opal webhook triggers accept an IANA Time-Zone override
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  const text = await res.text();
  return NextResponse.json({ ok: res.ok, status: res.status, opal: text.slice(0, 500) }, { status: res.ok ? 200 : 502 });
}
```

**`app/api/limitless/status/route.ts`** lets the CRM's Microsite column show the real published state from Graph.

```ts
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const QUERY = `
query AbmStatus($id: String) {
  AbmLandingPage(where: { AccountId: { eq: $id } }, limit: 1) {
    items {
      AccountName
      PageVersionNote
      LimitlessMode
      LastRefreshed
      _metadata { url { default } }
    }
  }
}`;

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('account');
  if (!id) return NextResponse.json({ live: false, error: 'account required' }, { status: 400 });

  const gateway = process.env.OPTIMIZELY_GRAPH_GATEWAY || 'https://cg.optimizely.com/content/v2';
  const res = await fetch(`${gateway}?auth=${process.env.OPTIMIZELY_GRAPH_SINGLE_KEY}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query: QUERY, variables: { id } }),
    cache: 'no-store',
  });
  const json = await res.json().catch(() => null);
  const item = json?.data?.AbmLandingPage?.items?.[0];

  return NextResponse.json(
    item
      ? { live: true, url: item._metadata?.url?.default, versionNote: item.PageVersionNote, mode: item.LimitlessMode, lastRefreshed: item.LastRefreshed }
      : { live: false },
  );
}
```

> The single key only sees **published** content. The status shows **Live** after you publish (the human approval step) and Graph syncs, usually within seconds. Drafts won't appear here, which is correct for a governed flow.

**Add to `.env` / `.env.example` and to Vercel:**

```bash
# --- Limitless demo: Opal workflow agent webhook trigger ---
OPAL_LIMITLESS_WEBHOOK_URL=https://webhook.opal.optimizely.com/webhooks/<uuid>/<uuid>
OPAL_LIMITLESS_WEBHOOK_SECRET=<same value as the trigger's Auth Key>
OPAL_LIMITLESS_WEBHOOK_HEADER=X-Limitless-Secret
```

> **Credit safety:** `/api/limitless/trigger` is public once deployed, so anyone with the URL can start runs. Turn on Vercel Deployment Protection, or trigger only from `localhost` while recording.

### 2.6 Host the mock CRM inside opti-baseline: `/demo/crm`

The canvas sandbox can't reliably call external URLs. Hosting the CRM in the Next.js app makes the button call a same-origin API route.

1. **Let `/demo` bypass the locale rewrite.** In `proxy.ts`, add `demo` to the matcher exclusions, otherwise `/demo/crm` is rewritten to `/en/demo/crm` and 404s in the CMS catch-all:
   ```ts
   matcher: ['/((?!api|_next/static|_next/image|preview|admin|styleguide|applications|demo|favicon.ico|.*\\..*).*)'],
   ```
2. **Create `app/demo/crm/page.tsx`** from the **`app/demo/crm/page.tsx` canvas**. It's the complete Northstar CRM (all six pages), already wired to the two routes in 2.5, with the payload shape the Router expects. Steps 3 and 4 below are **already done in that file** and are kept here for reference.
3. **(Done in the file) Dated signals** to `DETAILS` so update mode has something to detect. For example, for Apex:
   ```ts
   signals: [
     { date: '2026-10-02', type: 'c_suite_hire', text: 'Hired Dr. Elena Park as Chief Medical Information Officer' },
     { date: '2026-09-28', type: 'buying_stage_shift', text: 'Opportunity moved Discovery → Evaluation' },
   ],
   ```
   For Helix, map its existing `web` items into `signals` with dates.
4. **(Done in the file) Live status and the Run button.** The logic, for reference:
   ```tsx
   const [live, setLive] = useState<Record<string, { live: boolean; versionNote?: string; url?: string }>>({});
   const [running, setRunning] = useState<string | null>(null);

   useEffect(() => {
     const load = () =>
       Promise.all(ACCOUNTS.map(async (a) => [a.id, await (await fetch(`/api/limitless/status?account=${a.id}`, { cache: 'no-store' })).json()] as const))
         .then((rows) => setLive(Object.fromEntries(rows)));
     load();
     const t = setInterval(load, 10000); // poll so "Live · v2" appears on camera after publish
     return () => clearInterval(t);
   }, []);

   const runLimitless = async (a: (typeof ACCOUNTS)[number]) => {
     setRunning(a.id);
     const d = DETAILS[a.id];
     await fetch('/api/limitless/trigger', {
       method: 'POST',
       headers: { 'content-type': 'application/json' },
       body: JSON.stringify({
         account: a,
         contacts: d ? d.contacts : EXTRA_CONTACTS[a.id] ?? [],
         activity: d?.activity ?? [a.lastActivity],
         signals: d?.signals ?? [],
         odp: d?.odp ?? [], // simulated ODP behavioural feed
         crmNotes: d?.crm ?? [],
       }),
     });
     setTimeout(() => setRunning(null), 4000);
   };
   ```
   Then in the table's Microsite cell, render `live[a.id]?.live ? \`Live · ${live[a.id].versionNote}\` : 'None'`. Add a cell with a **✦ Run Limitless** button that calls `runLimitless(a)` and shows "Sent to Opal…" while `running === a.id`.

> The finished file starts with `// @ts-nocheck` because the UI is plain JS ported from the mock. That keeps `next build` on Vercel from failing strict type checks.

### 2.7 Deploy

`git push` → Vercel. Add the three `OPAL_LIMITLESS_*` vars, redeploy, and confirm `https://<your-domain>/demo/crm` loads.

---

## 3. CMS (SaaS) setup

1. **Create the ABM container.** Under the site's start page, create a **Page (v1)** named `ABM` with **Name in URL** set to `abm`, then **Publish**. Generated pages will live at `/abm/<account-slug>/`.
2. **Note the container's content key.** It's in the CMS URL when editing, or ask Opal: *"Get the content key of the page named ABM."* You'll paste it into the Creator agent.
3. **Run a smoke test in Opal chat before building agents.** This validates permissions and the rich-text write format:
   > *"Using cms_create_content_item, create an AbmLandingPage named 'Smoke Test' in locale en under container `<ABM key>` with route segment `smoke-test`. Then use cms_update_content_item to set HeroHeadline to 'Hello' and ProblemBody to `<p>Test <strong>rich</strong> text</p>`. Return the preview URL."*
   - Open the preview URL and check that the hero and problem body render.
   - **If the rich-text write is rejected,** change the five `*Body` properties to `type: 'string'`, then run `npm run cms:push:all`. The `Body` renderer already handles plain strings.
   - Delete the smoke-test page afterwards.
4. **Optional subdomain.** Limitless publishes to a customer subdomain such as `abm.vantagecloud-demo.com`. For the demo, `/abm/…` on your Vercel domain is fine. To mirror the subdomain, add the domain in Vercel and as an application hostname in CMS, and set `DEPLOYED_URL` to it.

---

## 4. Build the Opal agents

**Agents → Your Agents → Add Agent.** You'll build four specialized agents and one workflow agent.

| # | Agent (id) | Type | Tools to enable |
|---|---|---|---|
| 1 | Limitless Account Router (`limitless_router`) | Specialized | `graph_content_graphql_executor` |
| 2 | Limitless Account Researcher (`limitless_researcher`) | Specialized | Web search and web page reader tools; optionally ODP tools |
| 3 | Limitless Page Creator (`limitless_page_creator`) | Specialized | `cms_create_content_item`, `cms_update_content_item`, `cms_get_content_preview_url`; optionally your **Brand Pack** skill |
| 4 | Limitless Page Updater (`limitless_page_updater`) | Specialized | `cms_get_content_data`, `cms_update_content_item`, `cms_get_content_preview_url` |
| 5 | Limitless ABM Orchestrator (`limitless_abm_orchestrator`) | **Workflow** | Webhook trigger, optional Scheduler trigger, Condition node |

Give each specialized agent one text input (for example `input`). In the workflow, each step receives the previous step's output, and the first step receives the trigger payload.

### 4.1 Router prompt

```
You are the Limitless Account Router. Your input is a JSON webhook payload from the Northstar CRM
(fields: account.id, account.name, account.industry, contacts[], activity[], signals[], odp[], crmNotes[]).

1. If there is no account.id, output {"mode":"none"} and stop.
2. Use graph_content_graphql_executor to check whether a page already exists:
   query { AbmLandingPage(where: { AccountId: { eq: "<account.id>" } }, limit: 1) {
     items { AccountName PageVersionNote LastRefreshed _metadata { key url { default } } } } }
3. mode = "update" if an item is returned, otherwise "create".
4. slug = account.name in lowercase kebab-case without punctuation (e.g. "helix-freight-group").
5. Output ONLY this JSON (no prose):
{"mode":"create|update","accountId":"…","accountName":"…","slug":"…",
 "contentKey":"<_metadata.key or null>","currentVersionNote":"<or null>","lastRefreshed":"<or null>",
 "payload": <the full original payload>}
```

> Graph sees **published** content only. Keep each account's v1 published before demoing update mode, and delete stray drafts when you reset (section 7).

### 4.2 Researcher prompt (create branch)

```
You are the Limitless Account Researcher. Input: the Router's JSON. Build audience intelligence for ONE account.

Sources, in this order:
- CRM: payload.account, payload.contacts (name, title, buying role), payload.activity, payload.crmNotes
- Behavioural: payload.odp (treat as the ODP behavioural feed)
- Account signals: payload.signals
- Web research: use web search for INDUSTRY context relevant to the account's industry and the
  topics in payload.odp (e.g. trends, regulations, common platform challenges). The account itself
  is a fictional demo company, so do not invent facts about it beyond the payload.

Infer the buying committee: Economic Buyer, Technical Evaluator, Champion. For each give:
who (title), top 3 concerns, the content angle, and 1 proof point theme.

Output ONLY JSON:
{"mode":"create","accountId","accountName","slug","industry",
 "accountBrief":"3–4 sentences","topIntentTopics":[…],"objections":[…],
 "personas":[{"role","who","concerns":[…],"angle","proofTheme"}…3],
 "sourcesUsed":["CRM","ODP","Web: <short list of what you researched>"]}
```

### 4.3 Creator prompt (create branch)

```
You are the Limitless Page Creator for Vantage Cloud. Input: the Researcher's JSON.
Write an on-brand, modular, account-specific landing page and save it as a CMS DRAFT.

Brand rules: confident, plain-spoken B2B voice; no hype words ("revolutionary", "game-changing");
speak to the account by name; every claim tied to a concern from the input. (If the Brand Pack skill is
enabled, follow it — it overrides these rules.)

Steps:
1. cms_create_content_item: Locale "en", ContentType "AbmLandingPage",
   DisplayName "<accountName> | Vantage Cloud", Container "<ABM_CONTAINER_KEY>", RouteSegment "<slug>".
2. cms_update_content_item on the returned content key/version with ALL properties:
   MetaTitle (≤60 chars), MetaDescription (≤155), AccountId, AccountName, Industry,
   LimitlessMode "create", PageVersionNote "v1 · created by Limitless",
   SignalsSummary (≤200 chars, list the signals used), LastRefreshed (now, ISO 8601),
   HeroEyebrow (≤40, e.g. "For the <accountName> team"), HeroHeadline (≤80), HeroSubhead (≤180),
   PrimaryCtaLabel ("Book a 30-minute working session"), PrimaryCtaUrl ("#contact"),
   ProblemHeadline, ProblemBody,
   EconomicBuyerTitle/Body, TechnicalEvaluatorTitle/Body, ChampionTitle/Body (one per persona),
   ProofStats (JSON array of exactly 3 {"value","label"} — use clearly illustrative figures),
   CaseStudyHeadline, CaseStudyBody, FaqItems (JSON array of 3 {"Question","Answer"} addressing objections).
   Rich text fields: simple HTML only (<p>, <ul><li>, <strong>), 60–120 words each.
3. Do NOT publish. Publishing is the human approval step.
4. cms_get_content_preview_url for the draft.

Output a short summary: mode, content key, version, preview URL, and one line per persona
describing the angle you took.
```

> Replace `<ABM_CONTAINER_KEY>` with the key from section 3, step 2.

### 4.4 Updater prompt (update branch)

```
You are the Limitless Page Updater. Input: the Router's JSON (mode "update", contentKey, lastRefreshed, payload).
Run a LIGHTWEIGHT refresh — never redo full research.

1. cms_get_content_data for contentKey (latest published).
2. Consider only payload.signals and payload.activity dated within the last 90 days and after LastRefreshed.
   Material signal types: new C-suite hire, merger/acquisition, rebrand, competitor change in their
   tech stack, shift in buying stage.
3. If nothing material: output "No material change — page is current (<versionNote>)" and STOP. Do not write.
4. Map each material signal to the smallest set of affected fields. Examples:
   - New technical/clinical leader → TechnicalEvaluatorTitle, TechnicalEvaluatorBody (+ FaqItems if relevant)
   - Buying-stage shift to Evaluation → HeroSubhead, PrimaryCtaLabel, ProofStats
   - M&A or rebrand → HeroHeadline, HeroSubhead, ProblemBody
5. Rewrite ONLY those fields in the same voice. Also set LimitlessMode "update",
   PageVersionNote "v<n+1> · updated: <short reason>", SignalsSummary, LastRefreshed (now).
6. cms_update_content_item with contentKey, contentVersion 0 (creates a new draft from the published
   version), and ONLY the changed properties (JSON Merge Patch). Do not publish.
7. cms_get_content_preview_url.

Output: the signals detected, the list of changed fields (and unchanged sections), and the preview URL.
```

### 4.5 Workflow agent: Limitless ABM Orchestrator

1. **Add Agent → Workflow Agent.** Name it `Limitless ABM Orchestrator`, Id `limitless_abm_orchestrator`. Save.
2. **Add a Webhook trigger:**
   - Name: `Northstar CRM – ABM account sync`
   - Product Instance: your CMS (SaaS) instance (optional)
   - Payload Content Type: `application/json`
   - Auth Key: a long random secret. This goes into `OPAL_LIMITLESS_WEBHOOK_SECRET`.
   - Auth Header Name: **Custom** → `X-Limitless-Secret`
   - Auth Header Format: `{token}`
   - Timezone: America/New_York
   - **Save**, then copy the URL (`https://webhook.opal.optimizely.com/webhooks/<uuid>/<uuid>`) into `OPAL_LIMITLESS_WEBHOOK_URL`.
   - ⚠️ You can't edit the Auth Key, header name or format after saving. To change them, delete the trigger and recreate it.
3. **Optional Scheduler trigger** (for example, Mondays 07:00) as the "always-on refresh" proof point for the voiceover. With no payload, the Router outputs `mode: none` and the run ends cleanly.
4. **Wire the steps:**
   - Trigger → **Limitless Account Router**
   - Router → **Condition**:
     - `mode` = `create` → **Researcher** → **Creator**
     - `mode` = `update` → **Updater**
     - otherwise → end
5. **Save.** Open the workflow's **logs** view. This is your live Opal screen during the demo. It shows the trigger payload and each step's output.

---

## 5. Test end to end (before recording)

1. **Create mode (Helix):** on `/demo/crm`, click **Run Limitless** on Helix. In Opal, watch the logs: Router (`create`) → Researcher → Creator. In CMS, find the draft under **ABM**, open the preview, then **Publish**. Within about 10 seconds the CRM shows **Live · v1**, and `/abm/helix-freight-group/` renders.
2. **Seed Apex v1:** run create mode for Apex, then publish. This is the "existing page" for the update demo.
3. **Update mode (Apex):** click **Run Limitless** on Apex again. The Router returns `update`, and the Updater patches only the affected fields (for example, the Technical Evaluator section, because of the new CMIO). In CMS, open the new draft and compare it with the published version: only those fields differ. Publish, and the CRM shows **Live · v2**.
4. **No-change path:** run Apex once more without new signals. The Updater should report "No material change." That's a strong line to say on camera.
5. **Time each run.** Real runs vary with research depth. Write down the durations so you can plan the narration.

---

## 6. Approval: pick one

**Option A: human publish in CMS (recommended).** The agents only create drafts. On camera, you review the draft and click **Publish**. That *is* human-in-the-loop governance. Say: *"In production this sign-off runs through CMP approval modes; here I'm the approver."*

**Option B: real CMP approval loop (advanced).**
1. Add CMP tools to the Creator and Updater, and have them create a CMP task with the preview URL in the brief and an approval workflow (Brand → Compliance → ABM lead).
2. Build a second workflow agent, `limitless_publish_on_approval`, with a **Webhook trigger**. Register it in CMP (**Settings → Apps & Webhooks → Webhooks → Register New → General Webhook**) using the same secret, subscribed to the event for your approval step completing.
3. Its specialized agent reads the task, extracts the content key, and calls `cms_publish_content_item`.
4. Rehearse this more than Option A: there are more hand-offs to break mid-take.

---

## 7. Demo-day prep and reset

**Before each take:**
- [ ] **Delete the Helix page** (CMS → ABM → Helix → Move to trash, or Opal: *"cms_delete_content_item for the Helix AbmLandingPage"*), so create mode runs fresh
- [ ] **Apex v1 published** and not already at v2. If v2 is live, restore v1 from the versions list, or delete and re-seed it.
- [ ] No stray drafts under ABM
- [ ] Logged in to CMS, Opal and Vercel. Do Not Disturb on.

**Tabs open, in order:**
1. `https://<domain>/demo/crm`, the Northstar CRM
2. Opal → Limitless ABM Orchestrator → logs
3. CMS → ABM folder (edit view)
4. `https://<domain>/abm/helix-freight-group/` (refresh after publish)
5. Optional: the canvas mock as a **fallback** if a live run fails mid-take

---

## 8. Recording click path (live version)

| Demo step | Screen | Action | Say |
|---|---|---|---|
| 1. Frame the problem | CRM | Campaigns → Helix row (3 roles mapped) | The mid-funnel content gap: every role needs different content |
| 2. Account intake | CRM | Select the Helix row, then click **✦ Run Limitless · Helix Freight Group** | The CRM event fires a webhook into the Limitless workflow |
| 3. Enrichment | Opal logs | Show the trigger payload, then the Router (`create`), then the Researcher's output | CRM, behavioural and web research. Three inferred personas with angles. |
| 4. Generate | Opal → CMS | Creator output, then open the **draft in CMS** and preview | A modular page built on our content model and brand rules. Saved as a draft, not published. |
| 5. Two modes | CRM → Opal → CMS | Run Apex, show the Router (`update`) and the Updater's changed-fields list, then the draft in CMS | No re-research: only signals from the last 90 days, only the affected sections rewritten |
| 6. Publish and governance | CMS → site → CRM | **Publish** Helix, refresh `/abm/helix-freight-group/`, CRM shows **Live · v1**, show `?persona=it` | Human sign-off (CMP approval modes in production), a durable crawlable page, and per-segment URLs |
| 7. Delivery | Camera or Opal | (narrate) | An FDE configures the purpose-built agents against your CRM, CMS, CMP and ODP |

**If a run is slow:** narrate the Researcher's sources from the logs while it finishes. If it fails, switch to the pre-seeded Apex v1 page and continue. A handled hiccup scores well.

---

## 9. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `/demo/crm` returns 404 | `proxy.ts` rewrote it into `[locale]` | Add `demo` to the matcher exclusions (2.6, step 1) |
| Webhook returns 401/403 | Auth Key ≠ secret, or wrong header name | Header must be `X-Limitless-Secret`. Recreate the trigger if needed (auth can't be edited). |
| Page published but `/abm/…` 404s | Not under the application start page whose hostname = `DEPLOYED_URL`, or Graph hasn't synced | Move the ABM container under the right start page, wait about 10 seconds, refresh |
| Router always says `create` | Page only exists as a draft, or `AccountId` isn't queryable | Publish v1. Confirm `indexingType: 'queryable'` was pushed (`cms:push:all`). |
| Rich-text write rejected | Value format | Switch `*Body` properties to `string` (section 3, step 3) |
| `cms:push` "skipped" your change | Type already exists | `npm run cms:push:all` |
| CRM status never turns Live | Draft only, or Graph key missing on Vercel | Publish. Check `OPTIMIZELY_GRAPH_SINGLE_KEY` on Vercel. |

---

### Sources
- [Limitless 1:1 Personalization (Agent Platform docs)](https://docs.optimizely.com/agent-platform/docs/limitless-1-1-personalization)
- [Workflow agent triggers](https://docs.optimizely.com/agent-platform/docs/workflow-agent-triggers)
- [System tools for CMS (SaaS)](https://docs.optimizely.com/agent-platform/docs/system-tools-for-content-management-system-saas)
- [Send content events to Agent Platform with webhooks (CMS SaaS)](https://docs.optimizely.com/cms-saas/docs/send-content-events-to-agent-platform-with-webhooks)
- [Trigger workflow agents with CMP webhooks](https://docs.optimizely.com/agent-platform/docs/how-to-trigger-workflow-agents-with-content-marketing-platform-webhooks)
- Repo: [marvoey/opti-baseline](https://github.com/marvoey/opti-baseline)
