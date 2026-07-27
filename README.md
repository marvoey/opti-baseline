# Optimizely CMS + Next.js 16 — Demo Reference Base

A reusable starting point for **pre-sales demos** built on Optimizely CMS (SaaS,
`@optimizely/cms-sdk` v2) and the Next.js 16 App Router. Clone it, rebrand in a
few minutes, and build a bespoke prospect demo on top.

## What's in the box

- **Locale-aware routing** — default locale on clean URLs (`/slug`), non-default
  locales under a `/<segment>/` prefix (`/fr/slug`). Handled by `proxy.ts` +
  `lib/locales*` + the `[locale]/[[...slug]]` catch-all. Locales are generated
  from the CMS (`npm run gen:locales`).
- **CMS catch-all** — host-scoped Optimizely Graph fetch, kept **dynamic** so
  editor changes show on refresh. Dual-path fallback handles both clean and
  locale-prefixed Graph paths. See `ROUTING.md`.
- **Live preview / on-page editing** at `/preview` (`app/preview/page.tsx`).
- **Visual Builder content model** — `BlankExperience` as the root; four section
  layouts (`HeroSection`, `SidebarSection`, `SplitSection`, `FeedSection`); five
  block types (`Paragraph`, `CardBlock`, `ActionBlock`, `ComplianceBlock`,
  `HeroBlockv2`, `Image`). All blocks carry a shared four-axis taxonomy
  (`Intent`, `Persona`, `Service`, `Geo`). See `CONTENT-MODEL.md`.
- **Optional Web Experimentation** — loads the Optimizely Web snippet when
  `NEXT_PUBLIC_OPTIMIZELY_WEB_SNIPPET_ID` is set; skipped when blank.
- **Admin inspector** at `/admin` — lists all content types registered with the
  SDK; `/admin/[key]` shows properties and display templates for one type.
- **Styleguide** at `/styleguide` — block gallery with live render, property
  table, and source code for each registered block.
- **Seed scripts** — `npm run seed:*` scripts populate the CMS with demo
  experiences, hero images, cards, and rich-text paragraphs. See `SEEDING.md`.
- **Demo niceties** — one-file theme/rebrand layer (`lib/siteConfig.ts`), branded
  404 / error / loading screens, fail-fast env validation, per-page `<title>`.

## Spin up a new demo

```sh
cp .env.example .env            # fill in Graph key + CMS client credentials
npm run gen:locales             # pull enabled locales from the CMS
npm run cms:push                # push content type definitions to the CMS
npm run dev                     # http://localhost:3009 (set PORT in .env to change)
```

Rebrand by editing three things — no component changes required:

| What | Where |
|---|---|
| Colour tokens | `app/globals.css` — `@theme` block (`blue-950`, `blue-800`, …) |
| Name, nav, footer, legal copy | `lib/siteConfig.ts` |
| Logo | `public/logo.svg` — drop in the prospect's SVG |

## Adding a content type / block

1. Create `cms/<Name>.tsx` — export a `contentType()` definition, a default
   React component, and (if needed) a `displayTemplate()`.
2. Register in `cms/registry.ts`:
   - `initContentTypeRegistry` → add the `contentType()`
   - `initDisplayTemplateRegistry` → add any display template(s)
   - `initReactComponentRegistry` → map the type key → component
3. `npm run cms:push` — pushes the updated definitions to the CMS.

## Further reading

| Doc | Contents |
|---|---|
| `docs/ARCHITECTURE.md` | App structure, data flow, key design decisions |
| `docs/CONTENT-MODEL.md` | Content types, taxonomy, display templates |
| `docs/ROUTING.md` | Proxy logic, locale system, all routes |
| `docs/PROXY.md` | Deep-dive on `proxy.ts` with worked examples |
| `docs/SEEDING.md` | Seed scripts and content library structure |
| `AGENTS.md` | Notes for AI agents on this Next.js 16 version |

## Notes

This base intentionally **omits** production concerns that add nothing to a live
demo: ISR/caching, on-demand revalidation webhooks, hreflang, sitemap, robots,
and image CDN loaders. Add them per-engagement when a demo needs them.
