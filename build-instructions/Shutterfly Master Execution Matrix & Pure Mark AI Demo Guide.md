# Shutterfly Master Execution Matrix & Pure Mark AI Demo Guide

---

## 1. Master Execution Matrix: From 5 Pains to Consolidated Demo

| Operational Track | Stakeholder | Verbatim Pain Summary | Consolidated Stream | Demo Proof Point (Friday & Next Week) | Mark AI Primitive Used |
|---|---|---|---|---|---|
| **Track 1: SiteOps & Production** | Waruna Perera | Rogue settings buried 3 levels deep in device tabs require dev triage. | **Stream A: Content Velocity & Governance** | Run **Block Tree Auditor Agent** (`@block-tree-auditor`) to scan REST Delivery JSON and output tab-specific overrides in 5 seconds. | **Specialized Agent + Custom Skill** |
| **Track 2: E-Commerce & Experimentation** | Srinivas Kona | Manually creating block variants for 3rd-party A/B tests creates a bottleneck. | **Stream A: Content Velocity & Governance** | Run **A/B Variant Generator** (`/generate-variants`) to produce 3 schema-compliant CMS 12 draft block payloads from 1 master block. | **Custom Skill + Specialized Agent** |
| **Track 3: Creative, UX & Brand Governance** | Waruna Perera | Creative mocks differ from UX wireframes; no time to QA before debut. | **Stream A: Content Velocity & Governance** | Upload Creative mockup image and have Mark diff it against the rendered staging URL / JSON payload via **Agent Workflow**. | **Multimodal Agent Workflow + Web Browse** |
| **Track 4: Core Software Engineering** | Srinivas Manda | Developers coding in .NET repo need tools for component design and schema inspection. | **Stream B: Developer & Tooling** | Demonstrate Mark inspecting CMS 12 content type definitions, C# models, and generating TypeScript React interfaces & edge-case seed data. | **Specialized Agent + Code Execution / MCP** |
| **Track 5: Platform Compatibility & Sandbox** | Srinivas Kona | Unsure if CMS 12 version supports Mark; need a sandbox to test before Opti ID. | **Stream B: Developer & Tooling** | Showcase **Mark Agent Builder, Custom REST Tool Configuration, & Workspace Sandbox** running against headless CMS 12 REST contracts. | **Mark Agent Builder + REST API Tool** |
| **Executive Overlay** | VP of E-Commerce (Leon / Ladres) | Anxiety over contract ROI and being sold SaaS features on a PaaS architecture. | **Stream C: Executive ROI & Reality** | Deliver live **Interactive Canvas Reality Matrix** separating Day 1 PaaS capabilities from future roadmap, quantifying labor hours saved. | **Mark Interactive Canvas** |

---

## 2. Track-by-Track Step-by-Step Demo Instructions (Using Only Mark Capabilities)

Every proof point below is designed to run **100% natively inside Mark (Opal)** using built-in capabilities (Chat, Attachments, Specialized Agents, Custom Skills, Web Browsing, and Canvas)—requiring zero external dependencies or risky live customer VPN connections.

---

### Track 1: SiteOps & Content Production (Waruna Perera)
**Demo Proof Point:** Automated "3-Levels-Deep" Device Tab Block Tree Audit

#### A. What You Need to Prep in Mark (5 Mins Before Call)
1. **Save a Mock CMS 12 Content Delivery API JSON File (`shutterfly_page_delivery.json`):**
   Create a realistic headless CMS 12 JSON payload representing a promotional landing page that nests blocks 3 levels deep (`LandingPage` ➔ `HeroContainerBlock` ➔ `PromoRowBlock` ➔ `PromoCardBlock_04`) with a `ControlTab` and `DeviceTabs` (`Desktop`, `Tablet`, `Mobile`).
   ```json
   {
     "contentLink": { "id": 1042, "workId": 0 },
     "name": "Holiday Photo Books Campaign Page",
     "contentType": ["Page", "CampaignLandingPage"],
     "mainContentArea": [
       {
         "contentLink": { "id": 2010 },
         "name": "Level 1 - Main Hero Container",
         "contentType": ["Block", "ContainerBlock"],
         "controlTab": { "isVisible": true, "theme": "holiday-red" },
         "children": [
           {
             "contentLink": { "id": 3055 },
             "name": "Level 2 - Holiday Promo Grid Row",
             "contentType": ["Block", "GridRowBlock"],
             "controlTab": { "columns": 3 },
             "children": [
               {
                 "contentLink": { "id": 4892 },
                 "name": "Level 3 - 50% Off Hardcover Photo Book Card",
                 "contentType": ["Block", "PromoCardBlock"],
                 "controlTab": { "headline": "50% Off Hardcover Photo Books", "showPromoBadge": true, "ctaUrl": "/photo-books/hardcover" },
                 "deviceTabs": {
                   "desktop": { "inheritFromControl": true, "showPromoBadge": true, "overridePriceText": null },
                   "tablet": { "inheritFromControl": true, "showPromoBadge": true, "overridePriceText": null },
                   "mobile": { "inheritFromControl": false, "showPromoBadge": false, "overridePriceText": "Excludes Disney Collection", "hiddenLegacyBannerId": "BUG_BANNER_99" }
                 }
               }
             ]
           }
         ]
       }
     ]
   }
   ```
2. **Optional Skill Setup:** Create a personal skill in Mark titled `CMS 12 Deep Block Auditor` with handle `/audit-block-tree` that instructs Mark to recursively traverse CMS 12 Content Delivery JSON payloads and flag device-tab overrides and missing required fields.

#### B. Step-by-Step Live Execution in Mark
1. Open Mark Chat and attach `shutterfly_page_delivery.json` (or invoke your REST tool connected to a mock endpoint).
2. Narrate to Waruna: *"Here is the exact Content Delivery REST API payload from a CMS 12 campaign page with nested blocks and device tabs. Instead of clicking through 15 tabs in the CMS UI or pinging engineering, watch what SiteOps does in Mark."*
3. Enter the prompt below and run it live.

#### C. Exact Prompt Needed
```text
/audit-block-tree Inspect this CMS 12 Content Delivery API JSON payload for the "Holiday Photo Books Campaign Page". 

Recursively traverse all nested content areas and child blocks (Level 1, Level 2, Level 3+). Compare the `controlTab` settings against each breakpoint in `deviceTabs` (desktop, tablet, mobile). 

Output a structured SiteOps QA table identifying:
1. Exact Block ID & Name
2. Nesting Path (Breadcrumb trail from Level 1 down to the block)
3. The Device Tab where an override or rogue property exists
4. The exact property discrepancy causing unexpected rendering on the React frontend
5. Exact remediation steps for a SiteOps editor in CMS 12
```

#### D. Expected Outcome in Mark
Mark immediately outputs a clean diagnostic table:
* **Flagged Block:** `ID 4892` ("Level 3 - 50% Off Hardcover Photo Book Card")
* **Exact Breadcrumb Path:** `CampaignLandingPage (1042)` ➔ `Level 1 - Main Hero Container (2010)` ➔ `Level 2 - Holiday Promo Grid Row (3055)` ➔ `Level 3 - PromoCardBlock (4892)`
* **Device Tab Conflict:** On the **`mobile`** tab, `inheritFromControl` is set to `false`, `showPromoBadge` is overridden to `false`, and a rogue property `hiddenLegacyBannerId: "BUG_BANNER_99"` is injected.
* **Fix Action:** Open Block `#4892` in CMS 12, click the **Mobile Device Tab**, toggle `Inherit From Control` back to `True`, and clear `hiddenLegacyBannerId`.

#### E. How This Solves the Stakeholder Pain
* **For Waruna (SiteOps):** Eliminates hours of blind clicking through nested CMS folders and device tabs. His 4-person team can self-diagnose why something is showing up or missing on mobile in **5 seconds**.
* **For Engineering (Kona & Manda):** Completely stops SiteOps from interrupting developers to hunt down content-level configuration mistakes in the database or JSON responses.

---

### Track 2: E-Commerce Merchandising & Experimentation (Srinivas Kona & Waruna)
**Demo Proof Point:** Prompt-to-Block Bulk Variant Generation for 3rd-Party A/B Testing

#### A. What You Need to Prep in Mark (5 Mins Before Call)
1. **Create a Skill or Specialized Agent (`/generate-variants`):**
   Configure a skill in Mark that takes a baseline CMS 12 block JSON (such as a `TestimonialBlock` or `HeroBannerBlock`) and outputs ready-to-import CMS 12 Management API Draft payloads (`status: "Draft"`) for each requested audience variant while preserving all technical schema keys, React component bindings, and image constraints.

#### B. Step-by-Step Live Execution in Mark
1. Show the baseline approved CMS 12 `TestimonialBlock` JSON in Mark (Content ID `8810`).
2. Narrate to Kona: *"You mentioned the eCom team uses a 3rd-party A/B testing plugin on the React frontend, and their biggest bottleneck is manually cloning and editing block variations in CMS 12 for each test variant. Here is how Mark automates that."*
3. Run the prompt below.

#### C. Exact Prompt Needed
```text
Here is our approved baseline CMS 12 TestimonialBlock JSON (Content ID: 8810):
{
  "contentType": ["Block", "TestimonialBlock"],
  "name": "Baseline - General Photo Book Testimonial",
  "status": "Published",
  "properties": {
    "quoteHeadline": "Memories That Last a Lifetime",
    "customerQuote": "I made our family yearbook in under an hour and the print quality blew us away.",
    "customerPersona": "General Shopper",
    "ctaText": "Start Your Book",
    "ctaLink": "/photo-books",
    "reactComponentKey": "SflyTestimonialCardV2",
    "abTestSlotId": "HOME_TESTIMONIAL_SLOT_A"
  }
}

Our eCom team is launching a 3-way A/B test in our React testing tool. Generate 3 distinct CMS 12 block variations in "Draft" status tailored to these high-intent segments:
- Variant B: Newlyweds / Wedding Album Shoppers
- Variant C: Busy Parents / Baby's First Year Book
- Variant D: Holiday Gift Givers (Grandparents / Family Gifts)

Output:
1. A side-by-side Merchandising Review Table comparing the copy across all 3 variants.
2. The exact CMS 12 Content Management API POST payload array (`status: "Draft"`) ready to write directly into CMS 12 without manual cloning.
```

#### D. Expected Outcome in Mark
1. **Merchandising Review Table:** Displays Variant B, C, and D with tailored headlines, quotes, and CTAs so eCom can approve copy at a glance.
2. **Schema-Valid CMS 12 JSON Array:** Outputs the 3 structured JSON objects with `"status": "Draft"`, preserving `"reactComponentKey": "SflyTestimonialCardV2"` and incrementing `"abTestSlotId"` (`SLOT_B`, `SLOT_C`, `SLOT_D`) so the React frontend can render the A/B test immediately.

#### E. How This Solves the Stakeholder Pain
* **For Srinivas Kona & the eCom Team:** Turns 2 hours of repetitive manual block cloning, field pasting, and property configuring in CMS 12 into a 10-second prompt. It accelerates their existing 3rd-party React A/B testing program immediately without forcing them to rip-and-replace their testing tool on Day 1.

---

### Track 3: Creative, UX & Brand Governance (Waruna Perera)
**Demo Proof Point:** Pre-Launch Multimodal Spec-to-Build QA (Creative Comp vs. Staging Build)

#### A. What You Need to Prep in Mark (5 Mins Before Call)
1. **Prepare Two Artifacts on Your Desktop:**
   * **File 1 (`creative_approved_mock.png`):** A screenshot or mockup image of a Shutterfly promotional banner (e.g., a Holiday Card / Disney Collection banner that clearly shows: Headline *"Magical Memories Await"*, Promo Code `"DISNEY40"`, a secondary CTA *"View Full Collection"*, and a footer legal line *"© Disney. Exclusions apply."*).
   * **File 2 (Staging HTML/JSON or Live URL):** Either a staging preview snippet or the CMS 12 JSON payload for that same block where the secondary CTA is missing, the promo code says `"SAVE30"` instead of `"DISNEY40"`, and the legal disclaimer is omitted.

#### B. Step-by-Step Live Execution in Mark
1. Attach `creative_approved_mock.png` into the Mark chat window.
2. Narrate to Waruna: *"You described how UX mocks something up, Creative changes it, SiteOps builds it, and nobody has time to QA before debut—leading to last-minute fire drills when elements from the Creative mock are missing. Watch how Mark acts as an automated pre-launch governance gate."*
3. Run the multimodal comparison prompt.

#### C. Exact Prompt Needed
```text
Act as our Pre-Launch SiteOps & Brand Governance QA Agent. 

I have attached the final approved Creative Mockup image (`creative_approved_mock.png`) for tomorrow's campaign launch. Below is the actual CMS 12 block JSON payload currently staged for release by SiteOps:

{
  "blockId": 9921,
  "name": "Hero Banner - Magical Memories Campaign",
  "headline": "Magical Memories Await",
  "subhead": "Create custom keepsakes with your favorite characters.",
  "promoCodeBadge": "Use Code: SAVE30",
  "primaryCta": { "text": "Shop Now", "url": "/disney" },
  "secondaryCta": null,
  "legalDisclaimer": ""
}

Compare the visual Creative Mockup against the staged CMS 12 build. Identify every visual, copy, promotional, or legal discrepancy before we publish. Format the output as a Launch Readiness Scorecard (Pass/Fail) with exact field-level fixes for SiteOps.
```

#### D. Expected Outcome in Mark
Mark uses multimodal vision to read the Creative image and diffs it against the CMS build, outputting:
* **Launch Readiness Status:** ❌ **HOLD RELEASE (3 Critical Discrepancies Detected)**
  1. **Promo Code Mismatch (High Severity):** Creative mock displays `"Use Code: DISNEY40"`, but CMS `promoCodeBadge` is set to `"Use Code: SAVE30"`.
  2. **Missing Component (Medium Severity):** Creative mock includes a secondary CTA button (`"View Full Collection"`), but CMS `secondaryCta` is `null`.
  3. **Missing Legal Compliance Text (Critical Severity):** Creative mock contains `"© Disney. Exclusions apply."` at the bottom, whereas CMS `legalDisclaimer` is empty `""`.
* **Auto-Generated Corrected JSON:** Mark outputs the corrected JSON block with all three missing/mismatched fields fixed.

#### E. How This Solves the Stakeholder Pain
* **For Waruna (SiteOps) & Creative/UX:** Eliminates launch-day blame games (*"What did we promise who? Do we build it fast or renegotiate?"*). SiteOps can validate any page against Creative's final Figma/PNG export in 15 seconds prior to publishing—even when human QA time is zero.

---

### Track 4: Core Software Engineering & Architecture (Srinivas Manda & Srinivas Kona)
**Demo Proof Point:** C# `.NET` CMS 12 Content Type to React TypeScript Interface & Edge-Case Test Data Seeder

#### A. What You Need to Prep in Mark (5 Mins Before Call)
1. Have a sample CMS 12 C# Content Type class snippet ready (representing how Manda's team codes in their `.NET` repository):
   ```csharp
   [ContentType(DisplayName = "Promo Carousel Block", GUID = "d4b8a112-9c44-4f8a-b123-001122334455")]
   public class PromoCarouselBlock : BlockData
   {
       [Required]
       [Display(Name = "Carousel Title", GroupName = SystemTabNames.Content, Order = 10)]
       public virtual string CarouselTitle { get; set; }

       [Display(Name = "Auto Rotate Interval (ms)", GroupName = SystemTabNames.Content, Order = 20)]
       public virtual int AutoRotateInterval { get; set; }

       [AllowedTypes(typeof(PromoCardBlock))]
       [Display(Name = "Slides", GroupName = SystemTabNames.Content, Order = 30)]
       public virtual ContentArea Slides { get; set; }

       [Display(Name = "Mobile Override Tab", GroupName = "MobileTab", Order = 40)]
       public virtual bool HideOnMobileViewport { get; set; }
   }
   ```

#### B. Step-by-Step Live Execution in Mark
1. Narrate to Srinivas Manda: *"Manda, you asked how this platform helps developers who are coding directly in the Optimizely .NET repository when designing components, and how it speeds up QE testing across your middle-tier cache and React frontend. Whether invoked via MCP in VS Code or directly in Mark, watch this workflow."*
2. Paste the C# class into Mark with the developer prompt below.

#### C. Exact Prompt Needed
```text
We are developing a new CMS 12 component in our .NET repository and exposing it via the Optimizely Content Delivery REST API to our headless React frontend. Here is our C# block definition:

[Paste C# PromoCarouselBlock class above]

Perform 3 engineering & QE tasks:
1. Component Design Review: Analyze this C# ContentType for headless REST API serialization pitfalls or middle-tier caching risks.
2. React TypeScript Contract: Generate the exact TypeScript interface (`PromoCarouselBlockProps`) that matches how Optimizely Content Delivery API serializes this C# class into JSON.
3. Automated QE Stress-Test Seed Data: Generate 3 mock Content Delivery API JSON payloads to test our React error boundaries (1 Happy Path, 1 Boundary Case with 500-character strings and special Unicode characters, and 1 Null/Empty ContentArea edge case).
```

#### D. Expected Outcome in Mark
1. **Architectural Review:** Flags that `AutoRotateInterval` has no `[Range]` validation attribute (risking `0` or negative ms crashing the React carousel timer) and recommends explicit serialization settings for `ContentArea Slides` so nested blocks expand properly in a single REST call without N+1 cache misses.
2. **Ready-to-Use TypeScript Interface:** Outputs clean TypeScript code matching the CMS 12 Content Delivery API JSON structure (`ContentLink`, `ExpandedValue`, etc.).
3. **3 Edge-Case JSON Payloads:** Produces immediate JSON test fixtures that QE can run against the React frontend before a single content editor touches the CMS.

#### E. How This Solves the Stakeholder Pain
* **For Srinivas Manda & Kona:** Directly answers Manda's request for developer decision support while designing `.NET` components and Kona's headless React integration needs. It bridges the `.NET` backend and React frontend automatically and gives QE instant stress-test payloads.

---

### Track 5: Platform Implementation, Compatibility & Sandbox Evaluation (Srinivas Kona & Manda)
**Demo Proof Point:** Under-the-Hood Agent Builder & Decoupled REST API Architecture Walkthrough

#### A. What You Need to Prep in Mark (5 Mins Before Call)
1. Have the **Mark Skills / Agent Configuration** view open in a browser tab (or show how a skill/agent is authored live inside Mark using the `create_or_edit_skill` / agent configuration flow).

#### B. Step-by-Step Live Execution in Mark
1. Narrate to Kona: *"Kona, you asked two crucial questions: Does this work with CMS 12 without upgrading all your core .NET libraries to version 13? And how does Mark actually connect to your external systems and sandbox? Let's look under the hood."*
2. Run the prompt below in Mark to generate an interactive architectural blueprint and live agent definition for their team.

#### C. Exact Prompt Needed
```text
Create a technical integration specification and sample OpenAPI / Webhook tool definition showing how Optimizely Mark connects to Shutterfly's Headless CMS 12 PaaS environment:
- Backend: Optimizely CMS 12 on DXP PaaS (deployed via Jenkins)
- API Layer: Standard Optimizely Content Delivery REST API & Content Search API
- Middleware: Custom Caching Layer invalidated via CMS Publish Webhooks
- Frontend: Decoupled React Application

Show:
1. Why Mark requires ZERO upgrades to CMS 13 (how Opti ID + external REST API tools decouple AI from the .NET runtime DLLs).
2. A concrete JSON tool definition showing how Mark calls Shutterfly's Content Delivery API to inspect pages without bypassing or polluting their middle-tier cache.
3. How Kona and Manda can use a Mark Sandbox workspace immediately to test custom agents against their staging JSON payloads before Opti ID is even turned on in production.
```

#### D. Expected Outcome in Mark
Mark generates a clear technical architecture diagram and JSON tool schema showing:
* **Zero Core DLL Upgrade Dependency:** Mark runs in the Optimizely Cloud layer and communicates via HTTP REST endpoints and webhooks—meaning CMS 12 PaaS works as-is once Opti ID authentication is mapped.
* **Cache-Safe Execution:** Demonstrates how Mark reads from either the CMS 12 preview/management endpoint or public delivery API without triggering unintended production cache invalidations.
* **Immediate Sandbox Path:** Shows how Kona's team can log into an isolated Opal Sandbox and test agents using exported JSON payloads or staging URLs right away.

#### E. How This Solves the Stakeholder Pain
* **For Srinivas Kona & Manda:** Removes the fear of a massive, risky `.NET` upgrade project and answers Waruna’s requirement (`{00:35:29}`): *"In Kona's case, it would be more like, where's the external system, how's it gonna connect?"* It gives engineering complete confidence in how the plumbing works.

---

### Executive Overlay: Commercial ROI & Architectural Transparency (VP of E-Commerce)
**Demo Proof Point:** Live Interactive "Day 1 vs. Future Roadmap" Reality Matrix & ROI Calculator on Canvas

#### A. What You Need to Prep in Mark (5 Mins Before Call)
1. No external files needed—you will use **Mark Canvas** live during the wrap-up to leave behind an executive decision artifact.

#### B. Step-by-Step Live Execution in Mark
1. Narrate to Waruna (for the VP of E-Commerce briefing): *"Waruna, you made it crystal clear that previously Shutterfly was shown SaaS demos when you own PaaS CMS 12, and your VP wants to see exactly what you can support today versus what takes future infrastructure work. We built that exact transparency matrix directly into this executive summary."*
2. Run the prompt below (or open the pre-built Canvas) to display the executive takeaways.

#### C. Exact Prompt Needed
```text
Generate an Executive ROI & Architectural Transparency Brief for Shutterfly's VP of E-Commerce comparing our 4 demonstrated use cases across:
1. Business Problem Solved
2. Works Day 1 on Current CMS 12 PaaS Headless Stack (With Opti ID)
3. Requires Incremental API / MCP Configuration (Low Lift)
4. Requires Future SaaS Migration (Out of Scope for Current Contract ROI)
5. Estimated Weekly Hours Saved for the 4-Person SiteOps Team, eCom, and Engineering
```

#### D. Expected Outcome in Mark
Mark outputs a crystal-clear executive table that separates **Day 1 PaaS Reality** from **SaaS Shelfware**:
* **Day 1 (Zero Code Lift — Opti ID + Mark Workspace):**
  * Multimodal Creative Mock vs. Staging QA (Saves ~6–8 hrs/week of launch fire drills)
  * Public/Staging URL Accessibility & SEO Audits (Saves ~4 hrs/week)
  * JSON Payload Deep Block Tree Auditing (Saves ~5–8 hrs/week across SiteOps & Dev triage)
* **Low-Lift API Hookup (CMS 12 Management REST API + MCP):**
  * Automated Draft Block Variant Creation for 3rd-Party A/B Tests (3x faster campaign test velocity)
  * VS Code Developer Schema & QE Test Data Generation (Reduces component dev/QE cycle by ~30%)
* **Explicitly Excluded (No False SaaS Promises):**
  * SaaS Visual Builder / SaaS Experience Blueprints (Clearly marked as SaaS-only so leadership knows nothing in this demo is "shelfware").

#### E. How This Solves the Stakeholder Pain
* **For Waruna & the VP of E-Commerce (Leon / Ladres):** Directly neutralizes the historical trauma of being sold SaaS features on a PaaS contract. It arms Waruna and his VP with concrete, defensible ROI tied 100% to their existing CMS 12 headless investment.
