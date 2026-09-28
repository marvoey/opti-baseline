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
│ 1. Three (3) Minimal Atomic Component Schemas          │
│ 2. Five (5) Seeded Content Blocks (2 Permutations)     │
│ 3. One (1) Master Experience Template + Blueprint      │
│ 4. Front-End Context Switcher (or GraphiQL Query)      │
│ 5. One (1) Pre-Saved Mark CMP Prompt                   │
└────────────────────────────────────────────────────────┘
```

---

## 2. Step-by-Step Tenant Build Plan

### Step 1: Model 3 Atomic Primitives in CMS SaaS (15 Mins)
*Keep property schemas lean and clean. Use simple text and choice fields.*

#### A. `HeroBlock`
* `Headline` (Text, Single-line)
* `Subhead` (Text or Rich Text, target ~100–150 words)
* `PrimaryCTA` (Text)
* **Taxonomy Metadata:**
  * `Industry` (Choice: `CPG_FMCG`, `Beverage_Alcohol`, `Tech_Durables`)
  * `Persona` (Choice: `Ecommerce_Lead`, `Insights_Director`, `Category_Manager`)
  * `Solution` (Choice: `DigitalShelf`, `ConsumerPanel`, `BASES`)

#### B. `ProofBlock`
* `MetricNumber` (Text, e.g. `"-18%"`, `"92%"`)
* `MetricLabel` (Text, e.g. `"Retailer Out-of-Stocks"`, `"SKU Forecast Accuracy"`)
* `ClientQuote` (Text, 1–2 sentences)
* `ClientIdentifier` (Text, e.g. `"Global FMCG Personal Care Brand"`)
* **Taxonomy Metadata:** `Industry`, `Persona`

#### C. `ActionBlock`
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
   * **Subhead:** *"Connect store-level availability directly to omnichannel revenue and share of search on Amazon, Tesco, and Carrefour. Eliminate retailer blindspots with NIQ UPC-level referential data."*
   * **CTA:** *"Explore Digital Shelf Analytics"*
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
   * **Subhead:** *"Decode omnichannel buyer behavior and brand switching patterns across FMCG categories. Move from observation to predictive growth with verified consumer panel datasets."*
   * **CTA:** *"Access Consumer Panel Insights"*
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

### Step 3: Create The Master Experience in Visual Builder (20 Mins)
1. **Create One Single Experience:**
   * URL Path: `/solutions/enterprise-omnichannel`
2. **Assemble Layout Structure:**
   * Add a Section with 3 stacked slots/rows:
     * **Slot 1:** Hero Block
     * **Slot 2:** Proof Block
     * **Slot 3:** Action / Meeting Block
3. **Save as Blueprint:**
   * Highlight the section in the Outline panel $\rightarrow$ Click **"Save Blueprint"** $\rightarrow$ Name it: `"ABM Enterprise Strategic Expansion"`.
   * *Demo Purpose:* Proves marketers instantiate pre-governed design patterns in clicks without filing engineering tickets.

---

### Step 4: Setup the Runtime Resolution Trigger (15 Mins)

*Choose the demonstration vehicle that best fits your audience:*

#### Option A: Interactive Front-End Switcher (Recommended for Business / Marketing Leaders)
* On the demo landing page template, render a small floating diagnostic pill in the top-right corner:
  ```html
  <div class="demo-switcher">
    <span>Visitor Context:</span>
    <select onchange="switchPersona(this.value)">
      <option value="marvin">Marvin Oey (VP Ecommerce • Digital Shelf Surge)</option>
      <option value="sarah">Sarah Jenkins (Director Insights • Panel Focus)</option>
    </select>
  </div>
  ```
* Selecting the dropdown re-renders Slot 1 & Slot 2 immediately via dynamic state/query on the **same URL without page reloading**.

#### Option B: GraphiQL Explorer (Recommended for Technical / Architecture Leads)
* Open Optimizely Graph API Explorer and run the query live:
  ```graphql
  query ResolveABM($persona: String!) {
    HeroBlock(where: { Persona: { eq: $persona } }) {
      Headline
      Subhead
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
| **Building 10–20 separate pages** | Build **ONE** master template with dynamic slots. | Building multiple pages contradicts the Challenger insight that page cloning is obsolete. |
| **Writing custom CSS/themes** | Use standard Visual Builder components. | The prospect evaluates time-to-market and operational handoffs, not custom styling. |
| **Building live 6sense webhook APIs** | Use the existing LinkedIn Feed mock canvas. | Live external webhooks add latency and failure risk during live demos. |
| **Adding complete header/footer menus** | Keep the layout focused on Hero, Proof, and CTA. | Full navigation menus distract the audience from the core narrative contrast. |

---

## 4. Eight-Minute Live Demo Execution Guide

| Time | Action | Screen / Asset | Script Cue |
|---|---|---|---|
| **0:00 – 1:45** | **Act 1: Validate the Genius** | LinkedIn Feed Canvas (`dat7o4a9io6g009udcag`) | *"Look at how sophisticated your ABM intelligence is. 6sense identifies Marvin Oey at Unilever surging on digital shelf analytics (94/100). The LinkedIn ad speaks directly to his pain."* |
| **1:45 – 3:30** | **Act 2: Expose the Pain & The Math** | Click to live `nielseniq.com/products/digital-shelf/` | *"Marvin clicks 'Learn more'. Look at the page: generic title, spirits case study, and an SDR lead form. Why? Because manual page cloning across 5,760 permutations causes operational paralysis."* |
| **3:30 – 5:30** | **Act 3: Orchestrate with CMP & Mark** | Optimizely CMP + Visual Builder | *"Mark synthesizes the brief in seconds. In Visual Builder, marketers assemble governed Blueprints. Mark writes persona copy variants in 3 seconds without developer tickets."* |
| **5:30 – 7:15** | **Act 3: Live Permutation Switch** | Demo Page `/solutions/enterprise-omnichannel` | Toggle from **Marvin** to **Sarah**. Show the Hero, Proof, and CTA morph instantly on the exact same URL via Graph in <50ms. |
| **7:15 – 8:00** | **The Challenger Close** | Architecture Canvas (`dat7ad29io6g009p6h2g`) | *"From intent signal to live personalized experience in minutes, not months. Zero tickets. Zero cloned pages. Zero context loss."* |
