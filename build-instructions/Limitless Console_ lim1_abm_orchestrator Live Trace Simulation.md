# Limitless Console: `lim1_abm_orchestrator` Live Trace Simulation

## Overview
Instead of printing the single static line:
> `"Watching the CMS for the page. Router, Researcher and Creator steps are visible in the Opal workflow logs."`

This update streams realistic, step-by-step execution telemetry from **`lim1_abm_orchestrator`** directly into the **Limitless console** in `app/demo/crm/page.tsx`:
1. **Automatically branches between Create Mode and Update Mode** based on whether a published page already exists for the account (`liveStatus[acc.id]?.live` or `abmPages`).
2. **Uses the exact agent IDs, tool names, and account context** from your architecture (`lim1_account_router`, `graph_content_graphql_executor`, `lim1_account_researcher`, `lim1_page_creator`, `lim1_page_updater`, `cms_create_content_item`, `cms_update_content_item`, `cms_get_content_preview_url`).
3. **Gracefully stops simulated steps** if the real 5-second CMS poll (`/api/limitless/pages`) detects the new draft early or if `Clear` is clicked.

---

## Step 1: Add the `agent` Log Color & Helper in `app/demo/crm/page.tsx`

Find `LOG_COLOR` right above `function LimitlessConsole` (around **line 459**) and add a `step` / `tool` color so agent names and tool invocations stand out visually in the terminal:

```tsx
const LOG_COLOR = {
  info: "text-slate-300",
  step: "text-violet-300 font-semibold",
  tool: "text-sky-300",
  ok: "text-emerald-400",
  warn: "text-amber-300",
  error: "text-rose-400",
};
```

*(Optional)* Increase the console height from `h-48` to `h-60` in `LimitlessConsole` so more workflow steps stay visible on camera without scrolling:

```tsx
<div ref={ref} className="h-60 overflow-auto rounded-lg bg-slate-900 p-3 font-mono text-xs leading-relaxed">
```

---

## Step 2: Add the `lim1_abm_orchestrator` Simulation Builder

Right above `export default function CRMApplication()` (around **line 585**), paste this helper function that builds the exact trace sequence for **Create Mode** (e.g., *Helix Freight Group*) vs. **Update Mode** (e.g., *Apex Health Partners*):

```tsx
/**
 * Builds the timed console trace simulating `lim1_abm_orchestrator` steps
 * while the real Opal workflow runs and `/api/limitless/pages` polls the CMS.
 */
function buildOrchestratorTrace(acc, d, contacts, existingPage) {
  const isUpdate = !!existingPage;
  const slug = acc.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const rolesSummary = contacts.map((c) => `${c.name} (${c.role})`).join(", ");

  if (!isUpdate) {
    // CREATE MODE: Router -> Condition (mode === "create") -> Researcher -> Creator
    return [
      {
        delay: 900,
        level: "step",
        text: `[lim1_abm_orchestrator] Webhook trigger received event "crm.abm_account.sync" for ${acc.name} (${acc.id}).`,
      },
      {
        delay: 2400,
        level: "tool",
        text: `[lim1_account_router] Calling graph_content_graphql_executor → query AbmLandingPage(AccountId: "${acc.id}")…`,
      },
      {
        delay: 4500,
        level: "ok",
        text: `[lim1_account_router] 0 published pages found in Graph → output {"mode":"create","slug":"${slug}","contentKey":null}.`,
      },
      {
        delay: 6000,
        level: "step",
        text: `[lim1_abm_orchestrator] Condition matched mode == "create" → routing to [lim1_account_researcher].`,
      },
      {
        delay: 8200,
        level: "info",
        text: `[lim1_account_researcher] Ingesting CRM context (${acc.pipeline} · ${acc.stage}) & mapping buying committee: ${rolesSummary}.`,
      },
      {
        delay: 11500,
        level: "info",
        text: `[lim1_account_researcher] Enriching with ODP behavioral feed (${d?.odp?.[0] || "first-party intent sessions"}) + ${d?.signals?.length || 0} external market signals…`,
      },
      {
        delay: 15000,
        level: "tool",
        text: `[lim1_account_researcher] Running web search for ${acc.industry} industry benchmarks & regulatory context…`,
      },
      {
        delay: 19000,
        level: "ok",
        text: `[lim1_account_researcher] Audience intelligence brief compiled for 3 personas (Economic Buyer, Technical Evaluator, Champion).`,
      },
      {
        delay: 21000,
        level: "step",
        text: `[lim1_abm_orchestrator] Handing research JSON to [lim1_page_creator] (Brand Pack skill active).`,
      },
      {
        delay: 24000,
        level: "tool",
        text: `[lim1_page_creator] Calling cms_create_content_item (ContentType: "AbmLandingPage", RouteSegment: "${slug}")…`,
      },
      {
        delay: 28000,
        level: "tool",
        text: `[lim1_page_creator] Calling cms_update_content_item → writing Hero, Problem, 3 Persona tabs, ProofStats & FaqItems…`,
      },
      {
        delay: 32000,
        level: "tool",
        text: `[lim1_page_creator] Calling cms_get_content_preview_url (status: "draft" — awaiting human governance sign-off)…`,
      },
      {
        delay: 35500,
        level: "info",
        text: `[lim1_abm_orchestrator] Polling Optimizely CMS Management API for new AbmLandingPage draft…`,
      },
    ];
  }

  // UPDATE MODE: Router -> Condition (mode === "update") -> Updater (90-day delta check + JSON Merge Patch)
  const newContact = contacts.find((c) => c.isNew);
  const latestSignal = d?.signals?.[0]?.text || "recent CRM stage & stakeholder shift";

  return [
    {
      delay: 900,
      level: "step",
      text: `[lim1_abm_orchestrator] Webhook trigger received event "crm.abm_account.sync" for ${acc.name} (${acc.id}).`,
    },
    {
      delay: 2400,
      level: "tool",
      text: `[lim1_account_router] Calling graph_content_graphql_executor → query AbmLandingPage(AccountId: "${acc.id}")…`,
    },
    {
      delay: 4500,
      level: "ok",
      text: `[lim1_account_router] Existing page found (key: ${existingPage.key.slice(0, 8)}…, ${existingPage.versionNote || `v${existingPage.version}`}) → output {"mode":"update"}.`,
    },
    {
      delay: 6200,
      level: "step",
      text: `[lim1_abm_orchestrator] Condition matched mode == "update" → skipping Researcher, routing to [lim1_page_updater].`,
    },
    {
      delay: 8500,
      level: "tool",
      text: `[lim1_page_updater] Calling cms_get_content_data (contentKey: "${existingPage.key.slice(0, 8)}…") to inspect published baseline…`,
    },
    {
      delay: 11800,
      level: "info",
      text: `[lim1_page_updater] Evaluating 90-day delta window since LastRefreshed → detected ${d?.signals?.length || 2} material signals (${latestSignal}).`,
    },
    {
      delay: 15500,
      level: "info",
      text: `[lim1_page_updater] Mapping minimal field diff → targeting TechnicalEvaluatorTitle, TechnicalEvaluatorBody${newContact ? ` (for ${newContact.name})` : ""}, HeroSubhead & PageVersionNote.`,
    },
    {
      delay: 19500,
      level: "tool",
      text: `[lim1_page_updater] Calling cms_update_content_item (contentVersion: 0, JSON Merge Patch on changed fields only)…`,
    },
    {
      delay: 23500,
      level: "tool",
      text: `[lim1_page_updater] Calling cms_get_content_preview_url → draft saved for human review (unchanged sections preserved).`,
    },
    {
      delay: 27000,
      level: "info",
      text: `[lim1_abm_orchestrator] Polling Optimizely CMS Management API for updated draft version…`,
    },
  ];
}
```

---

## Step 3: Wire the Simulation Timers in `CRMApplication`

Inside `CRMApplication()`:

### 3a. Add a `simTimersRef` ref (around **line 597**)
Right next to `const fetchPagesRef = useRef(null);`, add:

```tsx
  const simTimersRef = useRef([]); // holds active simulation timeouts for lim1_abm_orchestrator
  const clearSimTimers = useCallback(() => {
    simTimersRef.current.forEach(clearTimeout);
    simTimersRef.current = [];
  }, []);
```

And clean them up on unmount:
```tsx
  useEffect(() => () => clearSimTimers(), [clearSimTimers]);
```

### 3b. Stop Simulated Steps Automatically When CMS Polling Detects the Draft
Inside the `/api/limitless/pages` polling `useEffect` (around **line 640**), right after the `if (!o) { ... } else if (o.version !== p.version) { ... }` block logs a real CMS change, stop any remaining simulated timers for that account so the real CMS event takes over cleanly:

```tsx
              if (!o) {
                clearSimTimers();
                log("ok", published ? `[CMS] Page found: ${p.accountName} (v${p.version})` : `[CMS] Draft created: ${p.accountName} (v${p.version})`);
              } else if (o.version !== p.version) {
                clearSimTimers();
                log("ok", `[CMS] ${published ? "Published" : "Draft updated"}: ${p.accountName} → v${p.version}${note}`);
              } else if (o.status !== p.status && published) {
                clearSimTimers();
                log("ok", `[CMS] Published: ${p.accountName}`);
              } else {
                continue;
              }
```

### 3c. Replace the Static Message in `triggerOpal` (around **line 690**)
In `triggerOpal`, replace the single `log("info", "Watching the CMS for the page...")` line with the orchestrator trace scheduler:

```tsx
      if (res.ok) {
        log("ok", `Accepted by Opal webhook (HTTP ${data.status || res.status}). Starting lim1_abm_orchestrator…`);
        setRunActive({ id: acc.id, name: acc.name, startedAt: Date.now() });

        // Schedule simulated lim1_abm_orchestrator step logs while waiting for CMS draft creation
        clearSimTimers();
        const contacts = d ? d.contacts : EXTRA_CONTACTS[acc.id] || [];
        const existingPage = abmPages.find((p) => p.accountId === acc.id) || (liveStatus[acc.id]?.live ? { key: acc.id, version: "1", versionNote: liveStatus[acc.id].versionNote } : null);
        const trace = buildOrchestratorTrace(acc, d, contacts, existingPage);
        simTimersRef.current = trace.map((step) =>
          setTimeout(() => log(step.level, step.text), step.delay)
        );
      }
```

### 3d. Clear Timers When Clicking `Clear` on the Console
Update the `clearLogs` prop passed to `<CRMCampaigns>` (around **line 730**):

```tsx
clearLogs={() => { clearSimTimers(); setLogs([]); }}
```

---

## What You Will See Live on Camera

### When You Trigger **Helix Freight Group** (Create Mode):
```text
4:12:01 PM Sending Helix Freight Group to the Limitless workflow in Opal…
4:12:02 PM Accepted by Opal webhook (HTTP 200). Starting lim1_abm_orchestrator…
4:12:03 PM [lim1_abm_orchestrator] Webhook trigger received event "crm.abm_account.sync" for Helix Freight Group (helix).
4:12:04 PM [lim1_account_router] Calling graph_content_graphql_executor → query AbmLandingPage(AccountId: "helix")…
4:12:06 PM [lim1_account_router] 0 published pages found in Graph → output {"mode":"create","slug":"helix-freight-group","contentKey":null}.
4:12:08 PM [lim1_abm_orchestrator] Condition matched mode == "create" → routing to [lim1_account_researcher].
4:12:10 PM [lim1_account_researcher] Ingesting CRM context ($480K · Discovery) & mapping buying committee: Marcus Lee (Economic Buyer), Priya Natarajan (Technical Evaluator), Tom Becker (Champion).
4:12:13 PM [lim1_account_researcher] Enriching with ODP behavioral feed (14 sessions from helixfreight.com in last 30 days) + 3 external market signals…
4:12:17 PM [lim1_account_researcher] Running web search for Logistics & Supply Chain industry benchmarks & regulatory context…
4:12:21 PM [lim1_account_researcher] Audience intelligence brief compiled for 3 personas (Economic Buyer, Technical Evaluator, Champion).
4:12:23 PM [lim1_abm_orchestrator] Handing research JSON to [lim1_page_creator] (Brand Pack skill active).
4:12:26 PM [lim1_page_creator] Calling cms_create_content_item (ContentType: "AbmLandingPage", RouteSegment: "helix-freight-group")…
4:12:30 PM [lim1_page_creator] Calling cms_update_content_item → writing Hero, Problem, 3 Persona tabs, ProofStats & FaqItems…
4:12:34 PM [CMS] Draft created: Helix Freight Group (v1)
```

### When You Trigger **Apex Health Partners** (Update Mode):
```text
4:15:10 PM Sending Apex Health Partners to the Limitless workflow in Opal…
4:15:11 PM Accepted by Opal webhook (HTTP 200). Starting lim1_abm_orchestrator…
4:15:12 PM [lim1_abm_orchestrator] Webhook trigger received event "crm.abm_account.sync" for Apex Health Partners (apex).
4:15:13 PM [lim1_account_router] Calling graph_content_graphql_executor → query AbmLandingPage(AccountId: "apex")…
4:15:15 PM [lim1_account_router] Existing page found (key: 79966884…, v1 · created by Limitless) → output {"mode":"update"}.
4:15:17 PM [lim1_abm_orchestrator] Condition matched mode == "update" → skipping Researcher, routing to [lim1_page_updater].
4:15:19 PM [lim1_page_updater] Calling cms_get_content_data (contentKey: "79966884…") to inspect published baseline…
4:15:22 PM [lim1_page_updater] Evaluating 90-day delta window since LastRefreshed → detected 2 material signals (Hired Dr. Elena Park as Chief Medical Information Officer).
4:15:26 PM [lim1_page_updater] Mapping minimal field diff → targeting TechnicalEvaluatorTitle, TechnicalEvaluatorBody (for Dr. Elena Park), HeroSubhead & PageVersionNote.
4:15:30 PM [lim1_page_updater] Calling cms_update_content_item (contentVersion: 0, JSON Merge Patch on changed fields only)…
4:15:34 PM [CMS] Draft updated: Apex Health Partners → v2 · v2 · updated: new CMIO
```
