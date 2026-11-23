# opti-baseline

Next.js 16 front end for **Optimizely CMS (SaaS)** demos. `main` is the clean baseline; every demo
site is its own branch, checked out in its own git worktree with its own `.env`, all talking to one
shared CMS instance.

- Content comes from Optimizely Graph through `@optimizely/cms-sdk` (`app/[locale]/[[...slug]]`).
- Content types are code: `cms/*.tsx` (definition + React component), registered in `cms/registry.ts`.
- The main nav is built from the CMS content tree (`lib/navTree.ts`); the rest of the chrome comes
  from `lib/siteConfig.ts`, colours from `app/globals.css`.

## Spin up a new demo

Run from the **main** checkout (see [Folder layout](#folder-layout)). Its `.env` holds the shared CMS and Graph credentials and points
`HOME_PAGE_CONTENT_ID` / `ASSET_BASE_FOLDER_ID` at the SaaS content root and assets root, which
become the parents of the new site's start page and asset folder. Commit any tooling changes on
`main` first: the new branch only gets what is committed.

```bash
yarn site:new acme --prefix Acme --name "Acme Corp" --opp Acme --dry   # check the plan, changes nothing
yarn site:new acme --prefix Acme --name "Acme Corp" --opp Acme
```

| Argument | Meaning |
|---|---|
| `acme` | Branch name, lowercase with hyphens. Must not exist locally or on `origin`. |
| `--prefix Acme` | Prefix for this site's content types (`AcmeHeroBlock`, `[ACME] Hero Banner`). Must be unused in the CMS. The first letter is capitalised for you, so `--prefix acme` works too (the setup guide uses three lower-case letters, `acm`). |
| `--name "Acme Corp"` | Display name for the start page, CMS application and asset folder. |
| `--opp Acme` | The opportunity folder under your `demo-sites` root. The site is created at `demo-sites/Acme/opti-baseline-acme` (the folder is created if missing). Without it, a folder named like the branch is used. |
| `--host`, `--port`, `--dir`, `--from` | Optional overrides. Defaults: `<branch>.<your domain>`, lowest free port from 3035 that no other checkout under `demo-sites` uses, `demo-sites/<opp>/opti-baseline-<branch>`, `main`. `--dir <absolute path>` replaces `--opp`. |

`site:new` creates, in order:

1. a `BlankExperience` start page (draft) under the shared content root,
2. an asset folder for shared blocks under the shared assets root,
3. a CMS application with the public hostname and a `localhost:<port>` preview host (never the
   instance default),
4. publishes the start page, then confirms Graph filed it under the new hostname,
5. the git worktree on the new branch (no commit),
6. the worktree's `.env`: shared credentials copied from this checkout, site values filled in
   (`SITE_BRANCH`, `SITE_PREFIX`, `PORT`, `DEPLOYED_URL`, `HOME_PAGE_CONTENT_ID`,
   `ASSET_BASE_FOLDER_ID`) and a fresh `MARK_TOOLS_TOKEN`,
7. `yarn install` (skip with `--no-install`).

Every step is idempotent: if a run fails part-way, fix the cause and re-run with `--resume`.
It does **not** set up DNS or hosting for the hostname, deploy, or commit.

Then, in the new worktree:

```bash
cd ~/demo-sites/Acme/opti-baseline-acme
yarn dev          # http://localhost:<PORT>
yarn cms:align    # baseline types in sync
```

Attach that folder in Mark Desktop. `site:new` prints the Windows path to use.

## Folder layout

```
demo-sites/
  opti-baseline-hub/             permanent hub (any name you like)
    opti-baseline-main/          the main checkout: branch main, port 3034, shared credentials
  Acme/                          one folder per opportunity
    opti-baseline-acme/          a git worktree of the hub, branch acme, its own .env and port
  H_R_block/
    opti-baseline-hrblock/       older sites may still be separate clones
```

A site is a git worktree: a second working folder that shares the hub's git history instead of
cloning it again. Each branch can be checked out in only one folder at a time.

- **The hub is permanent.** Every worktree's `.git` points back to `opti-baseline-main/.git`.
  Deleting or moving the hub breaks them (`git worktree repair` fixes a move, not a delete).
- **Remove a site cleanly** with `git worktree remove <folder>` from the hub, not by deleting the folder
  (`git worktree prune` cleans up if you already did). Then delete its CMS application, start page and
  asset folder.
- **The demo-sites root** is two levels above the hub checkout and can have any name (the setup guide suggests
  `demo-sites`). It must be a folder of its own, not your home folder or above. Set `OPPS_ROOT` to its path if
  your checkout is laid out differently.
- **Ports** come from each site's `.env`. `site:new` avoids ports used by running servers, by CMS preview
  hosts, and by every `demo-sites/<opportunity>/<folder>/.env`.

## Building the replica

The full pipeline (Site Recon agent, CMS Block Architect agent, CMS Page Builder and Verifier agent)
is in the `/site-replica` Mark skill. The scripts it relies on:

| Command | What it does |
|---|---|
| `yarn cms:align` | Compares `cms/*.tsx` with the live content types and lints them. Read only. `--fix-allowed` adds your types to lists such as `Page > Content` (union only, never removes). |
| `yarn cms:push` | Pushes content types that are missing from the CMS (`--dry` first). Never updates existing ones. |
| `yarn cms:bulk --spec scripts/specs/<file>.json` | Creates, updates and publishes shared blocks from a spec (`--dry` first). See `scripts/specs/README.md`. |
| `yarn cms:e2e` | Checks every published page of this site: Graph, CMS publish state, composition tree, shared block references and rendered HTML. Read only; renders against the local dev server when it is running. |

## The `main` application

`main` has its own CMS application (`main.optimoey.com`, preview `localhost:3034`) with an empty
start page, and it is the instance **default** application. Content published outside any site's
tree is filed under the default application's host in Graph, so it lands in `main` and never in a
demo site's nav. Site applications are never the default. Graph stamps a page's host when it is
published, so re-publish a page if it was published before its application existed.

## Rules that keep the shared CMS safe

- **One site per worktree.** The scripts refuse to run when `SITE_BRANCH` in `.env` is not the
  checked-out branch, and refuse CMS writes from `main`.
- **Prefix everything.** Every type a site adds starts with its `SITE_PREFIX` (`cms:align` rule L6).
  Only the baseline types on `main` (`Page`, `RichTextBlock`) are unprefixed.
- **Never narrow shared lists.** `Page > Content` allows blocks from every site. A CMS list that is
  a superset of the code is expected (`CMS+` in `cms:align`), not drift.
- **Verify locally.** Deploying is not part of verification: use `yarn dev` and `yarn cms:e2e`.

## Environment

Copy `.env.example` to `.env` for a manual setup (`site:new` writes it for you). Required to run:
`OPTIMIZELY_GRAPH_SINGLE_KEY`. The scripts also need `OPTIMIZELY_CMS_CLIENT_ID` /
`OPTIMIZELY_CMS_CLIENT_SECRET`, `DEPLOYED_URL`, `HOME_PAGE_CONTENT_ID` and `ASSET_BASE_FOLDER_ID`.
`PORT` sets the dev server port (`scripts/run-next.mjs`).

## Learn more

- [Optimizely CMS (SaaS) documentation](https://docs.optimizely.com/content-management-system/)
- [Next.js documentation](https://nextjs.org/docs)
