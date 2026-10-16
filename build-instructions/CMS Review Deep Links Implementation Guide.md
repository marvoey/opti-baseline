# CMS Review Deep Links Implementation Guide

This guide details how to add direct links in the Northstar CRM demo UI (`/demo/crm`) that open generated ABM landing pages directly in the **Optimizely CMS Visual Builder** in a new browser tab for review and sign-off.

---

## 1. Context & Certification Alignment

* **Module 1 Rubric & Flow (Step 6):** *"Show publishing and governance. CMS publishes pages to a customer subdomain, CMP approval modes handle sign-off, and marketing receives segment-specific URLs for campaigns..."*
* **The Workflow:** When the Opal workflow finishes research and page composition, it saves an `AbmLandingPage` draft in Optimizely CMS.
* **The Demo Moment:** Clicking **"Review in CMS ↗"** directly from the CRM console lets you show the draft inside CMS SaaS Visual Builder without manually digging through the CMS content tree.

---

## 2. Step 1: Expose `cmsEditUrl` in `/api/limitless/pages`

**File:** `app/api/limitless/pages/route.ts`

Optimizely CMS uses `#context=epi.cms.contentdata:///{key}` to route directly to a content item's edit view. We derive the CMS origin from `process.env.OPTIMIZELY_CMS_URL` and append the content key.

### Code Update

```typescript
// app/api/limitless/pages/route.ts

export async function GET() {
  const container = process.env.ABM_CONTAINER_KEY;
  if (!container) {
    return NextResponse.json({ ok: false, error: 'ABM_CONTAINER_KEY is not configured' }, { status: 500 });
  }

  try {
    const nodes = await cmsGet<Page<Node>>(
      `/v1/content/${container}/items?contentTypes=AbmLandingPage&pageSize=100`,
    );
    const origin = ((await siteOrigin()) ?? '').replace(/\/$/, '');
    const basePath = await getContainerPath(container);

    // Normalize the base CMS URL from environment variables
    const rawCmsUrl = (process.env.OPTIMIZELY_CMS_URL || '').replace(/\/$/, '');
    const cmsOrigin = rawCmsUrl.replace(/\/edit\/?$/, '');

    const pages = await Promise.all(
      (nodes.items ?? []).map(async ({ key }) => {
        const { items = [] } = await cmsGet<Page<Version>>(`/v1/content/${key}/versions?pageSize=20`);
        if (items.length === 0) return null;

        // Newest version and newest published version
        const sorted = [...items].sort((a, b) => Number(b.version) - Number(a.version));
        const latest = sorted[0];
        const published = sorted.find((v) => v.status === 'published');
        const p = latest.properties ?? {};

        // Deep-link to edit mode for this specific content item
        const cmsEditUrl = cmsOrigin
          ? `${cmsOrigin}/edit/#context=epi.cms.contentdata:///${key}`
          : null;

        return {
          key,
          accountId: str(p.AccountId),
          accountName: str(p.AccountName) ?? latest.displayName,
          routeSegment: latest.routeSegment,
          version: latest.version,
          status: latest.status,
          versionNote: str(p.PageVersionNote),
          lastModified: latest.lastModified,
          hasPublished: !!published,
          // Public URL exists once any version is published
          url: published && latest.routeSegment ? `${origin}${basePath}${latest.routeSegment}/` : null,
          cmsEditUrl,
        };
      }),
    );

    return NextResponse.json({ ok: true, pages: pages.filter(Boolean) });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : 'CMS request failed' }, { status: 502 });
  }
}
```

---

## 3. Step 2: Add "Review in CMS ↗" to `AbmPagesCard`

**File:** `app/demo/crm/page.tsx`

Update `AbmPagesCard` so that whenever `cmsEditUrl` is present, a distinct review action appears next to the status badge.

### Code Update

```tsx
/** Links to the ABM landing pages in the CMS (children of the ABM container). */
function AbmPagesCard({ pages, onRefresh, refreshing, lastUpdated }) {
  return (
    <Card
      title="ABM landing pages (CMS)"
      right={
        <div className="flex items-center gap-3">
          {lastUpdated && <span className="text-xs text-slate-400">Updated {lastUpdated.toLocaleTimeString()}</span>}
          <Badge color="slate">{pages.length}</Badge>
          <button
            onClick={onRefresh}
            disabled={refreshing}
            title="Refresh from the CMS"
            aria-label="Refresh ABM landing pages"
            className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={refreshing ? "animate-spin" : ""} aria-hidden="true">
              <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
          </button>
        </div>
      }
    >
      {pages.length === 0 ? (
        <div className="text-sm text-slate-500">No landing pages created yet.</div>
      ) : (
        <ul className="divide-y divide-slate-100 text-sm">
          {pages.map((p) => {
            const pending = p.status !== "published";
            const badge = !pending ? ["green", "Live"] : p.hasPublished ? ["amber", "Live · newer draft"] : ["amber", "Draft"];
            return (
              <li key={p.key} className="flex items-center justify-between gap-3 py-2">
                <div className="min-w-0">
                  <div className="truncate font-medium text-slate-800">{p.accountName}</div>
                  <div className="truncate text-xs text-slate-500">{p.versionNote || `v${p.version}`}</div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge color={badge[0]}>{badge[1]}</Badge>
                  {p.cmsEditUrl && (
                    <a
                      href={p.cmsEditUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-md bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-700 hover:bg-violet-100 transition-colors"
                      title="Open page in Optimizely CMS editor for review"
                    >
                      Review in CMS ↗
                    </a>
                  )}
                  {p.url ? (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-sky-700 transition-colors"
                      title="Open live public microsite"
                    >
                      Live site ↗
                    </a>
                  ) : !p.cmsEditUrl ? (
                    <span className="text-xs text-slate-400">Publish in CMS</span>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
```

---

## 4. Step 3: Add to Account Detail Drill-Down (`CRMAccounts`)

**File:** `app/demo/crm/page.tsx`

When clicking into an account from the **Accounts** tab, surface the deep link in the account's microsite card.

### 1. Pass `abmPages` from `CRMApplication` to `CRMAccounts`:

```tsx
{page === "Accounts" && (
  <CRMAccounts 
    key={selectedId} 
    selectedId={selectedId} 
    setSelectedId={setSelectedId} 
    liveStatus={liveStatus} 
    go={go} 
    triggerOpal={triggerOpal} 
    isSyncing={isSyncing}
    abmPages={abmPages}
  />
)}
```

### 2. Receive `abmPages` in `CRMAccounts`:

```tsx
function CRMAccounts({ selectedId, setSelectedId, liveStatus, go, triggerOpal, isSyncing, abmPages = [] }) {
```

### 3. Add the Review Button inside the `openId` view:

```tsx
          {/* Inside CRMAccounts when openId is selected */}
          {(() => {
            const pageInCms = abmPages.find((p) => p.accountId === acc.id);
            return (
              <Card title="Limitless 1:1 microsite" right={<Badge color={statusColor}>{statusText}</Badge>}>
                <p className="text-sm text-slate-600">
                  {isLive ? (
                    <>Personalized page live at{" "}
                      <a href={liveStatus[acc.id].url || "#"} target="_blank" rel="noopener noreferrer" className="font-medium text-sky-700 hover:underline">
                        {liveStatus[acc.id].url}
                      </a>
                    </>
                  ) : (
                    "No published page yet. Run the Limitless workflow to research and generate a draft, then approve it in CMS."
                  )}
                </p>
                {pageInCms?.cmsEditUrl && (
                  <div className="mt-3">
                    <a
                      href={pageInCms.cmsEditUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 hover:bg-violet-100 border border-violet-200 transition-colors"
                    >
                      Review in CMS Visual Builder ↗
                    </a>
                  </div>
                )}
                <button onClick={() => go("Campaigns")} className="mt-3 block text-sm font-medium text-sky-700 hover:underline">
                  See in campaign list
                </button>
              </Card>
            );
          })()}
```

---

## 5. Verification & Testing

| Scenario | Expected Behavior |
|---|---|
| **Helix Freight Group (Initial)** | No page exists yet. Card shows `Not published`. No review link appears until triggered. |
| **Trigger Helix Freight Group** | Opal generates draft. The console streams logs. Once CMS receives the draft, the badge becomes `Draft` and the violet `Review in CMS ↗` button appears. |
| **Click "Review in CMS ↗"** | Opens a new browser tab directly into the Optimizely CMS SaaS editor at `#context=epi.cms.contentdata:///<key>`. |
| **Apex Health Partners (Pre-existing v1)** | Shows `Live · v1` with `Live site ↗`. When update mode is triggered and creates a newer draft, badge shows `Live · newer draft` and displays both `Review in CMS ↗` and `Live site ↗`. |

---

## 6. On-Camera Demo Script for Step 6 (Governance)

> *"Notice that Limitless doesn't blindly push unvetted content straight to production. In the ABM landing pages card, our agent has created a new version in draft state.*
> 
> *By clicking **Review in CMS**, we jump directly into Optimizely CMS Visual Builder. Here, human marketers and compliance leads retain complete oversight — reviewing the modular blocks, editing copy if necessary, or routing through CMP approval modes before hitting Publish."*
