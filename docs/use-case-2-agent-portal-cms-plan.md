# Use case 2, Independent Agent Portal, in the CMS: plan

**Source mockup:** `public/use-case-2-agent-portal.html` (9 screens, all hard-coded in script)
**Demo guide:** `public/demo-guide-use-cases.html` (use case 2: three lenses, nine-point checklist)
**Pattern to follow:** [ask-liberty-cms-plan.md](./ask-liberty-cms-plan.md) (experience type + section-enabled blocks + shared blocks, pushed with `npm run cms:push`)
**Status:** built and checked, steps 0 to 7 done (this file is the plan and the per-step history; the **reference for how it works and how to demo it is [use-case-2-agent-portal.md](./use-case-2-agent-portal.md)**). Where a URL or decision below differs from the "Current structure" section, that section is right.

---

## Current structure (changed by the user in the CMS after step 3b)

Verified from Graph and the live site on 2026-11-10. This **supersedes the URLs in the sections below** where they differ.

```
Liberty Mutual (start page, /)
└── Independent Agent Portal   /agent             AgentPortal (the login page), published v1329
    ├── Agent Dashboard: Dana     /agent/dana       published v1323
    ├── Agent Dashboard: Tyler    /agent/tyler      published v1324
    ├── Agent Dashboard: Marcus   /agent/marcus     published v1325
    ├── Agent Dashboard: Elena    /agent/elena      published v1326
    └── Agent Priorities          /agent/priorities published v1321
```

- The Portal page (`AgentPortal`, key `fea861e0be974f30b684720b2020e218`) was renamed "Independent Agent Portal" and its URL segment is now `agent`. The `AgentPortal` type now allows **Agent Dashboard** and **Agent Priorities** as children (set in the CMS; mirrored in `cms/agent/AgentPortal.tsx`).
- The original rule-driven dashboard (key `e87a5e63…`, the 14 blocks with per-block rules) **was deleted**. Only the per-agent dashboards (D8) remain.
- Everything above is **published**, not draft. Sign in at `/agent` leads to `/agent/{agent}`, which now exists, so the front door works end to end.

### What this changes in the plan

| # | Impact | Where | Fix |
|---|---|---|---|
| 1 | **FIXED.** **The login page at `/agent` got the full portal header** (avatar, "view as", portal navigation), not the sparse sign-in header. The sign-in chrome is matched on `/agent/login`, which no longer exists. | `SIGNIN_PATH_RE` in `lib/agent/portalConfig.ts` | Match exactly `/agent` (and `/en/agent`) for the sign-in chrome; `/agent/<anything>` stays portal chrome. |
| 2 | **FIXED.** **The portal header's "Home" link and logo went to `/agent`, which is now the login page** (observed on `/agent/dana`: Home links to `/agent`). | `PortalHeader`, `PORTAL_HOME` | Home and logo go to the signed-in agent's own dashboard, `/agent/<key>`. The sign-in header's logo can keep `/agent`. |
| 3 | **FIXED.** **A rejected "Where Sign in leads" value fell back to `/agent`**, which is the login page itself (a loop). | `safeDestination` | Fall back to the default agent's dashboard, `/agent/dana`. |
| 4 | **BUILT, publish to fix.** **The Home + Auto card links to `/agent/home-auto-bundle`, which does not exist yet**, and it is now on live pages. | `AgentPriority` content, step 4 | Build the product page (step 4), or clear that link until then. |
| 5 | **DONE.** **The product page needs to be allowed under the Portal page.** The type only allows Agent Dashboard and Agent Priorities. | `AgentPortal.mayContainTypes`, step 4 | When `AgentProductExperience` is created, add it to the Portal type's allowed children (CMS type update, mirrored in code). |
| 6 | **The "rules decide" demo now rests on the priority cards**, not on per-block rules. With the rule-driven dashboard deleted, no page uses the block-level audience rules (updates by state etc.). The priorities rules, the "Why am I seeing these?" panel and Dana vs Tyler still show checklist items 1 and 2. | demo script | Keep. The block-level rules stay in the code for later use. |
| 7 | **Preview of two agents side by side** (step 6) is simpler: open two dashboard pages. | step 6 | Use `/agent/<key>` pairs; the compare mode on the Priorities page can iframe them. |
| 8 | **Demo script**: start at `/agent` (login), not `/agent/login`; there is no "follows the view-as switch" page. | section 7 | Updated below. |

Not affected: the agent-from-URL logic (`/agent/dana`), the "view as" switch on agent pages, the preview chrome choice (by page type), the priorities page and its cards, the shared blocks, `/bundling`, and the disclosure plan (step 5).

**Fixes 1 to 3 applied and verified** (after the restructuring): `/agent` shows the sparse sign-in header and `/agent/dana`, `/agent/priorities` the full one; Home and the logo lead to `/agent/<key>` for the agent shown (Dana by default, Marcus with the cookie, Elena with `?agent=elena`); a rejected Sign-in destination falls back to `/agent/dana`, never the login page. 30+ pure checks pass (sign-in pattern, home path, destination), `tsc` and my files' lint are clean. Still open from the table: items 4 and 5 (the product page, step 4).

---

## 1. Goal and scope

Rebuild the parts of the agent portal mockup that prove the CMS story, as real CMS content rendered by this Next.js app:

| You asked for | Mockup screen | Built as |
|---|---|---|
| Dashboard experience type | 1 · Dashboard | `AgentDashboardExperience` + audience-aware blocks |
| Product page | 2 · Product page (Home + Auto bundle) | `AgentProductExperience` + existing `Lib*` blocks + a few `Agent*` blocks |
| Priorities page | 3 · Priorities (marketer view) | `AgentPriorities` page type that **holds** the ordered priorities and shows what is live |
| **Portal** page type (login page), added later | 0 · Sign in | `AgentPortal` page type, display name "Portal" |
| Disclosure block | 6 · Disclosure (+ 7 · Two sites) | `AgentDisclosure` shared block, used on the portal and on LM.com |

**Not built:** 4 Preview-as, 5 Components, 8 Audit log. This use case does not use the Mark flow or the sign-in progress-card animation: Sign in goes straight to the dashboard. How the demo covers them is in section 7.

### What each part proves from the demo guide checklist

| Checklist item | How it is shown |
|---|---|
| Rules by role, state and agency | Every priority and every dashboard block carries audience rules. A "Why am I seeing these?" panel shows the match. |
| Two agents see different content | A "view as" switch in the portal header (four agents, as in the mockup). |
| Business user changes a priority, no development | Marketer reorders or hides a priority in the CMS, publishes, the dashboard changes. No code, no release. |
| Preview for each audience | `?agent=` on any portal URL, plus a side-by-side compare on the Priorities page. |
| Central content vs channel variation | Disclosure: one core text, one short channel note per site. |
| Reusable components and design system | Portal pages are built only from governed blocks; card settings live in one place (section 3.3). |
| One update to more than one site | One shared Disclosure block, placed on the portal product page and on LM.com `/bundling`. |
| Permissions, approval, rollback, audit | Shown in the CMS itself (roles, approval workflow, version history). **To verify in this CMS instance**, see section 9. |

---

## 2. Design decisions (change any of these before we build)

| # | Decision | Why |
|---|---|---|
| D1 | **Personalisation = rules stored on the content, evaluated against the signed-in agent's profile** (role, state, agency). The demo identity is one of four agents chosen with a cookie or `?agent=`. In production the profile would come from SSO claims. | It is the only option that shows the rules in the CMS and works the same in preview. Optimizely Personalization/ODP audiences are the production path and can replace the evaluation later without changing the content model. |
| D2 | **Priorities are shared blocks (`AgentPriority`) listed in order on one `AgentPriorities` page.** An agent sees the first three that are on and match. | One list drives the dashboard, the product page's "More ways to bundle" and the Priorities page. Reordering a list is the CMS-native way to "change a priority". |
| D3 | **Two experience types** (dashboard, product) sharing one portal shell, rather than one type with a layout switch. | They have different heroes. (AskLiberty used one type with a layout switch; this is the only difference.) |
| D4 | **Portal chrome (`/agent/*`) differs from LM.com chrome.** `SiteChrome` renders both and a small client component (`ChromeSwitch`) shows the portal header and footer when the URL starts with `/agent`. | The portal header (Home, Quote, Policies, Claims, Sales & marketing, Resources, avatar) is not the LM.com header. A server-side check (the first idea, a header set in the proxy) goes stale: Next.js does not re-render a shared layout on navigation. Existing pages stay untouched. |
| D5 | **Disclosure channel is a display template** (`AgentDisclosure` → "Channel": IA Portal / LM.com) chosen where the block is placed. | The editor sees the choice in Visual Builder. Fallback if display templates misbehave on shared blocks: derive the channel from the URL prefix. |
| D6 | **Agents are defined in code** (`lib/agent/personas.ts`), not in the CMS. | An agent's role, state and agency are identity, not content. It stands in for SSO claims. |
| D7 | **Approval, versioning, rollback and audit are not rebuilt in the website.** The demo shows the CMS's own. | The mockup's fake admin screens (7, 8) are what the CMS already is. |
| D8 | **Per-agent dashboards (decided by the user, after step 3).** Four pages, `/agent/dana`, `/agent/tyler`, `/agent/marcus`, `/agent/elena`, each an Agent Dashboard fixed to its agent ("Show as agent"), with only that agent's blocks and **no per-block rules**. The priority cards still read the shared Agent Priorities page, so a priority change is made once. The original `/agent` page stays as the "follows the view-as switch" dashboard. | Easier for editors (each page holds only what that agent sees) and easier to preview. The agent is read from the URL slug for the header, the "view as" select moves between the agent pages, and the CMS preview follows the page's agent. |

---

## 3. Content model

All keys are prefixed `Agent`, so they cannot clash with the other sites in this shared CMS (none exist today). Property names are stable once pushed. Follow the same rules as AskLiberty: empty fields render empty, every link goes through `safeHref`, "Spacing above" on every block, plain URL text field **and** link picker (plain wins).

### 3.1 Audience rules (one shared property set, `cms/agent/audience.ts`)

Spread into any type that can be targeted: `AgentPriority` and the dashboard blocks.

| Property | Type | Meaning |
|---|---|---|
| `ForProducers`, `ForPrincipals`, `ForServiceReps` | checkboxes | Roles that qualify. **None ticked = all roles.** (The SDK has no multi-select, so three checkboxes.) |
| `States` | list of text | States that qualify. **Empty = all states.** |
| `Agencies` | list of text | Agencies that qualify. **Empty = all agencies.** |

`isEligible(rules, agent)` is one small function used by every block, so the rule is the same everywhere.

### 3.2 Types

| Type | Base | Purpose and main properties |
|---|---|---|
| `AgentDashboardExperience` | `_experience` | Greeting band: role/state/agency chips, "Good morning, {first}", one tagline per role (`TaglineProducer`, `TaglinePrincipal`, `TaglineServiceRep`, with `{state}` `{agency}` `{first}` tokens), two buttons. Below it, a normal Visual Builder canvas. Also `MetaTitle`, `MetaDescription`. |
| `AgentPortal` (display name **Portal**) | `_page` | The login page (mockup screen 0). Split card: left a mist panel (eyebrow, two-tone heading, intro, illustration), right the sign-in form. Properties: `MetaTitle`, `MetaDescription`, `Eyebrow`, `HeadingBold`, `HeadingLight`, `Intro`, `Scene` (illustration: family, road or house), `SignInTitle`, `SignInIntro`, `EmailLabel`, `PasswordLabel`, `RememberLabel`, `ForgotLabel`/`ForgotUrl`, `ButtonLabel`, `NewUserText`, `RequestAccessLabel`/`RequestAccessUrl`, `DestinationUrl` (where Sign in leads, default `/agent`), `DemoNote`. See section 3.5. |
| `AgentProductExperience` | `_experience` | Breadcrumb (one "Label \| URL" per line), centred heading and lead (tokens), two buttons, then a canvas. |
| `AgentPriorities` | `_page` | `ProductPriorities` and `ServicePriorities` (ordered lists of `AgentPriority`), `FeaturedCount` (default 3), card settings (3.3, `QuoteLabel` and `HideTags`: a checkbox cannot default to on, so the setting is "hide"). Renders the marketer-facing "what is live" view (section 4.4). |
| `AgentPriority` | `_component` (shared block) | One priority: title, description, icon (dropdown), up to 4 benefits, link label, link (URL + picker), `QuoteLabel` (button text for service tasks), `Hidden` (turn off without deleting), plus the audience rules. Also renders as a single card if dropped on a canvas. |
| `AgentPriorityCards` | `_component`, sectionEnabled | Heading and the top N eligible priorities from the `AgentPriorities` page (`Group`: product or service). Skips the priority that links to the current page (this is what makes "More ways to bundle" work). Has the "Why am I seeing these?" panel. Audience rules. |
| `AgentTable` | `_component`, sectionEnabled | Heading and a 3-column table (column titles, rows as embedded `AgentTableRow` items). Used for "Bundle opportunities" and "What can be bundled in {state}". Tokens in cells. Audience rules. |
| `AgentUpdatesPanel` | `_component`, sectionEnabled | Cream panel "Updates for {state}", lines as `Date \| Text \| URL`. Audience rules. |
| `AgentLinkList` | `_component`, sectionEnabled | "Your toolkit" style list (`Label \| URL`). Audience rules. |
| `AgentResourceGrid` | `_component`, sectionEnabled | Download cards or list (`Title \| Meta \| URL`), `Layout` choice. Audience rules. |
| `AgentQuoteList` | `_component`, sectionEnabled | "Conversation starters": quotes with a yellow rule. |
| `AgentDisclosure` | `_component`, sectionEnabled, **shared** | `CoreText` (paragraphs separated by a blank line), `NoteIaPortal`, `NoteLmCom`, heading. Display template "Channel". Shows "Updated {date}" from the CMS publish date. |

Plus two embedded item types: `AgentTableRow`, and none other (updates, links, resources and quotes are one-line-per-entry text, as in AskLiberty).

Reused as they are, no change: `LibTitleBlock` (hero), `LibIllustrationBanner` (family), `LibAnswerWithSidebar` (text + "Best-fit clients" callout), `LibBenefitColumnGrid` (three benefits), `LibSectionHeading`.

### 3.3 One-place card settings (the "component governance" demo)

The mockup's Components screen changes the card button text and the "Top priority" tag once and updates 24 pages. Here, `AgentPriorities` holds `QuoteLabel` (e.g. "Start a quote") and `HideTags`. Every priority card on the dashboard and product page reads them from there. It is an honest approximation: governed in one place, no code change, but it is a setting, not a component version.

### 3.4 Agent identity and tokens (code, no CMS type)

- `lib/agent/personas.ts`: Dana (Producer, Texas, Harbor Light), Tyler (Producer, Texas, Lone Star), Marcus (Principal, Florida, Sunrise Coast), Elena (Service rep, Ohio, Buckeye), copied from the mockup.
- `lib/agent/getAgent.ts`: reads `?agent=` then the `lm_agent` cookie, else Dana. Wrapped in `React.cache` so one request resolves it once.
- `lib/agent/tokens.ts`: replaces `{first}`, `{state}`, `{agency}`, `{role}` in text. Plain string replacement, no HTML.
- `app/api/agent/route.ts`: sets the cookie from the "view as" switch (POST, JSON only, validated against the four keys, 204, no redirect). `?agent=` is handled in `proxy.ts`: valid values become a request header for that one request, never a cookie, so the side-by-side preview cannot change the visitor's own choice.
- `lib/agent/eligibility.ts` holds `isEligible` (pure, tested); `cms/agent/audience.ts` holds only the CMS properties.
- `AGENT_DEMO_SWITCH=off` disables the switch (everyone is Dana, `/api/agent` returns 404) for a deployment where visitors must not choose an identity.

### 3.5 The Portal (login) page

- **What the visitor sees:** as the mockup. The email field shows the chosen agent's address. **Demo only:** a "Sign in as" select (the same four agents as the "view as" switch) sits in the form so the presenter chooses who signs in.
- **What Sign in does:** stores the chosen agent with the existing `/api/agent` route (same cookie, same allow-list), then goes to `DestinationUrl`. No progress animation (decided earlier).
- **No credentials are collected.** The password box is for show: it has no `name`, is never sent anywhere, and the page says so in `DemoNote` ("Demo sign-in. Choose an agent; no password is checked or stored."). A real portal signs in through the company's SSO instead.
- **Header and footer:** the mockup's sign-in header is the logo with Help and Español only (no portal navigation, no agent), plus the portal footer. `ChromeSwitch` gets a third variant for the login URL.
- **Link targets** go through `safeHref`; `DestinationUrl` must be a path on this site (a full `https://` address is ignored), so the page cannot be used to send a visitor elsewhere.

---

## 4. Rendering and runtime

### 4.1 Rendering is per agent
Portal pages read the agent, so they are rendered per request, not cached. The catch-all already reads the request host, so it is already dynamic; no change to caching is needed. Graph fetches stay cached per request.

### 4.2 Reading the priorities
`AgentPriorityCards` needs the items of the `AgentPriorities` page, which is a different item from the page being rendered. The question is whether the SDK returns the nested content area with its properties when fetching it by key (the AskLiberty home does get its `Questions` inline, but that is the page's own property). **Step 0 spike.** Fallback: one Graph query for the page's two lists.

### 4.3 Chrome
- `SiteChrome` renders the LM.com chrome and the portal chrome (`app/_components_portal/`: `PortalHeader`, `PortalFooter`). `ChromeSwitch` (client) shows the portal one on URLs starting `/agent` (also `/en/agent`, in case the rewritten path is seen).
- `/preview` is never a portal URL, so the preview page chooses its own chrome: for content whose type key starts with `Agent` it passes `force="portal"` to `SiteChrome`. The preview layout no longer adds chrome itself. It also honours `?agent=dana` (checked against the four agents, and only while the demo switch is on).
- **Which header (rule: `chromeFor` in `lib/agent/portalConfig.ts`, tested, 26 cases).** The four portal variants, all built from the same simple header component (`SignInHeader`): (1) **signin**, the login page `/agent` (`/agent/` redirects): logo, Help, Español. (2) **agent**, the four dashboards (`/agent/dana`, `/agent/tyler`, `/agent/marcus`, `/agent/elena`) **and the product page** (`/agent/home-auto-bundle`): logo, notification bell, and the agent's initials circle with name and company (shared `AgentIdentity`); no menu, no "view as", no Help or Español. (3) **plain**, the priorities page (`/agent/priorities`): the logo only. (4) **portal**, the full header (menu, search, bell, agent, "view as"): now used by **no current page**; it is the fallback for any other `/agent/*` page added later and for 404s there. In the CMS preview the header is chosen by page type (`AgentPortal` signin, dashboard and product page agent, priorities plain, other `Agent*` types portal). The simple header's logo leads to the login page, which is now also the only way to switch agent (the "view as" select exists only in the full header). Dashboard and product pages have 1.5rem of space under the header (`pt-6`). Decided by the user after step 4.
- The "view as" switch sits in the portal's utility row. The header's "Sales & marketing" underline is not wired yet (step 4).

### 4.4 The Priorities page
At `/agent/priorities`, `AgentPriorities` renders for a marketer: both lists in order with rank, icon, audience chips (role, state, agency, highlighted when specific) and a "hidden" mark, plus an **Agent view** panel with an agent dropdown and the dashboard in an iframe (`/agent?agent=…`). A second dropdown gives a side-by-side compare, which covers "Preview for each audience". Editing happens in the CMS editor, not on this page. The page says so ("Edit in the CMS to change what agents see").

### 4.5 Preview and Visual Builder
Same rule as AskLiberty: anything with a `preview_token` turns off interactions that would navigate the editor frame. A block whose rules match the previewed agent shows a small "Shown to: Producers · Texas · All agencies" badge. A block that does not match collapses to one line ("Hidden for Dana · shown only to Principals · All states · All agencies · \"Heading\"") so an editor can still find and select it, without its text being filled in for the wrong agent. Use `?agent=` on the preview URL to see it as someone it matches.

---

## 5. Content to create in the CMS

| Item | Address | Notes |
|---|---|---|
| Portal (login) | `/agent` | `AgentPortal`, child of the start page; **the parent of the dashboards and the priorities page** (see "Current structure"). Copy from the mockup's sign-in screen. |
| Independent Agent Portal (dashboard) | `/agent` | `AgentDashboardExperience`. Canvas: product cards (Producer and Principal), service cards (Service rep), three opportunity tables (one per role), three updates panels and three resource grids (one per state), three toolkit lists (one per role). 14 audience-ruled blocks in all, as the mockup has data for them. |
| Agent Dashboard: Dana, Tyler, Marcus, Elena (added after step 3) | `/agent/dana`, `/agent/tyler`, `/agent/marcus`, `/agent/elena` | `AgentDashboardExperience`, children of `/agent`, each with `ForAgent` set. Five rule-free blocks each: priority cards, table, updates, toolkit, resources. |
| Priorities | `/agent/priorities` | `AgentPriorities`. Eight `AgentPriority` shared blocks (Condo + Auto, Home + Auto, Renters + Auto, Umbrella, Motorcycle, Make a policy change, Billing, Report a claim), rules copied from the mockup. |
| Home + Auto bundle | `/agent/home-auto-bundle` | `AgentProductExperience`. Canvas: illustration, text with best-fit sidebar, three benefits, bundle table, "More ways to bundle" cards, conversation starters, resources, Disclosure (channel: IA Portal). |
| Bundle savings disclosure | shared block, folder "Agent Portal" | Core text = v3 wording from the mockup. |
| LM.com bundling page | `/bundling` (existing AskLiberty page) | Add the same Disclosure block, channel: LM.com. This is the "second site" in the demo. |

---

## 6. Build steps

Each step ends with `npx tsc --noEmit`, `npx eslint cms app`, `npm run cms:check`, and a look in the browser.

0. **Spike. DONE (read-only, nothing pushed).** (a) Referenced page's content area returns item properties: **confirmed live (step 2).** (b) A display template on a shared block is delivered to the renderer: **expected to work, confirm when pushing in step 5.** (c) The cookie and `?agent=` reach the page inside the CMS preview frame: **cannot be tested without the editor, check in step 1.** Details below.

   - (a) **Confirmed live in step 2.** The running AskLiberty home renders its suggested-question chips from the shared `LibAskQuestion` blocks in its `Questions` content area (no extra fetch). An earlier Graph query returned an empty list only because it read old "Previous" versions. The Priorities page then rendered all eight shared priorities the same way. Condition: the item type must be in the property's `allowedTypes`, which is what makes the SDK ask for its fields. So `AgentPriorities` must list `AgentPriority` there, and the cards block must fetch the `AgentPriorities` page itself by key (a reference property alone only gives `{ key, url }`). The published AskLiberty home currently returns an empty `Questions` list because that change is still a draft, so it could not be used as a live proof.
   - (b) This CMS already has display templates on component types (e.g. `LoginForm`, `SharedContent`). The SDK passes a node's display settings to its component whether the node is embedded or a shared reference (`react/server.js`, component branch). Not yet proven for a shared block, so step 5 pushes the template first and tests it before building around it. The fallback (channel from the URL prefix) stays in the plan.
   - (c) `app/preview/page.tsx` renders from the CMS's own query string, so `?agent=` cannot be added by an editor. Preview will use the default agent unless the cookie survives the frame. Mitigation is already in section 4.5 (audience badges show every block).
1. **Foundation. DONE, see "Step 1 outcome" below.** `lib/agent/*`, `cms/agent/audience.ts`, `PortalHeader`/`PortalFooter`, `ChromeSwitch`, `/api/agent`, the `?agent=` handling in `proxy.ts`.
2. **Priorities. DONE as drafts, see "Step 2 outcome" below.** `AgentPriority`, `AgentPriorities` (read-only render), push, the eight shared blocks and the page. Also created `AgentDashboardExperience` and the `/agent` page now, because `/agent/priorities` needs its parent to exist.
3. **Dashboard. DONE as a draft, see "Step 3 outcome" below.** `AgentPriorityCards` (with the why panel), `AgentTable`, `AgentUpdatesPanel`, `AgentLinkList`, `AgentResourceGrid`; the `/agent` canvas; the preview fixes.
3b. **Portal (login) page. DONE as a draft, see "Step 3b outcome" below.** `AgentPortal` type and renderer, the sign-in header variant in `ChromeSwitch`, the Sign in action (calls `/api/agent`, then goes to `DestinationUrl`). (Added later at the user's request.)
4. **Product page. DONE as a draft, see "Step 4 outcome" below.** `AgentProductExperience`, `AgentQuoteList`. Push, build the page from the existing `Lib*` blocks.
5. **Disclosure.** `AgentDisclosure` and its display template. Create the shared block, place it on the product page and on `/bundling`. Edit the text, publish, confirm both pages change.
6. **Priorities view. DONE, see "Step 6 outcome" below.** The agent-view panel and compare mode on `/agent/priorities`.
7. **Finish.** Register everything in `cms/registry.ts`, update `scripts/check-content-types.mjs` if it misses `cms/agent/`, write `docs/use-case-2-agent-portal.md` (as the use case 1 doc), commit.

**Rules while building (same as AskLiberty):** never run `cms:push:all`; `cms:push` only pushes types that do not exist, so to add a property to an existing type use the CMS type-update tool and mirror it in code; restore `lib/locales.generated.ts` before committing; the CMS preview URL must point at `http://localhost:<PORT>/preview` for local testing.

### Step 1 outcome (done)

Built: the four agents, `getAgent` (query, then cookie, then default Dana; allow-listed), `isEligible`, `applyTokens`, the audience properties, `/api/agent`, the portal header and footer with the "view as" select, and the chrome switch.

Checked: `tsc` and `eslint` clean. 30 checks on the eligibility rule, the allow-list and the tokens pass (the plan's own rules: Condo + Auto matches only Marcus, Renters + Auto only Dana and not Tyler, empty rules match everyone, a typo in a rule matches nobody). On the running dev server: `/agent` shows the portal chrome and `/rental-car` the LM.com chrome; `?agent=elena` shows Elena for that request only; a cookie shows Marcus; an unknown `?agent=` value, a tampered cookie and a spoofed `x-agent` header all fall back safely; the route returns 204, 400, 415 or 405 as expected.

Not checked: how it **looks** (HTML only, no browser), the production `Secure` cookie flag, `AGENT_DEMO_SWITCH=off`, and the CMS preview frame (step 0 item c). `/agent` has no CMS page yet, so it shows the chrome around an empty body.

### Step 2 outcome (done, **drafts, not published**)

Types pushed (only these three, via `npm run cms:push`): `AgentPriority`, `AgentPriorities`, `AgentDashboardExperience`. `npm run cms:check`: 45 present, 0 missing.

| Item | Key | Draft version |
|---|---|---|
| Independent Agent Portal, `/agent` (dashboard) | `e87a5e6386b64316814bfe37ed3b8edb` | 1320 |
| Agent Priorities, `/agent/priorities` | `245f4338ae6b4fdd90296fea2a364b73` | 1321 |
| Condo + Auto bundle | `ea03c9abe94a463c86ac500c5de42aa3` | 1313 |
| Home + Auto bundle | `66a7110ef67b41b4a4b3671f4d2fe8e2` | 1312 |
| Renters + Auto | `41882f2b8a7f410ea3fbd0fccd2d2dab` | 1314 |
| Personal umbrella | `ff677ac200484ddd88d7b016a80e2204` | 1315 |
| Motorcycle add-on | `d0c528306ca146c8b80eb6b0deb6ed53` | 1316 |
| Make a policy change | `290392d021f448f6a9460a44598c2ecd` | 1317 |
| Billing and payments | `e0a8b35843994d348df8db6873e7dff7` | 1318 |
| Report a claim for a client | `96a67a882adb4dcf9e54ea7b467f4691` | 1319 |

Differences from the plan:
- **Dashboard type created early**, with its full property set, including an optional **Show as agent** choice. Empty = the page is for whoever is viewing (one rule-driven page). Set = always shown as that agent (one page per agent). Both dashboard options stay open, and step 3 needs no type change.
- **No separate "Agent Portal" folder.** The CMS tool cannot create folders (it insists on a locale, which folders reject). The eight blocks are named "Agent Priority: …" and sit in the **"Liberty Mutual"** folder (key `a5071b3e9d0941c69eec996617091f6a`, the `ASSET_BASE_FOLDER_ID` folder). I created them with the container key `e56f85d0…` from the AskLiberty plan, which the CMS treats as an alias for that folder: Graph reports `a5071b3e…` as the container of all eight, and of the existing AskLiberty shared blocks too. They can still be moved into a sub-folder in the CMS UI.
- **Home + Auto links to `/agent/home-auto-bundle`**, which does not exist until step 4.
- `QuoteLabel` and `HideTags` are on the priorities page; the cards that read them come in step 3.

Checked: both drafts render through the CMS preview URL. The Priorities page shows all eight in order with the right rule chips (e.g. "Producers · Texas · Harbor Light Insurance Group only"); the dashboard shows Dana's greeting and Texas tagline. `tsc` clean; my files lint clean (the 2 errors and 1 warning that remain also exist without my changes).

Found: `?agent=` has no effect on `/preview` (the proxy skips it) and `/preview` shows the LM.com chrome. Both to be fixed in step 3.

### Step 3 outcome (done, **draft, not published**)

Types pushed (only these six, via `npm run cms:push`): `AgentPriorityCards`, `AgentTable`, `AgentTableRow`, `AgentUpdatesPanel`, `AgentLinkList`, `AgentResourceGrid`. `npm run cms:check`: 51 present, 0 missing.

The `/agent` dashboard (key `e87a5e6386b64316814bfe37ed3b8edb`, draft version 1320) now has 14 blocks on its canvas, all inline (none are shared blocks, so the asset folder is not involved): two priority-card blocks (products for producers and principals, service tasks for service reps), three opportunity tables (one per role), three updates panels and three resource grids (one per state), three toolkit lists (one per role). Each carries its audience rule.

Checked through the CMS preview URL for all four agents:

| Agent | Cards (in order) | Not matched, and why | Also sees |
|---|---|---|---|
| Dana (Producer, Texas, Harbor Light) | Home + Auto (Top priority), Renters + Auto, Personal umbrella | Condo + Auto: Florida only | Producer table and toolkit, Texas updates, "Resources for Texas producers" |
| Tyler (Producer, Texas, Lone Star) | Home + Auto, Personal umbrella, Motorcycle add-on | Condo + Auto: Florida only; Renters + Auto: Harbor Light agencies only | same as Dana |
| Marcus (Principal, Florida) | Condo + Auto (Top priority), Home + Auto, Personal umbrella | Renters + Auto: Not for principals | Principal table, "Agency management", Florida updates, "Resources for Florida agencies" |
| Elena (Service rep, Ohio) | Make a policy change (Most used), Billing and payments, Report a claim | none | Service table, "Service tools", Ohio updates, "Resources for Ohio service teams" |

Dana and Tyler are both Texas producers and still see different cards, which is the agency rule at work. 9 of the 14 blocks are hidden for any one agent. Greeting chips and taglines are right for each role. The card button text ("Start a quote") comes from the Agent Priorities page.

Also done in this step: the preview chrome and `?agent=` fixes (4.3), and "Show as agent" on the dashboard type now applies to every block on the page (the header still shows the viewer's own agent in that case).

Differences from the mockup: the "Why am I seeing these?" link sits under the heading and opens a panel (a native `<details>`), not a right-aligned button; the updates, toolkit and resource blocks stack full width instead of the mockup's 2-column layout; the card tags ("Top priority", "Featured", "Most used", "Service") are fixed text.

Not checked: how it looks in a browser (HTML only), the on-page editing overlays in the real Visual Builder, the cookie inside the CMS preview frame, and the CMS preview of **non-portal** content after the preview route change (the code path is unchanged for it, but I did not load one).

### Step 3 addendum: per-agent dashboards (done, **drafts, not published**)

Added after the user chose four dashboards (D8). Created as children of `/agent`, display names start with "Agent Dashboard:" so they are easy to find in the CMS:

| Page | URL | Key | Draft version |
|---|---|---|---|
| Agent Dashboard: Dana Whitfield (Producer, Texas) | `/agent/dana` | `bbabe9512325450c802ec7108d40d1a5` | 1323 |
| Agent Dashboard: Tyler Brooks (Producer, Texas) | `/agent/tyler` | `de8ea116f73d42feae71b613629b2d80` | 1324 |
| Agent Dashboard: Marcus Chen (Agency Principal, Florida) | `/agent/marcus` | `a9644c1c976f4fdba121d453137444a4` | 1325 |
| Agent Dashboard: Elena Ruiz (Service Representative, Ohio) | `/agent/elena` | `33996f73b8924fcea404f34ea8bf272f` | 1326 |

Code added: `agentKeyFromPath` (allow-listed, tested with 20 cases), the proxy sets the request's agent from `/agent/<key>` (an explicit `?agent=` wins, any client-sent `x-agent` is dropped), `AgentSwitch` navigates to the chosen agent's page when on a per-agent page, and the preview page previews a page that has "Show as agent" as that agent, header included.

Checked through the CMS preview URLs: each page greets its own agent, the header avatar matches, and the cards, tables, updates and resources match the table in the step 3 outcome (Dana and Tyler differ by the agency rule; Condo + Auto and Renters + Auto are listed under "Not matched" with their reasons). No audience badges or hidden-block notes appear (the blocks have no rules). Dana's page opened with `?agent=elena` still shows Dana. `tsc` and my files' lint clean.

Not checked: the live (published) URLs, since the pages are drafts; the "view as" select navigating in a real browser (client code); how it looks.

### Step 3b outcome (done, **draft, not published**)

Type pushed (only this one, standard push): `AgentPortal`, display name **Portal**, a `_page`. `npm run cms:check`: 52 present, 0 missing.

Page: **Portal (agent sign-in)**, `/agent/login`, key `fea861e0be974f30b684720b2020e218`, draft version 1327, a child of the dashboard page `/agent`. Copy is from the mockup's sign-in screen.

What it does: a split card (welcome and illustration left, form right). A **Sign in as (demo)** select chooses one of the four agents; the email box shows that agent's address (read-only); **Sign in** stores the choice with `POST /api/agent` and goes to `DestinationUrl`, set to `/agent/{agent}`, so the chosen agent lands on their own dashboard. If the demo switch is off (`AGENT_DEMO_SWITCH=off`) the picker is hidden and Sign in goes to the destination as the default agent.

Safety: no input has a `name`; the email and password boxes are read-only **text** boxes (the password one shows bullets; neither is `type=email` or `type=password`) and carry the opt-out attributes for LastPass, 1Password, Bitwarden and Dashlane, so no password manager injects icons into them (a LastPass icon caused a React hydration warning on `/agent`, fixed) and nothing typed or shown is submitted; the form is disabled in the CMS editor; the demo note on the page says no password is checked or stored. `DestinationUrl` is accepted only as a path on this site (not `//host`, a backslash form, a control character, or a full address), otherwise `/agent`; `{agent}` is always one of the four allow-listed keys.

Header: `/agent/login` gets the sparse sign-in header (logo, Help, Español) with the portal footer, chosen from the URL in the browser like the other variants, and from the page type in the CMS preview.

Checked: `tsc` clean and `eslint` clean on my files; 34 checks on the destination rule and the login/portal URL patterns pass; the chrome for `/agent/login`, `/agent/dana` and `/rental-car` is right; the CMS preview of the draft renders the page with the form safe as described, preselects the agent from `?agent=` (Marcus's email shows for `?agent=marcus`).

Not checked: clicking Sign in in a real browser (the POST then navigation is client code; the route itself was tested in step 1 and the destination rule above), how the page looks, and the page when published.

### Step 4 outcome (done, **draft, not published**)

Types pushed (only these two): `AgentProductExperience` (display name "Agent Product Page") and `AgentQuoteList`. Two **updates to existing types**, done with the CMS type-update tool (non-breaking) and mirrored in code: the **Portal** type now also allows `AgentProductExperience` as a child, and **`AgentPriorityCards`** gained two properties, `SkipLinkedTo` (a page path to leave out) and `HideCardTags`. `npm run cms:check`: 54 present, 0 missing.

Page: **Agent Product Page: Home + Auto bundle**, `/agent/home-auto-bundle`, key `1003f43859804032bf719aa607306f70`, draft version 1330, a child of the Portal page. Canvas: illustration, "One conversation, two policies." with the Best-fit clients sidebar, three benefit columns, "What can be bundled in {state}", "More ways to bundle", Conversation starters, Resources (the first three are the existing Liberty blocks; the rest are Agent blocks). The disclosure goes at the bottom in step 5.

Checked through the CMS preview for all four agents: the lead, the table heading, the availability cells and the last resource show the viewer's state (Texas, Texas, Florida, Ohio); "More ways to bundle" leaves out Home + Auto (itself) and follows the agent's rules (Dana: Renters + Auto, Personal umbrella, Motorcycle; Tyler: umbrella, motorcycle, as Renters + Auto is Harbor Light only; Marcus: Condo + Auto, umbrella, motorcycle; Elena has no product priorities, so the block shows only an editor note and vanishes for visitors); no card tags; the breadcrumb Home and the header Home go to the agent's own dashboard; on the real URL the header underlines "Sales & marketing". `tsc` clean, my files' lint clean, and the new helper checks pass (active menu item, `{key}` token).

Differences from the plan and the mockup:
- **"More ways to bundle" leaves out the current page through an explicit property** (`SkipLinkedTo` = `/agent/home-auto-bundle`), not automatically. Visible to editors and no hidden magic.
- **The product page is a 5xl column** (like the Liberty blocks); the portal blocks are narrowed to match inside it.
- **Resources are cards**, not the mockup's list with icons.
- **The cards on this page have no tags** and no yellow top rule (`HideCardTags`), as in the mockup.
- **New token `{key}`** (the agent's key) for paths such as `/agent/{key}` in the breadcrumb.
- **The header menu shows the active item** (yellow underline): a small client component reads the URL. In the CMS preview (URL `/preview`) it always shows "Home".

Not checked: how it looks, the page when published (Home + Auto's card link goes live-correct only then), and the on-page editing overlays.

### Step 5 outcome (done; the placements were made by the user in the CMS)

Built and pushed (only these): the `AgentDisclosure` shared block and the **Channel** display template (`AgentDisclosureChannel`: IA Portal / LM.com). `npm run cms:check`: 55 present, 0 missing.

The shared block: **Agent Disclosure: Bundle savings**, key `917dbb01b0df49f889ddd4d72540fe1f`, published v1331, in the `ASSET_BASE_FOLDER_ID` folder ("Liberty Mutual"). Core text is the mockup's approved v3 wording; each channel has its own note; the block shows "Updated {date}" from its publish date.

Placed by the user, by reference, with a Channel chosen on each placement; both pages are published:
- **`/agent/home-auto-bundle`** (product page, key `1003f43859804032bf719aa607306f70`): Channel **IA Portal**.
- **`/bundling`** (existing AskLiberty page, key `7eee3068a3174e28bc5fb77cd43aee3b`, now v1332): Channel **LM.com**.

**Verified on the live site (read-only):** the display template works on a shared block (open question D5 / step 0 item b: **resolved**, no fallback needed). The product page shows the core text plus "For use by licensed independent agents. Not for distribution to customers or prospects."; `/bundling` shows the same core text plus "Questions about your coverage? Talk to a local agent or call us 24/7."; each page shows the block exactly once, as "Updated Nov 10, 2026"; every original section of `/bundling` is still there; on the product page the disclosure text and note are the same for every agent while the rest of the page follows the viewer (Texas, Florida, Ohio).

Observed, not changed: on the product page the block sits after the benefit columns (before the table) and "More ways to bundle" is now last; the mockup puts the disclosure at the very bottom. On `/bundling` it is the last block, below "Last reviewed".

Not done by me (presenter or CMS UI): the live edit to the v4 wording with review, approval, publish and rollback (checklist items 5, 8, 9). I did not change live text. Still to verify **in the CMS**, because I cannot check it from here: that this instance has an approval workflow, roles for author/approver/publisher, version compare and restore, and an activity log (section 9).

Note: the CMS management tool failed ("API connectivity problem", "Authorization failed", then HTTP 500) while I tried to place the block; Graph kept working. The user made the placements in the editor instead. The tool may still need re-authorizing.

### Step 6 outcome (done; this is code, so it is live on the already-published priorities page)

Added to the **Agent Priorities** page (`/agent/priorities`), below the two lists: a **"Preview by agent audience"** section (`app/_components_portal/AgentCompare.tsx`, a client component, wired into `cms/agent/AgentPriorities.tsx`). Two views side by side, each with its own agent picker (the four demo agents), chips for the chosen agent's role, state and agency, a scaled-down live frame of that agent's dashboard (`/agent/<key>`), and an "Open <name>'s dashboard" link. Defaults: View A = Dana (Texas producer), View B = Marcus (Florida principal). On narrow screens the views stack. It shows the **published** dashboards, as the section says ("change the priorities above, publish, and reload").

This covers checklist items 2 and 4 (two agents with different roles or agencies see different content; preview for each audience) with the real pages, not a mock-up. With the CMS preview, an editor can still open any draft through Visual Builder.

Checked: `tsc` clean, my files' lint clean; the page output has both frames (`/agent/dana`, `/agent/marcus`, lazy-loaded, titled), both pickers with the right agent selected, the lists intact and the logo-only header; the two frame targets load and greet Dana and Marcus; the site sends no frame-blocking headers, so same-site frames load.

Not checked (needs a browser): changing a picker, the scaling to the column width, how it looks. Frame size is 1200 by 1100 scaled to fit.

Notes: the section's wording is fixed text in the code, not editable in the CMS (making it editable would mean new properties on the type and a re-publish of the page). The framed dashboards are tall; each frame scrolls inside itself. The site has no `X-Frame-Options` or `frame-ancestors` header at all (checked); that is the existing setting for every page, and the CMS editor needs to frame the site, so I left it alone, but it is worth a deliberate decision before any production use.

---

## 7. Demo script
 (maps to the guide)

0. **Front door.** Open `/agent` (the login page), choose Dana, Sign in: `/agent/dana` opens.
1. **Agent experience.** Open `/agent/dana` (Texas producer): three product cards, Texas updates and resources. Open "Why am I seeing these?". Switch to Elena (Ohio service rep): different cards, tables, tools. Switch to Marcus (Florida principal): Condo + Auto is first.
2. **Business user.** In the CMS, open Agent priorities, move Umbrella above Home + Auto, publish. Reload Dana's dashboard: it changed. Hide a priority: it disappears.
3. **Preview per audience.** `/agent/priorities`, compare Dana and Marcus side by side. In Visual Builder, show the audience badges on blocks.
4. **Consistent design.** Open the product page and the dashboard: same portal chrome and blocks. Change the card button label in Agent priorities: all cards change.
5. **Shared content.** Edit the disclosure, submit for approval, approve, publish. Show `/agent/home-auto-bundle` and `/bundling`: both updated, each with its own channel note. Restore the previous version from version history.
6. **Governance.** Show roles, the approval step, version history and the audit trail **in the CMS**.

---

## 8. Differences from the mockup (expected)

- **Sign in is a demo.** It chooses one of the four agents and opens the dashboard. No password is checked or stored, and there is no progress animation (the Mark-style card from the mockup is not used).
- **Columns stack.** The mockup puts the opportunity table beside the updates and toolkit panels. Section-enabled blocks stack, as the claim cards did in AskLiberty.
- **Editing is the CMS, not a custom screen.** Reorder, hide, publish and discard are the CMS editor's, not drag handles on a web page.
- **Audit log, approval and rollback are the CMS's own**, so they look like the CMS, not like the mockup.
- **Dates.** The mockup's `Oct 1 – Dec 31` priority dates are unused there and left out. A start/end date on `AgentPriority` is a small later addition.

---

## 9. Risks and things to verify

- **A login-looking form.** The Portal page must never collect or send a real password (section 3.5). Keep the demo note visible, and keep the password box unnamed and unsent.
- **Approval workflow and roles.** Confirm this CMS instance has an approval workflow, roles for author, approver and publisher, version compare and restore, and an activity log. Checklist items "permission and role separation" and "approved, auditable, reversible" depend on it. If something is missing, we show the closest feature and say so.
- **Preview and cookies.** If the preview frame blocks the agent cookie, previews always show the default agent. The audience badges (4.5) still let an editor see every block.
- **Two lists, one setting.** Priorities are ordered per group, so "move Umbrella above Home + Auto" works only inside the product list. That matches the mockup (its list is per group too).
- **Shared CMS.** Other sites use the same instance. Keys are prefixed and nothing existing is edited except adding the Disclosure to `/bundling`.
- **Content volume.** 14 audience-ruled dashboard blocks is a lot of content entry. Build it with the CMS tools in one batch per role, as done for the AskLiberty pages.

---

## 10. To confirm before building

1. **Priorities page.** Read as: a CMS page that holds the ordered priorities (edited in the CMS) and shows a read-only "what is live" view with agent preview. Not a copy of the mockup's drag-and-drop admin screen.
2. **URLs.** Portal under `/agent`, LM.com side of the disclosure demo = the existing `/bundling` page.
3. **Rules approach (D1).** Rules on content plus a demo agent switch, not Optimizely Personalization audiences.

(Mark flow and the sign-in animation: out of scope. The Portal login page: added, section 3.5.)
5. **Login URL.** Decided by the user's restructuring: the login page is the portal root `/agent` (see "Current structure").
