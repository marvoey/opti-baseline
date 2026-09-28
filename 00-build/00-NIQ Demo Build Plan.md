# NIQ Challenger Demo Build Plan: The "Audience Without Content" Gap

**Target:** NielsenIQ (NIQ) Pre-Sales / Challenger Demo  
**Strategy:** Lean, high-impact **Minimum Viable Build (MVB)**. Avoid over-engineering.  
**Estimated Total Build Time:** 1 to 1.5 Hours.

---

## 1. Executive Build Summary: What to Build vs. What's Already Done

To prove the **5,760 Combinatorial Explosion** and demonstrate the **Single-Template Multi-Intent Engine**, you do **not** need to build dozens of pages or complex custom code.

```text
┌────────────────────────────────────────────────────────┐
│ ALREADY BUILT & READY (0 mins)                         │
│ • Act 1: LinkedIn Feed Mock Canvas (Marvin Oey / NIQ)   │
│ • Act 2: NIQ live site (nielseniq.com Digital Shelf)    │
│ • Architecture Diagram & Topology Canvas               │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ TO BUILD IN OPTIMIZELY TENANT (~60–75 mins total)      │
│ 1. Three (3) Atomic Component Schemas                   │
│    (HeroBlock extended · ProofBlock + ActionBlock new) │
│ 2. Five (5) Seeded Content Blocks (2 Permutations)     │
│ 3. Two (2) NIQLimitlessPage Instances, one per persona │
│    (Hero/Proof/Action slots)                           │
│ 4. Front-End Context Switcher (or GraphiQL Query)      │
│ 5. One (1) Pre-Saved Mark CMP Prompt                   │
└────────────────────────────────────────────────────────┘
```

---

## 2. Step-by-Step Tenant Build Plan

### Step 1: Model 3 Atomic Primitives in CMS SaaS (Done — see `cms/HeroBlock.tsx`, `cms/ProofBlock.tsx`, `cms/ActionBlock.tsx`, `cms/taxonomy.ts`)
*Before modeling, the live tenant's existing content types were compared against what this repo registers (`cms/registry.ts`). Result: `HeroBlock` already existed as a type shared with another (banking/mortgage) demo, so it was extended in place rather than rebuilt; no close match existed for `ProofBlock`/`ActionBlock`, so those are net-new.*

#### A. `HeroBlock` (pre-existing shared type, extended — not new)
* `Headline` (Text, single-line, required)
* `Subheadline` (Text, single-line) — *renamed from the original `Subhead` to match the live schema*
* `PrimaryCtaLabel` / `PrimaryCtaUrl` (Text) — *split label + URL, replacing the original single `PrimaryCTA` field*
* `SecondaryCtaLabel` / `SecondaryCtaUrl` (Text) — optional second CTA, inherited from the shared type
* `Eyebrow` (Text), `BackgroundImage` (Image reference), `MembersOnly` (Boolean) — inherited from the shared type; optional, leave unset for this demo
* `Audiences` (Choice, banking/mortgage taxonomy) — inherited from the shared type; **not used** by the NIQ demo, leave blank
* **New Taxonomy Metadata (added for this demo):**
  * `Industry` (Choice: `CPG_FMCG`, `Beverage_Alcohol`, `Tech_Durables`)
  * `Persona` (Choice: `Ecommerce_Lead`, `Insights_Director`, `Category_Manager`)
  * `Solution` (Choice: `DigitalShelf`, `ConsumerPanel`, `BASES`)

#### B. `ProofBlock` (new dedicated type)
* `MetricNumber` (Text, e.g. `"-18%"`, `"92%"`)
* `MetricLabel` (Text, e.g. `"Retailer Out-of-Stocks"`, `"SKU Forecast Accuracy"`)
* `ClientQuote` (Text, 1–2 sentences)
* `ClientIdentifier` (Text, e.g. `"Global FMCG Personal Care Brand"`)
* **Taxonomy Metadata:** `Industry`, `Persona` (same choice values as `HeroBlock`)

#### C. `ActionBlock` (new dedicated type — separate from the tenant's existing generic `ActionPrimitiveBlock` CTA-button type)
* `Headline` (Text, e.g. `"Connect with your dedicated account lead"`)
* `LeadName` (Text, e.g. `"Sarah Jenkins"`)
* `LeadTitle` (Text, e.g. `"Unilever Global Client Director"`)
* `CalendarUrl` (URL)
* **Taxonomy Metadata:** `Tier` (`StrategicCustomer`, `MidMarket`, `Prospect`)

---

### Step 2: Author Exactly 5 Content Blocks (20 Mins)
*Represents two distinct permutations from Unilever to expose the 5,760 math trap.*

#### Permutation A: Marvin Oey (Unilever • Ecommerce VP • Digital Shelf Whitespace)
1. **Hero Block 1:**
   * **Headline:** *"Unilever Omnichannel Performance: Win the Digital Shelf Across 40+ European Retailers"*
   * **Subheadline:** *"Connect store-level availability directly to omnichannel revenue and share of search on Amazon, Tesco, and Carrefour. Eliminate retailer blindspots with NIQ UPC-level referential data."*
   * **PrimaryCtaLabel:** *"Explore Digital Shelf Analytics"* (leave **PrimaryCtaUrl** pointing at the demo page, or `#` for the mock)
   * **Tags:** `Industry: CPG_FMCG`, `Persona: Ecommerce_Lead`, `Solution: DigitalShelf`
2. **Proof Block 1:**
   * **Metric:** `"-18%"`
   * **Label:** `"Retailer Out-of-Stocks"`
   * **Quote:** *"Real-time item availability benchmarking allowed our brand portfolio to prevent recurring out-of-stocks across major European online grocers."*
   * **Client:** `"Tier-1 Global Personal Care Brand"`
   * **Tags:** `Industry: CPG_FMCG`, `Persona: Ecommerce_Lead`

#### Permutation B: Sarah Jenkins (Unilever • Insights Director • Consumer Panel Focus)
3. **Hero Block 2:**
   * **Headline:** *"Unilever Consumer Intelligence: Predict Emerging Shopper Shifts with 100% Panel Precision"*
   * **Subheadline:** *"Decode omnichannel buyer behavior and brand switching patterns across FMCG categories. Move from observation to predictive growth with verified consumer panel datasets."*
   * **PrimaryCtaLabel:** *"Access Consumer Panel Insights"* (leave **PrimaryCtaUrl** pointing at the demo page, or `#` for the mock)
   * **Tags:** `Industry: CPG_FMCG`, `Persona: Insights_Director`, `Solution: ConsumerPanel`
4. **Proof Block 2:**
   * **Metric:** `"92%"`
   * **Label:** `"SKU Adoption Forecast Accuracy"`
   * **Quote:** *"Connecting panel purchase frequency to regional basket size enabled us to forecast new product viability 6 months before mass retail distribution."*
   * **Client:** `"Global Food & Refreshment Manufacturer"`
   * **Tags:** `Industry: CPG_FMCG`, `Persona: Insights_Director`

#### Shared Strategic Account Action Block
5. **Action Block 1:**
   * **Headline:** *"Fast-Path Scheduling for Strategic Partners"*
   * **LeadName:** *"Sarah Jenkins"*
   * **LeadTitle:** *"Dedicated Global Client Director — Unilever"*
   * **CalendarUrl:** `https://calendly.com/niq-unilever-team/15min`
   * **Tags:** `Tier: StrategicCustomer`

---

### Step 3: Instantiate the `NIQLimitlessPage` Template, Once Per Persona (15 Mins)
*Supersedes the original Visual Builder Experience + Blueprint approach. A dedicated page type — `NIQLimitlessPage` — was modeled directly in the CMS with three fixed `contentReference` slots (`HeroSlot` → `HeroBlock`, `ProofSlot` → `ProofBlock`, `ActionSlot` → `ActionBlock`) instead of an ad-hoc Visual Builder section. It's already registered and rendered in code (`cms/NiqLimitlessPage.tsx`, wired in `cms/registry.ts`) — a contentReference only delivers `{key, url}` from Graph, so the renderer resolves each slot's referenced item via the existing `expandReferences` helper (`cms/expandRefs.ts`) before handing it to the `HeroBlock`/`ProofBlock`/`ActionBlock` components. No Blueprint step is needed: the reusable pattern **is** the content type itself, so "instantiating a governed pattern in clicks" now means creating a new `NIQLimitlessPage` item and pointing its slots at tagged blocks — zero markup, zero new code.*

1. **Create Page Instance 1 — Marvin (Ecommerce Lead):**
   * URL Path: `/solutions/enterprise-omnichannel-marvin`
   * `HeroSlot` → Hero Block 1 (Marvin, Digital Shelf)
   * `ProofSlot` → Proof Block 1 (`-18%` Out-of-Stocks)
   * `ActionSlot` → Action Block 1 (Strategic Account Scheduling)
2. **Create Page Instance 2 — Sarah (Insights Director):**
   * URL Path: `/solutions/enterprise-omnichannel-sarah`
   * `HeroSlot` → Hero Block 2 (Sarah, Consumer Panel)
   * `ProofSlot` → Proof Block 2 (`92%` Forecast Accuracy)
   * `ActionSlot` → Action Block 1 (same shared Action block as Instance 1)
   * *Demo Purpose:* Two pages, one template, zero engineering tickets — proves the "single-template multi-intent engine" without needing a same-URL runtime toggle.

---

### Step 4: Setup the Runtime Resolution Trigger (15 Mins)

*Choose the demonstration vehicle that best fits your audience:*

#### Option A: Interactive Front-End Switcher (Recommended for Business / Marketing Leaders)
* On both `NIQLimitlessPage` instances, render a small floating diagnostic pill in the top-right corner:
  ```html
  <div class="demo-switcher">
    <span>Visitor Context:</span>
    <select onchange="location.href = this.value">
      <option value="/solutions/enterprise-omnichannel-marvin">Marvin Oey (VP Ecommerce • Digital Shelf Surge)</option>
      <option value="/solutions/enterprise-omnichannel-sarah">Sarah Jenkins (Director Insights • Panel Focus)</option>
    </select>
  </div>
  ```
* Selecting the dropdown navigates between the two page instances. Since both are the same `NIQLimitlessPage` type with the same slot layout, the Hero/Proof/Action content still visibly "morphs" while the page shell stays identical — the point is the **template resolves differently per instance's tagged slot references**, not a same-URL client-side toggle.

#### Option B: GraphiQL Explorer (Recommended for Technical / Architecture Leads)
* Open Optimizely Graph API Explorer and run the query live:
  ```graphql
  query ResolveABM($persona: String!) {
    HeroBlock(where: { Persona: { eq: $persona } }) {
      Headline
      Subheadline
    }
    ProofBlock(where: { Persona: { eq: $persona } }) {
      MetricNumber
      MetricLabel
    }
  }
  ```
* Show the JSON payload resolving in **<35ms**.

---

### Step 5: Mark Pre-Flight Prompt (5 Mins)
* In Optimizely CMP (or your conversation stream), have this prompt ready to show AI brief generation:
  ```text
  @campaign_brief_generation
  Account: Unilever
  Target Audience: VP of Global E-commerce
  Objective: Cross-sell Digital Shelf Analytics to existing Measurement client
  Assets Needed: 2026 European Retailer Out-of-Stock Benchmark
  ```

---

## 3. What NOT to Build (Avoid These Traps)

| Common Overthinking Pitfall | What to Do Instead | Why |
|---|---|---|
| **Building 10–20 separate hand-coded pages** | Build **ONE** governed page type (`NIQLimitlessPage`) and instantiate it per persona by referencing tagged blocks. | Two zero-code instances of the same template is categorically different from engineers hand-cloning markup across 5,760 permutations. |
| **Writing custom CSS/themes** | Reuse the existing `HeroBlock`/`ProofBlock`/`ActionBlock` renderers. | The prospect evaluates time-to-market and operational handoffs, not custom styling. |
| **Building live 6sense webhook APIs** | Use the existing LinkedIn Feed mock canvas. | Live external webhooks add latency and failure risk during live demos. |
| **Adding complete header/footer menus** | Keep the layout focused on Hero, Proof, and CTA. | Full navigation menus distract the audience from the core narrative contrast. |

---

## 4. Eight-Minute Live Demo Execution Guide

| Time | Action | Screen / Asset | Script Cue |
|---|---|---|---|
| **0:00 – 1:45** | **Act 1: Validate the Genius** | LinkedIn Feed Canvas (`dat7o4a9io6g009udcag`) | *"Look at how sophisticated your ABM intelligence is. 6sense identifies Marvin Oey at Unilever surging on digital shelf analytics (94/100). The LinkedIn ad speaks directly to his pain."* |
| **1:45 – 3:30** | **Act 2: Expose the Pain & The Math** | Click to live `nielseniq.com/products/digital-shelf/` | *"Marvin clicks 'Learn more'. Look at the page: generic title, spirits case study, and an SDR lead form. Why? Because manual page cloning across 5,760 permutations causes operational paralysis."* |
| **3:30 – 5:30** | **Act 3: Orchestrate with CMP & Mark** | Optimizely CMP + CMS | *"Mark synthesizes the brief in seconds. Marketers instantiate the governed `NIQLimitlessPage` template and point its slots at tagged blocks — no Visual Builder assembly required. Mark writes persona copy variants in 3 seconds without developer tickets."* |
| **5:30 – 7:15** | **Act 3: Live Permutation Switch** | `/solutions/enterprise-omnichannel-marvin` → `/solutions/enterprise-omnichannel-sarah` | Toggle from **Marvin** to **Sarah** via the dropdown. Same `NIQLimitlessPage` template, same slot layout — only the referenced Hero/Proof/CTA blocks differ, resolved via Graph in <50ms. |
| **7:15 – 8:00** | **The Challenger Close** | Architecture Canvas (`dat7ad29io6g009p6h2g`) | *"From intent signal to live personalized experience in minutes, not months. Zero tickets. Zero cloned pages. Zero context loss."* |
