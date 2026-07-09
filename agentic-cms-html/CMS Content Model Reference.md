# Progressive × Optimizely CMS Content Model Reference

This document maps the eight Progressive content types defined in Optimizely CMS SaaS to the Opal Consultant UI response cards they power. Use it to understand which CMS properties drive which visible elements.

---

## Architecture Overview

All eight types share the same base:

- **`baseType`**: `_component`
- **`compositionBehaviors`**: `['sectionEnabled', 'elementEnabled']` — usable inside Experience compositions
- **SDK**: `contentType()` from `@optimizely/cms-sdk`, pushed via `@optimizely/cms-cli`

The Opal Knowledge Assistant resolves content items at query time using the taxonomy fields (LOB, Topic, Jurisdiction) to filter candidates, then applies tier overrides. Fields marked **isLocalized** support per-locale variants. Multi-source responses assemble two or more content items; each item is resolved independently and the UI merges them.

---

## Shared Taxonomy Fields

Every content type includes these fields. They are the primary routing keys used to match a content item to a customer context.

### `LineOfBusiness`

```
type: array
format: selectMany
displayName: Line of Business
isRequired: true
sortOrder: 10
items.type: string
items.enum:
  - CommercialAuto  → Commercial Auto
  - PersonalAuto    → Personal Auto
  - Homeowners      → Homeowners
  - Renters         → Renters
```

### `Topic`

```
type: array
format: selectMany
displayName: Topic / Peril
isRequired: true
sortOrder: 20
items.type: string
items.enum:
  - Hail                → Hail
  - Discounts           → Discounts
  - CoverageOptions     → Coverage Options
  - Upsell              → Upsell
  - Tools               → Tools
  - RoadsideAssistance  → Roadside Assistance
  - TransitionGuidelines → Transition Guidelines
  - GlassClaim          → Glass Claim
```

### `Jurisdiction`

```
type: array
format: selectMany
displayName: Jurisdiction
sortOrder: 30
items.type: string
items.enum:
  - National → National
  - FL       → Florida
  - CA       → California
  - OH       → Ohio
  - TX       → Texas
  - NY       → New York
```

### Shared Metadata Fields

These appear on all types with consistent meanings:

| Property | Type | Description |
|---|---|---|
| `VariationLabel` | string | Human-readable override label shown in the UI, e.g. "FL Override" |
| `SourceLabel` | string | Citation label shown in the Sources chip, e.g. "Auto Comprehensive (FL Override)" |
| `ActiveDate` | dateTime | Effective date for this content version |

---

## Content Types

### 1. `PrgvCoverageRule` — Progressive: Coverage Rule

**Description**: Core policy coverage text — what is covered, deductibles, and exceptions. Supports state-level overrides.

**UI card type**: Blue left-border card ("Coverage Found")

#### Additional Fields

| Property | Type | Description | isLocalized | isRequired |
|---|---|---|---|---|
| `PolicyTier` | string (enum) | AllTiers / Standard / Gold / Platinum | — | — |
| `CoreDefinition` | richText | Main coverage description. May be inherited from National master. Returns `{ html: string }` | yes | — |
| `DeductibleRules` | richText | Deductible rules. State override replaces national default. Returns `{ html: string }` | yes | — |
| `Exceptions` | richText | Notable exceptions, statutory carve-outs, or edge cases. Returns `{ html: string }` | yes | — |
| `StateDisclosure` | richText | State-specific required disclosure text. Returns `{ html: string }` | yes | — |

#### UI → Field Mapping

| Opal UI element | CMS field |
|---|---|
| Card headline | `VariationLabel` (or auto-generated from taxonomy) |
| Coverage description paragraph | `CoreDefinition` (rendered HTML) |
| Deductible row | `DeductibleRules` (rendered HTML) |
| Exception note / follow-up answer | `Exceptions` (rendered HTML) |
| State disclosure warning | `StateDisclosure` (rendered HTML) |
| Sources chip label | `SourceLabel` |

---

### 2. `PrgvBenefit` — Progressive: Benefit

**Description**: Quantified service benefit with tier-based limits — rental reimbursement, roadside, and similar included services.

**UI card type**: Standard white card with benefit chip rows and optional CTA button

#### Additional Fields

| Property | Type | Description | isLocalized |
|---|---|---|---|
| `PolicyTier` | string (enum) | AllTiers / Standard / Gold / Platinum | — |
| `BenefitDescription` | richText | What the benefit provides | yes |
| `Procedure` | richText | How to initiate or use the benefit | yes |
| `Vendors` | string | Comma-separated approved vendor list, e.g. "Enterprise, Hertz, National" | — |
| `PrimaryLimit` | string | Tier-specific limit, e.g. "$50/day" | — |
| `MasterPrimaryLimit` | string | Standard/master tier limit, e.g. "$30/day" | — |
| `SecondaryLimit` | string | Tier-specific secondary limit, e.g. "30 days" | — |
| `MasterSecondaryLimit` | string | Standard/master secondary limit, e.g. "21 days" | — |
| `ReimbursementWindow` | string | e.g. "72 hours" | — |
| `EnrollmentAction` | string | CTA label, e.g. "Authorize Rental" | — |

#### UI → Field Mapping

| Opal UI element | CMS field |
|---|---|
| Benefit paragraph | `BenefitDescription` |
| Limit chip (tier-based) | `PrimaryLimit` (current tier) |
| Limit chip (standard footnote) | `MasterPrimaryLimit` |
| Duration cap | `SecondaryLimit` / `MasterSecondaryLimit` |
| Vendor chips | `Vendors` (split on comma) |
| Procedure / reimbursement note | `Procedure` |
| Reimbursement window note | `ReimbursementWindow` |
| CTA button label | `EnrollmentAction` |

---

### 3. `PrgvDiscount` — Progressive: Discount

**Description**: Individual discount catalog item with eligibility rules and enrollment guidance.

**UI card type**: Green left-border card ("Opportunity Found") showing savings row + status chip

#### Additional Fields

| Property | Type | Description | isLocalized |
|---|---|---|---|
| `DiscountName` | string (required) | e.g. "Snapshot® Telematics" or "Good Student" | — |
| `EligibilityRules` | richText | Who qualifies | yes |
| `EnrollmentSteps` | richText | How the consultant applies the discount | yes |
| `Documentation` | richText | Required documents, e.g. transcripts | yes |
| `TimingNote` | string | e.g. "Effective next billing cycle" | — |
| `SavingsType` | string (enum) | Percentage / DollarAmount / Both | — |
| `SavingsRange` | string | e.g. "Up to 30%" | — |
| `SavingsAmount` | string | e.g. "$5/month" | — |
| `GpaRequirement` | string | Minimum GPA for Good Student, e.g. "3.0 or B average" | — |

#### UI → Field Mapping

| Opal UI element | CMS field |
|---|---|
| Discount name row | `DiscountName` |
| Savings badge | `SavingsRange` or `SavingsAmount` |
| Enrollment status chip | Runtime (CRM enrolled=false) — NOT stored in CMS |
| Eligibility paragraph | `EligibilityRules` |
| Enrollment steps | `EnrollmentSteps` |
| Documentation checklist | `Documentation` |
| Timing note | `TimingNote` |
| GPA threshold | `GpaRequirement` |

> **Assembly note**: The "unenrolled discounts" view (Scenario 06) filters by `enrolled = false AND eligible = true`. The enrollment status is read from CRM at runtime; only the discount content itself lives in CMS.

---

### 4. `PrgvExclusionRule` — Progressive: Exclusion Rule

**Description**: What is NOT covered by a policy, with redirect guidance to the correct coverage.

**UI card type**: Red left-border card ("Gap / Not Covered")

#### Additional Fields

| Property | Type | Description | isLocalized |
|---|---|---|---|
| `ExclusionText` | richText | What is excluded and the policy basis | yes |
| `RedirectNote` | string | Where coverage may be found instead, e.g. "→ Homeowners off-premises" | yes |
| `ReferralProduct` | string | Product to refer the customer to, e.g. "NFIP" or "Umbrella" | — |

#### UI → Field Mapping

| Opal UI element | CMS field |
|---|---|
| "Not Covered" heading / explanation | `ExclusionText` |
| Redirect suggestion | `RedirectNote` |
| Cross-sell referral note | `ReferralProduct` |

> **Assembly note**: Exclusion cards frequently appear alongside a `PrgvCoverageRule` item in a multi-source assembly (e.g. Scenario 02 — tree on car; Scenario 03 — stolen property; Scenario 08 — flood vs. burst pipe). The agent resolves both items from separate content type queries and the UI merges them into a split "Covered / Excluded" view.

---

### 5. `PrgvRecommendation` — Progressive: Recommendation

**Description**: Cross-sell / upsell advisory content with gap analysis — triggered when current coverage falls short.

**UI card type**: Blue left-border card ("Recommendation")

#### Additional Fields

| Property | Type | Description | isLocalized |
|---|---|---|---|
| `RecommendationType` | string (enum, required) | Upsell / CrossSell / Advisory / GapAlert | — |
| `TriggerCondition` | string | Logic description that surfaces this item, e.g. "Auto BI limit < $500K threshold" | — |
| `GapNarrative` | richText | Why the current coverage is insufficient | yes |
| `CoverageAdditions` | richText | What the recommended product adds | yes |
| `UniqueCoverages` | richText | Coverages not available in existing base policies | yes |
| `ComparisonTable` | richText | Base policy caps vs. recommended product, structured as a table | yes |
| `PricingNote` | string | e.g. "~$19/month for $1M umbrella" | — |
| `CtaLabel` | string | e.g. "Get Umbrella Quote" | — |

#### UI → Field Mapping

| Opal UI element | CMS field |
|---|---|
| Gap narrative paragraph | `GapNarrative` |
| "What umbrella adds" chip list | `CoverageAdditions` |
| Unique coverage chips | `UniqueCoverages` |
| Comparison table | `ComparisonTable` |
| Pricing note | `PricingNote` |
| CTA button | `CtaLabel` |
| Trigger check | `TriggerCondition` (read by agent, not displayed) — net worth threshold from CRM |

---

### 6. `PrgvProgram` — Progressive: Program

**Description**: Enrollable program with scoring or discount logic — e.g. Snapshot® telematics.

**UI card type**: Purple left-border card ("Program")

#### Additional Fields

| Property | Type | Description | isLocalized |
|---|---|---|---|
| `ProgramName` | string (required) | e.g. "Snapshot®" | — |
| `ProgramDescription` | richText | How the program works | yes |
| `MeasurementPeriod` | string | e.g. "6 months" | — |
| `ScoringFactors` | richText | What is measured and how it affects the discount | yes |
| `ParticipationDiscount` | string | Immediate discount for enrolling, e.g. "Up to 10%" | — |
| `RenewalDiscount` | string | Behavior-based discount at renewal, e.g. "Up to 30%" | — |
| `ProfileEstimate` | string | Estimated savings for a typical profile, e.g. "15–22% for low-mileage weekend profiles" | — |
| `EnrollmentAction` | string | CTA label, e.g. "Enroll in Snapshot" | — |

#### UI → Field Mapping

| Opal UI element | CMS field |
|---|---|
| Program description | `ProgramDescription` |
| Enrollment discount table row | `ParticipationDiscount` |
| Renewal discount table row | `RenewalDiscount` |
| Measurement period | `MeasurementPeriod` |
| Scoring factors (positive/negative chips) | `ScoringFactors` |
| Profile savings estimate | `ProfileEstimate` |
| CTA button | `EnrollmentAction` |

---

### 7. `PrgvProcedure` — Progressive: Procedure

**Description**: Step-by-step procedure content for claims intake, enrollment flows, and other consultant-guided processes.

**UI card type**: Orange left-border card ("Process / Claim Intake")

#### Additional Fields

| Property | Type | Description | isLocalized |
|---|---|---|---|
| `ProcedureType` | string (required) | e.g. "Liability Claim Intake", "Glass Claim Filing", "Snapshot Enrollment" | — |
| `Steps` | richText | Numbered steps the consultant follows | yes |
| `RequiredInfo` | richText | Information to gather from the customer | yes |
| `RequiredDocuments` | richText | Documents the customer must provide | yes |
| `ResponseTimeline` | string | e.g. "Claims contact within 24 hours" | — |
| `CtaLabel` | string | e.g. "Open Liability Claim" | — |

#### UI → Field Mapping

| Opal UI element | CMS field |
|---|---|
| Procedure type heading | `ProcedureType` |
| Step instructions | `Steps` |
| Required info checklist | `RequiredInfo` |
| Document checklist | `RequiredDocuments` |
| Timeline note | `ResponseTimeline` |
| CTA button | `CtaLabel` |

---

### 8. `PrgvLifeEvent` — Progressive: Life Event

**Description**: Life event transition rules with multi-policy impact — student away, new driver, home purchase, marriage, etc.

**UI card type**: Teal left-border card ("Life Event")

#### Additional Fields

| Property | Type | Description | isLocalized |
|---|---|---|---|
| `LifeEventType` | string (enum, required) | StudentAway / NewDriverAdded / HomePurchase / Marriage / VehicleGaragedOutOfState | — |
| `AutoChanges` | richText | Required changes to the auto policy | yes |
| `HomeChanges` | richText | Required changes to the homeowners/renters policy | yes |
| `EligibilityRequirements` | richText | Conditions that must be met to apply this guidance | yes |
| `JurisdictionNote` | richText | State-specific transition rules or regulatory requirements | yes |
| `RequiredActions` | richText | Specific steps the consultant must take during the call | yes |

#### UI → Field Mapping

| Opal UI element | CMS field |
|---|---|
| Life event heading | `LifeEventType` (display label) |
| Auto policy section | `AutoChanges` |
| Home policy section | `HomeChanges` |
| Eligibility note | `EligibilityRequirements` |
| Jurisdiction / state note | `JurisdictionNote` |
| Consultant action checklist | `RequiredActions` |

---

## 10 Demo Scenarios — Opal UI to CMS Field Mapping

### Scenario 01 — Rental Reimbursement
**Taxonomy**: Personal Auto / Coverage Options / FL / Platinum

**Q1**: Car in shop for hail — rental coverage?
**A1 content type**: `PrgvBenefit`
- `PrimaryLimit` = "$50/day" (Platinum override; master = "$30/day")
- `SecondaryLimit` = "30 days" (Platinum override; master = "21 days")
- `Vendors` = "Enterprise, Hertz, National"
- `SourceLabel` = "Auto Rental – Platinum Tier"

**Q2**: Can rental be pre-authorized before estimate?
**A2 content type**: `PrgvBenefit` (pre-auth variant)
- `Procedure` = "24-hour pre-authorization window"
- `EnrollmentAction` = "Start Pre-Auth"

---

### Scenario 02 — Storm / Tree Damage
**Taxonomy**: Homeowners / Hail / FL

**Q1**: Tree fell on fence during hail storm — coverage?
**A1 content type**: `PrgvCoverageRule` (FL override)
- `CoreDefinition` = Other Structures: up to 10% of Dwelling A limit (inherited from master)
- `DeductibleRules` = debris removal sub-limit $500 (FL override; master = $1,000)
- `StateDisclosure` = FL Storm Endorsement required for wind/hail claims
- Source chips: "HO Other Structures", "FL Storm Endorsement"

**Q2**: Tree also hit the car — same claim?
**A2 content types**: Multi-source assembly — `PrgvCoverageRule` (Homeowners) + `PrgvCoverageRule` (Personal Auto)
- HO item `ExclusionText`-equivalent: vehicle damage excluded from Other Structures
- Auto item `CoreDefinition`: fallen object / tree covered under Comprehensive
- Auto item `DeductibleRules`: separate deductible independent of HO claim

---

### Scenario 03 — Personal Property Theft from Vehicle
**Taxonomy**: Personal Auto + Homeowners / Coverage Options / National

**Q1**: Laptop and camera stolen from car — auto or home covers it?
**A1 content types**: Multi-source assembly — `PrgvExclusionRule` (Auto) + `PrgvCoverageRule` (HO Off-Premises)
- Auto `ExclusionText`: personal property inside vehicle excluded (all tiers)
- Auto `RedirectNote`: → Homeowners off-premises personal property coverage
- HO `CoreDefinition`: off-premises personal property up to 10% of personal property limit
- HO `DeductibleRules`: ACV unless Replacement Cost endorsement active

**Q2**: Camera kit ~$4,000 — needs scheduled endorsement?
**A2 content type**: `PrgvBenefit` (Scheduled Personal Articles)
- `BenefitDescription`: agreed value — no depreciation applied at claim
- `Procedure`: appraisal or receipt required for items >$1,000
- `EnrollmentAction`: "Get Scheduled Articles Quote"

---

### Scenario 04 — Roadside Assistance
**Taxonomy**: Personal Auto / Roadside Assistance / FL / Platinum

**Q1**: Breakdown on I-4 — roadside covered? How to request?
**A1 content type**: `PrgvBenefit`
- `Vendors`: "Towing, Lockout, Fuel Delivery, Battery Jump" (Platinum; master = Towing only)
- `PrimaryLimit`: "$100 per incident" (Platinum override; master = "$75")
- `Procedure`: dispatch via 1-800-776-2778 or Progressive app
- `ReimbursementWindow`: "72 hours for out-of-pocket reimbursement"

**Q2**: Shop is 22 miles away — does distance affect coverage?
**A2 content type**: `PrgvBenefit` (overage clarification)
- `Procedure`: $100 limit applies to cost, not distance; overage is customer's responsibility
- `EnrollmentAction`: "Submit Reimbursement"

---

### Scenario 05 — Snapshot® Telematics
**Taxonomy**: Personal Auto / Tools / National

**Q1**: Telematics tools to lower premium?
**A1 content type**: `PrgvProgram`
- `ProgramName`: "Snapshot®"
- `MeasurementPeriod`: "6 months (app or plug-in)"
- `ParticipationDiscount`: "Up to 10% — applied at enrollment"
- `RenewalDiscount`: "Up to 30% — behavior-based at renewal"
- `ScoringFactors`: Hard Braking (−), Late Night (−), Low Mileage (+), Smooth Accel (+)

**Q2**: Weekend / low-mileage driver — good Snapshot score?
**A2 content type**: `PrgvProgram` (scoring detail)
- `ScoringFactors`: low mileage / weekend driving = positive signal; hard braking / midnight–4am = negative
- `ProfileEstimate`: "15–22% savings for low-mileage weekend profiles"

---

### Scenario 06 — Missing Discounts
**Taxonomy**: Personal Auto + Homeowners / Discounts / FL

**Q1**: What discounts is John missing?
**A1 content type**: `PrgvDiscount` × 3 (assembled by filter: enrolled=false AND eligible=true)
- Item 1 `DiscountName`/`SavingsRange`: Snapshot® Telematics / Up to 30%
- Item 2 `DiscountName`/`SavingsAmount`: Paperless Billing / $5/month
- Item 3 `DiscountName`/`SavingsRange`: Pay-in-Full / Up to 8%
- Enrollment status read from CRM at runtime — NOT in CMS

**Q2**: Apply paperless + pay-in-full now?
**A2 content type**: `PrgvDiscount` (enrollment steps)
- `EnrollmentSteps` (paperless): enroll via online account or agent-assisted
- `EnrollmentSteps` (pay-in-full): process full payment; discount auto-confirmed
- `TimingNote`: both effective at next billing cycle

---

### Scenario 07 — Liability After Accident
**Taxonomy**: Personal Auto / Coverage Options / National / Platinum

**Q1**: Fender bender — liability limits?
**A1 content type**: `PrgvCoverageRule`
- `CoreDefinition`: Bodily Injury $100K/$300K (Platinum; master = $50K/$100K), Property Damage $100K, Med Pay $5K
- `Exceptions` (consultant guidance): no admission of fault, documentation, referral to claims

**Q2**: How to open a claim?
**A2 content type**: `PrgvProcedure`
- `ProcedureType`: "Liability Claim Intake"
- `RequiredInfo`: police report, other party contact + insurance, scene photos, witness info
- `ResponseTimeline`: "Claims contact within 24 hours of filing"
- `CtaLabel`: "Open Liability Claim"

---

### Scenario 08 — Water Damage / Burst Pipe
**Taxonomy**: Homeowners / Coverage Options / FL

**Q1**: Pipe burst — water damage covered?
**A1 content types**: Multi-source assembly — `PrgvCoverageRule` (HO Water, FL) + `PrgvExclusionRule` (Flood)
- HO `CoreDefinition`: sudden & accidental water covered (dwelling + contents) — inherited from master
- HO `StateDisclosure`: FL sinkhole investigation may trigger for foundation claims (FL override)
- Flood `ExclusionText`: flood / surface water intrusion excluded (all tiers, all states)
- Flood `ReferralProduct`: "NFIP or private flood endorsement"

**Q2**: Should he look at a flood policy?
**A2 content type**: `PrgvRecommendation`
- `GapNarrative`: Central FL elevated weather-related flood risk
- `ComparisonTable`: NFIP ~$900–$1,400/yr vs. private flood
- `TriggerCondition`: FEMA zone data injected from CRM zip code lookup — NOT stored in CMS
- `CtaLabel`: "Start Flood Quote"

---

### Scenario 09 — Umbrella Coverage Upsell
**Taxonomy**: Personal Auto + Homeowners / Upsell / National

**Q1**: Enough liability protection or recommend umbrella?
**A1 content type**: `PrgvRecommendation`
- `RecommendationType`: Upsell
- `TriggerCondition`: "Auto BI limit < $500K net worth threshold" — net worth from CRM
- `GapNarrative`: combined auto BI cap $300K; recommend coverage = net worth
- `CoverageAdditions`: Excess Liability, Personal Injury (libel/slander), Worldwide Coverage, Rental Property Liability
- `PricingNote`: "~$19/month for $1M umbrella"
- `CtaLabel`: "Get Umbrella Quote"

**Q2**: What does umbrella cover that home + auto don't?
**A2 content type**: `PrgvRecommendation` (gap detail)
- `ComparisonTable`: auto BI $300K + $1M, home liability $100K + $1M, PD $100K + $1M
- `UniqueCoverages`: Personal injury / libel / slander, Worldwide liability, Rental property incidents

---

### Scenario 10 — College Student Transition
**Taxonomy**: Personal Auto + Homeowners / Transition Guidelines / FL → OH

**Q1**: Daughter moving to Ohio for college — what changes?
**A1 content type**: `PrgvLifeEvent`
- `LifeEventType`: StudentAway
- `AutoChanges`: update garaging to OH; FL registration note for FL-titled vehicles
- `HomeChanges`: dorm contents — off-premises personal property limit (10%)
- `EligibilityRequirements`: full-time student status required to maintain FL policy base
- `JurisdictionNote`: FL → OH garaging: premium recalculation + registration within 30 days

**Q2**: 3.8 GPA — Good Student discount?
**A2 content type**: `PrgvDiscount`
- `DiscountName`: "Good Student Discount"
- `GpaRequirement`: "3.0 GPA or Honor Roll certification"
- `Documentation`: current transcript, school honor roll letter, enrollment confirmation
- `TimingNote`: "Applies to insured vehicle at next renewal"
- `SavingsRange`: "Up to 8% on vehicle premium"

---

## richText Field Behavior

Fields typed `richText` return `{ html: string }` from the Optimizely Graph SDK. In React, render with `dangerouslySetInnerHTML={{ __html: field.html }}`. The CMS editor authors these as rich text blocks; the SDK serializes them to HTML on read.

## Taxonomy Routing Pattern

The agent resolves content items using a two-pass strategy:

1. **Exact match**: LOB + Topic + Jurisdiction (all must match)
2. **National fallback**: if no state-specific item found, fall back to `Jurisdiction = National`

Tier overrides are separate content items — a Platinum item contains the overridden limits alongside the master values for display. The master/standard values are stored in `Master*` fields (e.g. `MasterPrimaryLimit`) to allow the UI to show both tiers in a single response.
