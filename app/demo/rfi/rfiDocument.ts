// Generated from the ehealth_rfi.html canvas (Original RFI document section).
// Wording is verbatim from eHealth's questionnaire; edit with care.

export type RfiBlock =
  | { t: 'h3'; text: string }
  | { t: 'p'; html: string }
  | { t: 'ul' | 'ol' | 'check'; items: string[] }
  | { t: 'table'; head: string[]; rows: string[][] };

export type RfiSection = { id: string; title: string; blocks: RfiBlock[] };

export const RFI_TITLE = "Request for Information (RFI) — CMS / Digital Experience Platform";

export const RFI_SECTIONS: RfiSection[] = [
  {
    id: "sec-1-introduction-and-purpose",
    title: "1. Introduction and Purpose",
    blocks: [
      { t: 'p', html: "eHealth is evaluating content management / digital experience platforms to replace its current WordPress-based publishing stack. We are seeking information from qualified vendors to understand how your platform meets our functional, technical, security, and commercial requirements." },
      { t: 'p', html: "This RFI is for information-gathering only. It does not constitute a commitment to purchase, an offer, or a contract, and eHealth is not obligated to select any respondent. Information submitted may be used to shortlist vendors for a subsequent proof of concept (POC) and/or Request for Proposal (RFP)." },
      { t: 'h3', text: "Business Context" },
      { t: 'ul', items: [
        "Fragmented CMS systems and templates slow down publishing and experimentation.",
        "SEO and content teams depend heavily on engineering for updates and testing.",
        "The current platform lacks self-service capabilities, forcing business and marketing teams to rely on engineering for routine content changes, page updates, and experiments.",
        "The future platform must empower business and marketing teams with self-service authoring, publishing, and experiment management that does not require coding or engineering involvement.",
        "The platform must serve content to <strong>multiple frontend applications</strong>, organized by logical grouping (e.g., product line, paid-media traffic, organic traffic), not by domain.",
        "A/B testing will run on our <strong>existing Adobe Target</strong>; business/marketing teams require <strong>self-service</strong> experiment and content control without engineering.",
        "Static assets must be publishable to our <strong>Akamai CDN</strong>.",
        "SEO parity with our current <strong>Yoast SEO</strong> workflow is a priority.",
      ] },
    ],
  },
  {
    id: "sec-2-instructions-to-respondents",
    title: "2. Instructions to Respondents",
    blocks: [
      { t: 'ol', items: [
        "Complete <strong>Section 4 (Vendor Profile)</strong> and all applicable questions in <strong>Sections 5–18</strong>.",
        "For each requirement, provide a <strong>Response Code</strong> and a <strong>Comment</strong>. Where a capability depends on a specific edition, plan, or add-on, state this explicitly and reference the applicable license tier.",
        "For headless/API-delivered capabilities, indicate whether the capability is <strong>native to the CMS</strong> or must be <strong>implemented in the consuming frontend</strong>.",
        "Attach supporting documentation, architecture diagrams, and public documentation links where helpful.",
        "Submit responses inline in this document by <strong>[11/11/2026]</strong> to <a href=\"mailto:tri.ngo@ehealth.com\"><strong>tri.ngo@ehealth.com</strong></a>.",
      ] },
      { t: 'h3', text: "Response Code Legend" },
      { t: 'table', head: ["Code", "Meaning"], rows: [
        ["F", "Fully supported, native/out of the box"],
        ["C", "Supported with configuration (no custom code)"],
        ["X", "Supported via extension, plugin, or add-on (note cost/licensing)"],
        ["I", "Requires custom integration/engineering (describe effort)"],
        ["R", "On roadmap (provide target date)"],
        ["N", "Not supported"],
      ] },
      { t: 'p', html: "Use the <strong>Comment</strong> column to provide details, implementation effort, and any caveats." },
    ],
  },
  {
    id: "sec-3-response-format-example",
    title: "3. Response Format Example",
    blocks: [
      { t: 'table', head: ["#", "Requirement", "Response Code", "Native or Frontend", "Edition/Plan", "Comment"], rows: [
        ["x.x", "Example requirement", "F / C / X / I / R / N", "Native / Frontend", "e.g., Enterprise", "Notes, links, caveats"],
      ] },
    ],
  },
  {
    id: "sec-4-vendor-profile",
    title: "4. Vendor Profile",
    blocks: [
      { t: 'table', head: ["#", "Question", "Response"], rows: [
        ["4.1", "Company name, headquarters, and year founded."],
        ["4.2", "Product name(s) and current version/release cadence."],
        ["4.3", "Deployment models offered (SaaS, PaaS, self-hosted, hybrid)."],
        ["4.4", "Open-source vs. proprietary; license model."],
        ["4.5", "Number of enterprise customers and reference customers at comparable scale."],
        ["4.6", "Primary technology stack (backend language, database, admin UI framework)."],
        ["4.7", "Financial stability / ownership (public, private, PE/VC-backed)."],
        ["4.8", "Product roadmap transparency and release frequency."],
        ["4.9", "Implementation partner ecosystem relevant to our region/stack."],
      ] },
    ],
  },
  {
    id: "sec-5-architecture-and-multi-app-content-delivery",
    title: "5. Architecture and Multi-App Content Delivery",
    blocks: [
      { t: 'p', html: "Our requirement: one CMS instance delivering content to multiple independent frontend applications, with content organized by logical grouping (product line, paid-media, organic)." },
      { t: 'table', head: ["#", "Requirement", "Code", "Native/Frontend", "Comment"], rows: [
        ["5.1", "A single CMS instance can serve content to multiple independent frontend apps."],
        ["5.2", "First-class grouping construct (workspace, channel, space, folder, label, taxonomy) to organize content by logical grouping."],
        ["5.3", "A page/entry can belong to one or many groups; groups can nest."],
        ["5.4", "Per-app content scoping: an app can query/fetch only its group's content via API."],
        ["5.5", "Shared/reusable content and components across apps and groups (reference once, use many)."],
        ["5.6", "Per-group/per-app configuration (navigation, SEO defaults, locale, theme tokens)."],
        ["5.7", "Per-group permissions and ownership isolating teams."],
        ["5.8", "Group-level publishing, scheduling, and preview targeting a specific app."],
        ["5.9", "Per-app preview URLs / draft-mode integration."],
        ["5.10", "Reporting/filtering of content by group (e.g., \"all organic-traffic pages\")."],
        ["5.11", "Ability to add new apps/groups without re-architecting the content model."],
        ["5.12", "Describe your headless delivery model (headless-first, hybrid, traditional)."],
      ] },
    ],
  },
  {
    id: "sec-6-seo-and-aeo-capabilities-yoast-seo-parity-answer-engine-op",
    title: "6. SEO and AEO Capabilities (Yoast SEO Parity + Answer Engine Optimization)",
    blocks: [
      { t: 'p', html: "Benchmark against the Yoast SEO plugin we use today. For headless delivery, indicate whether the CMS supplies the data model and whether rendering is a frontend responsibility. AEO (Answer Engine Optimization) evaluates how well content can be surfaced and cited by AI chatbots and answer engines (ChatGPT, Perplexity, Google AI Overviews, Copilot, etc.) in response to user questions." },
      { t: 'h3', text: "6a. On-Page Metadata and Editorial SEO" },
      { t: 'table', head: ["#", "Requirement", "Code", "Native/Frontend", "Comment"], rows: [
        ["6.1", "Per-page SEO title and meta description fields with length guidance."],
        ["6.2", "Templated/variable-driven titles and descriptions with site-wide defaults and per-type overrides."],
        ["6.3", "Google/SERP snippet preview (desktop and mobile)."],
        ["6.4", "Social preview and Open Graph / Twitter (X) Card fields with overrides and fallbacks."],
        ["6.5", "Focus keyphrase / related keyphrase fields."],
        ["6.6", "Real-time SEO analysis (keyphrase placement, density, length)."],
        ["6.7", "Readability analysis (sentence length, passive voice, transitions, Flesch score)."],
        ["6.8", "Cornerstone / pillar content designation."],
        ["6.9", "Bulk editor for titles and meta descriptions."],
      ] },
      { t: 'h3', text: "6b. Crawl and Indexation Control" },
      { t: 'table', head: ["#", "Requirement", "Code", "Native/Frontend", "Comment"], rows: [
        ["6.10", "Per-page robots meta control (index/noindex, follow/nofollow, max-snippet, etc.)."],
        ["6.11", "Canonical URL management with automatic default and manual override."],
        ["6.12", "robots.txt management/editing."],
        ["6.13", "XML sitemap generation with automatic updates."],
        ["6.14", "Specialized sitemaps (image, video, news, sitemap index)."],
        ["6.15", "Pagination SEO handling."],
      ] },
      { t: 'h3', text: "6c. Structured Data, URLs, and Links" },
      { t: 'table', head: ["#", "Requirement", "Code", "Native/Frontend", "Comment"], rows: [
        ["6.16", "Schema.org structured data (Organization, WebSite, WebPage, BreadcrumbList, Article/Product/FAQ/HowTo)."],
        ["6.17", "Product/e-commerce schema (Product, Offer, AggregateRating, Review)."],
        ["6.18", "Configurable/extensible schema graph per content type."],
        ["6.19", "Breadcrumb generation and breadcrumb schema."],
        ["6.20", "Editable slugs/permalinks with configurable URL patterns per content type."],
        ["6.21", "Redirect manager (301/302/307/410) with UI and automatic redirect on slug change."],
        ["6.22", "Bulk redirect import/export."],
        ["6.23", "404 monitoring and reporting."],
        ["6.24", "Internal linking suggestions and orphaned-content detection."],
      ] },
      { t: 'h3', text: "6d. International, Performance, and Governance SEO" },
      { t: 'table', head: ["#", "Requirement", "Code", "Native/Frontend", "Comment"], rows: [
        ["6.25", "hreflang / alternate-language annotations across localized variants."],
        ["6.26", "Locale-specific canonical and metadata signals."],
        ["6.27", "Core Web Vitals readiness (image optimization, lazy loading, responsive images, CDN)."],
        ["6.28", "Clean, crawlable markup when rendered headless (SSR/SSG for indexable pages)."],
        ["6.29", "Integration hooks for Google Search Console, Bing Webmaster, analytics."],
        ["6.30", "SEO fields enforceable/required via validation; role-based control of canonical/robots/redirects."],
      ] },
      { t: 'h3', text: "6e. Answer Engine Optimization (AEO) — AI Chatbot Surfacing and Citation" },
      { t: 'table', head: ["#", "Requirement", "Code", "Native/Frontend", "Comment"], rows: [
        ["6.31", "llms.txt / AI-crawler guidance file generation or management to direct AI answer engines to key content."],
        ["6.32", "Granular control over AI/LLM crawler access (allow/deny GPTBot, PerplexityBot, Google-Extended, ClaudeBot, etc.)."],
        ["6.33", "Question-and-answer-oriented structured data (FAQ, QAPage, HowTo) to improve extractability and citation."],
        ["6.34", "Stable, canonical, citable URLs and anchor/fragment links so answer engines can cite specific passages."],
        ["6.35", "Clean semantic HTML / server-rendered content so AI crawlers parse answers without executing JavaScript."],
        ["6.36", "Content modeling supporting concise, self-contained answer blocks/snippets reusable across channels."],
        ["6.37", "Author, publication date, and E-E-A-T signals (authorship, sourcing, freshness) in model and markup."],
        ["6.38", "Entity/topic tagging and relationships to strengthen semantic understanding by answer engines."],
        ["6.39", "Ability to track or report referrals/citations from AI answer engines (directly or via analytics)."],
      ] },
    ],
  },
  {
    id: "sec-7-content-velocity-and-authoring-productivity",
    title: "7. Content Velocity and Authoring Productivity",
    blocks: [
      { t: 'table', head: ["#", "Requirement", "Code", "Native/Frontend", "Comment"], rows: [
        ["7.1", "Reusable content blocks/components and references across pages and apps."],
        ["7.2", "Draft/publish states with scheduled publish and unpublish/expiry."],
        ["7.3", "Bulk operations (publish, tag, move, delete, find-and-replace)."],
        ["7.4", "Content duplication/cloning and templates for new entries."],
        ["7.5", "Media library: upload, tagging, cropping/focal point, alt-text enforcement, DAM integration."],
        ["7.6", "Rich text/WYSIWYG with configurable allowed formatting and embeds."],
        ["7.7", "Inline/real-time collaboration and concurrent-edit locking."],
        ["7.8", "Autosave and recovery."],
        ["7.9", "Reusable page/layout templates and structured content modeling."],
        ["7.10", "Live/visual preview of content before publish."],
      ] },
    ],
  },
  {
    id: "sec-8-experimentation-adobe-target-and-self-service-content",
    title: "8. Experimentation (Adobe Target) and Self-Service Content",
    blocks: [
      { t: 'p', html: "A/B testing runs on our existing Adobe Target. The CMS must integrate and give marketing self-service control without engineering." },
      { t: 'table', head: ["#", "Requirement", "Code", "Native/Frontend", "Comment"], rows: [
        ["8.1", "Integration with Adobe Target (at.js or server-side delivery, Analytics for Target)."],
        ["8.2", "Experiment variant content authored/managed in the CMS and exposed to Adobe Target."],
        ["8.3", "Self-service: business/marketing can edit content within a specific experiment variant without code."],
        ["8.4", "Business can start, stop, pause, and schedule experiments from reusable templates without engineering."],
        ["8.5", "No-code variant creation from existing page/component templates."],
        ["8.6", "Experiment-aware content versioning (isolated, tracked, previewable, revertible)."],
        ["8.7", "Preview of each variant/experience before launch."],
        ["8.8", "Minimizes flicker and preserves SEO (server-side/edge delivery option)."],
        ["8.9", "Audience targeting/segmentation driven from Adobe Target without duplicating logic."],
        ["8.10", "Governance guardrails keeping self-service within approved templates/scopes."],
        ["8.11", "Results/reporting surfaced through Adobe Target / Adobe Analytics."],
      ] },
    ],
  },
  {
    id: "sec-9-ai-readiness-and-extensibility",
    title: "9. AI Readiness and Extensibility",
    blocks: [
      { t: 'table', head: ["#", "Requirement", "Code", "Native/Frontend", "Comment"], rows: [
        ["9.1", "Built-in generative authoring (drafting, rewriting, summarizing, tone)."],
        ["9.2", "AI-assisted translation."],
        ["9.3", "AI tagging/classification and metadata generation."],
        ["9.4", "AI alt-text and image generation."],
        ["9.5", "Bring-your-own-model / provider selection and swapping."],
        ["9.6", "Prompt/agent customization and extension points."],
        ["9.7", "Data governance, retention, and training-use controls for AI features."],
        ["9.8", "Guardrails, human-in-the-loop review, and audit of AI output."],
        ["9.9", "Plan/entitlement dependency and incremental cost of AI features."],
      ] },
    ],
  },
  {
    id: "sec-10-multilingual-and-localization",
    title: "10. Multilingual and Localization",
    blocks: [
      { t: 'table', head: ["#", "Requirement", "Code", "Native/Frontend", "Comment"], rows: [
        ["10.1", "Native locales and localized fields."],
        ["10.2", "Locale fallback configuration."],
        ["10.3", "Translation workflow (status per locale, side-by-side editing)."],
        ["10.4", "Translation-management-system connectors (Smartling, Lokalise, Phrase, etc.)."],
        ["10.5", "Per-locale publishing and scheduling."],
        ["10.6", "Locale-specific URLs and hreflang."],
        ["10.7", "Locale-aware media/asset variants."],
      ] },
    ],
  },
  {
    id: "sec-11-workflow-and-governance",
    title: "11. Workflow and Governance",
    blocks: [
      { t: 'table', head: ["#", "Requirement", "Code", "Native/Frontend", "Comment"], rows: [
        ["11.1", "Multi-step approval workflows with assignable reviewers."],
        ["11.2", "Version history, diff, and rollback."],
        ["11.3", "Content scheduling and embargo."],
        ["11.4", "Environments/branching for staged content changes."],
        ["11.5", "Legal/compliance review gating and content expiry."],
        ["11.6", "Accessibility (WCAG) authoring aids and checks."],
      ] },
    ],
  },
  {
    id: "sec-12-security-and-access-control",
    title: "12. Security and Access Control",
    blocks: [
      { t: 'table', head: ["#", "Requirement", "Code", "Native/Frontend", "Comment"], rows: [
        ["12.1", "Granular RBAC with content-type- and field-level permissions."],
        ["12.2", "Per-group/workspace and per-app access scoping."],
        ["12.3", "Content/asset-level access control."],
        ["12.4", "Single sign-on (SAML/OIDC) and SCIM provisioning/deprovisioning."],
        ["12.5", "Multi-factor authentication (MFA/2FA)."],
        ["12.6", "IP allowlisting / network restrictions for admin and APIs."],
        ["12.7", "API key/token management: scoped tokens, least-privilege, expiry, rotation."],
        ["12.8", "Session management (timeout, concurrent-session limits, revocation)."],
        ["12.9", "Encryption in transit (TLS) and at rest."],
        ["12.10", "Secrets management for integration credentials."],
        ["12.11", "Audit logging of content, admin, and security events with export/SIEM integration."],
        ["12.12", "WAF/DDoS protection and rate limiting."],
        ["12.13", "Backup, disaster recovery, and data retention/deletion controls."],
        ["12.14", "Security certifications (SOC 2, ISO 27001) and penetration-test/attestation availability."],
        ["12.15", "Vulnerability disclosure process, patch cadence, CVE handling."],
        ["12.16", "Data residency and regulatory compliance (GDPR, CCPA, HIPAA if applicable)."],
      ] },
    ],
  },
  {
    id: "sec-13-developer-experience-and-apis",
    title: "13. Developer Experience and APIs",
    blocks: [
      { t: 'table', head: ["#", "Requirement", "Code", "Native/Frontend", "Comment"], rows: [
        ["13.1", "REST and/or GraphQL content delivery APIs."],
        ["13.2", "Preview/draft API for staged content."],
        ["13.3", "Management/authoring API for programmatic writes and migrations."],
        ["13.4", "Webhooks/event subscriptions for publish events."],
        ["13.5", "Incremental/delta content retrieval (sync API or change feed) to build/publish only changed content for faster builds."],
        ["13.6", "SDKs for our frontend stack (React/Next.js, etc.)."],
        ["13.7", "Rate limits, caching, and CDN delivery behavior."],
        ["13.8", "Content modeling flexibility (references, nested/components, validation rules)."],
        ["13.9", "Local development, environment promotion, and config-as-code."],
        ["13.10", "API versioning and backward-compatibility policy."],
      ] },
    ],
  },
  {
    id: "sec-14-search-and-content-discovery",
    title: "14. Search and Content Discovery",
    blocks: [
      { t: 'table', head: ["#", "Requirement", "Code", "Native/Frontend", "Comment"], rows: [
        ["14.1", "Native/built-in content search for delivered site/apps (full-text over published content)."],
        ["14.2", "Integration with dedicated search services (Algolia, Elasticsearch/OpenSearch, Coveo)."],
        ["14.3", "Automatic indexing/reindexing on publish, update, unpublish (incl. delta reindex)."],
        ["14.4", "Faceted search, filtering, and sorting (by product line, tag, group, locale)."],
        ["14.5", "Per-app/per-group scoping so each frontend searches only relevant content."],
        ["14.6", "Relevance tuning, synonyms, typo tolerance, ranking controls."],
        ["14.7", "Autocomplete/typeahead and suggestions."],
        ["14.8", "Multilingual/locale-aware search and analyzers."],
        ["14.9", "Search analytics (queries, zero-result rate, click-through)."],
        ["14.10", "API/webhook support to push content changes to the search index."],
        ["14.11", "Internal (admin) content search and filtering across large content sets."],
      ] },
    ],
  },
  {
    id: "sec-15-rendering-performance-and-hosting",
    title: "15. Rendering, Performance, and Hosting",
    blocks: [
      { t: 'table', head: ["#", "Requirement", "Code", "Native/Frontend", "Comment"], rows: [
        ["15.1", "SSR and SSG support via the chosen frontend framework."],
        ["15.2", "Incremental/on-demand revalidation on content change."],
        ["15.3", "Edge/CDN content delivery and cache invalidation."],
        ["15.4", "Ability to publish static assets (images, JS, CSS, fonts) to Akamai CDN."],
        ["15.5", "Image optimization and responsive delivery."],
        ["15.6", "Hosting model (SaaS vs. self-hosted) and operational burden."],
        ["15.7", "Uptime SLA and scalability under traffic spikes."],
      ] },
    ],
  },
  {
    id: "sec-16-migration-from-wordpress",
    title: "16. Migration from WordPress",
    blocks: [
      { t: 'table', head: ["#", "Requirement", "Code", "Native/Frontend", "Comment"], rows: [
        ["16.1", "WordPress-specific importer vs. custom WXR/REST extraction."],
        ["16.2", "Rich-text/Gutenberg-block to target content-model mapping."],
        ["16.3", "Media and metadata migration (alt text, captions)."],
        ["16.4", "URL structure preservation and redirect generation for SEO continuity."],
        ["16.5", "Taxonomy (categories/tags) and author mapping."],
        ["16.6", "Custom fields/ACF mapping."],
        ["16.7", "Yoast SEO metadata migration (titles, descriptions, canonical, robots, focus keywords)."],
        ["16.8", "Phased/parallel-run migration support and rollback."],
      ] },
    ],
  },
  {
    id: "sec-17-commercial-cost-and-total-cost-of-ownership",
    title: "17. Commercial, Cost, and Total Cost of Ownership",
    blocks: [
      { t: 'table', head: ["#", "Question", "Response"], rows: [
        ["17.1", "License/subscription model and tier thresholds (users, API calls, bandwidth, records)."],
        ["17.2", "Overage and scaling cost behavior."],
        ["17.3", "Add-on costs (experimentation, personalization, AI, premium support)."],
        ["17.4", "Typical implementation and partner-services cost range."],
        ["17.5", "Ongoing engineering and operational cost (hosting, upgrades, maintenance)."],
        ["17.6", "Estimated migration cost from WordPress."],
        ["17.7", "Contract terms, minimum commitment, lock-in, and data-export/exit provisions."],
        ["17.8", "Indicative annual pricing for our scope (state assumptions)."],
      ] },
    ],
  },
  {
    id: "sec-18-vendor-support-and-viability",
    title: "18. Vendor Support and Viability",
    blocks: [
      { t: 'table', head: ["#", "Question", "Response"], rows: [
        ["18.1", "Support tiers, hours, severity definitions, and response-time SLAs."],
        ["18.2", "Escalation path and named/dedicated support options."],
        ["18.3", "Documentation quality and community resources."],
        ["18.4", "Professional services and training offerings."],
        ["18.5", "Three reference customers of comparable scale and use case."],
        ["18.6", "Product roadmap for the next 12–18 months relevant to our requirements."],
      ] },
    ],
  },
  {
    id: "sec-19-submission-checklist",
    title: "19. Submission Checklist",
    blocks: [
      { t: 'check', items: [
        "Vendor Profile (Section 4) complete.",
        "All applicable functional sections (5–16) answered with Response Codes and Comments.",
        "Commercial and TCO information (Section 17) provided with stated assumptions.",
        "Support and viability (Section 18) complete, including references.",
        "Supporting documentation and links attached.",
        "Any edition/plan dependencies and additional costs clearly identified.",
      ] },
      { t: 'p', html: "<em>Submit completed responses to </em><a href=\"mailto:tri.ngo@ehealth.com\"><em>tri.ngo@ehealth.com</em></a><em> by [11/11/2026]. Questions regarding this RFI may be directed to </em><a href=\"mailto:tri.ngo@ehealth.com\"><em>tri.ngo@ehealth.com</em></a><em> by [11/11/2026].</em>" },
    ],
  },
];
