# ESL Federal Credit Union - Demo Prep Details

## Proposed Agenda (from Vendor Template)

| Topic | Duration |
|---|---|
| Introductions | 10 mins |
| Company + Product Overview | 15 mins |
| Platform Orientation + Content Curation | 20 mins |
| Personalization + Experimentation | 15 mins |
| Customer Data Platform | 15 mins |
| Visual Composition + Rapid Experience Iteration | 15 mins |
| Digital Asset Management | 15 mins |
| Time-to-Market Benchmarks + Case Studies | 10 mins |
| Open Questions / Wrap Up | 5 mins |

## Discovery Notes Provided (July 31)

**Context: ESL Federal Credit Union deal**
ESL is a NY-based credit union ($5–25B assets) replacing an "archaic" marketing site as the front-end layer of a 5-year backend modernization. Alacrity Partners (Simon + Joe) is the owner's rep running vendor sourcing/pre-screening ahead of a formal RFP; Ocean is the headless dev firm that will build the front end. Optimizely is being evaluated against Contentful/Contentstack, with embedded personalization/experimentation and Opal as our key differentiators.

**What was covered on the July 31 technical call:**

*   **Headless/composability:** confirmed pure headless, API-first, no forced dependencies. Marvin walked through the visual builder (framework-agnostic preview, GraphiQL tooling) and demoed Opal — both the content-model RAG assistant and generative page creation. Simon flagged Opal as differentiation but cautioned ESL will want brand/design governance first before embracing AI-generated pages (position Opal as an add-on, not the headline for the initial demo).
*   **Personalization/experimentation:** no hard dependency on Optimizely's ODP — can plug into a CDP ESL already has, and we can meet them at a "crawl/walk/run" maturity level rather than pushing full sophistication day one.
*   **Hosting:** Optimizely offers front-end hosting but it's not comparable to Vercel/Netlify tooling; ESL is looking at Vercel — composable, no blocker either way.
*   **DAM/CDP:** Optimizely's DAM is "good enough" for most and roadmap is expanding; not positioned as best-in-class vs. Bynder. No hard dependency between CMS/DAM/CDP — all swappable via API/connectors. Optimizely's Graph (Elasticsearch-backed) can even index external/legacy CMS content.
*   **Scoring Criteria:** What Simon said actually matters for scoring: partnership quality, customer success model, whether we do our own professional services or lean on partners, and how well the team gels in the demo — more than any single feature.
*   **Next steps agreed:** informal for now (no NDA needed yet), demo window is week of 8/17, Alacrity offered a pre-demo coaching call.

**Optimizely Follow Up With Alacrity Partners - July 31**

*   **Meeting Purpose:** Technical deep-dive to vet Optimizely's fit for ESL's DXP project.
*   **Key Takeaways:**
    *   Optimizely is a strong technical fit for ESL's headless, composable DXP needs. Its API-first architecture, flexible visual composition, and optional AI tools align with ESL's requirements.
    *   The initial demo must focus on a brand-governed MVP. ESL's priority is a fast rebrand launch, so the demo should showcase structured content and brand system adherence, positioning AI as a future add-on.
    *   Optimizely's platform is highly composable, preventing vendor lock-in. Its API-first design allows swapping out components (CDP, DAM) and integrating with external systems like Vercel, a key consideration for ESL.
    *   The demo is scheduled for the week of August 17th. Optimizely is unavailable the week prior (Aug 11-14) due to an internal conference.

**Topics:**

*   **ESL's DXP Requirements**
    *   ESL Credit Union is modernizing its public-facing digital properties (website, marketing, apps).
    *   Core Requirements: Headless (API-first), Composable/MACH, DXP Capabilities (Core CMS plus Level 1 adjacent features).
    *   Key Consideration: ESL's technical sophistication is high, but the public website is outdated. The rebrand is the primary driver, not the DXP itself.
*   **Optimizely's Headless & Composable Platform**
    *   Pure Headless: API-first architecture with JSON output.
    *   "Opinionated" Visual Builder: Structure uses a sections > rows > columns > leaves model. Agnostic Preview supports any front-end framework.
    *   Developer Tooling: Built-in GraphiQL tool for real-time API documentation. GraphQL layer built on Elasticsearch.
    *   Opal AI (Optional): Textual RAG tool. Understands content models, answers questions, generates content. Pricing flexible.
*   **Supporting Capabilities & Ecosystem**
    *   Independent Components: Personalization, experimentation, and ODP (CDP) are API-first and swappable.
    *   DAM Strategy: Optimizely's DAM is included. Recommendation is to start with integrated DAM for simplicity.
    *   Front-End Hosting: Optimizely offers hosting but recommends specialized services like Vercel or Netlify. ESL's Plan: Use Vercel.
*   **Demo Strategy & Process**
    *   Demo Focus: The initial demo must center on the brand rebrand MVP.
    *   Showcase: Structured content, design system adherence, and simple workflows (e.g., drag-and-drop, translation).
    *   Position Opal AI: As a powerful future capability, not a core MVP feature.
    *   Evaluation Process: Phase 1 (Informal) -> Phase 2 (Formal POC requiring NDA).
    *   Key Decision Factor: Partnership quality is critical. ESL values thought leadership and a community-focused approach.

**Next Steps:**
*   Alacrity Partners: Circulate demo time slots for week of 8/17, share demo agenda with all vendors.
*   Optimizely: Confirm availability for week of 8/17, prepare demo focused on brand rebrand MVP.