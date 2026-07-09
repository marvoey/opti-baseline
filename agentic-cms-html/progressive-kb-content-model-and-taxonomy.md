# Progressive AI Knowledge Base — Content Model & Governance Taxonomy

**Context:** Optimizely demo at `progressive.optimoey.com/demo-v2` — an AI assistant chat interface that dynamically assembles content for a Progressive Insurance consultant, driven by one of three "intent" tabs: **Consult (Live Data)**, **Resolve/Support**, **Simulate/Transact**.

This doc captures the working design so far: (1) the content model for the assembled answer UI, and (2) a governance-first taxonomy so an LLM can use closed-enum facets to retrieve **only pre-approved** knowledge base content — not as a search-relevance mechanism, but as a hard access-control gate.

Only **Intent 1: Consult (Live Data)** has been observed directly (via screenshot). Intents 2 and 3 are inferred/placeholder pending further screenshots — flagged as open questions below.

---

## Part 1 — Observed UI (Intent 1: Consult / Live Data)

Rendered elements, top to bottom:
1. Progressive header/nav with 3 intent tabs (Intent 1 active/underlined)
2. "Assistant Chat" panel with live-status dot, opening with a conversational summary message: *"I've pulled the active auto insurance discounts and coverage options directly from the Progressive.com catalog. I've highlighted the Bundle & Save and Snapshot programs as your best levers to lower their premium."*
3. "Optimizely Content Assembly" strip — 3-step pipeline trail shown to the consultant as reasoning transparency:
   - **1. Intent** → Consultation / Upsell
   - **2. Layout Blueprint** → Dashboard (Side-by-Side)
   - **3. Content Fetch** → Live Progressive.com Data (Snapshot, Bundle, Vehicle Protection)
4. Blue hero card: **"Auto Coverage & Discounts Playbook"**, badge "Live Data Mode," subtitle "Sourced from Progressive.com / Auto"
5. "Savings & Discount Toolkit" section beginning (cut off in screenshot — content unknown)

---

## Part 2 — Content Model (Optimizely block structure)

Designed as composable blocks so Intents 2 and 3 can reuse the same shell with different content populating the ContentArea.

### 2.1 `AiAssistantAnswerBlock` (root Content Type — Block)

| Property | Type | Notes |
|---|---|---|
| IntentKey | Enum/Selection | `Consult`, `Resolve`, `Simulate` — drives which downstream template renders |
| AssistantMessage | XhtmlString | The conversational summary text |
| StatusIndicator | Enum | live/idle dot state (green = active) |
| PipelineSteps | ContentArea (of `PipelineStepBlock`) | The 3-step "Optimizely Content Assembly" trail |
| AnswerHeroCard | ContentReference (`HeroCardBlock`) | The blue title card |
| ContentModules | ContentArea (mixed block types) | Everything below the hero (Savings Toolkit, etc.) |
| DataSource | Block (`DataSourceMetadataBlock`) | Traceability for "Live Data Mode" claims |
| TaxonomyFacets | Block (`TaxonomyFacetsBlock`) | See Part 3 — governance gating, required on every KB-sourced answer |

### 2.2 `PipelineStepBlock` (reusable Block)

| Property | Type | Example |
|---|---|---|
| StepNumber | Int | 1 |
| StepLabel | String | "Intent" |
| StepValue | String | "Consultation / Upsell" |
| StepDetail | String (optional) | "Dashboard (Side-by-Side)" |

*Design note: Step 3 packs multiple data source names into one string — consider splitting into a `SourceTags` list property (multi-select: Snapshot, Bundle, Vehicle Protection) to render as chips instead of prose. Under the governance model (Part 3), these source tags should map to the closed `DiscountProgramName` enum, not free text.*

### 2.3 `HeroCardBlock` (reusable Block)

| Property | Type | Example |
|---|---|---|
| Title | String | "Auto Coverage & Discounts Playbook" |
| SourceLabel | String | "Sourced from Progressive.com / Auto" |
| ModeBadge | Enum/String | "Live Data Mode" |
| ThemeColor | Enum | Progressive blue |

### 2.4 `DataSourceMetadataBlock`

Not visibly rendered as UI text but implied by "Live Data Mode" — needed for provenance/trust.

| Property | Type |
|---|---|
| SourceSystem | String (e.g. "Progressive.com/Auto catalog") |
| FetchTimestamp | DateTime |
| ConfidenceLabel | Enum (e.g. "Live" vs "Cached") |

### 2.5 `ContentModules` — allowed block types in the ContentArea

The "Savings & Discount Toolkit" section suggests a generic, repeatable module pattern:

- `ToolkitItemBlock` — icon, title, short description, CTA link
- `ComparisonTableBlock` — side-by-side coverage options
- `CalloutBlock` — highlighted recommendations

This keeps the answer shell intent-agnostic: Intent 2 and 3 reuse `AiAssistantAnswerBlock` + `PipelineSteps` + `HeroCardBlock`, swapping only which modules populate `ContentModules`.

### Open questions (pending Intent 2 & 3 screenshots)

1. Do pipeline step **labels** change per intent (e.g., "Diagnosis" instead of "Layout Blueprint" for Resolve), or just the **values**?
2. Does `ModeBadge` vocabulary expand beyond "Live Data Mode" (e.g., "Transaction Mode," "Support Mode")?
3. Are `ContentModules` genuinely reusable across intents, or does each intent need dedicated module types?

---

## Part 3 — Governance Taxonomy (retrieval-gating, not search)

### 3.1 Design principle

The taxonomy's purpose is **not** search relevance — it's deterministic access control. The flow is:

1. LLM parses the consultant's natural-language question and classifies it into a fixed set of **closed enum facet values** (structured output, not prose).
2. The retrieval system queries the KB with a **hard filter**: facets match AND `ApprovalStatus = Approved` AND jurisdiction/entity/channel constraints satisfied.
3. The LLM never sees unapproved content — governance lives in the query filter, not in an instruction asking the model to disregard restricted material. Excluding at retrieval is strictly stronger than excluding via prompt instruction.

**Every facet in this model must be closed enum.** Free-form/open tags are unsuitable for a governance gate — an LLM can't reliably use open vocabulary as a hard filter. (A separate free-form/search-relevance layer can exist elsewhere in the system, but it must not participate in the approval gate.)

### 3.2 Full facet list

**Core content classification facets**
- **Intent Type** — Consult, Resolve, Simulate
- **Product Line** — Auto, Home, Renters, Motorcycle, Boat, Bundle, Commercial
- **Topic** — Discounts, Coverage, Billing, Claims, Policy Terms
- **Journey Stage** — Prospect/Quote, New Policyholder, Active Policyholder, Renewal, Claims/Post-Incident
- **Content Format** — Playbook, FAQ, Comparison Table, Step-by-Step, Policy Excerpt

**Progressive/insurance-specific facets**
- **Underwriting Entity** — the specific legal subsidiary (Progressive Direct, Progressive Advantage, Progressive Casualty, etc.) — varies by state; content accurate for one entity can be wrong for another
- **Distribution Channel** — Agent-sold, Direct-to-consumer, Comparative rater ("Name Your Price") — approval can differ by channel
- **Discount/Program Name** — Snapshot, Bundle & Save, Multi-Car, Paperless, Pay-in-Full, etc. — closed enum (not free-form) because these are state-filed programs; an unfiled or mismatched name is a compliance risk, and this list is owned by governance/compliance, not marketing
- **Coverage Type** — Liability, Collision, Comprehensive, PIP, UM/UIM, Roadside, Rental Reimbursement — primarily for Resolve/claims content
- **Claim Type** — Auto Claim, Property Damage, Bodily Injury, Glass, Total Loss — governs which claims-handling content surfaces (Resolve intent)
- **Language** — English, Spanish — mismatched language + jurisdiction is its own compliance issue
- **Jurisdiction (State)** — likely the highest-risk facet; content approved in one state may be non-compliant in another

**Governance/approval facets**
- **Approval Status** — Approved, Restricted, Deprecated, Pending Review — the actual retrieval gate; nothing without `Approved` enters the candidate set regardless of topical match
- **Access Level** — Consultant-only, Public-facing, Internal Training — governs audience, independent of topic
- **Content Effective Date / Expiration Date** — filings change over time; approval can be time-boxed, so expired content must hard-drop out of the retrievable set (not just flag)
- **Last Compliance Review Date + Reviewer of Record** — audit trail: who approved, when — separate from current validity

### 3.3 Highest-risk facet intersection

**Jurisdiction × Underwriting Entity × Discount/Program Name** — this is where "technically true nationally, wrong in this specific state/entity" lives. Recommend this triad gets explicit test coverage in any governance validation suite.

### 3.4 `TaxonomyFacetsBlock` (proposed Optimizely content type — attached to every KB-sourced answer/content item)

| Property | Type |
|---|---|
| IntentType | Enum |
| ProductLine | Enum |
| Topic | Enum |
| JourneyStage | Enum |
| ContentFormat | Enum |
| UnderwritingEntity | Enum |
| DistributionChannel | Enum |
| DiscountProgramName | Enum (multi-select) |
| CoverageType | Enum (multi-select) |
| ClaimType | Enum (multi-select, Resolve-intent content) |
| Language | Enum |
| Jurisdiction | Enum (state, multi-select) |
| ApprovalStatus | Enum |
| AccessLevel | Enum |
| EffectiveDate | Date |
| ExpirationDate | Date |
| LastComplianceReviewDate | Date |
| ReviewerOfRecord | String/Reference |

### 3.5 Retrieval query shape (conceptual)

```
WHERE ApprovalStatus = 'Approved'
  AND ExpirationDate > NOW()
  AND Jurisdiction CONTAINS consultant.state
  AND UnderwritingEntity = consultant.applicableEntity
  AND IntentType = classifiedIntent
  AND ProductLine = classifiedProductLine
  AND Topic = classifiedTopic
  [AND DiscountProgramName IN classifiedPrograms]
  [AND CoverageType IN classifiedCoverageTypes]
ORDER BY LastComplianceReviewDate DESC
```

The LLM's structured-output step produces `classifiedIntent`, `classifiedProductLine`, `classifiedTopic`, etc. — never a free-text query.

---

## Next steps / open items

1. Capture Intent 2 (Resolve/Support) and Intent 3 (Simulate/Transact) screenshots to validate whether the content model shell (Part 2) and pipeline step labels genuinely generalize, or need per-intent variants.
2. Decide whether `Topic` should be a standalone enum facet or folded into `ProductLine`/`ContentFormat` — flagged as a judgment call, not yet resolved.
3. Determine who owns/maintains the `DiscountProgramName` enum list given it's tied to state filings (compliance vs. marketing ownership).
4. Define the structured-output schema/prompt the LLM uses to classify consultant questions into facet values (JSON schema matching `TaxonomyFacetsBlock`).
