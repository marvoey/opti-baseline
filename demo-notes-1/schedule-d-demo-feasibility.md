# Schedule D — Demo Feasibility Matrix

Maps each RFP requirement to what can be demonstrated and how, given the current Next.js + Optimizely CMS SaaS app.

---

## Live App — Demonstrable in the running Next.js app today

| Requirement | Category | How the app demonstrates it |
|---|---|---|
| Headless CMS — separated presentation from content | Functional | Entire architecture: Optimizely Graph → `getContentByPath` → `OptimizelyComponent` render |
| Flexible layouts and web components | Functional | Visual Builder sections already registered: `HeroSection`, `SidebarSection`, `SplitSection`, `FeedSection`, `ColumnTemplate` |
| Multiple content types | Functional | `ContentTypeExplorer` at `/admin`; distinct block types: `HeroBlock`, `CardBlock`, `ComplianceBlock`, `ActionBlock`, `Paragraph` |
| Mobile-friendly views | Functional | Responsive Tailwind layout throughout |
| Preview content before going live | Functional | `/preview` route + `getPreviewContent` path in the catch-all |
| French language / bilingual support | Language, Compliance | `LanguageSwitcher` + full locale routing (`/fr/...`) already wired |
| Branded templates / brand governance | Compliance | `siteConfig.ts` controls all chrome; component system enforces consistent patterns |
| Omnichannel content delivery / API-first | Distribution | Same content delivered via GraphQL to any consumer; Next.js app is one of many possible frontends |
| Content personalization | Personalization | `OptimizelyActivation` re-fires Optimizely Web on every soft navigation; experiments and targeting run against real page state |
| SEO integration / metadata control | Functional | `generateMetadata` reads `MetaTitle` from CMS per-page; structured `<title>` and description propagate automatically |
| Easily create campaign pages | Functional | Live Visual Builder composition: drag sections/blocks, publish — no developer involvement required |
| AEO — machine-readable, LLM-optimized | AI | Demo the raw GraphQL response alongside the rendered page — same structured content, different consumer |

---

## Minor Addition — Demonstrable with a small addition (< 1 hour each)

| Requirement | Category | What to add |
|---|---|---|
| Google Analytics integration | Analytics | Add `<Script>` tag in `app/layout.tsx` |
| Google Tag Manager integration | Analytics | Add GTM snippet in `app/layout.tsx` |
| Automatic sitemap XML | Functional | Add `app/sitemap.ts` using App Router convention; calls Graph to enumerate published pages |
| Indigenous language support | Language | Add a locale entry to `lib/locales.ts` — switcher and routing pick it up automatically |
| WCAG 2.0 Level AA accessibility | Compliance | Run axe-core or Lighthouse against the running app; point at semantic markup in rendered output |

---

## CMS Editor — Live demo in the Optimizely editor

Best shown by switching to the Optimizely CMS edit interface during the demo.

| Requirement | Category | Where to show it |
|---|---|---|
| AI content creation, summarization, tagging | AI | Opal AI in the CMS content editor |
| WYSIWYG editor / code-switch | Functional | Visual Builder + rich-text property editor |
| Approval workflows (second set of eyes) | Compliance | Publish pipeline with reviewer gate |
| Versioning / audit trail | Compliance | Content history panel |
| Content publishing scheduling | Functional | Schedule publish at specific date/time/timezone |
| Digital asset management — search and metadata | Functional | Asset library with AI tagging and metadata search |
| Image editor — resize, crop, optimize | Functional | DAM built-in image editor |
| Batch content publishing | Functional | Publish a content tree in one action |
| Multi-site management | Functional | Single CMS instance, multiple configured hosts |
| User access management / custom roles | Security | RBAC in admin panel |
| Single sign-on (SSO) | Security | Platform authentication settings |
| Multi-factor authentication | Security | Platform authentication settings |
| Gated content with lead-gen capture | Security | Forms + access rules in CMS |
| Adaptability — evolving workflows over time | Adaptability | Show content model editor, workflow config, new block registration |

---

## Architecture / Argument — Best addressed with diagrams or platform documentation

| Requirement | Category | Rationale |
|---|---|---|
| Performance monitoring / alerting | Performance | Infrastructure concern; platform SLA argument |
| CDN | Performance, Security | Optimizely SaaS + edge delivery; argue rather than demo |
| CRM / email / workflow tool integrations | Integration | API connections; show architecture diagram |
| Dev / stage / prod environments | Functional | Show three Graph environment configs; not a UI demo |
| Real-time multi-user collaborative editing | Functional | Partial CMS feature; limited vs. Google Docs — call out honestly |
| User attestation reporting | Security | Back-end admin report, not directly impressive as a demo moment |
| Support & Training (3 rows) | Support & Training | Commercial commitments, not technical demonstrations |

---

## Summary

| | Count | Status |
|---|---|---|
| Live App | 12 | Ready now |
| Minor Addition | 5 | < 1 hour each |
| CMS Editor | 14 | Show in editor |
| Architecture / Argument | 8 | Docs / diagrams |
| **Total requirements** | **39** | |
