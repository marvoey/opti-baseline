# Peacock mock homepage sections

`_components/composition.ts` builds a hand-authored CMS composition tree — standing in for what Optimizely Graph would return for a real experience — listing the 8 sections below as top-level nodes. `app/mock/peacock/page.tsx` renders that tree through `cms/BlankExperience` (the same `OptimizelyComposition` pipeline a real Visual Builder-driven page uses) between `<BrandHeader>` and `<BrandFooter>`; the real `<footer>` (legal links, social, copyright) is `BrandFooter`'s job, not this composition's.

Live sports listings are illustrative placeholders, not real dated games, so they won't go stale.

For internal prototyping/reference only.

Each section lives in its own file in `_components/` and also exports a CMS `contentType()` definition (`_component` baseType, `compositionBehaviors: ['sectionEnabled']`, no properties yet), so the sections are discoverable and pushable via `npm run cms:push` and droppable directly into a Visual Builder experience as their own section. `cms/registry.ts` registers each type's schema and maps its content-type key to its React component in `initReactComponentRegistry`, so it renders wherever it's placed in a composition — including `composition.ts`'s mock one. Each component still renders its own hardcoded content directly — none of them read from CMS `content` yet, since there are no properties to read.

## Icons

`Icons.tsx` — shared inline SVGs, not a content type:

- **`CheckIcon`** — checkmark used next to plan features in `Pricing`.
- **`ChevronDown`** — expand/collapse indicator in `Faq`'s `<details>` summaries.

## Sections

Rendered in this order by `composition.ts`'s composition tree:

1. **`Hero.tsx`** (`PeacockHeroBlock`) — top banner with headline, subhead, "Get Peacock" / "Get Bundle" CTAs, and a sign-in note for existing subscribers.
2. **`SportsCarousel.tsx`** (`PeacockSportsCarouselBlock`) — horizontally scrollable row of live/upcoming sports events, sourced from a local `SPORTS_EVENTS` array (sport, matchup, when).
3. **`Showcase.tsx`** (`PeacockShowcaseBlock`) — two-tile grid promoting series and movies, built from the local `ShowcaseTile` helper (gradient tile with a label).
4. **`Pricing.tsx`** (`PeacockPricingBlock`) — plan comparison grid (Select / Premium / Premium Plus) sourced from a local `PLANS` array (name, tagline, features, monthly/annual price, "most popular" flag). Anchored at `#plans`.
5. **`Features.tsx`** (`PeacockFeaturesBlock`) — three-column "More Reasons to Love Peacock" grid, sourced from a local `FEATURES` array (label, heading, body).
6. **`GiftCards.tsx`** (`PeacockGiftCardsBlock`) — single promo banner for Peacock gift cards with a "Buy Now" CTA.
7. **`Faq.tsx`** (`PeacockFaqBlock`) — accordion of frequently asked questions using native `<details>`/`<summary>`, sourced from a local `FAQS` array (question, answer).
8. **`ExploreMore.tsx`** (`PeacockExploreMoreBlock`) — multi-column footer-style link directory (Browse, Sports, Collections, Peacock Originals, Trending, About), sourced from a local `EXPLORE_COLUMNS` array (heading, links).

Each section's static data array is private to its own file (not exported).

## `composition.ts`

Exports `peacockMockExperienceContent`, a mock `BlankExperience` content object whose `composition.nodes` array references each section above by its content-type key (`component.__typename`), matching the keys registered in `cms/registry.ts`. No row/column nesting — `sectionEnabled` components sit directly as top-level nodes.
