# Demo Flow — Section 3: Solution Presentation

The evaluation committee is structured to hook business and marketing stakeholders first, then validate with IT and security. The agenda's bullet order is intentional — it reflects that stakeholder handoff. This demo flow mirrors it strictly, descending from marketer-visible experience into technical architecture.

Reference: `schedule-d-demo-feasibility.md`

---

## 1. Demonstration of Platform Interface (~15 min)

*Lead with what the marketer sees and controls. Hook the business stakeholders before anyone looks under the hood.*

- Open the published CIBC Mellon site — show a visitor-facing page as the starting point
- Switch to the CMS editor: open the same page in Visual Builder
- Live composition: add a section (Hero, Sidebar, Split), drop in blocks (Card, Action, Compliance), publish — no developer involvement
- Multiple content types side by side: thought leadership article, news item, information page, campaign landing page
- Mobile preview: demonstrate responsive layout without leaving the editor
- Bilingual: toggle EN / FR via the language switcher; show locale-prefixed routing on the live site
- Real-time preview: show draft state vs. published via the `/preview` route

**Feasibility:** Live App + CMS Editor

---

## 2. Customer Journey Mapping and Experience Optimization (~10 min)

*Not a platform feature — this is the business-value narrative told through the live site. Walk a specific CIBC Mellon persona through a content journey to show how the platform supports it end to end.*

Suggested scenario: **a pension fund manager discovering a thought leadership piece**

- Hub page (Insights / Straight Talk) → individual article → related content sidebar → CTA block
- Show how a marketer builds and maintains that journey in the editor: page hierarchy, internal linking, featured content slots
- DAM moment: marketer uploads a thought leadership PDF, AI tags it, it surfaces in search and the sidebar
- Gated content: the PDF download triggers a lead-capture form — show the setup in the CMS

*The customer journey is the story; the platform interface demo above is the proof.*

**Feasibility:** Live App + CMS Editor

---

## 3. Personalization & Engagement Tools (~10 min)

*The marketer differentiator. Demonstrate that the platform can recognise who is on the site and serve them a different experience — without a developer.*

- Audience segmentation setup in Optimizely Web: define a "Pension Fund Manager" segment
- Assign a content variant to that segment on the campaign landing page (different hero, different CTA)
- Show `OptimizelyActivation` re-firing on soft (Next.js `<Link>`) navigation — personalization persists across the site without full page reloads
- A/B experiment: headline variant test on the Insights hub; show how a marketer reads the results and promotes the winner

**Feasibility:** Live App

---

## 4. Core Features and Capabilities (~10 min)

*Transition segment: broaden the capability story and begin bridging from marketer experience toward the technical depth IT will validate next.*

- Approval workflow: route a draft through a reviewer gate — the "second set of eyes" compliance requirement
- Content scheduling: set a future publish date/time/timezone on a campaign page
- Opal AI: generate a draft article summary, auto-tag assets, suggest metadata
- Versioning / audit trail: content history panel — show a previous version and restore
- Image editor: resize and crop a DAM asset without leaving the CMS
- Batch publishing: publish a content tree (hub + articles + assets) in one action
- Brand governance: show that all pages are constrained to registered block types and the `siteConfig` template — rogue styling is not possible
- WCAG 2.0 AA: show Lighthouse / axe-core result against the running site

**Feasibility:** CMS Editor + Live App (WCAG result)

---

## 5. Solution Architecture and Technology Stack (~5 min)

*Hand off to the IT stakeholders. Now that the marketing value is established, show how it's built.*

- Headless / decoupled architecture diagram — Optimizely CMS → Optimizely Graph → Next.js frontend (and any other consumer)
- Live GraphQL endpoint: show the same structured content the site renders, now as raw API output — this is the AEO / machine-readable story
- Omnichannel: the Next.js site is one consumer; mobile, partner portals, and data feeds use the same Graph endpoint
- Dev / stage / prod environment setup
- Multi-site: single CMS instance managing multiple configured hosts

**Feasibility:** Live App (GraphQL moment) + Architecture / Argument

---

## 6. Integration Capabilities (~5 min)

*IT validates the ecosystem fit. No live app demo — use an architecture diagram.*

- Microsoft Dynamics CRM: contact and lead data activation from gated content forms
- Salesforce Marketing Cloud / Marketo: lead capture, nurture triggers, campaign sync
- Headless API-first model: every integration connects via the same Graph endpoint the Next.js app uses — no bespoke connectors per channel

**Feasibility:** Architecture / Argument

---

## 7. Security and Ongoing Remediation (~5 min)

*IT and security stakeholders validate governance and risk posture.*

- RBAC: show custom roles and per-site access controls in the CMS admin panel
- SSO / MFA: platform authentication settings
- Gated content: revisit the lead-capture form from segment 2 — show the access control layer
- Versioning / audit trail: revisit as a compliance and remediation tool, not just a marketer convenience
- User attestation reporting: access activity visibility for governance

**Feasibility:** CMS Editor + Architecture / Argument

---

## 8. Scalability (~3 min)

*Final IT sign-off. Brief — the room is ready to close.*

- SaaS architecture: no infrastructure provisioning or performance tuning required
- Global CDN: edge delivery, cache invalidation on publish
- Ability to add sites, locales, and content types without re-platforming

**Feasibility:** Architecture / Argument

---

## Stakeholder Handoff Map

| Segment | Primary audience | Mode |
|---|---|---|
| 1. Platform Interface | Marketing, Business | Live App + CMS Editor |
| 2. Customer Journey | Marketing, Business | Live App + CMS Editor |
| 3. Personalization | Marketing, Business | Live App |
| 4. Core Features | Marketing → IT bridge | CMS Editor + Live App |
| 5. Architecture | IT | Architecture / Argument + Live App |
| 6. Integrations | IT | Architecture / Argument |
| 7. Security | IT, Security | CMS Editor + Architecture / Argument |
| 8. Scalability | IT, Security | Architecture / Argument |
