# Plan: Align Content Types with policies.json for CMS Import

## Context

The approach for the Resolve intent has been clarified: every response is composed of exactly **1 of each of the 4 copy types** from `Compliant_Copy_Structuring_Resolve.md`. The actual content data lives in `app/[locale]/kb-workspace/_data/policies.json` (624 entries), which has a simple, flat schema that does not match the current complex Prgv* content type definitions.

**The mismatch:** The existing content types (`PrgvCoverageRule`, `PrgvBenefit`, `PrgvExclusionRule`, `PrgvProcedure`) bundle multiple richText fields together (e.g., `PrgvCoverageRule` has `CoreDefinition`, `DeductibleRules`, `Exceptions`, and `StateDisclosure` all on one type). The `policies.json` is atomic — each entry is one block, one copy type, one `RichTextValue`. These are incompatible shapes.

---

## What policies.json actually looks like

Each of the 624 entries has exactly these 5 fields:

```json
{
  "BlockType": "KnowledgeRuleBlock",         // KnowledgeRuleBlock | ConsultantScriptBlock | ComplianceDisclaimerBlock
  "InternalName": "FL - Hail Deductible",
  "Taxonomy": { "LOB": "Homeowners", "Topic": "Hail/Storm Damage", "Jurisdiction": "FL" },
  "CopyType": "Jurisdictional Override",      // Core Principle | Jurisdictional Override | Statutory Disclosure | Procedural Safeguard
  "RichTextValue": "<p>...</p>"
}
```

Distribution of the 624 entries across 6 topics:
- **Core Principle** (`KnowledgeRuleBlock`, `Jurisdiction: National`) — 6 entries (1/topic)
- **Procedural Safeguard** (`ConsultantScriptBlock`, `Jurisdiction: National`) — 6 entries (1/topic)
- **Jurisdictional Override** (`KnowledgeRuleBlock`, `Jurisdiction: [state]`) — 306 entries (51/topic)
- **Statutory Disclosure** (`ComplianceDisclaimerBlock`, `Jurisdiction: [state]`) — 306 entries (51/topic)

---

## Recommended Approach

### Step 1 — Create 4 lean content types (one per copy type)

Replace the existing over-engineered Prgv* types with 4 new types that mirror the flat `policies.json` schema exactly. Each type has the same field set:

| Field | Type | Notes |
|---|---|---|
| `InternalName` | string | From `policies.json.InternalName` |
| `LOB` | string | From `Taxonomy.LOB` |
| `Topic` | string | From `Taxonomy.Topic` |
| `Jurisdiction` | string | From `Taxonomy.Jurisdiction` — "National" or 2-letter state code |
| `RichTextValue` | richText, localized | From `policies.json.RichTextValue` |

The 4 new content type keys:

| CopyType in JSON | New Content Type Key | File |
|---|---|---|
| `"Core Principle"` | `PrgvCorePrinciple` | `cms/PrgvCorePrinciple.tsx` |
| `"Jurisdictional Override"` | `PrgvJurisdictionalOverride` | `cms/PrgvJurisdictionalOverride.tsx` |
| `"Statutory Disclosure"` | `PrgvStatutoryDisclosure` | `cms/PrgvStatutoryDisclosure.tsx` |
| `"Procedural Safeguard"` | `PrgvProceduralSafeguard` | `cms/PrgvProceduralSafeguard.tsx` |

All 4 use `baseType: '_component'` with `compositionBehaviors: ['elementEnabled']`.

### Step 2 — Register new types in registry.ts

Add all 4 to `registeredContentTypes` and `initReactComponentRegistry` in `cms/registry.ts` (same pattern as Step 1 in the prior session).

### Step 3 — Push content types to CMS

```bash
npm run config:push
```

### Step 4 — Write an import script

Create `scripts/import-policies.mjs` that:
1. Reads `app/[locale]/kb-workspace/_data/policies.json`
2. Maps each entry's `CopyType` → content type key
3. Maps `Taxonomy` → individual `LOB`, `Topic`, `Jurisdiction` fields
4. Calls `mcp__opal-cms__cms_create_content_item` (or the CMS SDK REST client) for each of the 624 entries
5. Logs progress and any errors

The `CopyType → content type key` map:
```js
const TYPE_MAP = {
  'Core Principle':         'PrgvCorePrinciple',
  'Jurisdictional Override': 'PrgvJurisdictionalOverride',
  'Statutory Disclosure':   'PrgvStatutoryDisclosure',
  'Procedural Safeguard':   'PrgvProceduralSafeguard',
};
```

---

## Files to create / modify

- **Create** `cms/PrgvCorePrinciple.tsx`
- **Create** `cms/PrgvJurisdictionalOverride.tsx`
- **Create** `cms/PrgvStatutoryDisclosure.tsx`
- **Create** `cms/PrgvProceduralSafeguard.tsx`
- **Modify** `cms/registry.ts` — add 4 imports + register in both calls
- **Create** `scripts/import-policies.mjs` — import runner

- **Delete** `cms/PrgvCoverageRule.tsx`, `cms/PrgvBenefit.tsx`, `cms/PrgvExclusionRule.tsx`, `cms/PrgvProcedure.tsx`
- **Modify** `cms/registry.ts` — remove the 4 old imports/registrations added in the prior session

---

## Optimizely Graph query pattern (after import)

A single Graph query fetches all 4 copy types for a given `LOB + Topic + Jurisdiction`:

```graphql
{
  core: PrgvCorePrinciple(where: { LOB: "Homeowners", Topic: "Hail/Storm Damage", Jurisdiction: "National" }) { RichTextValue { html } }
  override: PrgvJurisdictionalOverride(where: { LOB: "Homeowners", Topic: "Hail/Storm Damage", Jurisdiction: "FL" }) { RichTextValue { html } }
  disclosure: PrgvStatutoryDisclosure(where: { LOB: "Homeowners", Topic: "Hail/Storm Damage", Jurisdiction: "FL" }) { RichTextValue { html } }
  procedure: PrgvProceduralSafeguard(where: { LOB: "Homeowners", Topic: "Hail/Storm Damage", Jurisdiction: "National" }) { RichTextValue { html } }
}
```

---

## Verification

1. After `config:push`, inspect the 4 new content types in the CMS admin UI to confirm all fields appear.
2. After running the import script, do a spot-check Graph query for one topic (e.g., `LOB: Homeowners, Topic: Hail/Storm Damage, Jurisdiction: FL`) and confirm all 4 copy types are returned.
3. Verify `Jurisdiction: National` fallback works for a state with no override (should not be needed — all 51 jurisdictions are covered per topic in the data).
