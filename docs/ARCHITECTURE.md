# Architecture

## Overview

```
Request
  │
  ▼
proxy.ts          ← Next.js 16 Proxy (replaces Middleware)
  │  locale redirect / rewrite
  ▼
app/[locale]/[[...slug]]/page.tsx   ← CMS catch-all
  │  getContentByPath (Optimizely Graph)
  ▼
OptimizelyComponent                 ← SDK-driven renderer
  │  key → component lookup via cms/registry.ts
  ▼
cms/<Block>.tsx                     ← content type component
```

## Directory map

```
cibc-from-base/
├── proxy.ts              Next.js 16 Proxy — locale routing
├── app/
│   ├── layout.tsx        Root layout (fonts, SDK init, Web Experimentation)
│   ├── [locale]/
│   │   ├── layout.tsx    SiteChrome wrapper
│   │   └── [[...slug]]/ page.tsx  CMS catch-all
│   ├── preview/          Live preview / on-page editor route
│   ├── admin/            Content type inspector (no SiteChrome)
│   └── styleguide/       Block gallery (no SiteChrome)
├── cms/
│   ├── registry.ts       SDK config + content type / component registration
│   ├── BasicBlocks/      Block content types (Paragraph, Card, Action, …)
│   └── *Section.tsx      Section layout types (Hero, Sidebar, Split, Feed)
├── lib/
│   ├── env.ts            Fail-fast env validation
│   ├── locales.ts        Locale helpers
│   ├── locales.generated.ts  AUTO-GENERATED — refresh with `npm run gen:locales`
│   ├── siteConfig.ts     Rebrand layer (name, nav, footer)
│   ├── siteHost.ts       Canonical origin from request headers
│   └── cms/              Management API client + seeding helpers
└── seeds/                Demo content seeds
```

## Request lifecycle

### CMS page (e.g. `/solutions/custody`)

1. `proxy.ts` sees no locale prefix → rewrites to `/en/solutions/custody` (internal).
2. `app/[locale]/layout.tsx` renders `SiteChrome` (TopNav + MainNav + Footer).
3. `app/[locale]/[[...slug]]/page.tsx` calls `getContentByPath('/solutions/custody/', { host })`.
4. Graph returns a content node. `OptimizelyComponent` looks up the type key in the
   `initReactComponentRegistry` resolver map and renders the matching component.
5. If the first Graph fetch returns empty, the page retries with the locale-prefixed
   path (`/en/solutions/custody/`) before calling `notFound()`.

### Live preview (`/preview?...`)

1. `proxy.ts` matcher explicitly excludes `/preview` — no locale rewrite.
2. `app/preview/page.tsx` calls `getPreviewContent()` using the CMS draft token
   passed in the query string.
3. `PreviewComponent` renders the draft content with on-page edit overlays
   (`cms/wrappers.tsx` → `ComponentWrapper` → SDK `pa()`).

### Admin inspector (`/admin`, `/admin/[key]`)

1. `proxy.ts` matcher excludes `/admin` — served directly, no locale prefix.
2. Pages call `fetchCmsContentTypes()` / `fetchCmsContentType(key)` from
   `lib/cms/contentTypes.ts`, which authenticates against the CMS Management API
   using OAuth client credentials.

## SDK initialisation

`cms/registry.ts` is imported for side effects by `app/layout.tsx` (the root
layout, executed once on every request). It does three things:

1. `config({ apiKey, graphUrl })` — configures the SDK's Graph client.
2. `initContentTypeRegistry([...])` — registers content type definitions so the
   SDK can validate and push them.
3. `initDisplayTemplateRegistry([...])` — registers display template definitions.
4. `initReactComponentRegistry({ resolver: {...} })` — maps content type keys
   to React components so `OptimizelyComponent` knows what to render.

The `optimizely.config.mjs` file (used only by `npm run cms:push`) globs
`./cms/**/*.tsx` to find content types — `registry.ts` is intentionally a `.ts`
file so it is excluded from that glob.

## Graph host scoping

`lib/siteHost.ts` reads the incoming `host` and `x-forwarded-proto` headers to
build the canonical origin. This origin is passed as the `host` option to
`getContentByPath`, scoping the Graph query to pages indexed under this domain.
This allows multiple demo sites to share the same Optimizely CMS instance.

## Fonts

`app/layout.tsx` loads two Google Font substitutes:

- **Source Serif 4** → `--font-publico` (approximates CIBC Mellon's licensed Publico)
- **Inter** → `--font-akkurat` (approximates Akkurat Pro)

Swap these for the prospect's fonts when rebranding.

## Web Experimentation

The Optimizely Web snippet is loaded via `next/script` with `strategy="afterInteractive"`.
Running it after hydration avoids SSR/hydration mismatch — experiments apply post-hydration
(slight flicker trade-off). `OptimizelyActivation` re-fires the activation event on every
client-side navigation. Both are skipped entirely when `NEXT_PUBLIC_OPTIMIZELY_WEB_SNIPPET_ID`
is unset.
