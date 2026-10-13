# Implement the UPS 38-Market Build Plan (ups branch)

## Context
`build-instructions/UPS Build Plan on opti-baseline (ups branch).md` describes turning the re-branded baseline into a UPS homepage with native BCP-47 locale routing, a market/service registry, a `SmartCta`, six homepage blocks and an audit CLI. I checked the plan against the repo. Most of it holds, but several snippets would not work as written (listed under "Deviations"). Decisions from the user: **full scope (all 7 steps)**, **homepage = BlankExperience + sections**, **user enables locales in the CMS** (no tool for that here).

## Deviations from the plan doc (fix while implementing)
- **Step 2 proxy already exists** (`proxy.ts`) and matches the plan's logic. It uses `process.env.OPTIMIZELY_DEFAULT_LOCALE || 'en'`. Only change: default to `en-US` if the user's CMS default is `en-US`; keep env-driven. No rewrite.
- **Step 1 generator already exists** (`scripts/generate-locales.mjs`, default `'en'`). No code change except the fallback default; just re-run it after the user enables locales.
- **EnhancedAppTeaser uses `useState` in a server file** that also calls `getPreviewUtils`. Split: `cms/EnhancedAppTeaser.tsx` (contentType + server component) renders a `'use client'` widget at `app/_components/QuoteTrackTabs.tsx`. Same for any other interactive block (SolutionsSection segment toggle, Accordion).
- **Components get only `content`**, not a `locale` prop. Derive locale from `content._metadata?.locale` (fallback `DEFAULT_LOCALE`) and pass it to `SmartCta`.
- **`cms/components/SmartCta.tsx` would match the `./cms/**/*.tsx` push glob.** Put helpers outside the glob: `app/_components/SmartCta.tsx` and `lib/markets.ts` (see `cms/shared.ts` comment on this convention).
- **Audit script can't import `lib/markets.ts` from `.mjs`**, has raw newlines inside string literals, and stubs `exists = true`. Rewrite: keep market data in `lib/markets.data.json`, imported by both `lib/markets.ts` and `scripts/cms-market-audit.mjs`; the script calls `/v1/locales` (same auth as `generate-locales.mjs`) and reports markets whose `cmsLocales` aren't enabled; optionally a Graph check that a home page exists per locale. Add `"cms:audit"` to `package.json`.
- Plan's `Page` content-area route is not used; blocks must be `elementEnabled`/`sectionEnabled` for Visual Builder.

## Steps

### 1. Section 2 fixes (baseline)
- `app/_components/LanguageSwitcher.tsx`: trigger `text-white/80 hover:text-white` -> `text-blue-950 hover:underline`; dropdown active already `text-blue-800 font-bold`.
- `app/_components/Badge.tsx`: replace dead `cibc-*` classes (gold: `bg-blue-200/25 text-blue-950 border-blue-200/60`, blue/teal: `bg-blue-800/10 text-blue-800 border-blue-800/30`; map mint/rust to taupe/red tokens `ups-taupe`, `ups-red`). Used by `app/admin/*`, keep `BadgeColor` names so callers don't break.
- `package.json`: name `nextjs-banner` -> `ups-baseline`; remove dead `seed:hero`; add `cms:audit`.
- `app/_components/DevQuickLinks.tsx`: swap icon to `siteConfig.logoSrc`, ring `ring-green-400` -> `ring-blue-200`, alt text "UPS quick links"; drop links to non-existent routes (`/assemble`, `/content-library`, `/cms-admin`) after confirming they don't exist.

### 2. Locales (user-driven)
- User enables the plan's locales in the CMS (en-US default, es-US, en-CA, fr-CA, de-DE, de-CH, fr-CH, es-MX, en-GB, ar-SA, fr-DZ, ar-DZ, ar-AE, then the rest of the 38) and confirms default key.
- Set `OPTIMIZELY_DEFAULT_LOCALE` accordingly (`.env`, `.env.example`, fallback in `proxy.ts` and `scripts/generate-locales.mjs`), then `npm run gen:locales` to regenerate `lib/locales.generated.ts`.
- RTL: for `ar-*` locales set `dir="rtl"` on `<html>` (root layout currently hardcodes `lang="en"`; derive from locale in `app/[locale]/layout.tsx` wrapper or a small client effect) — flag as follow-up if root layout can't see the param.

### 3. `lib/markets.ts` + `lib/markets.data.json`
38 markets: `countryCode`, `countryName`, `defaultLocale`, `cmsLocales[]`, `services[]` (`UpsService` union from the plan). Export `MARKETS_38`, `getCountryFromLocale(locale)` (default `US`). Fill the elided list (AT, BE, BR, CH, CN, CZ, DK, ES, FI, GR, HK, IE, IN, IT, JP, KR, NL, NO, PL, PT, SE, SG, TR, TW, …) and confirm the exact 38 with the user's source list.

### 4. `app/_components/SmartCta.tsx`
Server-safe component per the plan: service guard (red dashed in editor, `null` in production), localize internal paths with the existing `localizePath()` in `lib/locales.ts` instead of hand-rolled prefixing. `isEditor` from preview context (`/preview` route) rather than a prop where available.

### 5. Six blocks in `cms/` (+ client widgets in `app/_components/`)
Source markup: `public/ups-home.html` (`data-block-name`: enhanced-app-teaser, solutions-section, dynamic-banner, carousel, feature-list, accordion; headings "Solutions for Everyone", "Delivering What Matters", "Get Started with UPS", "Important Updates").
- `EnhancedAppTeaser.tsx` (`UpsEnhancedAppTeaser`), `SolutionsSection.tsx`, `DynamicBanner.tsx`, `CarouselSection.tsx`, `FeatureListSection.tsx`, `AccordionSection.tsx`.
- Each: `contentType({ baseType: '_component', compositionBehaviors: ['sectionEnabled', ...] })`, localized string properties, `pa()` attributes, SmartCta for gated links; repeatable items as `array` of `component` properties (cards, accordion items, features) following `docs/content-type-definition-reference.md`.
- Register in `cms/registry.ts` (all three registries) and add to `registeredContentTypes`.
- Optionally extend `BlankSection`/`BlankExperience` rendering is unchanged.

### 6. Push + content
- `npm run cms:push` (pushes only missing types; use `cms:push:all` only if updating existing — confirm with user first as it overwrites CMS types).
- Build the home experience in CMS via the opal-cms MCP (`cms_create_content_item` BlankExperience, sections, publish) once types exist, per locale as translations are available.

### 7. Audit CLI
`scripts/cms-market-audit.mjs` as described under Deviations; `npm run cms:audit`.

## Critical files
`app/_components/{LanguageSwitcher,Badge,DevQuickLinks}.tsx`, `package.json`, `proxy.ts`, `lib/locales*.ts`, `scripts/generate-locales.mjs`, `lib/markets.ts` (new), `lib/markets.data.json` (new), `app/_components/SmartCta.tsx` (new), `cms/*.tsx` (6 new), `cms/registry.ts`, `scripts/cms-market-audit.mjs` (new).
Reuse: `localizePath`/`stripLocale` (`lib/locales.ts`), `ctaHref`/`OptiLink` (`cms/shared.ts`), `ComponentWrapper` (`cms/wrappers.tsx`), `getPreviewUtils().pa`, push script `scripts/cms-push.mjs`.

## Verification
1. `npm install`, then `npx tsc --noEmit` and `npm run lint` clean (none of this has been type-checked so far; node_modules is absent).
2. `npm run gen:locales` produces the expected locale list; `npm run cms:audit` exits 0 with locales enabled, non-zero when one is missing.
3. `npm run dev`: `/` renders the experience; `/fr-CA/`, `/de-DE/` resolve (fallback to default if untranslated); `/en-US/x` redirects to `/x`; language switcher is legible on the light top bar.
4. SmartCta: in a market without `ups_store`, the card CTA is omitted in prod and shows the red dashed marker in `/preview`.
5. Visual Builder preview in the CMS: blocks drop into columns, `pa()` overlays work, content types appear after `cms:push` (check with `cms_list_content_types`).
