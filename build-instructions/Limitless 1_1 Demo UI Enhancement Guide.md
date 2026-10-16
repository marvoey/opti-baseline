# Limitless 1:1 Personalization — CRM UI Enhancement Guide

This guide details the step-by-step changes to display **ODP Behavioral Telemetry** and **Web Research & Market Signals** in the Northstar CRM interface (`app/demo/crm/page.tsx`).

---

## 1. Why This Change is Required for Certification

In the **SA Certification Programme v2.0 (Module 1)** rubric:
- **Demo Flow Step 3:** *"Show enrichment. Explain how each account is enriched with web research and ODP behavioural data, and how the agent infers buying-committee personas (economic buyer, technical evaluator, champion) so content addresses each role."*
- **Knowledge Check Q3:** *"List at least three data sources used to build audience intelligence."* (Answer: CRM opportunity/contact history, ODP behavioral sessions, and external web research/market signals).

Currently, `d.odp` and `d.signals` are defined in `DETAILS` and posted behind the scenes to `/api/limitless/trigger`, but they are invisible in the front-end. Rendering them on-screen gives you tangible visual artifacts to narrate on camera right before triggering Opal.

---

## 2. File: `app/demo/crm/page.tsx`

### Step 2.1: Add Enrichment Grid to `CRMCampaigns`
In `app/demo/crm/page.tsx`, navigate to `CRMCampaigns` (around line 440). Locate the 3-column grid containing the account summary, buying committee, and recent activity:

```tsx
<div className="mt-6 grid gap-4 lg:grid-cols-3">
  <Card title={acc.name} right={<Badge color={statusColor}>Microsite: {statusText}</Badge>}>
    ...
  </Card>
  <Card title="Buying committee (known contacts)">
    ...
  </Card>
  <Card title="Recent activity">
    ...
  </Card>
</div>
```

**Directly beneath that closing `</div>` and right before `<div className="mt-6 grid gap-4 lg:grid-cols-2">` (the Limitless Console and ABM Pages card), insert:**

```tsx
      {/* --- Account Enrichment (ODP + Web Research Signals) --- */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card
          title="ODP behavioral intelligence"
          right={<Badge color="green">Optimizely Data Platform</Badge>}
        >
          {d?.odp && d.odp.length > 0 ? (
            <ul className="space-y-2 text-sm text-slate-700">
              {d.odp.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="mt-0.5 text-xs font-bold text-emerald-600">✦</span>
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-slate-500">No recent digital intent sessions captured in ODP.</div>
          )}
        </Card>

        <Card
          title="Web research & market signals"
          right={<Badge color="blue">External Intelligence</Badge>}
        >
          {d?.signals && d.signals.length > 0 ? (
            <ul className="space-y-2.5 text-sm text-slate-700">
              {d.signals.map((sig, idx) => {
                const badgeColor =
                  sig.type === "c_suite_hire"
                    ? "amber"
                    : sig.type === "earnings_call"
                    ? "rose"
                    : sig.type === "buying_stage_shift"
                    ? "violet"
                    : "slate";

                return (
                  <li key={idx} className="flex items-start justify-between gap-3 border-l-2 border-sky-400 pl-3">
                    <div>
                      <div className="font-medium leading-snug text-slate-800">{sig.text}</div>
                      <div className="mt-0.5 text-xs text-slate-400">{sig.date}</div>
                    </div>
                    <Badge color={badgeColor}>
                      {sig.type.replace(/_/g, " ")}
                    </Badge>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-sm text-slate-500">No external intelligence signals logged.</div>
          )}
        </Card>
      </div>
```

---

### Step 2.2: (Optional) Add to `CRMAccounts`
If you click through to an account detail page via the **Accounts** tab during the demo, add the same enrichment cards inside `CRMAccounts` directly above or below the activity timeline grid:

```tsx
<div className="mt-4 grid gap-4 lg:grid-cols-3">
  <Card title="Activity timeline" className="lg:col-span-2">
    ...
  </Card>
  <Card title="Limitless 1:1 microsite" right={<Badge color={statusColor}>{statusText}</Badge>}>
    ...
  </Card>
</div>
```

---

## 3. Visual Verification Checklist

Run your development server (`npm run dev`) and navigate to `/demo/crm`:

| Account | ODP Behavioral Card | Web Research & Signals Card |
|---|---|---|
| **Helix Freight Group** (`helix`)<br>*Create Mode Demo* | • 14 sessions in last 30 days<br>• Viewed *Supply Chain Visibility* 6×<br>• Topics: *cold-chain compliance, TMS integration* | • 2026-09-18: 3 new EU cold-chain hubs<br>• 2026-08-07: CFO quotes legacy systems on earnings call<br>• 2026-09-30: Hiring 40+ data engineers |
| **Apex Health Partners** (`apex`)<br>*Update Mode Demo* | • 9 sessions in last 30 days<br>• Viewed *Security & Compliance* 4×<br>• Topics: *HIPAA compliance, EHR integration* | • **2026-10-02**: Hired Dr. Elena Park as CMIO (`c suite hire`)<br>• **2026-09-28**: Moved Discovery → Evaluation (`buying stage shift`) |

---

## 4. Certification Run-of-Show: Step 3 Talking Track

When you reach Step 3 in your recording, highlight the cards before clicking **Run Limitless**:

> *"Before triggering the agent, look at how Limitless solves the mid-funnel content bottleneck through true multi-source audience intelligence. Real personalization requires more than broad account tags. Here in Northstar CRM, we see three distinct data streams:*
>
> 1. ***CRM buying committee roles:*** *We’ve mapped our contacts into explicit buying roles — Economic Buyer, Technical Evaluator, and Champion.*
> 2. ***ODP first-party intent:*** *Optimizely Data Platform shows 14 recent sessions exploring cold-chain compliance and TMS migration.*
> 3. ***External web research & signals:*** *The agent picks up their Q2 earnings call where the CFO cited fragmented legacy systems as margin pressure, plus recent hiring trends.*
>
> *Limitless synthesizes all three sources so the generated microsite addresses each evaluator's specific priorities without manual prompt engineering."*
