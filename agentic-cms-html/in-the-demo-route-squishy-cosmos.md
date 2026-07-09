# Plan: CMS Content Model Reference Artifact

## Context

Before building out the 10 demo scenarios in code, the team needs a reference document that defines the "expected" response for each Q1→Q2 flow and maps every fragment of that response to the CMS content model field that produces it. This mirrors the logic of `/demo/cms/page.tsx` (Face vs. Brain), but as a static, shareable spec covering all 10 scenarios — giving a clear build target before any UI work starts.

## Output

A published HTML Artifact: a scrollable reference document with a sticky scenario nav (01–10). Each scenario shows:

1. **Header** — scenario number, title, taxonomy tags (LOB / Topic / Jurisdiction)
2. **Q1 exchange** — quoted question → two-column split:
   - **Face (left):** response card exactly as it would appear in the Consultant Workspace (h4 headings, bold terms, sources chips, action buttons where applicable)
   - **Brain (right):** dark-bg panel with content type badge + field blocks (monospace dot-path keys, values, override/master badges)
3. **Q2 exchange** — follow-up question → same two-column split

## Design Plan

- **Palette:** BG `#EEF2F7` (cool blue-tinted, not warm cream), surface `#FFFFFF`, text `#0B1C2E`, accent `#007BC7` (Progressive brand), brain bg `#0D1B28`, brain mono `#5BC8F5`
- **Type:** `system-ui / -apple-system / 'Segoe UI'` body; `'Courier New' / Consolas` for all CMS field keys — schema notation looks like code because it is
- **Field stripe colors (semantic):** blue = taxonomy, green = core coverage, amber = limits/rules, purple = procedure/eligibility, red = exclusions
- **Tags:** LOB (blue), Topic (green), Jurisdiction (purple)
- **Content type badges:** per type (CoverageComponent, BenefitComponent, ExclusionComponent, DiscountComponent, ProgramComponent, LifeEventComponent, RecommendationComponent)
- **Both light + dark themes** via CSS custom properties

## 10 Scenarios and Their Content Types

| # | Title | LOB | Topic | Juris | Q1 Content Type | Q2 Content Type |
|---|-------|-----|-------|-------|-----------------|-----------------|
| 1 | Rental Reimbursement | Personal Auto | Coverage Options | FL | BenefitComponent (Platinum tier override) | BenefitComponent (pre-auth procedure) |
| 2 | Storm / Tree Damage | Homeowners | Hail | FL | CoverageComponent (HO, FL variation) | Multi-source: CoverageComponent (HO) + CoverageComponent (Auto) |
| 3 | Personal Property Theft | Personal Auto + Homeowners | Coverage Options | National | ExclusionComponent (Auto) + CoverageComponent (HO off-premises) | BenefitComponent (Scheduled Articles) |
| 4 | Roadside Assistance | Personal Auto | Roadside Assistance | FL | BenefitComponent (Platinum, dispatch) | BenefitComponent (overage / reimbursement) |
| 5 | Snapshot Telematics | Personal Auto | Tools | National | ProgramComponent (enrollment + discounts) | ProgramComponent (scoring factors) |
| 6 | Missing Discounts | Personal Auto + Homeowners | Discounts | FL | DiscountComponent × 3 (unenrolled, CRM-filtered) | DiscountComponent (enrollment procedure) |
| 7 | Liability After Accident | Personal Auto | Coverage Options | National | CoverageComponent (Liability, Platinum limits) | ProcedureComponent (Claims Intake) |
| 8 | Water Damage | Homeowners | Coverage Options | FL | CoverageComponent (HO water, FL) + ExclusionComponent (Flood) | RecommendationComponent (Flood Insurance) |
| 9 | Umbrella Upsell | Personal Auto + Homeowners | Upsell | National | RecommendationComponent (gap analysis) | RecommendationComponent (coverage gap detail) |
| 10 | College Student Transition | Personal Auto + Homeowners | Transition Guidelines | FL → OH | LifeEventComponent (student away) | DiscountComponent (Good Student) |

## Verification

Open the published Artifact URL — confirm all 10 scenarios render cleanly, the brain side shows monospace field paths with correct override badges, response cards match the established Consultant Workspace card format (h4 + p + sources), and both light/dark themes are legible.
