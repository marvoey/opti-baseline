'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/* =====================================================================
   Liberty Mutual RFP follow-up responses: React viewer
   Reads the "LM RFP" content model from Optimizely CMS (SaaS) through
   Optimizely Graph instead of the spreadsheet.
   Modes: Optimizely Graph (single key) · Secure proxy · Sample data
   ===================================================================== */

const GRAPH_DEFAULT = 'https://cg.optimizely.com/content/v2';
const REPO_BLOB = 'https://github.com/marvoey/opti-baseline/blob/libertymutual/';
const STORE_SETTINGS = 'lm_rfp_viewer_settings_v1';
const STORE_DONE = 'lm_rfp_viewer_done_v1';
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_URL || '';

const FORMATS = {
  written: 'Written follow-up',
  visual: 'Visual demonstration follow-up',
  'written-visual': 'Written and visual demonstration follow-up',
};
const TAB_REFS = { 'OP-14 Data Flow': 'flow', 'OP-14 ERD': 'erd', 'OP-16 Sample Query': 'query' };
const CONFIRM_SRC = '\\[CONFIRM[^\\]]*\\]';
const TOKEN_SRC = '(OP-14 Data Flow|OP-14 ERD|OP-16 Sample Query)|(OP-\\d{2})|(' + CONFIRM_SRC + ')|(`[^`]+`)|\\[([^\\]\\n]+)\\]\\(((?:https?:\\/\\/|\\/)[^\\s)]+)\\)';
const countConfirms = (t) => (String(t || '').match(new RegExp(CONFIRM_SRC, 'g')) || []).length;
const confirmTexts = (t) => String(t || '').match(new RegExp(CONFIRM_SRC, 'g')) || [];

/* ---------- GraphQL (the same queries live in the secure proxy) ---------- */
const META = '_metadata { key version status lastModified published }';
const statusWhere = (drafts) =>
  `where: { _metadata: { status: { in: [${(drafts ? ['Published', 'Draft'] : ['Published']).map((s) => `"${s}"`).join(', ')}] } } }`;

function buildMainQuery(drafts) {
  const w = statusWhere(drafts);
  return `query LmRfpFollowUps {
  responseSet: LmRfpResponseSet(locale: en, limit: 10, ${w}) {
    items { ${META} Eyebrow Title Intro SourceWorkbook AsOf FooterNote }
  }
  questions: LmRfpQuestion(locale: en, limit: 100, orderBy: { QuestionId: ASC }, ${w}) {
    total
    items { ${META} QuestionId LmRfpId Topic FollowUpQuestion ResponseFormat VendorResponse SupportingDocumentation }
  }
  flow: LmRfpDataFlowStep(locale: en, limit: 100, orderBy: { Step: ASC }, ${w}) {
    items { ${META} Step WhatHappens WhereItHappens Ownership ExpectedTime Notes }
  }
  erd: LmRfpErdEntity(locale: en, limit: 100, orderBy: { SortOrder: ASC }, ${w}) {
    items { ${META} SortOrder Entity KeyAttributes Relationships RetrievalEffect RelatedEntities }
  }
  sampleQueries: LmRfpSampleQuery(locale: en, limit: 10, ${w}) {
    items { ${META} QuestionId Title GraphqlRequest ExampleResponse Notes }
  }
}`;
}

function buildRefsQuery(drafts) {
  return `query LmRfpDemoReferences {
  refs: LmRfpDemoReference(locale: en, limit: 100, orderBy: { QuestionId: ASC }, ${statusWhere(drafts)}) {
    items { ${META} QuestionId Points Gaps Files }
  }
}`;
}

/* ---------- sample data (shaped exactly like the Graph response) ---------- */
const SAMPLE = {"main": {"responseSet": {"items": [{"_metadata": {"key": "sample-set", "version": "1", "status": "Published", "lastModified": "2026-11-14T14:30:00Z", "published": "2026-11-14T14:30:00Z"}, "Eyebrow": "Liberty Mutual RFP · Optimizely follow-up responses", "Title": "Follow-up questions and responses.", "Intro": "Every topic, follow-up question, response format, vendor response and supporting link, plus the Data Flow, ERD and Sample Query content, managed in Optimizely CMS (SaaS).", "SourceWorkbook": "Sample data (3 of 17 questions), not loaded from the CMS", "AsOf": "2026-11-14T00:00:00Z", "FooterNote": "OP-15 intentionally leaves out the Alloy and Stride starter-template wording."}]}, "questions": {"total": 3, "items": [{"_metadata": {"key": "sample-op-14", "version": "2", "status": "Published", "lastModified": "2026-11-14T14:30:00Z", "published": "2026-11-14T14:30:00Z"}, "QuestionId": "OP-14", "LmRfpId": "Demo", "Topic": "Author edit to Akamai data flow and example ERD", "FollowUpQuestion": "Data Flow Diagram\nCan you send a data flow diagram from an author's edit to a live page behind our Akamai, with each step labeled vendor-managed or customer-built and the expected time at each step?\n\nPlease also send an ERD of an example platform's data model, showing how content types, entries, shared references, assets, versions and workflow states relate in relation to content/asset retrieval.", "ResponseFormat": "written", "VendorResponse": "Data flow diagram: see tab 'OP-14 Data Flow'. It lists each step from an author's edit to a live page behind Akamai, whether the step is vendor-managed or customer-built, and the expected time.\nSummary: steps inside CMS and Graph (save, preview, approval workflow, publish, indexing, Graph cache invalidation, webhook delivery) are vendor-managed. Steps after the webhook (handler, Next.js revalidation, Akamai purge, rendering) are customer-built, using documented patterns and SDKs. Expected end-to-end time is seconds, excluding human approval time.\n\nERD: see tab 'OP-14 ERD'. It shows how applications, content types, property definitions, content items, locale versions (including workflow status), shared references, assets, folders, approvals, access control, taxonomy, the change log and the Graph delivery index relate, and how each affects retrieval.\n\n", "SupportingDocumentation": ["https://docs.optimizely.com/cms-saas/docs/content-types-saas", "https://docs.optimizely.com/cms-saas/docs/approval-sequences", "https://docs.optimizely.com/cms-saas/docs/compare-versions-of-content", "https://docs.optimizely.com/graph/docs/architecture-overview"]}, {"_metadata": {"key": "sample-op-16", "version": "2", "status": "Published", "lastModified": "2026-11-14T14:30:00Z", "published": "2026-11-14T14:30:00Z"}, "QuestionId": "OP-16", "LmRfpId": "Demo", "Topic": "Show GraphQL request, response, calls per page, caching, authentication", "FollowUpQuestion": "What do the API calls look like? \nPlease show us the GraphQL query that the page sends to Optimizely Graph, and the response that it receives.\nHow many API calls does one page need?\nWhich of these calls can the CDN cache?\nWhat changes when the user is authenticated?\nPlease use a representative Liberty Mutual page with shared content, assets, personalization metadata, and authenticated context rather than any generic sample page.", "ResponseFormat": "visual", "VendorResponse": "Sample query and response: see tab 'OP-16 Sample Query'. It shows an agent landing page with a shared disclosure, an image asset and a personalized content variation.\n\nCalls per authenticated, server-rendered agent-portal page:\n1. Graph: page by URL (layout, components, inlined shared blocks, asset URLs, variation). 1 request. Cacheable in the Graph response cache and the Next.js data cache, keyed by URL + locale + variation.\n2. Graph: global navigation, header and footer. 1 request. Cacheable with a long TTL, purged by webhook.\n3. Feature Experimentation decision: 0 network calls. It is decided in-process from a cached datafile; events are sent asynchronously.\n4. ODP segment lookup (only if ODP audiences are used): 1 per session (the SDK caches segments). Per user, so not cached at the CDN.\n5. LM business APIs (e.g., the renewals card): N calls, owned by LM. Per user.\nThe Optimizely content portion is typically 1–2 Graph requests per page, both cacheable.\n\nAkamai caching: public pages are fully cacheable as HTML. Authenticated page HTML is per user, so it is not cached at Akamai (static assets and images still are). Alternatively, cache a shared page shell at Akamai and load per-user cards client-side.\n\nWhat changes when the user is authenticated:\n• Public CMS content: nothing. It uses the public single key and is cached.\n• Agent-only CMS content: Graph honours CMS access rights. The server calls Graph with HMAC plus a role header, or forwards the agent's OIDC token from LM's identity provider (Graph validates issuer, audience and the roles claim). Restricted queries run server-side only.\n• Personalization: the decision uses agent attributes, and the returned variation key becomes part of the cache key.\n", "SupportingDocumentation": ["https://docs.optimizely.com/cms-saas/docs/visual-builder-queries-saas", "https://docs.optimizely.com/cms-saas/docs/retrieve-content-using-optimizely-graph", "https://docs.optimizely.com/graph/docs/generic-oidc-provider", "https://docs.optimizely.com/graph/docs/hmac", "https://github.com/episerver/content-js-sdk/blob/main/docs/guides/authentication.md"]}, {"_metadata": {"key": "sample-op-17", "version": "1", "status": "Published", "lastModified": "2026-11-14T14:30:00Z", "published": "2026-11-14T14:30:00Z"}, "QuestionId": "OP-17", "LmRfpId": "Demo", "Topic": "Where content, business data and personalization come together", "FollowUpQuestion": "Where should content and data come together?\nOur pages will show Optimizely content and data from our own systems on the same screen. For example, an agent page can show Optimizely content next to a card that lists upcoming renewals. The renewal data comes from a different service, not from Optimizely. In your RFP response (IN-04 and IN-07), you said that the CMS does not call external APIs at runtime. You also said that we build the BFF. Would you please defend that pattern, identify alternatives involving ODP or Connect Platform, and clarify where targeting is evaluated for authenticated agent experiences.  Where should the personalization decision occur? If you recommend your platform, which product does this, and is it in your proposal? What do your other enterprise customers do?", "ResponseFormat": "written", "VendorResponse": "Recommendation: compose at the front-end server (the BFF), evaluate personalization there, and keep business data in LM's systems. This is the standard pattern for enterprise headless builds, and the most secure one for an insurer.\n\nWhy this pattern:\n• Security and compliance: agent book and policy data never leaves LM's network or lands in a vendor CMS. The CMS holds editorial content plus the component's configuration (data source, filters, labels, empty-state and error copy).\n• Failure isolation: a slow renewals service degrades one card, not the page, and a CMS issue never blocks transactional data.\n• Caching: content is cacheable and shared; personal data is not. Keeping them separate keeps cache hit rates high (see OP-01).\n• No extra infrastructure: in Next.js, server components and route handlers are the BFF. It ships with the front end rather than as a separate service.\n\nAlternatives using Optimizely:\n• ODP: ingest agent attributes (quote counts, tier, book metrics, loaded in batch from Snowflake via API, CSV or OCP) and portal behavior events, then build real-time audiences for Experimentation and Personalization. Strong for targeting; not a store for per-policy renewal lists.\n• Optimizely Connect Platform (OCP): integration layer for scheduled or event-driven syncs (LM → ODP, LM reference data → Graph). Not a per-request proxy.\n• Graph external content sources: non-personal business data (e.g., product catalog, state coverage rules) can be indexed in Graph, linked from CMS content and fetched in the same query as the content.\n\nWhere targeting is evaluated for authenticated agents: server-side in the front end, with the Feature Experimentation SDK.\n• It decides in-process, with no network call, using agent attributes from LM's session (state, tier, quote counts) plus ODP real-time segments.\n• The decision returns a variation key that selects the matching CMS content variation from Graph.\n• Marketers manage audiences and rules in the UI, with no deployment needed (see OP-22).\n• Client-side alternative: Web Experimentation / Personalization campaigns with ODP audiences. These use a visual editor but run in the browser, so they suit public pages better than an authenticated portal.\n\nIn our proposal? [CONFIRM: The proposal includes CMS (SaaS) with Graph, Mark, Web Experimentation (optional) and CMP. State whether Feature Experimentation, ODP and Personalization will be added as optional line items.]\nOther enterprise customers: [CONFIRM: reference customers using server-side Feature Experimentation with CMS (SaaS)/Graph for authenticated experiences.]", "SupportingDocumentation": ["https://docs.optimizely.com/feature-experimentation/docs/configure-optimizely-cms-saas", "https://docs.optimizely.com/feature-experimentation/docs/real-time-audiences-for-feature-experimentation-for-server-side-sdks", "https://docs.optimizely.com/data-platform/docs/understand-audiences", "https://docs.optimizely.com/optimizely-connect-platform/docs/import-data-to-ocp", "https://docs.optimizely.com/cms-saas/docs/integrate-external-resources"]}]}, "flow": {"items": [{"_metadata": {"key": "sample-flow-1", "version": "1", "status": "Published", "lastModified": "2026-11-14T14:30:00Z", "published": "2026-11-14T14:30:00Z"}, "Step": 1, "WhatHappens": "Author edits content in Visual Builder or the form editor (changes autosave as a draft).", "WhereItHappens": "CMS (SaaS)", "Ownership": "Vendor-managed", "ExpectedTime": "Real time", "Notes": "Draft is never visible to the public Graph key."}, {"_metadata": {"key": "sample-flow-2", "version": "1", "status": "Published", "lastModified": "2026-11-14T14:30:00Z", "published": "2026-11-14T14:30:00Z"}, "Step": 2, "WhatHappens": "Author previews the draft in LM's real front end (preview token appended to the preview URL).", "WhereItHappens": "CMS (SaaS) + LM front end", "Ownership": "Vendor-managed (preview); customer-built (preview route in the app)", "ExpectedTime": "Real time (preview refreshes on save)", "Notes": "Preview token is short-lived (5 minutes)."}, {"_metadata": {"key": "sample-flow-3", "version": "1", "status": "Published", "lastModified": "2026-11-14T14:30:00Z", "published": "2026-11-14T14:30:00Z"}, "Step": 3, "WhatHappens": "Author submits 'Ready for Review'; approvers act in the approval sequence (optional).", "WhereItHappens": "CMS (SaaS)", "Ownership": "Vendor-managed (LM defines steps and reviewers)", "ExpectedTime": "Human time", "Notes": "Decisions recorded in the Change Log."}, {"_metadata": {"key": "sample-flow-4", "version": "1", "status": "Published", "lastModified": "2026-11-14T14:30:00Z", "published": "2026-11-14T14:30:00Z"}, "Step": 4, "WhatHappens": "Publish now, or scheduled publish.", "WhereItHappens": "CMS (SaaS)", "Ownership": "Vendor-managed", "ExpectedTime": "Immediate", "Notes": ""}]}, "erd": {"items": [{"_metadata": {"key": "sample-erd-1", "version": "1", "status": "Published", "lastModified": "2026-11-14T14:30:00Z", "published": "2026-11-14T14:30:00Z"}, "SortOrder": 1, "Entity": "Application (site)", "KeyAttributes": "key, name, hostnames, start page, root, locales, preview settings", "Relationships": "1 Application → many Content items (under its root); shares 'For All Applications' folders", "RetrievalEffect": "Front ends query Graph scoped to their application; hostnames drive URL resolution.", "RelatedEntities": ["Content item", "Folder"]}, {"_metadata": {"key": "sample-erd-2", "version": "1", "status": "Published", "lastModified": "2026-11-14T14:30:00Z", "published": "2026-11-14T14:30:00Z"}, "SortOrder": 2, "Entity": "Content Type", "KeyAttributes": "key, baseType (_page, _experience, _section, _component, _image/_video/_media, _folder), displayName, mayContainTypes, compositionBehaviors", "Relationships": "1 Content Type → many Property Definitions; 1 Content Type → many Content items", "RetrievalEffect": "Becomes a GraphQL type in Graph (e.g., Disclosure { ... }); _folder is not delivered.", "RelatedEntities": ["Property Definition", "Content item"]}, {"_metadata": {"key": "sample-erd-3", "version": "1", "status": "Published", "lastModified": "2026-11-14T14:30:00Z", "published": "2026-11-14T14:30:00Z"}, "SortOrder": 3, "Entity": "Property Definition", "KeyAttributes": "key, type, required (isRequired), validation (pattern, min/max, enum, min/maxItems), localized, group, allowedTypes/restrictedTypes", "Relationships": "Many → 1 Content Type", "RetrievalEffect": "Defines queryable/filterable fields; required rules are enforced at publish.", "RelatedEntities": ["Content Type"]}, {"_metadata": {"key": "sample-erd-4", "version": "1", "status": "Published", "lastModified": "2026-11-14T14:30:00Z", "published": "2026-11-14T14:30:00Z"}, "SortOrder": 4, "Entity": "Content item", "KeyAttributes": "key (GUID), content type, container/parent, owner folder, created by/date", "Relationships": "1 Content item → many Content Versions; belongs to 1 parent (tree)", "RetrievalEffect": "Retrieved by key, type, field values or URL (pages only).", "RelatedEntities": ["Content Type", "Content Version (per locale)", "Application (site)", "Reference", "Folder", "Taxonomy term (categories)", "Change Log entry"]}, {"_metadata": {"key": "sample-erd-5", "version": "1", "status": "Published", "lastModified": "2026-11-14T14:30:00Z", "published": "2026-11-14T14:30:00Z"}, "SortOrder": 5, "Entity": "Content Version (per locale)", "KeyAttributes": "version id, locale, status (Draft, Ready to Publish, In Review, Rejected, Scheduled, Published, Previously Published), property values, composition (experiences/sections), changed by/date, published date, stop-publish (expiry)", "Relationships": "Many → 1 Content item; 1 Version → many References", "RetrievalEffect": "Public Graph key returns only the current Published version (non-expired). Preview token/HMAC can read drafts.", "RelatedEntities": ["Content item", "Reference", "Approval (instance)", "Graph document (delivery index)", "Asset"]}]}, "sampleQueries": {"items": [{"_metadata": {"key": "sample-sq", "version": "2", "status": "Published", "lastModified": "2026-11-14T14:30:00Z", "published": "2026-11-14T14:30:00Z"}, "QuestionId": "OP-16", "Title": "Representative agent-portal page (Agent Home)", "GraphqlRequest": "# Representative agent-portal page (Agent Home) - illustrative; field names reflect a sample LM content model.\n# Request: POST https://cg.optimizely.com/content/v2   (server-side)\n#   Public content:     Authorization: epi-single <SINGLE_KEY>   -> cacheable\n#   Agent-only content: Authorization: Bearer <agent OIDC JWT>  (or HMAC + cg-roles)\n#   Cached template:    ?stored=true  + header  cg-stored-query: template\n\nquery AgentHome($url: String!, $locale: [Locales], $variation: String!) {\n  _Content(\n    where: { _metadata: { url: { default: { eq: $url } } } }\n    locale: $locale\n    variation: { include: SOME, value: [$variation], includeOriginal: true }\n  ) {\n    item {\n      __typename\n      _metadata { key version locale displayName types variation published url { default } }\n      ... on AgentHomeExperience {\n        seoTitle\n        composition {\n          nodes {\n            key nodeType displayTemplateKey\n            ... on CompositionStructureNode {\n              component { ...Comp }\n              nodes { key nodeType\n                ... on CompositionStructureNode { nodes { key nodeType\n                  ... on CompositionStructureNode { nodes { key nodeType\n                    ... on CompositionComponentNode { component { ...Comp } } } } } } }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment Comp on _IComponent {\n  __typename\n  _metadata { key }\n  ... on HeroBlock { heading subheading image { url { default } } cta { text url } }\n  ... on DisclosureBlock { title body { html } stateCodes productLine effectiveDate }   # shared block, inlined\n  ... on RenewalsCard { heading maxItems emptyStateText errorText dataSource }      # config only; data comes from LM API\n}", "ExampleResponse": "{\n  \"data\": {\n    \"_Content\": {\n      \"item\": {\n        \"__typename\": \"AgentHomeExperience\",\n        \"_metadata\": { \"key\": \"8f2c...\", \"version\": \"412\", \"locale\": \"en\", \"displayName\": \"Agent Home\",\n                       \"types\": [\"AgentHomeExperience\",\"_Experience\",\"_Page\",\"_Content\"],\n                       \"variation\": \"CommercialAutoPush\", \"published\": \"2026-11-10T14:02:11Z\",\n                       \"url\": { \"default\": \"/agents/home/\" } },\n        \"seoTitle\": \"Agent Home | Liberty Mutual\",\n        \"composition\": { \"nodes\": [\n          { \"key\": \"s1\", \"nodeType\": \"section\", \"nodes\": [ { \"key\": \"r1\", \"nodeType\": \"row\", \"nodes\": [\n            { \"key\": \"c1\", \"nodeType\": \"column\", \"nodes\": [\n              { \"key\": \"e1\", \"nodeType\": \"component\", \"component\": {\n                  \"__typename\": \"HeroBlock\", \"_metadata\": { \"key\": \"a11b...\" },\n                  \"heading\": \"Grow your commercial auto book\",\n                  \"image\": { \"url\": { \"default\": \"https://<asset-cdn>/hero-commercial-auto.jpg\" } } } },\n              { \"key\": \"e2\", \"nodeType\": \"component\", \"component\": {\n                  \"__typename\": \"RenewalsCard\", \"_metadata\": { \"key\": \"c42d...\" },\n                  \"heading\": \"Upcoming renewals\", \"maxItems\": 5,\n                  \"emptyStateText\": \"No renewals in the next 30 days.\",\n                  \"errorText\": \"Renewals are temporarily unavailable.\", \"dataSource\": \"renewals-v2\" } },\n              { \"key\": \"e3\", \"nodeType\": \"component\", \"component\": {\n                  \"__typename\": \"DisclosureBlock\", \"_metadata\": { \"key\": \"d77e...\" },\n                  \"title\": \"Washington auto coverage disclosure\",\n                  \"body\": { \"html\": \"<p>...</p>\" }, \"stateCodes\": [\"WA\"], \"productLine\": \"Auto\",\n                  \"effectiveDate\": \"2026-07-01\" } }\n            ] } ] } ] }\n        ] }\n      }\n    }\n  }\n}", "Notes": "How the page is assembled (server-side, one Graph request for content):\n1. Feature Experimentation decides the variation in-process (no network call), e.g., 'CommercialAutoPush'.\n2. One Graph request returns layout, components, the inlined shared disclosure, asset URLs and the variation. Cacheable by URL + locale + variation.\n3. The RenewalsCard returns configuration only. The front end calls LM's renewals API with the agent's OAuth token and renders the list, or the CMS-authored empty/error text.\n4. Navigation, header and footer come from a second, long-cached Graph request.\n"}]}}, "refs": {"refs": {"items": [{"_metadata": {"key": "sample-ref-op-16", "version": "1", "status": "Published", "lastModified": "2026-11-14T14:30:00Z", "published": "2026-11-14T14:30:00Z"}, "QuestionId": "OP-16", "Points": ["The SDK is configured with `OPTIMIZELY_GRAPH_SINGLE_KEY` and `OPTIMIZELY_GRAPH_GATEWAY` (the public single key, which returns published content only).", "The four agent dashboards are LM-representative candidates for the “Agent Home” page: `/agent/dana`, `/agent/tyler`, `/agent/marcus` and `/agent/elena` (`AgentDashboardExperience`). The product page already shows the shared disclosure inlined."], "Gaps": ["No authenticated (HMAC/OIDC) Graph calls exist in the build. Agent identity is a demo cookie, not a sign-in, so the authenticated-context part of the ask needs an extra step."], "Files": ["cms/registry.ts", "cms/agent/AgentDashboardExperience.tsx", "lib/agent/getAgent.ts"]}]}}};

/* ---------- data helpers ---------- */
function latestPerKey(items) {
  const byKey = new Map();
  (items || []).forEach((it) => {
    const k = it && it._metadata && it._metadata.key;
    if (!k) return;
    const v = parseInt(it._metadata.version || '0', 10) || 0;
    const cur = byKey.get(k);
    if (!cur || v > cur.__v) byKey.set(k, { ...it, __v: v });
  });
  return [...byKey.values()];
}
const metaOf = (it) => ({
  key: it._metadata.key,
  version: it._metadata.version || '',
  status: it._metadata.status || 'Published',
  lastModified: it._metadata.lastModified || it._metadata.published || null,
});
const list = (v) => (Array.isArray(v) ? v : v ? [v] : []).map((x) => String(x).trim()).filter(Boolean);

function normalize(main, refsData) {
  const d = main || {};
  const set = latestPerKey(d.responseSet && d.responseSet.items)[0] || null;
  const questions = latestPerKey(d.questions && d.questions.items)
    .map((it) => ({
      ...metaOf(it),
      id: String(it.QuestionId || '').trim(),
      rfp: String(it.LmRfpId || ''),
      topic: String(it.Topic || ''),
      question: String(it.FollowUpQuestion || ''),
      formatValue: String(it.ResponseFormat || ''),
      format: FORMATS[it.ResponseFormat] || String(it.ResponseFormat || ''),
      response: String(it.VendorResponse || ''),
      docs: list(it.SupportingDocumentation),
    }))
    .filter((q) => q.id)
    .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
  const flow = latestPerKey(d.flow && d.flow.items)
    .map((it) => ({
      ...metaOf(it),
      step: Number(it.Step) || 0,
      what: String(it.WhatHappens || ''),
      where: String(it.WhereItHappens || ''),
      owner: String(it.Ownership || ''),
      time: String(it.ExpectedTime || ''),
      notes: String(it.Notes || ''),
    }))
    .sort((a, b) => a.step - b.step);
  const erd = latestPerKey(d.erd && d.erd.items)
    .map((it) => ({
      ...metaOf(it),
      order: Number(it.SortOrder) || 0,
      entity: String(it.Entity || ''),
      attrs: String(it.KeyAttributes || ''),
      rels: String(it.Relationships || ''),
      effect: String(it.RetrievalEffect || ''),
      related: list(it.RelatedEntities),
    }))
    .sort((a, b) => a.order - b.order);
  const sqs = latestPerKey(d.sampleQueries && d.sampleQueries.items);
  const sqRaw = sqs.find((x) => String(x.QuestionId || '').trim() === 'OP-16') || sqs[0] || null;
  const sq = sqRaw
    ? {
        ...metaOf(sqRaw),
        id: String(sqRaw.QuestionId || ''),
        title: String(sqRaw.Title || ''),
        request: String(sqRaw.GraphqlRequest || ''),
        response: String(sqRaw.ExampleResponse || ''),
        notes: String(sqRaw.Notes || ''),
      }
    : null;
  const refs = {};
  latestPerKey(refsData && refsData.refs && refsData.refs.items).forEach((it) => {
    const id = String(it.QuestionId || '').trim();
    if (id) refs[id] = { points: list(it.Points), gaps: list(it.Gaps), files: list(it.Files) };
  });
  return {
    set: set
      ? {
          ...metaOf(set),
          eyebrow: set.Eyebrow || '',
          title: set.Title || '',
          intro: set.Intro || '',
          source: set.SourceWorkbook || '',
          asOf: set.AsOf || null,
          footer: set.FooterNote || '',
        }
      : null,
    questions,
    flow,
    erd,
    sq,
    refs,
  };
}

function ownerOf(v) {
  const s = String(v || '');
  if (!s.trim() || s.trim() === '\u2014') return 'none';
  const vend = /vendor-managed/i.test(s);
  const cust = /customer-built/i.test(s);
  if (vend && cust) return 'shared';
  if (cust) return 'customer';
  if (vend) return 'vendor';
  return 'none';
}

const fmtDate = (v, withTime = true) => {
  if (!v) return '';
  const d = new Date(v);
  if (isNaN(d)) return '';
  return d.toLocaleString(undefined, withTime
    ? { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }
    : { month: 'short', day: 'numeric', year: 'numeric' });
};

function readJSON(key, fallback) {
  try {
    const v = window.localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch (e) {
    return fallback;
  }
}
function writeJSON(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    /* storage unavailable */
  }
}

// const DEFAULT_SETTINGS = { mode: 'sample', endpoint: GRAPH_DEFAULT, singleKey: '', proxyUrl: '', proxyToken: '', drafts: false, remember: false };

const DEFAULT_SETTINGS = {
  mode: 'proxy',
  endpoint: GRAPH_DEFAULT,
  singleKey: '',
  proxyUrl: `${BASE_PATH.replace(/\/$/, '')}/api/rfp-followups`,
  proxyToken: process.env.NEXT_PUBLIC_RFP_VIEWER_TOKEN,
  drafts: false,
  remember: false,
};

function hintFor(msg) {
  const m = String(msg || '');
  if (/Cannot query field "LmRfp/i.test(m)) return 'The LM RFP content types are not in this Graph yet. Create them first (plan steps 4 and 5), then publish at least one item.';
  if (/401|403|unauthori|forbidden|invalid.*key/i.test(m)) return 'Check the key or proxy token. A single key only reads published content that Everyone can read.';
  if (/Failed to fetch|NetworkError|Load failed|TypeError/i.test(m)) return 'The request was blocked before it reached the server (network, CORS or the canvas sandbox). Check the proxy\u2019s allowed origin, or run this app locally.';
  return '';
}

/* ---------- CSS that Tailwind classes cannot express ---------- */
const CSS = `
.lmv details > summary { list-style: none; cursor: pointer; }
.lmv details > summary::-webkit-details-marker { display: none; }
.lmv details[open] > summary .chev { transform: rotate(90deg); }
.lmv .chev { transition: transform .15s ease; }
.lmv pre.code { font-family: "Roboto Mono", ui-monospace, monospace; font-size: 12.5px; line-height: 1.55; background: #1A1446; color: #FFFFFF; border-radius: 12px; padding: 16px; overflow: auto; white-space: pre; margin: 8px 0; }
.lmv pre.code .cm { color: #C0BFC0; }
.lmv .confirm { background: #FFEAA9; color: #1A1446; border-left: 3px solid #FFD000; padding: 1px 6px; border-radius: 4px; font-weight: 500; }
.lmv .confirm.done { background: #E6E6E6; border-left-color: #C0BFC0; color: #707070; text-decoration: line-through; }
.lmv code.ic { font-family: "Roboto Mono", ui-monospace, monospace; font-size: .85em; background: #F5F5F5; border: 1px solid #E6E6E6; border-radius: 4px; padding: 0 4px; color: #1A1446; }
.lmv .xref { font: inherit; background: none; border: 0; padding: 0; color: #06748C; font-weight: 500; text-decoration: underline; text-underline-offset: 2px; cursor: pointer; }
.lmv .xref:hover { color: #1A1446; }
.lmv .card-hl { box-shadow: 0 0 0 3px #78E1E1; }
@media print {
  .lmv .no-print { display: none !important; }
  .lmv pre.code { white-space: pre-wrap; background: #fff; color: #000; border: 1px solid #ccc; }
}
`;

const Chev = () => (
  <svg className="chev w-4 h-4 text-[#06748C] shrink-0" width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M7 5l6 5-6 5V5z" />
  </svg>
);

/* =====================================================================
   App
   ===================================================================== */
export default function App() {
  // Opens in the secure proxy. A mode saved earlier is honoured only when "Remember on this device" was ticked.
  const [settings, setSettings] = useState(() => {
    const stored = readJSON(STORE_SETTINGS, {});
    return { ...DEFAULT_SETTINGS, ...stored, ...(stored.remember ? {} : { mode: DEFAULT_SETTINGS.mode }) };
  });
  const [draft, setDraft] = useState(settings);
  const [data, setData] = useState(() => normalize(SAMPLE.main, SAMPLE.refs));
  const [source, setSource] = useState({ mode: 'sample', loadedAt: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConn, setShowConn] = useState(false);

  const [tab, setTab] = useState('questions');
  const [q, setQ] = useState('');
  const [fmts, setFmts] = useState(() => new Set());
  const [status, setStatus] = useState('all');
  const [since, setSince] = useState('');
  const [sort, setSort] = useState('id');
  const [showRefs, setShowRefs] = useState(true);
  const [done, setDone] = useState(() => new Set(readJSON(STORE_DONE, [])));
  const [toast, setToast] = useState('');
  const [hl, setHl] = useState('');
  const [activeNav, setActiveNav] = useState('');
  const [flowFilter, setFlowFilter] = useState('all');
  const [flowView, setFlowView] = useState('steps');
  const [erdView, setErdView] = useState('cards');
  const [erdSel, setErdSel] = useState(null);
  const cardsRef = useRef(null);

  /* fonts */
  useEffect(() => {
    try {
      if (document.getElementById('lmv-fonts')) return;
      const l = document.createElement('link');
      l.id = 'lmv-fonts';
      l.rel = 'stylesheet';
      l.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Roboto+Mono:wght@400;500&display=swap';
      document.head.appendChild(l);
    } catch (e) {
      /* ignore */
    }
  }, []);

  const flash = useCallback((msg) => {
    setToast(msg || 'Copied');
    setTimeout(() => setToast(''), 1400);
  }, []);

  const copyText = useCallback(
    (t) => {
      const fallback = () => {
        try {
          const ta = document.createElement('textarea');
          ta.value = t;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          ta.remove();
          flash('Copied');
        } catch (e) {
          flash('Copy failed');
        }
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(() => flash('Copied'), fallback);
      else fallback();
    },
    [flash]
  );

  /* ---------- loading ---------- */
  const callGraph = useCallback(async (cfg, op) => {
    let res;
    if (cfg.mode === 'graph') {
      res = await fetch(cfg.endpoint || GRAPH_DEFAULT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `epi-single ${String(cfg.singleKey || '').trim()}` },
        body: JSON.stringify({ query: op === 'main' ? buildMainQuery(false) : buildRefsQuery(false) }),
      });
    } else {
      const headers = { 'Content-Type': 'application/json' };
      if (cfg.proxyToken) headers.Authorization = `Bearer ${String(cfg.proxyToken).trim()}`;
      res = await fetch(cfg.proxyUrl, { method: 'POST', headers, body: JSON.stringify({ op, drafts: !!cfg.drafts }) });
    }
    const text = await res.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch (e) {
      throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
    }
    if (json && Array.isArray(json.errors) && json.errors.length) throw new Error(json.errors.map((e) => e.message).join(' \u00b7 '));
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${(json && (json.error || json.message)) || text.slice(0, 200)}`);
    return json.data || {};
  }, []);

  const load = useCallback(
    async (cfg) => {
      setError('');
      if (cfg.mode === 'sample') {
        setData(normalize(SAMPLE.main, SAMPLE.refs));
        setSource({ mode: 'sample', loadedAt: null });
        return;
      }
      if (cfg.mode === 'graph' && !String(cfg.singleKey || '').trim()) {
        setError('Enter the single key first.');
        setShowConn(true);
        return;
      }
      if (cfg.mode === 'proxy' && !String(cfg.proxyUrl || '').trim()) {
        setError('Enter the proxy URL first.');
        setShowConn(true);
        return;
      }
      setLoading(true);
      try {
        const [main, refs] = await Promise.all([callGraph(cfg, 'main'), callGraph(cfg, 'refs').catch(() => null)]);
        const n = normalize(main, refs);
        setData(n);
        setSource({ mode: cfg.mode, loadedAt: new Date().toISOString(), drafts: cfg.mode === 'proxy' && !!cfg.drafts });
        if (!n.questions.length) {
          setError(
            cfg.mode === 'graph'
              ? 'Connected, but Graph returned no published follow-up questions. If the LM RFP folder is restricted (recommended), the single key cannot read it: use the secure proxy.'
              : 'Connected, but no follow-up questions came back. Check that the items are published (or tick "Include drafts").'
          );
        }
      } catch (e) {
        setError(e.message || String(e));
        setShowConn(true);
      } finally {
        setLoading(false);
      }
    },
    [callGraph]
  );

  useEffect(() => {
    // Load automatically from the secure proxy; other modes only when remembered.
    if (settings.mode === 'proxy' || (settings.mode !== 'sample' && settings.remember)) load(settings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applySettings = () => {
    const next = { ...draft };
    setSettings(next);
    if (next.remember) writeJSON(STORE_SETTINGS, next);
    else writeJSON(STORE_SETTINGS, { mode: next.mode, endpoint: next.endpoint, proxyUrl: next.proxyUrl, drafts: next.drafts, remember: false });
    load(next);
  };

  /* ---------- derived ---------- */
  const QS = data.questions;
  const QIDS = useMemo(() => new Set(QS.map((x) => x.id)), [QS]);

  const CONFIRMS = useMemo(() => {
    const out = [];
    QS.forEach((x) => confirmTexts(x.response).forEach((t, i) => out.push({ id: `${x.id}|${i}`, label: `${x.id} \u00b7 ${x.topic.trim()}`, text: t, go: { type: 'q', id: x.id } })));
    data.flow.forEach((r) =>
      confirmTexts([r.what, r.time, r.notes].join(' ')).forEach((t, i) =>
        out.push({ id: `FLOW-${r.step}|${i}`, label: `OP-14 Data Flow \u00b7 Step ${r.step}`, text: t, go: { type: 'tab', id: 'flow' } })
      )
    );
    if (data.sq) confirmTexts(data.sq.notes).forEach((t, i) => out.push({ id: `SQ|${i}`, label: 'OP-16 Sample Query \u00b7 Notes', text: t, go: { type: 'tab', id: 'query' } }));
    return out;
  }, [QS, data.flow, data.sq]);

  const refBy = useCallback(
    (tabName) => QS.filter((x) => (x.question + '\n' + x.response).includes(tabName)).map((x) => x.id),
    [QS]
  );

  const sinceTs = since ? new Date(since + 'T00:00:00').getTime() : null;
  const matches = useCallback(
    (x) => {
      const hay = [x.id, x.rfp, x.topic, x.question, x.format, x.response, x.docs.join(' ')].join(' ').toLowerCase();
      const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
      if (words.length && !words.every((w) => hay.includes(w))) return false;
      if (fmts.size && !fmts.has(x.format.trim())) return false;
      if (status === 'confirm' && !countConfirms(x.response)) return false;
      if (status === 'awaiting' && x.response.trim()) return false;
      if (status === 'demo' && !/Demo/i.test(x.rfp)) return false;
      if (status === 'rfp' && (/Demo/i.test(x.rfp) || !x.rfp.trim())) return false;
      if (status === 'draft' && x.status !== 'Draft') return false;
      if (sinceTs && (!x.lastModified || new Date(x.lastModified).getTime() < sinceTs)) return false;
      return true;
    },
    [q, fmts, status, sinceTs]
  );

  const visible = useMemo(() => {
    const l = QS.filter(matches);
    if (sort === 'updated') l.sort((a, b) => new Date(b.lastModified || 0) - new Date(a.lastModified || 0));
    return l;
  }, [QS, matches, sort]);

  /* ---------- navigation ---------- */
  const showTab = useCallback((id) => {
    setTab(id);
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      /* ignore */
    }
  }, []);

  const goTo = useCallback(
    (id) => {
      setTab('questions');
      if (!QS.filter(matches).some((x) => x.id === id)) {
        setQ('');
        setFmts(new Set());
        setStatus('all');
        setSince('');
      }
      setTimeout(() => {
        const el = document.getElementById('card-' + id);
        if (!el) return;
        el.querySelectorAll('details[data-sec="question"], details[data-sec="response"]').forEach((d) => {
          d.open = true;
        });
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setHl(id);
        setTimeout(() => setHl(''), 1800);
      }, 80);
    },
    [QS, matches]
  );

  const ctx = { qids: QIDS, done, goTo, showTab };

  /* active side-nav while scrolling */
  useEffect(() => {
    if (tab !== 'questions' || typeof IntersectionObserver === 'undefined' || !cardsRef.current) return undefined;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.isIntersecting && setActiveNav(en.target.dataset.id)),
      { rootMargin: '-20% 0px -70% 0px' }
    );
    cardsRef.current.querySelectorAll('article[data-id]').forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [tab, visible]);

  const toggleDone = (id, on) => {
    setDone((prev) => {
      const n = new Set(prev);
      if (on) n.add(id);
      else n.delete(id);
      writeJSON(STORE_DONE, [...n]);
      return n;
    });
  };

  const setAllDetails = (open) => {
    if (!cardsRef.current) return;
    cardsRef.current.querySelectorAll('details').forEach((d) => {
      if (!open) d.open = false;
      else if (d.dataset.sec !== 'ref' || showRefs) d.open = true;
    });
  };

  /* =====================================================================
     Text rendering (keeps every word; adds structure, links, highlights)
     ===================================================================== */
  function inline(text, srcKey, counter) {
    const s = String(text == null ? '' : text);
    const re = new RegExp(TOKEN_SRC, 'g');
    const out = [];
    let last = 0;
    let m;
    let k = 0;
    while ((m = re.exec(s))) {
      if (m.index > last) out.push(s.slice(last, m.index));
      const [tok, tabName, op, cf, code, mdText, mdUrl] = m;
      if (tabName) {
        out.push(
          <button type="button" key={`t${k++}`} className="xref" onClick={() => showTab(TAB_REFS[tabName])}>
            {tabName}
          </button>
        );
      } else if (op) {
        out.push(
          ctx.qids.has(op) && op !== srcKey ? (
            <button type="button" key={`o${k++}`} className="xref" onClick={() => goTo(op)}>
              {op}
            </button>
          ) : (
            op
          )
        );
      } else if (cf) {
        const idx = counter ? counter.n++ : 0;
        const id = srcKey ? `${srcKey}|${idx}` : '';
        out.push(
          <span key={`c${k++}`} className={`confirm${id && done.has(id) ? ' done' : ''}`}>
            {cf}
          </span>
        );
      } else if (code) {
        out.push(
          <code key={`k${k++}`} className="ic">
            {code.slice(1, -1)}
          </code>
        );
      } else if (mdUrl) {
        out.push(
          <a
            key={`l${k++}`}
            className="text-[#06748C] font-medium underline underline-offset-2 hover:text-[#1A1446]"
            href={mdUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {mdText}
          </a>
        );
      }
      last = m.index + tok.length;
    }
    if (last < s.length) out.push(s.slice(last));
    return out;
  }

  function labelOf(t) {
    const body = t.replace(/^\s*(?:\u2022\s*|\d+\.\s*|[a-z]\.\s*)/, '');
    if (body.startsWith('[')) return null;
    const ci = body.indexOf(':');
    if (ci > 0 && ci <= 48) {
      const pre = body.slice(0, ci);
      if (!/[.?!]/.test(pre) && !/http/i.test(pre) && !pre.includes('`')) return pre + ':';
    }
    return null;
  }

  function lineNodes(body, rawTrim, srcKey, counter) {
    const label = labelOf(rawTrim);
    const at = label ? body.indexOf(label) : -1;
    if (at < 0) return inline(body, srcKey, counter);
    return [
      <React.Fragment key="pre">{inline(body.slice(0, at), srcKey, counter)}</React.Fragment>,
      <strong key="lbl" className="text-[#1A1446] font-medium">
        {inline(label, srcKey, counter)}
      </strong>,
      <React.Fragment key="post">{inline(body.slice(at + label.length), srcKey, counter)}</React.Fragment>,
    ];
  }

  function renderText(text, srcKey) {
    const lines = String(text || '').split('\n');
    const counter = { n: 0 };
    const out = [];
    let code = [];
    let k = 0;
    const flush = () => {
      if (code.length) {
        out.push(
          <pre key={`p${k++}`} className="code">
            {code.join('\n')}
          </pre>
        );
        code = [];
      }
    };
    lines.forEach((raw) => {
      if (/^\{\s/.test(raw) || /^ {4}\S/.test(raw)) {
        code.push(raw);
        return;
      }
      flush();
      const t = raw.trim();
      if (!t) {
        out.push(<div key={`s${k++}`} className="h-2" />);
        return;
      }
      if (/^\s*\u2022/.test(raw)) {
        const body = t.replace(/^\u2022\s*/, '');
        out.push(
          <div key={`b${k++}`} className="flex gap-2 pl-1 my-1">
            <span className="text-[#06748C] font-bold leading-6">{'\u2022'}</span>
            <div className="leading-6">{lineNodes(body, t, srcKey, counter)}</div>
          </div>
        );
      } else if (/^\s*\d+\.\s/.test(raw)) {
        const n = t.match(/^(\d+)\.\s/)[1];
        const body = t.replace(/^\d+\.\s/, '');
        out.push(
          <div key={`n${k++}`} className="flex gap-2.5 my-1.5">
            <span className="shrink-0 mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#1A1446] text-white text-[11px] font-medium">{n}</span>
            <div className="leading-6">
              <span className="sr-only">{n}. </span>
              {lineNodes(body, t, srcKey, counter)}
            </div>
          </div>
        );
      } else if (/^\s+[a-z]\.\s/.test(raw)) {
        out.push(
          <div key={`a${k++}`} className="pl-8 my-1 leading-6">
            {lineNodes(t, t, srcKey, counter)}
          </div>
        );
      } else if (/:$/.test(t) && t.length < 90) {
        out.push(
          <p key={`h${k++}`} className="mt-3 mb-1 font-medium text-[#1A1446] leading-6">
            {inline(t, srcKey, counter)}
          </p>
        );
      } else {
        out.push(
          <p key={`l${k++}`} className="my-1 leading-6">
            {lineNodes(t, t, srcKey, counter)}
          </p>
        );
      }
    });
    flush();
    return out;
  }

  function hlCode(src) {
    return String(src || '')
      .split('\n')
      .map((l, i) => {
        const at = l.indexOf('#');
        const line = at > -1 && !l.slice(0, at).includes('"') ? [l.slice(0, at), <span key="c" className="cm">{l.slice(at)}</span>] : [l];
        return (
          <React.Fragment key={i}>
            {line}
            {'\n'}
          </React.Fragment>
        );
      });
  }

  const fmtBadge = (f) => {
    const k = String(f || '').trim();
    let cls = 'bg-[#C9F3F4] text-[#1A1446]';
    if (/^Visual/.test(k)) cls = 'bg-[#FFEAA9] text-[#1A1446]';
    else if (/Written and visual/.test(k)) cls = 'bg-[#1A1446] text-white';
    return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>{f || '\u2014'}</span>;
  };

  const chip = (on) =>
    `rounded-full border px-3 py-1 text-xs transition ${on ? 'bg-[#1A1446] text-white border-[#1A1446]' : 'bg-white text-[#343741] border-[#C0BFC0] hover:border-[#1A1446]'}`;

  const refByNodes = (tabName) => {
    const ids = refBy(tabName);
    if (!ids.length) return null;
    return (
      <>
        {' '}
        Referenced by{' '}
        {ids.map((id, i) => (
          <React.Fragment key={id}>
            {i > 0 ? (i === ids.length - 1 ? ' and ' : ', ') : ''}
            <button type="button" className="xref" onClick={() => goTo(id)}>
              {id}
            </button>
          </React.Fragment>
        ))}
        .
      </>
    );
  };

  /* =====================================================================
     Sections
     ===================================================================== */
  const demoCount = QS.filter((x) => /Demo/i.test(x.rfp)).length;
  const awaiting = QS.filter((x) => !x.response.trim()).length;
  const drafts = QS.filter((x) => x.status === 'Draft').length;
  const tiles = [
    [QS.length, 'Follow-up questions'],
    [demoCount, 'From the demo'],
    [QS.filter((x) => /visual/i.test(x.format)).length, 'Need a visual demo'],
    [CONFIRMS.length, '[CONFIRM] items'],
    [awaiting, 'Awaiting a response'],
  ];
  const hasRefs = Object.keys(data.refs).length > 0;
  const TABS = [
    ['questions', 'Follow-up questions', QS.length],
    ['flow', 'OP-14 Data Flow', data.flow.length],
    ['erd', 'OP-14 ERD', data.erd.length],
    ['query', 'OP-16 Sample Query', null],
    ['confirm', '[CONFIRM] tracker', CONFIRMS.length],
    ...(hasRefs ? [['build', 'Demo build reference', Object.keys(data.refs).length]] : []),
  ];

  const sourceLabel =
    source.mode === 'sample'
      ? 'Sample data \u00b7 not from the CMS'
      : `${source.mode === 'proxy' ? 'Secure proxy' : 'Optimizely Graph'} \u00b7 ${source.drafts ? 'published + drafts' : 'published'} \u00b7 loaded ${fmtDate(source.loadedAt)}`;

  /* ---------- connection panel ---------- */
  const renderConnection = () => (
    <div className="no-print border-b border-[#E6E6E6] bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-[#1A1446]">Connect to the CMS content</h2>
          <button type="button" className="text-sm text-[#06748C] underline underline-offset-2" onClick={() => setShowConn(false)}>
            Close
          </button>
        </div>
        <div className="mt-3 inline-flex rounded-full border border-[#C0BFC0] bg-white p-0.5 text-sm">
          {[
            ['graph', 'Optimizely Graph (single key)'],
            ['proxy', 'Secure proxy'],
            ['sample', 'Sample data'],
          ].map(([k, l]) => (
            <button key={k} type="button" onClick={() => setDraft({ ...draft, mode: k })} className={`px-4 py-1.5 rounded-full ${draft.mode === k ? 'bg-[#1A1446] text-white' : 'text-[#343741]'}`}>
              {l}
            </button>
          ))}
        </div>
        {draft.mode === 'graph' && (
          <div className="mt-4 grid md:grid-cols-2 gap-3">
            <label className="text-sm">
              <span className="block text-[#707070] mb-1">Graph endpoint</span>
              <input value={draft.endpoint} onChange={(e) => setDraft({ ...draft, endpoint: e.target.value })} className="w-full rounded-xl border border-[#C0BFC0] bg-white px-3 py-2" />
            </label>
            <label className="text-sm">
              <span className="block text-[#707070] mb-1">Single key</span>
              <input type="password" value={draft.singleKey} onChange={(e) => setDraft({ ...draft, singleKey: e.target.value })} placeholder="Paste the Graph single key" className="w-full rounded-xl border border-[#C0BFC0] bg-white px-3 py-2" />
            </label>
            <p className="md:col-span-2 text-xs text-[#707070]">
              The single key reads published content that Everyone can read. If you restricted the LM RFP folder (recommended in the plan), it returns nothing: use the secure proxy instead.
            </p>
          </div>
        )}
        {draft.mode === 'proxy' && (
          <div className="mt-4 grid md:grid-cols-2 gap-3">
            <label className="text-sm">
              <span className="block text-[#707070] mb-1">Proxy URL</span>
              <input value={draft.proxyUrl} onChange={(e) => setDraft({ ...draft, proxyUrl: e.target.value })} placeholder="https://your-app.example.com/api/rfp-followups" className="w-full rounded-xl border border-[#C0BFC0] bg-white px-3 py-2" />
            </label>
            <label className="text-sm">
              <span className="block text-[#707070] mb-1">Viewer token</span>
              <input type="password" value={draft.proxyToken} onChange={(e) => setDraft({ ...draft, proxyToken: e.target.value })} placeholder="RFP_VIEWER_TOKEN" className="w-full rounded-xl border border-[#C0BFC0] bg-white px-3 py-2" />
            </label>
            <label className="inline-flex items-center gap-2 text-sm cursor-pointer select-none">
              <input type="checkbox" className="w-4 h-4 accent-[#06748C]" checked={!!draft.drafts} onChange={(e) => setDraft({ ...draft, drafts: e.target.checked })} />
              Include drafts (see edits before they are published)
            </label>
            <p className="md:col-span-2 text-xs text-[#707070]">The proxy holds the Graph app key and secret on the server and only runs the two LM RFP queries.</p>
          </div>
        )}
        {draft.mode === 'sample' && <p className="mt-4 text-sm text-[#343741]">Built-in sample: 3 of the 17 questions, 4 data flow steps, 5 ERD entities and the sample query. Nothing is loaded from the CMS.</p>}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {draft.mode !== 'sample' && (
            <label className="inline-flex items-center gap-2 text-sm cursor-pointer select-none">
              <input type="checkbox" className="w-4 h-4 accent-[#06748C]" checked={!!draft.remember} onChange={(e) => setDraft({ ...draft, remember: e.target.checked })} />
              Remember on this device and load automatically
            </label>
          )}
          <button type="button" onClick={applySettings} disabled={loading} className="ml-auto rounded-full bg-[#1A1446] text-white text-sm font-medium px-5 py-2 hover:brightness-110 disabled:opacity-50">
            {loading ? 'Loading\u2026' : draft.mode === 'sample' ? 'Show sample data' : 'Load from the CMS'}
          </button>
        </div>
      </div>
    </div>
  );

  /* ---------- question card ---------- */
  const renderCard = (x) => {
    const nConf = countConfirms(x.response);
    const ref = data.refs[x.id];
    return (
      <article key={x.key} id={`card-${x.id}`} data-id={x.id} className={`rounded-2xl border border-[#E6E6E6] bg-white overflow-hidden transition-shadow ${hl === x.id ? 'card-hl' : ''}`}>
        <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-[#E6E6E6]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-md bg-[#FFD000] text-[#1A1446] text-xs font-bold px-2 py-1">{x.id}</span>
            <span className="inline-flex items-center rounded-md border border-[#C0BFC0] text-[#343741] text-xs px-2 py-0.5">
              LM RFP ID: {x.rfp.trim() ? x.rfp : <span className="text-[#707070]">{'\u2014'}</span>}
            </span>
            {fmtBadge(x.format)}
            {nConf > 0 && <span className="inline-flex items-center rounded-full bg-[#FFEAA9] text-[#1A1446] text-xs font-medium px-2.5 py-0.5">{nConf} [CONFIRM]</span>}
            {!x.response.trim() && <span className="inline-flex items-center rounded-full border border-[#1A1446] text-[#1A1446] text-xs font-medium px-2.5 py-0.5">Awaiting response</span>}
            {x.status === 'Draft' && <span className="inline-flex items-center rounded-full bg-[#1A1446] text-white text-xs font-medium px-2.5 py-0.5">Draft</span>}
            {x.lastModified && (
              <span className="ml-auto text-xs text-[#707070]">
                Updated {fmtDate(x.lastModified)}
                {x.version ? ` \u00b7 v${x.version}` : ''}
              </span>
            )}
          </div>
          <p className="mt-3 text-xs font-bold uppercase tracking-wider text-[#707070]">Topic</p>
          <h3 className="mt-1 text-lg font-medium text-[#1A1446] leading-snug">{inline(x.topic, x.id)}</h3>
        </div>

        <details className="border-b border-[#E6E6E6]" data-sec="question" open>
          <summary className="flex items-center gap-2 px-5 sm:px-6 py-3 hover:bg-[#F5F5F5]">
            <Chev />
            <span className="text-sm font-bold text-[#1A1446]">Follow-up question</span>
          </summary>
          <div className="px-5 sm:px-6 pb-4 text-[15px] text-[#343741]">{renderText(x.question, null)}</div>
        </details>

        <details className="border-b border-[#E6E6E6]" data-sec="response" open>
          <summary className="flex items-center gap-2 px-5 sm:px-6 py-3 hover:bg-[#F5F5F5]">
            <Chev />
            <span className="text-sm font-bold text-[#1A1446]">Vendor response</span>
            {x.response.trim() && (
              <button
                type="button"
                className="no-print ml-auto text-xs font-medium text-[#06748C] underline underline-offset-2 hover:text-[#1A1446]"
                onClick={(e) => {
                  e.preventDefault();
                  copyText(x.response);
                }}
              >
                Copy response
              </button>
            )}
          </summary>
          <div className="px-5 sm:px-6 pb-5 text-[15px] text-[#343741]">
            {x.response.trim() ? renderText(x.response, x.id) : <p className="italic text-[#707070]">No vendor response yet.</p>}
          </div>
        </details>

        <details className={ref && showRefs ? 'border-b border-[#E6E6E6]' : ''} data-sec="docs" open={x.docs.length > 0}>
          <summary className="flex items-center gap-2 px-5 sm:px-6 py-3 hover:bg-[#F5F5F5]">
            <Chev />
            <span className="text-sm font-bold text-[#1A1446]">Supporting documentation</span>
          </summary>
          <div className="px-5 sm:px-6 pb-5">
            {x.docs.length ? (
              <ul className="space-y-1.5">
                {x.docs.map((u) => (
                  <li key={u} className="flex gap-2 text-sm">
                    <span className="text-[#707070]">{'\u2197'}</span>
                    <a className="text-[#06748C] underline underline-offset-2 hover:text-[#1A1446] break-all" href={u} target="_blank" rel="noopener noreferrer">
                      {u}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm italic text-[#707070]">None listed.</p>
            )}
          </div>
        </details>

        {ref && showRefs && (
          <details className="bg-[#F2FCFC]" data-sec="ref">
            <summary className="flex items-center gap-2 px-5 sm:px-6 py-3 hover:bg-[#C9F3F4]/50">
              <Chev />
              <span className="text-sm font-bold text-[#1A1446]">Demo build reference</span>
              <span className="text-xs text-[#707070]">{'\u00b7'} Not part of the response wording</span>
            </summary>
            <div className="px-5 sm:px-6 pb-5 text-sm text-[#343741]">{refBody(ref)}</div>
          </details>
        )}
      </article>
    );
  };

  function refBody(ref) {
    return (
      <>
        <ul className="space-y-1.5">
          {ref.points.map((p, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-[#06748C] font-bold">{'\u2022'}</span>
              <span className="leading-6">{inline(p, null)}</span>
            </li>
          ))}
        </ul>
        {ref.gaps.length > 0 && (
          <div className="mt-3 rounded-xl bg-white border border-[#E6E6E6] p-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#707070]">To close before the demo</p>
            <ul className="mt-1.5 space-y-1">
              {ref.gaps.map((g, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-[#1A1446]">{'\u2192'}</span>
                  <span className="leading-6">{inline(g, null)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {ref.files.length > 0 && (
          <p className="mt-3 text-xs text-[#707070]">
            Files:{' '}
            {ref.files.map((f, i) => (
              <React.Fragment key={f}>
                {i > 0 ? ' \u00b7 ' : ''}
                <a className="text-[#06748C] underline underline-offset-2" target="_blank" rel="noopener noreferrer" href={REPO_BLOB + encodeURI(f)}>
                  {f}
                </a>
              </React.Fragment>
            ))}
          </p>
        )}
      </>
    );
  }

  /* ---------- questions tab ---------- */
  const formatsInData = [...new Set(QS.map((x) => x.format.trim()).filter(Boolean))];
  const statusChips = [
    ['all', 'All'],
    ['demo', 'From the demo'],
    ['rfp', 'From the RFP'],
    ['confirm', 'Has [CONFIRM] items'],
    ['awaiting', 'Awaiting response'],
    ...(drafts ? [['draft', `Drafts (${drafts})`]] : []),
  ];

  const QuestionsTab = (
    <section>
      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-64 shrink-0 no-print">
          <div className="lg:sticky lg:top-16">
            <p className="text-xs font-bold uppercase tracking-wider text-[#707070] mb-2">Questions</p>
            <ol className="space-y-0.5 max-h-[70vh] overflow-auto pr-1">
              {QS.map((x) => {
                const on = visible.includes(x);
                return (
                  <li key={x.id}>
                    <button
                      type="button"
                      disabled={!on}
                      onClick={() => goTo(x.id)}
                      className={`w-full text-left block border-l-[3px] pl-3 pr-2 py-1.5 rounded-r-md text-sm ${activeNav === x.id ? 'bg-[#F5F5F5] border-[#FFD000]' : 'border-transparent'} ${on ? 'text-[#343741] hover:bg-[#F5F5F5]' : 'text-[#C0BFC0]'}`}
                    >
                      <span className={`font-medium text-[#1A1446] ${on ? '' : 'opacity-40'}`}>{x.id}</span>
                      <span className="block text-xs leading-4 truncate">{x.topic.trim()}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </aside>
        <div className="flex-1 min-w-0">
          <div className="bg-[#F5F5F5] rounded-2xl p-4 sm:p-5 no-print">
            <div className="flex flex-col md:flex-row gap-3 md:items-center">
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search topics, questions, responses, links\u2026"
                className="flex-1 w-full rounded-xl border border-[#C0BFC0] bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#06748C]"
              />
              <div className="flex gap-2 flex-wrap">
                <button type="button" onClick={() => setAllDetails(true)} className="rounded-full bg-[#78E1E1] text-[#1A1446] text-sm font-medium px-4 py-2 hover:brightness-95">
                  Expand all
                </button>
                <button type="button" onClick={() => setAllDetails(false)} className="rounded-full border border-[#1A1446] text-[#1A1446] bg-white text-sm font-medium px-4 py-2 hover:bg-[#F5F5F5]">
                  Collapse all
                </button>
                <button type="button" onClick={() => window.print()} className="rounded-full border border-[#1A1446] text-[#1A1446] bg-white text-sm font-medium px-4 py-2 hover:bg-[#F5F5F5]">
                  Print
                </button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-[#707070] mr-1">Response format:</span>
              {formatsInData.map((f) => (
                <button
                  key={f}
                  type="button"
                  className={chip(fmts.has(f))}
                  onClick={() => {
                    const n = new Set(fmts);
                    if (n.has(f)) n.delete(f);
                    else n.add(f);
                    setFmts(n);
                  }}
                >
                  {f} <span className={fmts.has(f) ? 'text-white/70' : 'text-[#707070]'}>{QS.filter((x) => x.format.trim() === f).length}</span>
                </button>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-[#707070] mr-1">Show:</span>
              {statusChips.map(([k, l]) => (
                <button key={k} type="button" className={chip(status === k)} onClick={() => setStatus(k)}>
                  {l}
                </button>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              <label className="inline-flex items-center gap-2">
                <span className="text-[#707070]">Updated since</span>
                <input type="date" value={since} onChange={(e) => setSince(e.target.value)} className="rounded-lg border border-[#C0BFC0] bg-white px-2 py-1 text-sm" />
                {since && (
                  <button type="button" className="text-xs text-[#06748C] underline" onClick={() => setSince('')}>
                    clear
                  </button>
                )}
              </label>
              <label className="inline-flex items-center gap-2">
                <span className="text-[#707070]">Sort</span>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-lg border border-[#C0BFC0] bg-white px-2 py-1 text-sm">
                  <option value="id">Question ID</option>
                  <option value="updated">Most recently updated</option>
                </select>
              </label>
              {hasRefs && (
                <label className="ml-auto inline-flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" className="accent-[#06748C] w-4 h-4" checked={showRefs} onChange={(e) => setShowRefs(e.target.checked)} />
                  <span className="text-[#343741]">Show demo build references</span>
                </label>
              )}
            </div>
          </div>
          <p className="mt-4 text-sm text-[#707070]">
            Showing {visible.length} of {QS.length} follow-up questions
          </p>
          <div ref={cardsRef} className="mt-3 space-y-5">
            {visible.map((x) => renderCard(x))}
          </div>
          {!visible.length && <div className="mt-10 text-center text-[#707070]">{QS.length ? 'No questions match your search or filters.' : 'No follow-up questions loaded yet.'}</div>}
        </div>
      </div>
    </section>
  );

  /* ---------- data flow tab ---------- */
  const OWN = {
    vendor: { dot: 'bg-[#1A1446] text-white', label: 'Vendor-managed' },
    customer: { dot: 'bg-[#78E1E1] text-[#1A1446]', label: 'Customer-built' },
    shared: { dot: 'text-white', label: 'Shared' },
    none: { dot: 'bg-[#C0BFC0] text-[#1A1446]', label: '\u2014' },
  };
  const sharedBg = { background: 'linear-gradient(90deg,#1A1446 50%,#78E1E1 50%)' };

  const FlowTab = (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-[#1A1446]">OP-14 Data Flow.</h2>
          <p className="text-sm text-[#707070] mt-1">
            From an author&apos;s edit to a live page behind Akamai.
            {refByNodes('OP-14 Data Flow')}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 no-print">
          {[
            ['all', 'All steps'],
            ['vendor', 'Vendor-managed'],
            ['customer', 'Customer-built'],
            ['shared', 'Shared'],
          ].map(([k, l]) => (
            <button key={k} type="button" className={chip(flowFilter === k)} onClick={() => setFlowFilter(k)}>
              {l}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-[#343741]">
        <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#1A1446]" />Vendor-managed</span>
        <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#78E1E1]" />Customer-built</span>
        <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={sharedBg} />Shared (vendor + customer)</span>
        <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#C0BFC0]" />{'\u2014'}</span>
      </div>
      <div className="mt-3 inline-flex rounded-full border border-[#C0BFC0] p-0.5 text-sm no-print">
        {[
          ['steps', 'Step view'],
          ['table', 'Table view'],
        ].map(([k, l]) => (
          <button key={k} type="button" onClick={() => setFlowView(k)} className={`px-4 py-1.5 rounded-full ${flowView === k ? 'bg-[#1A1446] text-white' : ''}`}>
            {l}
          </button>
        ))}
      </div>
      {!data.flow.length && <p className="mt-6 text-[#707070]">No data flow steps loaded.</p>}
      {flowView === 'steps' ? (
        <ol className="mt-5 relative">
          {data.flow.map((r, i) => {
            const o = ownerOf(r.owner);
            const dim = flowFilter !== 'all' && o !== flowFilter ? 'opacity-30' : '';
            const src = `FLOW-${r.step}`;
            const c = { n: 0 };
            const what = inline(r.what, src, c);
            const time = inline(r.time, src, c);
            const notes = r.notes ? inline(r.notes, src, c) : null;
            return (
              <li key={r.key} className={`relative pl-14 pb-5 transition-opacity ${dim}`}>
                {i < data.flow.length - 1 && <span className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-[#E6E6E6]" />}
                <span className={`absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${OWN[o].dot}`} style={o === 'shared' ? sharedBg : undefined}>
                  {o === 'shared' ? <span className="bg-white text-[#1A1446] rounded-full w-6 h-6 flex items-center justify-center text-xs">{r.step}</span> : r.step}
                </span>
                <div className="rounded-2xl border border-[#E6E6E6] bg-white p-4 sm:p-5">
                  <p className="text-[15px] text-[#343741] leading-6">{what}</p>
                  <div className="mt-3 grid sm:grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#707070]">Where</p>
                      <p className="mt-0.5 text-[#1A1446]">{inline(r.where, src, { n: 99 })}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#707070]">Vendor-managed or customer-built</p>
                      <p className="mt-0.5 text-[#343741]">{inline(r.owner, src, { n: 99 })}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#707070]">Expected time</p>
                      <p className="mt-0.5 text-[#343741]">{time}</p>
                    </div>
                  </div>
                  {notes && (
                    <p className="mt-3 text-sm text-[#343741] bg-[#F5F5F5] rounded-lg px-3 py-2">
                      <span className="font-medium text-[#1A1446]">Notes:</span> {notes}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <div className="mt-5 overflow-x-auto rounded-2xl border border-[#E6E6E6]">
          <table className="min-w-full text-sm">
            <thead className="bg-[#1A1446] text-white">
              <tr>
                {['Step', 'What happens', 'Where', 'Vendor-managed or customer-built', 'Expected time', 'Notes'].map((h) => (
                  <th key={h} className="text-left font-medium px-3 py-2.5 align-top">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.flow.map((r, i) => {
                const o = ownerOf(r.owner);
                const dim = flowFilter !== 'all' && o !== flowFilter ? 'opacity-30' : '';
                const src = `FLOW-${r.step}`;
                const c = { n: 0 };
                const cells = [r.step, inline(r.what, src, c), inline(r.where, src, { n: 99 }), inline(r.owner, src, { n: 99 }), inline(r.time, src, c), inline(r.notes, src, c)];
                return (
                  <tr key={r.key} className={`${i % 2 ? 'bg-[#F5F5F5]' : 'bg-white'} ${dim} align-top`}>
                    {cells.map((cell, j) => (
                      <td key={j} className="px-3 py-2.5 text-[#343741]">
                        {cell}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );

  /* ---------- ERD tab ---------- */
  const selected = erdSel ? data.erd.find((e) => e.entity === erdSel) : null;
  const relSet = new Set(selected ? selected.related : []);
  const ErdTab = (
    <section>
      <h2 className="text-2xl font-bold text-[#1A1446]">OP-14 ERD.</h2>
      <p className="text-sm text-[#707070] mt-1">
        An example data model and how each entity affects content and asset retrieval.
        {refByNodes('OP-14 ERD')}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3 no-print">
        <div className="inline-flex rounded-full border border-[#C0BFC0] p-0.5 text-sm">
          {[
            ['cards', 'Entity cards'],
            ['table', 'Table view'],
          ].map(([k, l]) => (
            <button key={k} type="button" onClick={() => setErdView(k)} className={`px-4 py-1.5 rounded-full ${erdView === k ? 'bg-[#1A1446] text-white' : ''}`}>
              {l}
            </button>
          ))}
        </div>
        <p className="text-xs text-[#707070]">Select an entity to highlight the entities it relates to (from its Related entities field). Select it again to clear.</p>
      </div>
      {!data.erd.length && <p className="mt-6 text-[#707070]">No ERD entities loaded.</p>}
      {erdView === 'cards' ? (
        <div className="mt-5 grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {data.erd.map((e) => {
            let ring = '';
            if (erdSel) ring = e.entity === erdSel ? 'ring-[3px] ring-[#1A1446]' : relSet.has(e.entity) ? 'ring-[3px] ring-[#78E1E1]' : '';
            return (
              <button
                key={e.key}
                type="button"
                onClick={() => setErdSel(erdSel === e.entity ? null : e.entity)}
                className={`text-left rounded-2xl border border-[#E6E6E6] bg-white p-4 sm:p-5 hover:border-[#1A1446] transition ${ring}`}
                style={erdSel && e.entity !== erdSel && !relSet.has(e.entity) ? { opacity: 0.35 } : undefined}
              >
                <p className="text-base font-bold text-[#1A1446]">{e.entity}</p>
                <p className="mt-3 text-xs font-bold uppercase tracking-wider text-[#707070]">Key attributes</p>
                <p className="mt-0.5 text-sm text-[#343741] leading-6">{e.attrs}</p>
                <p className="mt-3 text-xs font-bold uppercase tracking-wider text-[#707070]">Relationships</p>
                <p className="mt-0.5 text-sm text-[#343741] leading-6">{e.rels}</p>
                <div className="mt-3 rounded-lg bg-[#F5F5F5] px-3 py-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#06748C]">Effect on content/asset retrieval</p>
                  <p className="mt-0.5 text-sm text-[#343741] leading-6">{e.effect}</p>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto rounded-2xl border border-[#E6E6E6]">
          <table className="min-w-full text-sm">
            <thead className="bg-[#1A1446] text-white">
              <tr>
                {['Entity', 'Key attributes', 'Relationships', 'Effect on content/asset retrieval'].map((h) => (
                  <th key={h} className="text-left font-medium px-3 py-2.5">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.erd.map((e, i) => (
                <tr key={e.key} className={`${i % 2 ? 'bg-[#F5F5F5]' : 'bg-white'} align-top`}>
                  <td className="px-3 py-2.5 font-medium text-[#1A1446] whitespace-nowrap">{e.entity}</td>
                  <td className="px-3 py-2.5 text-[#343741]">{e.attrs}</td>
                  <td className="px-3 py-2.5 text-[#343741]">{e.rels}</td>
                  <td className="px-3 py-2.5 text-[#343741]">{e.effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );

  /* ---------- sample query tab ---------- */
  const panel = (title, body) => (
    <div className="rounded-2xl border border-[#E6E6E6] overflow-hidden">
      <div className="flex items-center justify-between bg-[#F5F5F5] px-4 py-2.5">
        <p className="text-sm font-bold text-[#1A1446]">{title}</p>
        <button type="button" className="no-print text-xs font-medium text-[#06748C] underline underline-offset-2 hover:text-[#1A1446]" onClick={() => copyText(body)}>
          Copy
        </button>
      </div>
      <pre className="code" style={{ borderRadius: 0, margin: 0, maxHeight: 640 }}>
        {hlCode(body)}
      </pre>
    </div>
  );
  const QueryTab = (
    <section>
      <h2 className="text-2xl font-bold text-[#1A1446]">OP-16 Sample Query.</h2>
      {data.sq ? (
        <>
          <p className="text-sm text-[#707070] mt-1">
            {data.sq.title || 'Sample query'}.
            {refByNodes('OP-16 Sample Query')}
          </p>
          <div className="mt-5 grid xl:grid-cols-2 gap-5">
            {panel('GraphQL request', data.sq.request)}
            {panel('Example response (abridged)', data.sq.response)}
          </div>
          <div className="mt-5 rounded-2xl bg-[#F5F5F5] p-5">
            <p className="text-sm font-bold text-[#1A1446] mb-1">Notes</p>
            <div className="text-[15px] text-[#343741]">{renderText(data.sq.notes, 'SQ')}</div>
          </div>
        </>
      ) : (
        <p className="mt-6 text-[#707070]">No sample query loaded.</p>
      )}
    </section>
  );

  /* ---------- confirm tracker ---------- */
  const doneN = CONFIRMS.filter((c) => done.has(c.id)).length;
  const pct = CONFIRMS.length ? Math.round((100 * doneN) / CONFIRMS.length) : 100;
  const groups = [];
  CONFIRMS.forEach((c) => {
    let g = groups.find((x) => x.label === c.label);
    if (!g) groups.push((g = { label: c.label, go: c.go, items: [] }));
    g.items.push(c);
  });
  const ConfirmTab = (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-[#1A1446]">Open [CONFIRM] items.</h2>
          <p className="text-sm text-[#707070] mt-1">Every [CONFIRM] marker in the CMS content, grouped by where it appears. Tick an item when it is resolved; ticks are saved in this browser.</p>
        </div>
        <button
          type="button"
          className="no-print rounded-full bg-[#78E1E1] text-[#1A1446] text-sm font-medium px-4 py-2 hover:brightness-95"
          onClick={() => copyText(CONFIRMS.filter((c) => !done.has(c.id)).map((c) => `${c.label}: ${c.text}`).join('\n') || 'No open items')}
        >
          Copy open items
        </button>
      </div>
      <div className="mt-4 rounded-2xl bg-[#F5F5F5] p-4">
        <div className="flex justify-between text-sm">
          <span className="text-[#343741] font-medium">
            {doneN} of {CONFIRMS.length} resolved
          </span>
          <span className="text-[#707070]">{pct}%</span>
        </div>
        <div className="mt-2 h-2.5 w-full rounded-full bg-[#E6E6E6] overflow-hidden">
          <div className="h-full bg-[#06748C] rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>
      {!CONFIRMS.length && <p className="mt-6 text-[#707070]">No [CONFIRM] markers in the loaded content.</p>}
      <div className="mt-5 space-y-4">
        {groups.map((g) => (
          <div key={g.label} className="rounded-2xl border border-[#E6E6E6] bg-white p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium text-[#1A1446]">{inline(g.label, null)}</p>
              <button type="button" className="text-xs font-medium text-[#06748C] underline underline-offset-2 hover:text-[#1A1446]" onClick={() => (g.go.type === 'q' ? goTo(g.go.id) : showTab(g.go.id))}>
                Open in context {'\u2192'}
              </button>
            </div>
            <ul className="mt-3 space-y-2">
              {g.items.map((c) => (
                <li key={c.id}>
                  <label className="flex gap-3 items-start cursor-pointer">
                    <input type="checkbox" className="mt-1 w-4 h-4 accent-[#06748C]" checked={done.has(c.id)} onChange={(e) => toggleDone(c.id, e.target.checked)} />
                    <span className="text-sm leading-6">
                      <span className={`confirm${done.has(c.id) ? ' done' : ''}`}>{c.text}</span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );

  /* ---------- demo build reference tab ---------- */
  const BuildTab = (
    <section>
      <h2 className="text-2xl font-bold text-[#1A1446]">Demo build reference.</h2>
      <p className="text-sm text-[#707070] mt-1 max-w-3xl">Notes from the Liberty Mutual demo build that help prepare the visual demonstrations. Not part of the response wording.</p>
      <div className="mt-5 grid lg:grid-cols-2 gap-4">
        {Object.keys(data.refs)
          .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
          .map((id) => {
            const x = QS.find((y) => y.id === id);
            return (
              <div key={id} className="rounded-2xl border border-[#E6E6E6] bg-[#F2FCFC] p-4 sm:p-5 text-sm text-[#343741]">
                <div className="flex flex-wrap items-center gap-2">
                  <button type="button" onClick={() => goTo(id)} className="inline-flex items-center rounded-md bg-[#FFD000] text-[#1A1446] text-xs font-bold px-2 py-1">
                    {id}
                  </button>
                  {x && <span className="font-medium text-[#1A1446]">{x.topic.trim()}</span>}
                </div>
                <div className="mt-3">{refBody(data.refs[id])}</div>
              </div>
            );
          })}
      </div>
    </section>
  );

  /* =====================================================================
     Layout
     ===================================================================== */
  const set = data.set;
  const eyebrow = (set && set.eyebrow) || 'Liberty Mutual RFP \u00b7 Optimizely follow-up responses';
  const title = (set && set.title) || 'Follow-up questions and responses.';
  const intro = (set && set.intro) || 'Every topic, follow-up question, response format, vendor response and supporting link, managed in Optimizely CMS (SaaS).';

  return (
    <div className="lmv min-h-screen bg-white text-[#343741]" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>
      <style>{CSS}</style>

      <header className="bg-[#FFD000]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-8 pb-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <p className="text-sm font-medium text-[#1A1446] tracking-wide">{eyebrow}</p>
            <button
              type="button"
              onClick={() => {
                setDraft(settings);
                setShowConn((v) => !v);
              }}
              className="no-print inline-flex items-center gap-2 rounded-full bg-white/85 hover:bg-white text-[#1A1446] text-xs font-medium px-3 py-1.5"
            >
              <span className={`w-2 h-2 rounded-full ${source.mode === 'sample' ? 'bg-[#C0BFC0]' : 'bg-[#06748C]'}`} />
              {sourceLabel}
              <span className="underline underline-offset-2">Connection</span>
            </button>
          </div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-[#1A1446] leading-tight">{title}</h1>
          <p className="mt-3 max-w-3xl text-[#1A1446] text-[15px] leading-6">{intro}</p>
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-5 gap-3">
            {tiles.map(([n, l]) => (
              <div key={l} className="bg-white rounded-xl px-4 py-3">
                <div className="text-2xl font-bold text-[#1A1446]">{n}</div>
                <div className="text-xs text-[#343741] mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {showConn && renderConnection()}

      {source.mode === 'sample' && !showConn && (
        <div className="no-print bg-[#F2FCFC] border-b border-[#C9F3F4]">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-2.5 flex flex-wrap items-center gap-3 text-sm text-[#1A1446]">
            You are viewing built-in sample data (3 of 17 questions). Connect to Optimizely Graph to load the CMS content.
            <button
              type="button"
              className="ml-auto rounded-full bg-[#1A1446] text-white text-xs font-medium px-3 py-1.5"
              onClick={() => {
                setDraft({ ...settings, mode: settings.mode === 'sample' ? 'graph' : settings.mode });
                setShowConn(true);
              }}
            >
              Connect
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-7xl mx-auto px-5 sm:px-8 mt-4">
          <div className="rounded-2xl border-l-4 border-[#FFD000] bg-[#FFEAA9]/60 px-4 py-3 text-sm text-[#1A1446]">
            <p className="font-medium">Something needs attention.</p>
            <p className="mt-0.5 break-words">{error}</p>
            {hintFor(error) && <p className="mt-1 text-[#343741]">{hintFor(error)}</p>}
          </div>
        </div>
      )}

      <nav className="sticky top-0 z-30 bg-white border-b border-[#E6E6E6] no-print">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center gap-1 overflow-x-auto">
          {TABS.map(([id, label, n]) => (
            <button
              key={id}
              type="button"
              onClick={() => showTab(id)}
              className={`whitespace-nowrap px-4 py-3.5 text-sm font-medium border-b-[3px] ${tab === id ? 'border-[#FFD000] text-[#1A1446]' : 'border-transparent text-[#343741] hover:text-[#1A1446]'}`}
            >
              {label}
              {n != null && <span className="ml-1 text-xs text-[#707070]">{n}</span>}
            </button>
          ))}
          {loading && <span className="ml-auto text-xs text-[#707070] whitespace-nowrap">Loading from the CMS{'\u2026'}</span>}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-6">
        {tab === 'questions' && QuestionsTab}
        {tab === 'flow' && FlowTab}
        {tab === 'erd' && ErdTab}
        {tab === 'query' && QueryTab}
        {tab === 'confirm' && ConfirmTab}
        {tab === 'build' && hasRefs && BuildTab}
      </main>

      <footer className="border-t border-[#E6E6E6] mt-10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6 text-xs text-[#707070] space-y-1">
          <p>
            Source: {source.mode === 'sample' ? 'built-in sample data' : 'Optimizely CMS (SaaS) through Optimizely Graph'}
            {set && set.source ? ` \u00b7 ${set.source}` : ''}
            {set && set.asOf ? ` \u00b7 as of ${fmtDate(set.asOf, false)}` : ''}.
          </p>
          {set && set.footer && <p>{set.footer}</p>}
          <p>
            Content types: LmRfpResponseSet, LmRfpQuestion, LmRfpDataFlowStep, LmRfpErdEntity, LmRfpSampleQuery{hasRefs ? ', LmRfpDemoReference' : ''}.
          </p>
        </div>
      </footer>

      <div
        className={`fixed bottom-5 left-1/2 -translate-x-1/2 bg-[#1A1446] text-white text-sm px-4 py-2 rounded-full shadow-lg transition-opacity pointer-events-none ${toast ? 'opacity-100' : 'opacity-0'}`}
        role="status"
        aria-live="polite"
      >
        {toast || ' '}
      </div>
    </div>
  );
}
