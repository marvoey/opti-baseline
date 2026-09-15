# Add Universal Component Library primitives to the CMS

## Context
`000-build-md-files/universal-primitives-setup.md` specs out 5 reusable Visual
Builder primitives (Prose/RichText, Card, Action, Media, Wayfinding) so content
can be assembled from intent-tagged blocks (`Intent`/`Audience`/`Domain`/`Geo`)
and queried deterministically via Optimizely Graph. Today only `RichTextBlock`
exists; `CardBlock`, `ActionBlock`, `MediaBlock`, `WayfindingBlock` don't.

I verified the doc's proposed code against the actual installed
`@optimizely/cms-sdk@2.2.0` type definitions and this repo's existing `cms/`
conventions (`RichText.tsx`, `blockWidth.ts`, `registry.ts`). The shapes are
correct and match the SDK exactly. Two things in the doc are wrong/incomplete
for this repo and are corrected below: it references a non-existent
`npm run config:push` script (real scripts are `cms:push` / `cms:push:all` /
`cms:check`), and it doesn't address that pushing writes live schema changes
to a shared CMS SaaS instance.

## Approach
Additive-only change, 6 files, no renames, no new abstractions beyond
established precedent (`blockWidth.ts`'s enum-property pattern):

### A. `cms/shared.ts` (edit)
Append `export const intentTaxonomyProperties = { Intent, Audience, Domain, Geo }
as const` — plain const (not a factory like `blockWidth()`), since these
sort orders (100/110/120/130) are fixed with no per-call-site parameter to
justify a function wrapper. File stays `.ts` (untouched by the push glob).

### B. `cms/RichText.tsx` (edit)
Import `intentTaxonomyProperties` from `./shared`, spread it into
`RichTextContentType.properties` after `Body`. Component body (the
`__composition` + `pa(block)` / `pa('Body')` pattern) is untouched.

### C–F. New files: `cms/CardBlock.tsx`, `cms/ActionBlock.tsx`,
`cms/MediaBlock.tsx`, `cms/WayfindingBlock.tsx`
Each follows `cms/RichText.tsx`'s exact pattern: `contentType({ baseType:
'_component', compositionBehaviors: ['elementEnabled','sectionEnabled'],
... })`, and a component using `getPreviewUtils(content)` +
`(content as { __composition?: { key: string } }).__composition` + `pa(block)`
/ `pa('Field')`. Per the original doc's field lists, with two small deviations
to match existing repo conventions rather than the doc's raw snippets:
- **`ActionBlock.Variant`**: use a real `enum: [{value,displayName}, ...]`
  (primary/secondary/outline) instead of free-text `string`, matching
  `blockWidth.ts`'s existing precedent for closed-set UI variants — gives
  editors a dropdown instead of documenting choices only in `displayName` text.
- **All editorial fields get explicit `isLocalized: true`** (Title, Eyebrow,
  Description, Link, Label, Variant, MediaUrl, AltText, Caption, StepTitle,
  TotalSteps) — every existing property in the repo sets `isLocalized`
  explicitly; the doc's snippets omitted it on these new fields.
`CardBlock`/`ActionBlock` import `ctaHref, type OptiLink` from `./shared` for
their `Link` property (already exported today, matches doc's assumption).
`MediaBlock.MediaUrl` stays `type: 'string'` (a plain URL, not a `link`
property — no CMS asset-reference type exists in the repo to introduce here).

### G. `cms/registry.ts` (edit)
Additive only: import the 4 new components + content types, append to
`registeredContentTypes` and to `initReactComponentRegistry`'s `resolver`
(key === content-type key, e.g. `CardBlock: CardBlock`). While editing this
file, fix its own docblock's stale `Run npm run config:push` line to
`npm run cms:push` (directly adjacent one-line correction, not unrelated
cleanup).

### Left alone (deliberately)
- `cms/Page.tsx`'s `Content.items.allowedTypes` stays `[RichTextContentType]`.
  `compositionBehaviors` is what makes these `_component` types placeable in
  Visual Builder sections/elements — that's the intended authoring path for
  all 5 primitives, not direct insertion into `Page.Content`. The task doc
  never asked to touch `Page.tsx`.
- `.env.example`'s separate stale `config:push` comment — out of scope unless
  requested.

## Verification
Local/read-only, in order:
```bash
npx tsc --noEmit
npm run lint
npm run cms:check   # read-only diff vs. live CMS: expect RichTextBlock
                     # flagged as changed, the 4 new blocks as MISSING
```

**Pushing to CMS SaaS is a separate, explicitly-confirmed step — not run
automatically as part of this task.** `npm run cms:push` (and
`npm run cms:push:all`, needed here since `RichTextBlock` is being modified,
not just added) perform a real OAuth `client_credentials` write to a shared,
live CMS instance using `OPTIMIZELY_CMS_CLIENT_ID`/`_SECRET` from `.env`. I'll
implement and validate all 6 files above, then stop and confirm with you
before running either push command. After a push, the doc's own manual
verification steps (Admin UI → Content Types → confirm base type/composition
flag/taxonomy properties on each) still apply.

### Critical files
- `cms/shared.ts`, `cms/RichText.tsx`, `cms/registry.ts` (edited)
- `cms/CardBlock.tsx`, `cms/ActionBlock.tsx`, `cms/MediaBlock.tsx`,
  `cms/WayfindingBlock.tsx` (new)
- `cms/blockWidth.ts` — reference pattern for the `Variant` enum
- `scripts/cms-push.mjs` — push semantics/env requirements (not modified)
