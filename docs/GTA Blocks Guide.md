# GTA Blocks Guide

Visual Builder blocks that recreate the three canvas pages (GTA V Overview, GTA Online, Career Progress). All keys start with `Gta` and all display names start with `[GTA]`, so they are easy to find and cannot collide with existing types.

**Status:** all 11 types are live in the CMS and indexed in Optimizely Graph. The `Page` type's Content area allows the 7 blocks. Code and CMS were compared field by field and match.

## Blocks

| Block (key) | Use it for | Where it can go | Embedded item |
|---|---|---|---|
| `[GTA] Hero Banner` (`GtaHeroBlock`) | Page hero: eyebrow, H1, text, 2 buttons, background image | Outline or column | none |
| `[GTA] Promo Banner` (`GtaPromoBannerBlock`) | Mission Creator, Career Progress card, license plates, feedback | Outline or column | none |
| `[GTA] Buy Panel` (`GtaBuyPanelBlock`) | Box art, platform badges, Buy Now | Outline or column | none |
| `[GTA] Feature Carousel` (`GtaCarouselBlock`) | "New This Week", 1 of N slides | **Outline only** | `[GTA] Carousel Slide` |
| `[GTA] Update Showcase` (`GtaUpdateShowcaseBlock`) | Layered update cards (Slider) or scrolling thumbnails (Marquee) | **Outline only** | `[GTA] Update Card` |
| `[GTA] Feature Grid` (`GtaFeatureGridBlock`) | Feature cards, tech highlights, 2 to 4 columns | **Outline only** | `[GTA] Feature Item` |
| `[GTA] Career Grid` (`GtaCareerGridBlock`) | Career cards with sticky filter tabs | **Outline only** | `[GTA] Career Card` **shared blocks** (see below) |

- **Outline** means the experience's top-level list of sections (add the block directly, no section/row/column needed). All 7 blocks can also be added in the **Content** area of a `Page`.
- **Why four blocks are outline-only:** they hold lists of inline items (an array of components), and the CMS does not allow element-enabled blocks to have component properties. So they are section-enabled only and cannot be dropped into a section column. All four are full-width page sections anyway.
- **Embedded items** are added inside their parent block's list property (Slides, Updates, Items, Cards). They are not placed on a page on their own.

## Career Cards are shared blocks

- The Career Grid's **Cards** list is a `content` list, so it holds **shared blocks** (and inline cards if needed). The other blocks' lists are still inline-only.
- The 30 Career Progress cards are shared blocks in **Assets > eHealth > GTA Career Cards** (the eHealth folder is `ASSET_BASE_FOLDER_ID` in `.env`). Edit a card there and every grid that uses it updates when the card is published.
- To add a card: create a `[GTA] Career Card` in that folder, publish it, then drag it into the grid's Cards list.
- Graph returns shared cards with all their fields, so the component needs no extra fetch.
## Keeping code and CMS in sync

```bash
npm run cms:check      # code vs CMS: lists exist / missing / CMS-only
npm run cms:push       # pushes only types that are missing in the CMS (safe, additive)
npm run cms:push:all   # re-pushes every type, overwriting what is in the CMS
```

- `cms:push` skips types that already exist, so changing a property on an existing `Gta*` type needs either `cms:push:all` or a targeted update to that one type.
- `Page` was updated in the CMS directly (allowed blocks in Content) rather than with `cms:push:all`, to avoid overwriting other types. The code in `cms/Page.tsx` defines the same list.
- Changing `compositionBehaviors` on a type that already has content is a breaking change and needs an explicit override.

## Page recipes

**GTA Online**: Hero (Standard) > Feature Carousel "New This Week" > Promo Banner "Rockstar Mission Creator" > Update Showcase (Marquee) > Promo Banner "Career Progress" (Centered, with the mugshot as image) > Update Showcase "Updates" (Slider) > Promo Banner "Personalize Your Plates" > Promo Banner "Share Your Feedback" (Yellow, Centered)

**Career Progress**: Hero (Compact, buttons "Sign In" and "Create an Account") > Career Grid (Progress Note: "Sign in to view progress")

**GTA V Overview**: Hero (Tall) > Feature Grid "Welcome to Los Santos" (3 columns) > Feature Grid for tech highlights (4 columns) > Buy Panel

## Notes

- **Images are URL properties**, not media-library references, so editors can paste CDN URLs directly. Switch to `contentReference` to `_image` later if the assets move into the DAM.
- **Hotlinked images** may be blocked by the image host. Images send no referrer to improve the odds, and fall back to a dark background if they fail.
- **Links on cards** (Update Card, Career Card): only the URL is used and the whole card is clickable. Button text is ignored.
- **Marquee rows**: 1 row for fewer than 6 updates, 2 rows for 6 to 8, 3 rows for 9 or more. It pauses on hover and stops for visitors who prefer reduced motion.
- **Empty blocks** show a dashed placeholder in the editor that says what to add.
- **Keep `cms/*.tsx` imports light.** The push CLI bundles each file with esbuild. Importing `next/*` or icon libraries from a `cms/` file can break `cms:push`. Shared UI used by blocks lives in `app/_components` and follows this rule (plain `<a>`, inline SVG icons).
- **Not yet verified:** no page has been built from these blocks, so the blocks have not been seen in a browser or in Visual Builder, and Graph has not been queried for real block content.
