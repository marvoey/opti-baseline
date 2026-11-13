---
name: cms-content-placement
description: >-
  Where new Optimizely CMS content must be created in this project. Use whenever
  you create or import a page, experience, shared block (standalone component) or
  media/asset in the CMS — via the opal-cms MCP tools (cms_create_content_item,
  cms_update_content_item, cms_upload_media), a script in scripts/, or app code
  calling the Content Management API. Pages and experiences go under the
  HOME_PAGE_CONTENT_ID container; shared blocks and media go in the folder
  ASSET_BASE_FOLDER_ID. Never rely on the tools' defaults (Root page / the shared
  "For All Applications" folder).
---

# CMS content placement (Corel)

This CMS instance is **shared with many other demos**. The tools' defaults drop new
content at the Root page or into the global shared asset folder — both are wrong for
this project and would mix Corel content with other teams' content. Always pass the
container explicitly, from the environment.

## The rule

| You are creating… | Container (parent) | Env variable |
|---|---|---|
| A **page** or **experience** (`_page`, `_experience`, e.g. `CorelExperience`) | the Corel home page | `HOME_PAGE_CONTENT_ID` |
| A **shared block** — a standalone `_component` content item that other content references | the Corel asset folder | `ASSET_BASE_FOLDER_ID` |
| **Media** — image, video or file uploads (`_image`, `_video`, `_media`) | the Corel asset folder | `ASSET_BASE_FOLDER_ID` |

Not covered by this rule (no container needed):

- **Inline blocks / elements** — components dropped into an experience's composition
  or a content area. They live inside their owner; don't create them as separate items.
- **Variations**, **updates** to existing items, content types, display templates.
- **Reading** content.

Never use any other parent, and never fall back to a default if a variable is missing.

## 1. Resolve the IDs

Both live in `.env` (gitignored) as content-key GUIDs (32 hex characters, or 36 with
hyphens). **`.env` also holds the CMS client secret and Graph key — never `cat` it,
echo it, or paste it into output.** Read only these two lines:

```bash
grep -E '^(HOME_PAGE_CONTENT_ID|ASSET_BASE_FOLDER_ID)=' .env
```

If either is empty or missing: **stop and ask the user** for the ID. Do not guess,
do not search for "a likely folder", and do not omit the container to get the default.

Do not hard-code the GUIDs in scripts, code, skills or docs — read them from the
environment every time so the project can be repointed by editing `.env`.

## 2. opal-cms MCP tools

Always set `Container` explicitly; omitting it silently uses the wrong default.

| Tool | Create what | `Container` |
|---|---|---|
| `cms_update_content_item` (omit `ContentKey` → create + populate; **preferred**) | page / experience | `HOME_PAGE_CONTENT_ID` |
| | shared block (`_component`) | `ASSET_BASE_FOLDER_ID` |
| `cms_create_content_item` (creates an empty draft) | page / experience | `HOME_PAGE_CONTENT_ID` |
| | shared block (`_component`) | `ASSET_BASE_FOLDER_ID` |
| `cms_upload_media` | any image / video / file | `ASSET_BASE_FOLDER_ID` |

Notes:

- `Container` must be a content-key **GUID**, not a URL path or route segment. It is
  only used when creating — it does not move existing items.
- The CMS only allows pages/experiences under pages/experiences, and components
  under folders. If a call is rejected (for example the parent type's
  `mayContainTypes` doesn't allow the new type), **report the error** — do not retry
  with the default container.
- Give pages and experiences a `RouteSegment`; their URL is built from the home
  page's route segment plus theirs. Use a locale that is enabled in the CMS (check
  with `cms_get_content_type_details … IncludeRelatedTypes` → `enabledLocales`).
- Media in the asset folder is referenced from properties as `cms://content/{key}`.

## 3. Scripts and app code

Read, validate and fail closed. Node scripts in this repo run with
`node --env-file=.env scripts/<name>.mjs` (see package.json); use the same pattern.

```js
const GUID = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;

function requireId(name) {
  const value = process.env[name]?.trim();
  if (!value || !GUID.test(value)) {
    throw new Error(`${name} is missing or not a content-key GUID — set it in .env`);
  }
  return value.replace(/-/g, '');
}

export const HOME_PAGE_CONTENT_ID = requireId('HOME_PAGE_CONTENT_ID');
export const ASSET_BASE_FOLDER_ID = requireId('ASSET_BASE_FOLDER_ID');

// pages / experiences:        { container: HOME_PAGE_CONTENT_ID, … }
// shared blocks and media:    { container: ASSET_BASE_FOLDER_ID, … }
```

- Pass the id as the `container` of the create request to the Content Management API
  (the parent content key — the same thing the MCP tools call `Container`). If unsure
  of the exact request shape, pull the spec with `npm run schema:pull` and check it
  rather than guessing.
- Don't log the ids alongside credentials, and never log `OPTIMIZELY_CMS_CLIENT_SECRET`
  or `OPTIMIZELY_GRAPH_SINGLE_KEY`.
- Batch/seed scripts must check the ids **before** creating anything, so a bad
  config fails up front instead of half-way through a run.
- Idempotency: look for an existing item (same type, display name or route segment
  under the same container) before creating a duplicate.

## 4. Check the result

After creating, confirm the item landed in the right place — don't assume:

- Pages / experiences: their URL path starts with the home page's route segment
  (`/<home-route>/<segment>/`), and `_metadata.container` (Graph) equals
  `HOME_PAGE_CONTENT_ID`.
- Shared blocks / media: they appear under the Corel folder in the CMS Assets view,
  and `_metadata.container` equals `ASSET_BASE_FOLDER_ID`.

If something was created in the wrong place, say so and ask before moving or
deleting it — other teams share this instance.

## 5. Publishing note

Child pages resolve under the home page's URL, so the home page
(`HOME_PAGE_CONTENT_ID`) should be **published** before the pages under it are
expected to be reachable. If it is still a draft, tell the user rather than
publishing it on your own.
