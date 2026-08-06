# proxy.ts — Locale clean-URL routing

`proxy.ts` is the Next.js 16 **Proxy** (the replacement for Middleware). It handles
locale clean-URLs for the Optimizely CMS routes. It does **routing only** — no data
fetching (the Next.js docs explicitly discourage fetching here).

## Why it exists

Optimizely Graph resolves content by a **locale-prefixed path** (e.g. `/en/vb-demo/`).
We want **clean public URLs** (`/vb-demo`) but still need to route internally to
`app/[locale]/[[...slug]]` so the `[locale]` param is populated and Graph queries stay
consistent.

CMS-first routing: every path flows to the CMS catch-all, so adding a new CMS page
needs no change here.

## Configuration

- `DEFAULT_LOCALE` — `process.env.OPTIMIZELY_DEFAULT_LOCALE`, defaulting to `en`. The
  default locale serves **clean URLs** (no visible prefix).
- `KNOWN_LOCALE_SEGMENTS` — the route segments of the **non-default** locales enabled
  in the CMS, sourced from `lib/locales.generated.ts` (refresh with `npm run gen:locales`).
  The default locale has no segment here because it has no visible prefix.
- `PROXY_EXCLUDED_PATHS` — comma-separated list of first path segments that bypass
  locale rewriting entirely (early `NextResponse.next()`). Use this for standalone app
  routes that live outside the CMS catch-all and must not be rewritten into a locale.

  ```
  PROXY_EXCLUDED_PATHS=preview,DemoHomepages,DemoPrototype
  ```

  These are checked at runtime inside `proxy()`, so adding or removing entries requires
  only an `.env` change and a server restart — no code change needed. The `config.matcher`
  is intentionally kept to static/performance exclusions only (`_next/*`, `api`,
  `favicon.ico`, files with dots).

## Decision flow

Given a request, the proxy inspects the **first path segment** (`pathname.split('/')[1]`)
and takes exactly one of three branches:

### 1. First segment **is** the default locale → **redirect** to the clean path

```
/en/some-slug  →  redirect (307)  →  /some-slug
```

The visible default-locale prefix is non-canonical, so it's redirected away for
SEO/canonical reasons. The strip uses the regex `^/en(?=/|$)`; the `(?=/|$)` lookahead
ensures only a real segment boundary is stripped (so `/enterprise` is **not** affected).
Query strings are preserved via `search`. A bare `/en` becomes `/`.

The resulting clean request then re-enters the proxy and is handled by branch 3.

### 2. First segment is a **known non-default locale** → **pass through**

```
/sv/some-slug  →  NextResponse.next()  →  served as-is
```

The `[locale]` param is already populated by the visible prefix, so nothing changes.

### 3. Clean path with **no locale** → **rewrite** into the default locale

```
/some-slug   →  rewrite (invisible)  →  /en/some-slug
/enterprise  →  rewrite (invisible)  →  /en/enterprise
```

The URL bar keeps the clean path; internally `[locale]` is set to the default locale so
the CMS catch-all and Graph queries resolve. This is a **rewrite**, not a redirect — the
browser never sees `/en/...`.

## Worked examples (default locale = `en`)

| Incoming path   | First segment | Branch | Action                        | Result the browser sees |
| --------------- | ------------- | ------ | ----------------------------- | ----------------------- |
| `/en/some-slug` | `en`          | 1      | Redirect to `/some-slug`      | `/some-slug`            |
| `/en`           | `en`          | 1      | Redirect to `/`               | `/`                     |
| `/sv/some-slug` | `sv`          | 2      | Pass through                  | `/sv/some-slug`         |
| `/some-slug`    | `some-slug`   | 3      | Rewrite to `/en/some-slug`    | `/some-slug`            |
| `/enterprise`   | `enterprise`  | 3      | Rewrite to `/en/enterprise`   | `/enterprise`           |

> `/enterprise` does **not** match the default-locale branch: segment comparison is exact
> (`"enterprise" !== "en"`), and even the strip regex's `(?=/|$)` lookahead would refuse to
> chop `en` out of the middle of the word.

## Matcher

```js
matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)']
```

Runs on everything **except** API routes, Next.js internals (`_next/static`,
`_next/image`), `favicon.ico`, and any path containing a dot (static assets like
`/logo.svg`). These are hard-coded because they are purely about performance — they
should never need locale logic.

Custom route exclusions (e.g. `preview`, `DemoPrototype`) are **not** in the matcher;
they are handled inside `proxy()` via `PROXY_EXCLUDED_PATHS` (see Configuration above).
