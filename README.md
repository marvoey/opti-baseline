# Optimizely CMS + Next.js 16 — Demo Reference Base

A reusable starting point for **pre-sales demos** built on Optimizely CMS (SaaS,
`@optimizely/cms-sdk` v2) and the Next.js 16 App Router. Clone it, rebrand in a
few minutes, and build a bespoke prospect demo on top.

## What's in the box

- **Locale-aware routing** with a default locale on clean URLs and other CMS
  locales under a `/<segment>/` prefix — `proxy.ts` + `lib/locales*` +
  `app/[locale]/[[...slug]]/page.tsx` + the `LanguageSwitcher`. The enabled
  locales are generated from the CMS (`npm run gen:locales`).
- **CMS catch-all** with host-scoped Optimizely Graph fetching and a sensible
  default-locale fallback, kept **dynamic** so editor changes show on refresh.
- **Live preview / on-page editing** at `/preview` (`app/preview/page.tsx`).
- **Minimal content model**: a fixed-layout `Page`, a Visual Builder
  `ExperiencePage`, and two generic blocks — `Hero` and `RichText`.
- **Optional Web Experimentation**: loads the Optimizely Web snippet when
  `NEXT_PUBLIC_OPTIMIZELY_WEB_SNIPPET_ID` is set (`OptimizelyActivation`);
  skipped entirely when it's blank.
- **Demo niceties**: a one-file theme/rebrand layer, branded 404 / error /
  loading screens, fail-fast env validation, and per-page `<title>`.

## Spin up a new demo

1. **Clone** this base into a new project folder.
2. **Configure** — `cp .env.example .env` and fill in your Optimizely Graph +
   CMS API client credentials.
3. **Rebrand** — edit three things, no component changes needed:
   - `app/globals.css` — the `@theme` colour tokens (set `blue-950` to your
     darkest brand colour and `blue-800` to your primary).
   - `lib/siteConfig.ts` — site name, nav links, footer columns, legal copy.
   - `public/logo.svg` — drop in the prospect's logo.
4. **Generate locales** — `npm run gen:locales` (reads enabled locales from the CMS).
5. **Push content types** — `npm run config:push` (pushes Page, ExperiencePage,
   Hero, RichText to the CMS).
6. **Run** — `npm run dev` (http://localhost:3009; set `PORT` in `.env` to change it).

## Adding a content type / block

1. Create `cms/<Name>.tsx` exporting a `contentType()` definition and a default
   React component (plus a display template, if the type needs one).
2. Register it in `cms/registry.ts`: add the `contentType()` to
   `initContentTypeRegistry`, map the key → component in
   `initReactComponentRegistry`, and add any display template to
   `initDisplayTemplateRegistry`.
3. `npm run config:push`.

## Notes

- This base intentionally **omits** production concerns that add nothing to a
  live demo: ISR/caching, on-demand revalidation webhooks, hreflang, sitemap,
  robots, and image CDN loaders. Add them per-engagement if a demo needs them.
- See `docs/` for the Optimizely JavaScript SDK reference, and `AGENTS.md` for
  notes on this (breaking-change) Next.js version.
