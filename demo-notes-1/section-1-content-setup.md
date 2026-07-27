# Section 1 Content Setup

Step-by-step checklist to get all CMS content into place before running the Section 1 demo (`/stack-strategic-briefing`).

---

## Pre-flight: Env vars

Confirm these are set in `.env.local` before running any seed scripts:

| Variable | Required | Where to find it |
|---|---|---|
| `OPTIMIZELY_CMS_CLIENT_ID` | Yes | CMS Admin → Settings → API Clients |
| `OPTIMIZELY_CMS_CLIENT_SECRET` | Yes | Same — copy the secret when you create the client |
| `OPTIMIZELY_CMS_API_URL` | No | Defaults to `https://api.cms.optimizely.com` |
| `FOLDER_DISCOVER_RECOMMEND_HERO_BLOCKS` | Yes | CMS content folder key for hero blocks |
| `FOLDER_DISCOVER_RECOMMEND_PROSE_BLOCKS` | Yes | CMS content folder key for prose blocks |

The `$env` references in the seed JSON files read these at runtime. If either folder key is missing the seed scripts will fail silently with a bad container reference.

---

## Pre-flight: Push content types

If content types haven't been pushed to this CMS instance yet (or you've made schema changes), run this first:

```sh
npm run cms:push
```

This registers `HeroSection`, `SidebarSection`, `SplitSection`, `FeedSection`, `BlankSection`, `HeroBlockv2`, `CardBlock`, `ComplianceBlock`, `Paragraph`, `ActionBlock`, and `Image` with the CMS. Safe to re-run — it updates in place.

---

## Step 1: Seed the hero blocks library

```sh
npm run seed:heroes:dr
```

Seeds `seeds/library/heroes/items.json` → creates 4 × `HeroBlockv2` items:

| Display name | Geo | Intent |
|---|---|---|
| Canadian Institutional Markets | canada | discover_recommend |
| European Institutional Solutions | europe | discover_recommend |
| US Institutional Solutions | united_states | discover_recommend |
| Global Institutional Solutions | global | discover_recommend |

These are the blocks you'll drag from the palette in the Visual Builder walkthrough. Their `Intent` and `Geo` taxonomy fields are the same fields that drive personalization in Section 3 — point them out when they appear in the editor.

**If you want to test one item first:**

```sh
node scripts/seed-heroes.mjs seeds/library/heroes/items.json --dry-run
node scripts/seed-heroes.mjs seeds/library/heroes/items.json --limit 1
```

409 responses mean the item already exists — safe to ignore.

---

## Step 2: Seed the content library

These aren't strictly required for Section 1 alone, but seed them now so the Section 2 journey (Pension Fund Manager path) works without a separate setup run.

```sh
npm run seed:library:dr   # discover-recommend paragraphs and cards
npm run seed:library:eg   # educate-govern paragraphs
```

Dry-run either with:

```sh
node scripts/seed-paragraphs.mjs seeds/library/discover-recommend/items.json --dry-run
```

The script exits with code 1 if any item fails — check terminal output after each run.

---

## Step 3: Handle the hero background image

The stack-1 experience seed references a DAM image by key:

```
cms://content/DamImageSource/740c72b0687411f18b7e4ef65a1508fe
```

**Check if it already exists:** Open CMS → Assets and search for key `740c72b0687411f18b7e4ef65a1508fe`. If it appears, skip to Step 4.

**If the key doesn't exist:** 

1. Upload a suitable institutional/finance image to the DAM (CMS → Assets → Upload).
2. Copy the new asset's content key from the asset detail view.
3. Open `seeds/stacks/stack-1-strategic-briefing.json` and replace the image value:
   ```json
   "Image": {
     "value": "cms://content/DamImageSource/<your-new-key>"
   }
   ```
4. Save the file — then continue to Step 4.

The hero will render without an image if this reference is broken, but the rest of the page still works. For demo purposes a broken hero is distracting — fix it before the meeting.

---

## Step 4: Seed the experience page

```sh
npm run seed:experience -- seeds/stacks/stack-1-strategic-briefing.json
```

This creates and publishes the experience at `routeSegment: stack-strategic-briefing`. The page composition is:

| Section | Layout | Blocks inside |
|---|---|---|
| Hero — Executive Summary | HeroSection | Image (background), Paragraph (H1 + body) |
| Sidebar — Targeted Insight | SidebarSection | ToC Paragraph (25%), Paragraph + ComplianceBlock (75%) |
| Grid — Required Solutions | BlankSection | 3 × CardBlock (Global Custody, FX, Securities Lending) |
| Action — CTA | BlankSection | ActionBlock (Schedule Strategy Session) |

409 = already exists, safe to ignore. The script does not support `--dry-run`.

---

## Step 5: Verify in the running app

```sh
npm run dev
```

Open `http://localhost:3000/stack-strategic-briefing` and check:

- [ ] Hero renders with background image and the "Strategic Expansion Briefing: European Equities" heading
- [ ] Sidebar renders with a ToC column on the left and article body + compliance notice on the right
- [ ] Three cards appear below (Global Custody, Foreign Exchange, Securities Lending)
- [ ] "Schedule Strategy Session" CTA button renders at the bottom
- [ ] Resize to mobile — all sections stack vertically, no horizontal overflow

---

## Step 6: Language switcher check

In the top nav, click `English` → `français`.

- [ ] URL changes to `/fr/stack-strategic-briefing` with no full page reload
- [ ] The switcher returns to English correctly

The demo point here is URL architecture and zero-reload navigation — not French content. If the page 404s on `/fr/...`, confirm `fr` is present in `lib/locales.generated.ts`. If not, run:

```sh
npm run gen:locales
```

---

## Step 7: Visual Builder walkthrough prep

Open the CMS Editor and navigate to the `stack-strategic-briefing` experience in Visual Builder.

**Section palette — confirm these are draggable:**
- [ ] HeroSection
- [ ] SidebarSection
- [ ] SplitSection
- [ ] FeedSection
- [ ] BlankSection

**Component palette — confirm these are draggable:**
- [ ] HeroBlockv2 — open its property panel and confirm `Intent` and `Geo` fields are visible (used in Section 3 personalization talk track)
- [ ] CardBlock
- [ ] ComplianceBlock
- [ ] Paragraph
- [ ] ActionBlock

**Preview check:**
1. Make a trivial edit (e.g. add a space to the hero paragraph).
2. Click Preview.
3. Confirm the `/preview` route opens and renders the draft change in the Next.js app.
4. Revert the edit.

---

## Done

All content is in place. The demo path for Section 1 is:

1. `http://localhost:3000/stack-strategic-briefing` (live app)
2. Language switcher → `/fr/stack-strategic-briefing` (URL architecture)
3. CMS Editor → Visual Builder for `stack-strategic-briefing` (marketer authoring)
4. Preview route (draft fidelity)
