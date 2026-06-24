---
name: optimizely-nextjs-cms
description: >-
  Reference patterns for wiring Optimizely CMS SaaS (@optimizely/cms-sdk v2) into
  a Next.js 16 App Router app. Use when implementing the app/[locale]/[[...slug]]
  catch-all, locale clean-URLs via proxy.ts (the Next 16 replacement for
  Middleware), Optimizely Graph fetching (getContentByPath/getPreviewContent),
  on-page editing overlays (getPreviewUtils / pa), Visual Builder composition
  (experiences, sections, rows, columns, elements), display templates, or
  pushing content types with @optimizely/cms-cli. Trigger on tasks touching
  Optimizely Graph, proxy.ts, preview/Draft routes, or @optimizely/cms-sdk.
---

# Optimizely CMS SaaS on Next.js 16 (App Router)

Implementation guidance + reference code for `@optimizely/cms-sdk` v2 and
`@optimizely/cms-cli` v2. **Verify APIs against source before emitting code**:
Next 16 docs in `node_modules/next/dist/docs/`; SDK guides in `/docs`. The notes
below were confirmed empirically against this SDK version.

Repo specifics: app dir is `app/` (no `src/`); alias `@/* → ./*`; CMS code under
`@/cms/...`. Env (`.env`): `OPTIMIZELY_GRAPH_SINGLE_KEY`, `OPTIMIZELY_GRAPH_GATEWAY`
(`https://cg.optimizely.com/content/v2`), `OPTIMIZELY_CMS_URL`,
`OPTIMIZELY_CMS_CLIENT_ID`/`OPTIMIZELY_CMS_CLIENT_SECRET` (CLI), and
`OPTIMIZELY_DEFAULT_LOCALE`.

## Verified gotchas (read first)

- **No `@optimizely/cms-sdk/next` export in v2.0.0.** The docs' `NextPreviewComponent`
  doesn't resolve — use `PreviewComponent` from `@optimizely/cms-sdk/react/client`.
- **Default-locale URLs are CLEAN once a hostname is configured.** With a CMS
  Hostname set (e.g. `http://localhost:3000`), Graph indexes the default locale's
  `_metadata.url.default` WITHOUT a locale prefix (e.g. `/vb-demo/`), sets
  `url.base = <host>`, and keeps `locale` as metadata. So the Graph path must NOT
  include the locale for the default locale. (Before a hostname is set, it's the
  locale-prefixed `/en/vb-demo/` with no base — which is why this bites you.)
  Non-default locales may be path-prefixed; handle those later.
- **`getContentByPath(path)`** matches `_metadata.url.default` (it tries the path
  with and without a trailing slash) and, only if you pass `{ host }`, also
  `_metadata.url.base`. Single-site: omit host. Always guard `content[0]` and call
  `notFound()` on empty.
- **`OptimizelyGridSection` does NOT wrap leaf elements** (unlike `OptimizelyComposition`,
  which wraps each node in your `ComponentWrapper`). So element components must mark
  their OWN editable block boundary, or on-page editing won't attach to grid/column
  elements. See §4.
- **Section content properties are NEVER delivered** by the composition query. The
  SDK fragment fetches `component { ..._IComponent }` only for component (element)
  nodes, not section/structure nodes. A section is a WRAPPER — configure it with a
  DISPLAY TEMPLATE (`displaySettings`), not content properties. See §5.
- **`sectionEnabled` is auto-applied** by the CLI when you push a `_section` type;
  no need to declare `compositionBehaviors` for sections.
- **Publishing a `_experience` requires its SEO `GraphType`.** On a `BlankExperience`,
  `BlankExperienceSeoSettings.GraphType` is required and only accepts `-` or `article`.
- **`opti-cli config push` discovers BOTH content types and display templates** from
  the `components` glob. Keep the registry module as `.ts` (not `.tsx`) so the
  `./cms/**/*.tsx` glob skips it.

## 1. Locale routing with `proxy.ts`

`proxy.ts` (Next 16 Middleware replacement; root, sibling of `app/`) gives clean
public URLs and populates `app/[locale]`. Routing only — NO data fetching.

```ts
// proxy.ts (project root)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const DEFAULT_LOCALE = process.env.OPTIMIZELY_DEFAULT_LOCALE || 'en';
const KNOWN_LOCALES = [DEFAULT_LOCALE];
const MOCK_ROUTE_RE = /^\/(services|locations)(\/|$)/; // routes still served by app/ (drop as they migrate)

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (pathname === '/' || MOCK_ROUTE_RE.test(pathname)) return NextResponse.next();

  const seg = pathname.split('/')[1] ?? '';
  if (seg === DEFAULT_LOCALE) {                                   // /en/x → redirect to clean /x
    const stripped = pathname.replace(new RegExp(`^/${DEFAULT_LOCALE}(?=/|$)`), '') || '/';
    return NextResponse.redirect(new URL(stripped + search, request.url));
  }
  if (KNOWN_LOCALES.includes(seg)) return NextResponse.next();    // other locale present
  return NextResponse.rewrite(new URL(`/${DEFAULT_LOCALE}${pathname}${search}`, request.url)); // /x → /en/x
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|preview|favicon.ico|.*\\..*).*)'],
};
```

The `[locale]` segment + proxy normalize the URL and capture `locale`, but for the
DEFAULT locale the Graph query must use the **clean path** (§2) — the proxy is about
the address bar, not the Graph lookup.

## 2. `app/[locale]/[[...slug]]/page.tsx` (catch-all)

Build the Graph path from the **slug only** — do NOT prefix the locale (see gotchas).

```tsx
import { getClient } from '@optimizely/cms-sdk';
import { OptimizelyComponent, withAppContext } from '@optimizely/cms-sdk/react/server';
import { notFound } from 'next/navigation';

type Props = { params: Promise<{ locale: string; slug?: string[] }> };

async function Page({ params }: Props) {
  const { slug = [] } = await params;
  const path = slug.length ? `/${slug.join('/')}/` : '/';   // "/vb-demo/", NOT "/en/vb-demo/"
  const content = await getClient().getContentByPath(path);
  if (!content?.[0]) notFound();
  return <OptimizelyComponent content={content[0]} />;
}

export default withAppContext(Page);
```

`getClient()` needs `config({...})` to have run once — do it in `@/cms/registry`
(imported for side effects by `app/layout.tsx`) alongside `initContentTypeRegistry`,
`initDisplayTemplateRegistry`, and `initReactComponentRegistry`.

## 3. Preview / Draft route

```tsx
// app/preview/page.tsx
import { getClient, type PreviewParams } from '@optimizely/cms-sdk';
import { OptimizelyComponent, withAppContext } from '@optimizely/cms-sdk/react/server';
import { PreviewComponent } from '@optimizely/cms-sdk/react/client'; // NOT /next (unexported)
import Script from 'next/script';

export const dynamic = 'force-dynamic';

async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = (await searchParams) as unknown as PreviewParams;
  const content = await getClient().getPreviewContent(params);
  const injector = new URL('/util/javascript/communicationinjector.js', process.env.OPTIMIZELY_CMS_URL).href;
  return (
    <>
      <Script src={injector} strategy="afterInteractive" />
      <PreviewComponent />
      <OptimizelyComponent content={content} />
    </>
  );
}

export default withAppContext(Page);
```

CMS-side: add Hostname `http://localhost:3000`; Live Preview → Use Preview Tokens →
preview URL `http://localhost:3000/preview`. `PreviewParams` = `{ preview_token, key, ctx, ver, loc }`.

## 4. On-page editing overlays (`pa`)

`getPreviewUtils(content).pa(x)` emits `data-epi-*` ONLY when `content.__context.edit`
is true (set when the preview URL's `ctx === 'edit'`). `pa('field')` → property overlay;
`pa(node)` (object with `.key`) → block boundary.

- **Sections / rows / columns**: apply `pa(content)` (section) and `pa(node)` (in your
  row/column wrappers). `OptimizelyComposition` wraps experience-level nodes in your
  `ComponentWrapper` (which applies `pa(node)`).
- **Element components in a grid**: `OptimizelyGridSection` renders them WITHOUT a
  wrapper, so each element must mark its own block boundary from its composition node
  (the grid sets `content.__composition`; it's absent at the experience level, so this
  is a safe no-op there):

```tsx
const { pa } = getPreviewUtils(content);
const block = content.__composition; // typed on the inferred content; { key } | undefined
return <article {...pa(block)}>{/* …fields with pa('field')… */}</article>;
```

Apply `pa('field')` to every editable property so editors can click straight to it.

## 5. Sections are wrappers — configure via display templates

A `_section` hosts the composition grid and (optionally) presentational config. Its
own content properties are NOT delivered (see gotchas), so put options on a DISPLAY
TEMPLATE and read them via the `displaySettings` prop. A default template (`isDefault`)
flows to the default component — no variant/tag needed.

```tsx
import { contentType, displayTemplate, type ContentProps } from '@optimizely/cms-sdk';
import { OptimizelyGridSection, getPreviewUtils } from '@optimizely/cms-sdk/react/server';

export const DemoSectionContentType = contentType({
  key: 'DemoSection', baseType: '_section', displayName: 'Demo Section', properties: {},
});

export const DemoSectionDisplayTemplate = displayTemplate({
  key: 'DemoSectionDefault', isDefault: true, displayName: 'Demo Section',
  contentType: 'DemoSection',
  settings: {
    background: { editor: 'select', displayName: 'Background', sortOrder: 0,
      choices: { muted: { displayName: 'Muted', sortOrder: 1 }, navy: { displayName: 'Navy', sortOrder: 2 } } },
  },
});

type Props = {
  content: ContentProps<typeof DemoSectionContentType>;
  displaySettings?: ContentProps<typeof DemoSectionDisplayTemplate>;
};

export default function DemoSection({ content, displaySettings }: Props) {
  const { pa } = getPreviewUtils(content);
  const bg = displaySettings?.background === 'navy' ? 'bg-blue-900 text-white' : 'bg-slate-100';
  return (
    <section {...pa(content)} className={`rounded-3xl px-6 py-10 ${bg}`}>
      <OptimizelyGridSection nodes={content.nodes} row={DemoRow} column={DemoColumn} />
    </section>
  );
}
```

Register with `initDisplayTemplateRegistry([DemoSectionDisplayTemplate])`. Display
template targets (choose one): `contentType` | `baseType` (`_section`/`_component`/
`_experience`) | `nodeType` (`row`/`column`). Editors set `select`/`checkbox` values
in VB; values are the choice keys.

## Composition model

- **Experience** (`_experience`) — routable page; renders `OptimizelyComposition` over
  `content.composition.nodes` with a `ComponentWrapper`.
- **Section** (`_section`) — wrapper; renders `OptimizelyGridSection` over `content.nodes`
  with custom `row`/`column`. Config via display templates.
- **Element** (`_component` + `compositionBehaviors: ['elementEnabled']`) — the actual
  content; dropped into a section's columns; self-marks its block boundary (§4).

## CLI workflow

Define content types + display templates in `./cms/**/*.tsx`; push with
`npx @optimizely/cms-cli config push optimizely.config.mjs`. Removing/altering a
property on a type with existing content is a breaking change → re-run with `--force`
(drops affected data). `buildConfig({ components, propertyGroups })` in
`optimizely.config.mjs`; property `group` keys must reference a declared propertyGroup.

## References
- Next 16 Proxy: `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`
- SDK guides: `docs/3-modelling.md`, `5-fetching.md`, `6-rendering-react.md`,
  `7-live-preview.md`, `8-experience.md`, `9-display-settings.md`
