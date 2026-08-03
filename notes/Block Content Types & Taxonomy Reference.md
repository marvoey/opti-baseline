# Block Content Types & Taxonomy Reference

This document covers the four atomic block content types used in the Progressive knowledge base and the shared taxonomy library (`lib/cms/taxonomy.ts`) that drives their enum values.

---

## Taxonomy Library — `lib/cms/taxonomy.ts`

All enum values stored on content properties are **numeric string codes** (`"0"`, `"1"`, …). The taxonomy file is the canonical decode table used by both content type definitions and React components.

### Exported helpers

| Export | Purpose |
|---|---|
| `taxonomyEnums(map)` | Converts a taxonomy map into the `{ value, displayName }[]` array expected by `contentType()` enum definitions |
| `labelFor(map, code)` | Decodes a stored code to its display name; returns the raw code if not found |
| `abbrFor(map, code)` | Like `labelFor` but returns the two-letter abbreviation (falls back to display name) |

### `RULE_CATEGORY`

Used on: `PrgvHandlingNoteBlock`

| Code | Display Name |
|---|---|
| `"0"` | Severity Flag |
| `"1"` | Escalation Rule |
| `"2"` | State Exception |
| `"3"` | General Handling Note |

### `SEVERITY_LEVEL`

Used on: `PrgvHandlingNoteBlock`

| Code | Display Name |
|---|---|
| `"0"` | Low Priority |
| `"1"` | Medium Priority |
| `"2"` | High Priority |
| `"3"` | Critical - Stop/Review |

### `TARGET_AUDIENCE`

Used on: `PrgvStandardInstructionBlock`

| Code | Display Name |
|---|---|
| `"0"` | Tier 1 Service |
| `"1"` | Tier 2 Service |
| `"2"` | Tier 1 Claims Intake |
| `"3"` | Tier 2 Claims Support |
| `"4"` | Escalation Desk |
| `"5"` | Retention |
| `"6"` | Supervisor Queue |
| `"7"` | Agency Support |

### `LINE_OF_BUSINESS`

Used on: all four block types

| Code | Display Name |
|---|---|
| `"0"` | Personal Auto |
| `"1"` | Commercial Auto |
| `"2"` | Homeowners |
| `"3"` | Renters |
| `"4"` | Motorcycle / ATV |
| `"5"` | Boat / Watercraft |
| `"6"` | RV / Trailer |
| `"7"` | Umbrella Policy |

### `US_JURISDICTION`

Used on: all four block types. 51 entries covering all 50 US states plus the District of Columbia (`"0"` = Alabama … `"50"` = Wyoming). Each entry has a `displayName` and a two-letter `abbr`. Use `abbrFor()` when space is constrained.

---

## Block Content Types

All four types share these characteristics:

- `baseType: "_component"` — they are composable blocks, not standalone pages
- `compositionBehaviors: ["sectionEnabled", "elementEnabled"]` — can be placed inside Visual Builder sections or as inline elements
- Taxonomy fields live in the **Taxonomy** property group and are all marked `indexingType: "searchable"` so Optimizely Graph can filter on them
- `Category` is a `contentReference` to a `PrgvCategory` node, enabling the hierarchical taxonomy tree

---

### `PrgvGlobalComplianceDisclosure`

**CMS key:** `prgv_GlobalComplianceDisclosure`  
**File:** `cms/PrgvGlobalComplianceDisclosure.tsx`  
**Purpose:** A specialized compliance block managed by Legal — full legal disclosure text with jurisdiction and LOB scoping.

#### Properties

| Property | Type | Required | Group | Notes |
|---|---|---|---|---|
| `DisclosureName` | `string` | Yes | — | Indexed, searchable |
| `EffectiveDate` | `dateTime` | No | — | Indexed, searchable |
| `LegalText` | `richText` | Yes | — | Indexed, searchable |
| `LineOfBusiness` | `array (selectMany)` | No | Taxonomy | Enum from `LINE_OF_BUSINESS`; multi-select |
| `ApplicableState` | `string (selectOne)` | No | Taxonomy | Enum from `US_JURISDICTION` |
| `Jurisdiction` | `string (selectOne)` | No | Taxonomy | Enum from `US_JURISDICTION`; distinct from `ApplicableState` |
| `Category` | `contentReference` | No | Taxonomy | Allows `PrgvCategory` types only |

> `ApplicableState` and `Jurisdiction` both draw from `US_JURISDICTION` but serve different semantic roles: `Jurisdiction` is the regulatory/legal jurisdiction that governs the disclosure, while `ApplicableState` is the state where the disclosure is operationally surfaced to agents.

#### Visual design
Red left border (`border-l-4 border-red-600`) signals legal/compliance weight. Jurisdiction renders as plain text; `ApplicableState` renders as a green badge; LOB tags render as blue badges.

---

### `PrgvHandlingNoteBlock`

**CMS key:** `prgv_HandlingNoteBlock`  
**File:** `cms/PrgvHandlingNoteBlock.tsx`  
**Purpose:** Atomic blocks for severity flags, escalation rules, and state exceptions. Used to surface operational warnings inline within procedures.

#### Properties

| Property | Type | Required | Group | Notes |
|---|---|---|---|---|
| `NoteContent` | `richText` | Yes | — | Indexed, searchable |
| `LineOfBusiness` | `array (selectMany)` | No | Taxonomy | Enum from `LINE_OF_BUSINESS` |
| `ApplicableState` | `string (selectOne)` | No | Taxonomy | Enum from `US_JURISDICTION` |
| `RuleCategory` | `string (selectOne)` | No | Taxonomy | Enum from `RULE_CATEGORY` |
| `SeverityLevel` | `string (selectOne)` | No | Taxonomy | Enum from `SEVERITY_LEVEL` |
| `Category` | `contentReference` | No | Taxonomy | Allows `PrgvCategory` types only |

#### Visual design
Amber border and background (`border-amber-300 bg-amber-50`). Severity renders as an amber badge, RuleCategory as a gray badge, ApplicableState as green, LOBs as blue.

---

### `PrgvScriptingBlock`

**CMS key:** `prgv_ScriptingBlock`  
**File:** `cms/PrgvScriptingBlock.tsx`  
**Purpose:** Verbatim language the agent must read out loud. This is the tightest-scoped block — no rule/severity metadata, just the script and its targeting context.

#### Properties

| Property | Type | Required | Group | Notes |
|---|---|---|---|---|
| `VerbatimScript` | `richText` | Yes | — | Indexed, searchable |
| `LineOfBusiness` | `array (selectMany)` | No | Taxonomy | Enum from `LINE_OF_BUSINESS` |
| `ApplicableState` | `string (selectOne)` | No | Taxonomy | Enum from `US_JURISDICTION` |
| `Category` | `contentReference` | No | Taxonomy | Allows `PrgvCategory` types only |

#### Visual design
Blue border and background (`border-blue-300 bg-blue-50`). Script text renders bold (`font-medium`) to distinguish it as verbatim language. Taxonomy badges shown only when present.

---

### `PrgvStandardInstructionBlock`

**CMS key:** `prgv_StandardInstructionBlock`  
**File:** `cms/PrgvStandardInstructionBlock.tsx`  
**Purpose:** General step-by-step guidance for an operational procedure. The most broadly applicable block type; adds `TargetAudience` to scope instructions by agent role.

#### Properties

| Property | Type | Required | Group | Notes |
|---|---|---|---|---|
| `InstructionText` | `richText` | Yes | — | Indexed, searchable |
| `LineOfBusiness` | `array (selectMany)` | No | Taxonomy | Enum from `LINE_OF_BUSINESS` |
| `ApplicableState` | `string (selectOne)` | No | Taxonomy | Enum from `US_JURISDICTION` |
| `Category` | `contentReference` | No | Taxonomy | Allows `PrgvCategory` types only |
| `TargetAudience` | `string (selectOne)` | No | Taxonomy | Enum from `TARGET_AUDIENCE`; indexed |

#### Visual design
No background tint — renders inline within the page flow. Audience label shown in small caps (`uppercase tracking-wide text-gray-500`), state as a green badge, LOBs as blue badges.

---

## Taxonomy Field Summary Across Block Types

| Taxonomy Field | GlobalComplianceDisclosure | HandlingNoteBlock | ScriptingBlock | StandardInstructionBlock |
|---|:---:|:---:|:---:|:---:|
| `LineOfBusiness` | Multi-select | Multi-select | Multi-select | Multi-select |
| `ApplicableState` | Single-select | Single-select | Single-select | Single-select |
| `Jurisdiction` | Single-select | — | — | — |
| `RuleCategory` | — | Single-select | — | — |
| `SeverityLevel` | — | Single-select | — | — |
| `TargetAudience` | — | — | — | Single-select |
| `Category` (ref) | Yes | Yes | Yes | Yes |

---

## Design Decisions

**Numeric string codes, not slug strings.** Opal AI receives short numeric tokens. The taxonomy file decodes them at render time via `labelFor()`. This keeps stored values compact and lets display names change without a data migration.

**`ApplicableState` vs `Jurisdiction` on `GlobalComplianceDisclosure`.** Both fields draw from `US_JURISDICTION` but are intentionally separate: `Jurisdiction` is the regulatory authority governing the disclosure; `ApplicableState` is where the disclosure is operationally shown to agents. A disclosure governed by New York law might surface in a New Jersey agent's view.

**`PrgvCategory` content reference.** All blocks carry a `Category` field pointing to a `PrgvCategory` page node. This enables a hierarchical taxonomy tree in the CMS for groupings that don't fit a flat enum (e.g., product sub-categories, regional groupings).

**`TargetAudience` is single-select on blocks.** Unlike the article-level taxonomy (which historically used multi-select), block-level audience targeting is single-select to keep individual blocks tightly scoped. Compose multiple blocks to cover multiple audiences.
