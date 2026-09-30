# Visual 2 build: CCO Employer Wellness Portal (Visual Builder + clinical variants)

## Context
Marvin needs a rehearsed 6–8 min Visual Builder micro-demo for CCO's founders
(Dr. Kay = live clinical copy edit, Dawn = male/female cohort variants).
`000-build/CCO Visual 2 Build Guide…md` §2 describes the CMS build, but the repo only has
`BlankExperience`, `BlankSection`, `Page`, `RichTextBlock`. So the work is: content types
+ renderers in code, then CMS content + variant setup.

Decisions (from user): model built **in code**, user runs the push manually
(`npm run cms:push`); **placeholders** for real names/compliance claims; variant
mechanism **decided by a Phase 0 spike**.

## Conventions to reuse (verified in repo)
- Element pattern: `cms/RichText.tsx` — `contentType({ baseType:'_component', compositionBehaviors:['elementEnabled'] })`,
  default component reads `content.__composition` and spreads `pa(block)` on the root, `pa('Field')` on each field.
- Resolver key === content-type key (`RichTextBlock`) in `cms/registry.ts` (3 calls: `initContentTypeRegistry` via `registeredContentTypes`, `initDisplayTemplateRegistry`, `initReactComponentRegistry`).
- `cms/blockWidth.ts` (`blockWidth()`, `widthClass()`), `cms/shared.ts` (`OptiLink`, `ctaHref`), `cms/BlankSection.tsx` / `BlankExperience.tsx` / `wrappers.tsx` render rows/columns — reuse, no new section type.
- Edit-guard for CTA links (inert anchor when editing) per `docs/mossy-purring-breeze.md`.
- Catch-all `app/[locale]/[[...slug]]/page.tsx` already serves any CMS path, so `/pilot/acme-health` needs no route code.
- `scripts/cms-push.mjs` globs `cms/**/*.tsx` (keep helper files `.ts`).

## Phase 1: Content model in code (new files in `cms/`)
All `_component` + `elementEnabled`, each with `pa()` overlays and Tailwind styling matching `app/visuals/3-tier-arch` (teal/slate).

1. `EmployerHeaderBlock.tsx` — `EmployerLogo` (image/content ref), `CoBrandText` (string), `AccentColor` (string, hex). Accent exposed as a CSS variable for sibling styling. Placeholder logo via `public/` SVG.
2. `ClinicalHeroBlock.tsx` — `Headline`, `MotivationalBody` (richText, via `RichText` from `@optimizely/cms-sdk/react/richText`), `CtaButtonText`, `CtaDeepLink` (string), optional hero image property. CTA is an inert anchor in edit mode.
3. `ClinicalTrustBlock.tsx` — `TherapeuticModelBadge` (string), `PrivacyDisclaimer` (richText), `CrisisNotice` (richText, generic 988 wording).
4. `HygiaChatCardBlock.tsx` — **not in the guide but required by Step 3's 60/40 right column**: a static simulated chat snippet (intro message string properties, reassuring copy).
5. Register all four in `cms/registry.ts` (`registeredContentTypes` + resolver keys). Display templates: none (BlankSection suffices). `blockWidth()` only if layout needs it.
6. Dropped from the guide on purpose: `ClientSlug` / `AudienceSegment` content properties. Slug is the page URL segment; cohort is the variant. Less model, same demo. (Revisit only if the spike needs a property.)

Placeholders (per user): "Acme Health" as employer; clinician shown as "[Clinical Lead]" / "Clinical Oversight led by [Chief Medical Officer]"; compliance line as "[Privacy statement placeholder, confirm wording with CCO]" rather than asserting HIPAA/"never shared" claims. Seed/demo text must say placeholders clearly so nothing reads as real CCO claims.

**Handoff:** user runs `npm run cms:push` (and `cms:check` to confirm the four types exist).

## Phase 2: Variant spike (user-assisted, CMS UI) — decides mechanism
Goal: pick the simplest mechanism that shows Default/Male/Female live and is reliable on a shared screen. Timebox 30 min. Test in order:

**A. Content/experience variations.** SDK supports `getContentByPath(path, { variation: { include: 'SOME', value: [id] } })` (`docs/5-fetching.md:168`). On the demo experience, create a variation in Visual Builder; note the variation id.
  - Pass if: (1) editor shows a switcher usable on screen; (2) Graph returns the variation for a request with the id (check via `/admin` or a temp query); (3) we can map `?variant=male|female` → id.
  - Needs code (Phase 3): catch-all reads `searchParams.variant`, maps to variation id (env/const), passes `variation` option. Note this makes the catch-all dynamic on the query param (it already is dynamic per README).

**B. Personalization/audience rules.** Only if the tenant exposes audiences in VB. Likely requires Optimizely Personalization/Web Experimentation (`OptimizelyActivation` is off by default). Record availability; don't build unless A fails and it's clearly present.

**C. Fallback (always works):** add three optional override fields to `ClinicalHeroBlock` (`MaleHeadline/MaleBody/MaleCtaText`, `FemaleHeadline/…`); component picks by `?variant=` (passed from page via searchParams → client-safe prop). Editor shows all three copy sets in one block; Dr. Kay/Dawn story still holds ("one template, cohort rules"). Adding fields later is non-breaking, so C can be added after the spike only if A/B fail.

**Decision rule:** A if it passes all three checks, else C. B only as a bonus. Record the outcome in this plan's follow-up.

## Phase 3: Wire the chosen mechanism (code)
- If A: small change to `app/[locale]/[[...slug]]/page.tsx` (`loadContent` takes the variation option; `searchParams` added to Props; cache key includes variant). Keep `generateMetadata` consistent.
- If C: extend `ClinicalHeroBlock` + pass `variant` down (hero is rendered by the SDK from the composition; simplest is reading `variant` via a tiny client component using `useSearchParams`, with Suspense boundary, or a `?variant=` cookie-free server prop through `OptimizelyComponent` context). Choose when we get there.
- Either way: add a visible "cohort" chip/ribbon under the hero for the demo so the audience sees what changed.

## Phase 4: CMS content (user in UI; I supply copy)
Guide Steps 3–5 executed in the CMS (no code): `/pilot/` container page → `[Demo] Acme Health - Wellness Portal` BlankExperience; Section 1 (1 col: EmployerHeader), Section 2 (2 col 60/40: ClinicalHero + HygiaChatCard), Section 3 (1 col: ClinicalTrust). I'll provide a copy sheet in `000-build/` (Default / Male / Female headline, body, CTA text, image direction). Guide fixes included: define the male CTA ("Start 3-Minute Performance Reset") and female CTA, which Step 5 omits. Two placeholder hero images.

## Phase 5: Stage and verify
Guide Step 6 + checklist. Also reconcile Visual 3: its GraphQL query uses `EmployerLandingPage`/`clientSlug`/`heroHeadline`, which do not exist. Either update the Visual 3 doc to query `ClinicalHeroBlock`/`EmployerHeaderBlock` or add a thin `EmployerLandingPage` type. Flag to user; do not change silently.

## Verification
1. `npx tsc --noEmit` and `npx eslint cms/` clean for new files (note: `app/visuals/3-tier-arch/page.tsx` still has lint errors from the earlier review, unrelated).
2. User pushes; `npm run cms:check` lists the four new types.
3. Create the experience; open in Visual Builder, confirm on-page-edit overlays attach to every field (click-to-edit headline/body).
4. Publish; refresh incognito `/pilot/acme-health`, confirm edit shows within one refresh.
5. Hit `?variant=male` and `?variant=female`; confirm headline, CTA and image change, default view unchanged.
6. Rehearse run-of-show against the guide's timing (Action A 2.5 min, Action B 2.5 min).
