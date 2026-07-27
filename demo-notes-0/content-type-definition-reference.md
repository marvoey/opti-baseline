# Content type definition reference

The full grammar of a `contentType()` definition, sourced from the
`@optimizely/cms-sdk` TypeScript types:

- `node_modules/@optimizely/cms-sdk/dist/cjs/model/contentTypes.d.ts`
- `node_modules/@optimizely/cms-sdk/dist/cjs/model/properties.d.ts`

Use this to know every field a content type and its properties *can* declare —
not just what any single type (e.g. `cms/CibcHero.tsx`) happens to use.

## Content-type level

Every content type shares these common fields (`BaseContentType`):

```ts
key: string            // required
displayName: string    // required
baseType: ...          // required — discriminator (see table)
properties?: Record<string, AnyProperty>
```

`baseType` is a discriminated union — each base type unlocks different extra
fields:

| `baseType`                      | Extra fields allowed                                                            |
| ------------------------------- | ------------------------------------------------------------------------------- |
| `_page`                         | `mayContainTypes?`                                                              |
| `_experience`                   | `mayContainTypes?`                                                              |
| `_folder`                       | `mayContainTypes?` *(asset-panel only — not exposed in Graph)*                  |
| `_component`                    | `compositionBehaviors?: ('sectionEnabled' \| 'elementEnabled')[]`, `mayContainTypes?` |
| `_section`                      | *(none — internal use)*                                                         |
| `_image` / `_media` / `_video`  | *(none)*                                                                        |

`mayContainTypes` entries are each: a `ContentType`, the string `'_self'`, or a
base-type string.

> **Note:** the SDK's typed surface does not list `description`, yet content
> types set it (e.g. `cms/CibcHero.tsx`). `description` is accepted by the API
> and `contentType()` even though it is absent from the `.d.ts` — the SDK types
> are slightly narrower than what is actually allowed.

## Property level

Every property shares these common fields (`BaseProperty`):

```ts
type: ...            // required — discriminator
format?: string
displayName?: string
description?: string
isRequired?: boolean
isLocalized?: boolean
group?: PropertyGroupKey
sortOrder?: number
indexingType?: 'disabled' | 'queryable' | 'searchable'
```

`indexingType` controls how Optimizely Graph exposes the field:

- `disabled` — output only (read-only, best performance; not filterable/searchable)
- `queryable` — filterable in `where` clauses
- `searchable` — text search (`contains` / `match`) and contributes to `_fulltext`

### Per-`type` additional fields

There are **14** property types. Each adds its own fields on top of
`BaseProperty`:

| `type`             | Extra fields                                  |
| ------------------ | --------------------------------------------- |
| `string`           | `pattern?`, `minLength?`, `maxLength?`, `enum?` |
| `integer`          | `minimum?`, `maximum?`, `enum?`               |
| `float`            | `minimum?`, `maximum?`, `enum?`               |
| `dateTime`         | `minimum?: string`, `maximum?: string`        |
| `boolean`          | —                                             |
| `url`              | —                                             |
| `richText`         | —                                             |
| `json`             | —                                             |
| `binary`           | —                                             |
| `link`             | —                                             |
| `contentReference` | `contentType?`, `allowedTypes?`, `restrictedTypes?` |
| `content`          | `contentType?`, `allowedTypes?`, `restrictedTypes?` |
| `component`        | `contentType` *(required)*                    |
| `array`            | `items` *(required)*, `minItems?`, `maxItems?` |

### Compound options

Most extra fields are scalars (`minLength`, `pattern`, `sortOrder`, …). Three
options take a structured value:

**`enum`** (string/integer/float) — an array of `{ value, displayName }`:

```ts
Severity: {
  type: 'string',
  enum: [
    { value: 'URGENT', displayName: 'Urgent' },
    { value: 'MARKET', displayName: 'Market' },
  ],
}
```

**`allowedTypes` / `restrictedTypes`** — an array of type references
(`PermittedTypes` = a `ContentType` | a base-type string | `'_self'`):

```ts
allowedTypes?: (ContentType | '_page' | '_component' | ... | '_self')[]
```

**`array.items`** — a nested property definition (any single non-`array`
property type; arrays cannot nest):

```ts
Alerts: {
  type: 'array',
  items: { type: 'component', contentType: CibcAlertContentType },
}
```

## Worked example

`cms/CibcHero.tsx` exercises only `string` and `link`:

```ts
export const CibcHeroContentType = contentType({
  key: 'CibcHero',
  baseType: '_component',
  displayName: 'CIBC: Hero',
  description: 'High-impact hero with eyebrow, headline, subtext and up to two CTAs.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    Eyebrow:      { type: 'string', displayName: 'Eyebrow', isLocalized: true, sortOrder: 10 },
    Headline:     { type: 'string', displayName: 'Headline', isLocalized: true, sortOrder: 20 },
    Subtext:      { type: 'string', displayName: 'Subtext', isLocalized: true, sortOrder: 30 },
    PrimaryCta:   { type: 'link',   displayName: 'Primary CTA', isLocalized: true, sortOrder: 40 },
    SecondaryCta: { type: 'link',   displayName: 'Secondary CTA', isLocalized: true, sortOrder: 50 },
  },
});
```

Any property above could instead use any of the 14 types with their respective
options.
