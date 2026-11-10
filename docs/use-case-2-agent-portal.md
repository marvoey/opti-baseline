# Use Case 2: Independent Agent Portal (CMS build, reference)

**Mockup:** `public/use-case-2-agent-portal.html` (9 screens). **Demo guide:** `public/demo-guide-use-cases.html`, use case 2.
**Build history, decisions and per-step checks:** [use-case-2-agent-portal-cms-plan.md](./use-case-2-agent-portal-cms-plan.md).
**What this is:** the Independent Agent Portal rebuilt as real CMS content rendered by this Next.js app. One shared list of priorities, rules for who sees what, one dashboard per demo agent, a product page, and a disclosure managed once and shown on the portal and on LM.com. No Mark flow and no sign-in animation are used.

> **The agent identity is a demo.** Dana, Tyler, Marcus and Elena are four fixed demo agents. "Signing in" only chooses one of them. No password is checked or stored, and nothing here is authentication. A real portal takes the agent from the company's single sign-on.

---

## 1. The pages

| Page | URL | Type | CMS key |
|---|---|---|---|
| Independent Agent Portal (sign in) | `/agent` | `AgentPortal` ("Portal") | `fea861e0be974f30b684720b2020e218` |
| Dashboard: Dana Whitfield (Producer, Texas, Harbor Light) | `/agent/dana` | `AgentDashboardExperience` | `bbabe9512325450c802ec7108d40d1a5` |
| Dashboard: Tyler Brooks (Producer, Texas, Lone Star) | `/agent/tyler` | same | `de8ea116f73d42feae71b613629b2d80` |
| Dashboard: Marcus Chen (Agency Principal, Florida, Sunrise Coast) | `/agent/marcus` | same | `a9644c1c976f4fdba121d453137444a4` |
| Dashboard: Elena Ruiz (Service Representative, Ohio, Buckeye) | `/agent/elena` | same | `33996f73b8924fcea404f34ea8bf272f` |
| Agent Priorities (marketing's list, plus the compare view) | `/agent/priorities` | `AgentPriorities` | `245f4338ae6b4fdd90296fea2a364b73` |
| Home + Auto bundle (product page) | `/agent/home-auto-bundle` | `AgentProductExperience` | `1003f43859804032bf719aa607306f70` |
| Bundling (existing AskLiberty answer, LM.com side of the disclosure) | `/bundling` | `AskLibertyExperience` | `7eee3068a3174e28bc5fb77cd43aee3b` |

Tree: start page → Independent Agent Portal (`/agent`) → the four dashboards, Agent Priorities and the product page. The `AgentPortal` type allows exactly those three child types.

Shared blocks (all in the `ASSET_BASE_FOLDER_ID` folder, "Liberty Mutual"): eight **Agent Priority** blocks (Condo + Auto `ea03c9ab…`, Home + Auto `66a7110e…`, Renters + Auto `41882f2b…`, Personal umbrella `ff677ac2…`, Motorcycle add-on `d0c52830…`, Make a policy change `290392d0…`, Billing and payments `e0a8b358…`, Report a claim for a client `96a67a88…`) and **Agent Disclosure: Bundle savings** (`917dbb01b0df49f889ddd4d72540fe1f`).

## 2. How a visitor moves through it

1. `/agent`: the sign-in page. Choose one of the four demo agents ("Sign in as (demo)"), press Sign in.
2. Sign in stores the choice (one cookie) and opens that agent's dashboard, `/agent/<name>`.
3. On a dashboard: the greeting for that agent, their focus cards (with "Why am I seeing these?"), and the blocks for their role and state. The Home + Auto card opens the product page.
4. The logo on the dashboards leads back to the sign-in page, which is how you switch agent. `/agent/priorities` is the marketer's view.

**Headers** (rule: `chromeFor` in `lib/agent/portalConfig.ts`, chosen from the URL; in the CMS preview by page type):

| Header | Pages |
|---|---|
| Logo, Help, Español | `/agent` |
| Logo, notification bell, agent's initials, name and company | the four dashboards and the product page |
| Logo only | `/agent/priorities` |
| Full portal header (menu, search, bell, agent, "view as") | no page today; fallback for any other `/agent/*` page |
| LM.com header | everything else |

## 3. How personalisation works

- **Who is the agent** (`lib/agent/getAgent.ts`), in this order: a page's "Show as agent" setting; `?agent=dana` (that request only, never stored); the `/agent/<name>` in the URL; the `lm_agent` cookie; else Dana. Every value is checked against the four fixed keys; anything else is ignored. `AGENT_DEMO_SWITCH=off` turns the choosing off (everyone is Dana).
- **Rules on content.** A priority (and any dashboard block that carries rules) has: three role checkboxes (none ticked = every role), "Only these states" (empty = every state), "Only these agencies" (empty = every agency). One function, `isEligible`, decides, so a card and a table can never disagree. Examples that are live: Condo + Auto is Florida producers and principals only; Renters + Auto is Texas producers at Harbor Light only (so Tyler does not get it, Dana does).
- **The cards** (`AgentPriorityCards`) read the ordered lists on the Agent Priorities page and show the first N (default 3) that are on and match. The "Why am I seeing these?" panel shows the match and what was not matched and why.
- **Per-agent dashboards.** Each dashboard has "Show as agent" set, so everything on it (and its header) is for that agent. The blocks on them carry no rules; the priority cards are the rule-driven part.
- **Tokens** in text: `{first}` `{name}` `{key}` `{role}` `{people}` `{state}` `{agency}`. The product page uses them: its lead, the table heading and the last resource follow the viewing agent.

## 4. The content model

| Type | Kind | What it is |
|---|---|---|
| `AgentPortal` | page | Sign-in page: welcome panel, illustration, demo sign-in form. "Where Sign in leads" defaults to `/agent/{agent}`. |
| `AgentDashboardExperience` | experience | Greeting band (role, state, agency, taglines per role, two buttons), then a canvas. Optional "Show as agent". |
| `AgentProductExperience` | experience | Breadcrumb, centred heading and lead, two buttons, then a canvas. |
| `AgentPriorities` | page | Two ordered lists of Agent Priority blocks, "cards per agent", quote button text, "hide tags"; shows the lists with rule chips and the compare view. |
| `AgentPriority` | shared block | One product or service task: title, text, icon, benefits, link, button text, "turn off", plus the rules. |
| `AgentPriorityCards` | block | The focus cards; options: which list, "why" panel text, "leave out the priority that links to", "hide the card tags". |
| `AgentTable` (+ `AgentTableRow`), `AgentUpdatesPanel`, `AgentLinkList`, `AgentResourceGrid`, `AgentQuoteList` | blocks | Dashboard and product page content. Entries are one line each ("Label \| Detail \| URL"). All can carry rules. |
| `AgentDisclosure` | shared block | The approved text, one note per channel. With display template **Channel** (IA Portal / LM.com). |

Existing Liberty blocks are reused on the product page (illustration, text with sidebar, benefit columns).

## 5. How to run the demo

1. **Front door.** `/agent`, choose Dana, Sign in: `/agent/dana`. Open "Why am I seeing these?".
2. **Different agents.** Back to `/agent`, sign in as Tyler: also Texas, but no Renters + Auto (Harbor Light only). Sign in as Marcus: Condo + Auto first (Florida). Elena: service tasks.
3. **Marketing changes a priority, no development.** In the CMS open Agent Priorities, move Personal umbrella above Home + Auto (or turn a priority off), publish. Reload a dashboard: it changed. Nothing was released.
4. **Preview by audience.** `/agent/priorities`, scroll to "Preview by agent audience": Dana and Marcus side by side, change either picker.
5. **One approved text, two sites.** Open the product page and `/bundling`: the same disclosure, each with its own note (IA Portal, LM.com). In the CMS edit the shared block, take it through review and approval, publish: both pages change ("Updated {date}" moves). Restore the previous version from the version history.
6. **Governance.** Show roles, the approval step, version history and the activity log **in the CMS**. (Not rebuilt in the site; see section 8.)

## 6. Things to know when editing

- **The CMS is shared with other sites.** Every type here starts with `Agent`. Never run `npm run cms:push:all`. `npm run cms:push` only pushes types that do not exist yet; to add a property or an allowed child type to an existing type use the CMS type-update tool (or the CMS) and mirror it in code.
- **Blocks go in the `ASSET_BASE_FOLDER_ID` folder** (read it from `.env`). The key `e56f85d0…` used in the older AskLiberty docs is an alias for the same folder.
- **Property names are stable** once pushed; renaming or removing one on a type with content is a breaking change.
- **Publish a shared block before the pages that reference it.** The one 404 seen on the priorities page went away once its blocks were published, so that was the likely cause.
- **When updating a page canvas through the tool, send the whole canvas.** It was not tested whether a partial update adds to or replaces the existing blocks, so every update here sent all of them. Shared blocks are referenced with `component: { reference: 'cms://content/<key>' }`; a placement's display setting is `displaySettings: { displayTemplate, settings }`.
- **All links from CMS text go through `safeHref`**; "Where Sign in leads" accepts only a path on this site.
- **`npm run dev` rewrites `lib/locales.generated.ts`**; restore it (`git checkout -- lib/locales.generated.ts`) before committing.
- `.env.example` documents `AGENT_DEMO_SWITCH`.

## 7. Security notes

- The demo identity is a preference, not a login: it grants nothing and all content is public demo content. Every route that reads it (`?agent=`, the URL, the cookie, `POST /api/agent`) allow-lists the four keys. The cookie is `HttpOnly`, `SameSite=Lax`, `Secure` in production. `POST /api/agent` accepts only JSON, a tiny body, and a valid key.
- The sign-in form collects nothing: no input has a `name`; the email and password boxes are read-only text boxes (bullets) that tell password managers to ignore them. The page carries a visible demo note.
- A client cannot spoof the agent header: the proxy drops any inbound `x-agent` and sets it only from the query or the URL.
- No raw HTML is rendered from CMS text; React escapes everything. Tokens are plain string replacement.
- The site sends **no `X-Frame-Options` or `frame-ancestors`** on any page (pre-existing; the CMS editor needs to frame it, and the compare view frames the dashboards). Decide this on purpose before any production use.

## 8. Known gaps and things to verify

- **Approval, roles, version compare and restore, activity log** are the CMS's own and were **not verified** from here. Check this instance has them (author, approver, publisher) before the demo. If one is missing, show the closest feature and say so.
- Not built, by decision: the mockup's sign-in progress animation, the Components screen (card settings live on the priorities page instead), the Audit log screen (the CMS's activity log), and the two-column layouts (blocks stack).
- Not verified in a browser (HTML and the live site were checked): how the pages look, the sign-in click, the picker in the compare view, on-page editing overlays in the real Visual Builder, and the cookie inside the CMS preview frame.
- The compare view's section wording is fixed text in code.
- The product page canvas order was changed by the user after build (the disclosure sits after the benefits; "More ways to bundle" is last).

## 9. Where the code is

| What | Where |
|---|---|
| Agents, who is the agent, rules, tokens | `lib/agent/` (`personas.ts`, `getAgent.ts`, `eligibility.ts`, `tokens.ts`, `portalConfig.ts`) |
| Content types and renderers | `cms/agent/` (registered in `cms/registry.ts`) |
| Headers, footer, sign-in form, compare view, cards | `app/_components_portal/`, `app/_components/SiteChrome.tsx` |
| The "view as" route | `app/api/agent/route.ts` |
| `?agent=` and the URL's agent, forwarded safely | `proxy.ts` |
| Preview chooses the header by page type | `app/preview/page.tsx` |
