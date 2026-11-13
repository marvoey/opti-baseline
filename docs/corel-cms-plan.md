# Corel mock → CMS plan

Goal: rebuild `app/demo/mock/page.tsx` (the CorelDRAW base-site recreation: Home,
Product, Special offers, Free trials, Learning center, Support) as editable
Optimizely CMS content — one **Experience** per page, composed of reusable
**blocks**.

## 1. What the CMS already has (audit)

The CMS instance is **shared with many other demos** (Liberty `Lib*`, UPS `Ups*`,
Floor & Decor `Fd*`, NBC, NOW TV, Peacock, OpenTable, JH …). Nothing is prefixed
`Corel`.

| Existing type | Wired in this repo? | Decision |
|---|---|---|
| `BlankExperience`, `BlankSection` | yes (`cms/registry.ts`) | Keep. Not used for Corel pages so Corel pages are identifiable. |
| `RichTextBlock` | yes | Reusable for plain prose; the mock has no pure-prose block, so unused for now. |
| `Page (v1)` | yes | Not suitable — its body only accepts `RichTextBlock`. |
| `HeroBlock`, `Breadcrumb`, `PromoBannerBlock`, `ProofBlock`, `CardBlock`, … | **no** (other demos own them; no renderer here) | **Not reused.** Pushing schema changes from here could break the demos that own them; `HeroBlock` also carries unrelated NIQ personalisation fields. |
| `NowTv*`, `Peacock*` mock blocks | no | Property-less (content is hard-coded in React) — not a model to follow. |
| `Lib*` family | no | **Pattern followed**: section-level `_component` blocks with an array of small item components and real editable properties. |

Conclusion: new types are needed. Everything is prefixed so it is distinguishable.

## 2. Naming — how to tell Corel types apart

- Content type **key**: `Corel…` (e.g. `CorelHeroSplit`).
- **Display name**: `Corel: Hero split` for blocks, `Corel Item: Text card` for
  item components, `Corel: Experience` for the page type.
- Code lives in `cms/corel/`, UI primitives in `app/_components/corel/`.
- `scripts/cms-push.mjs` (default mode) only pushes keys that do **not** exist in
  the CMS, so pushing can never overwrite another demo's types.

## 3. Content model

- `CorelExperience` (`_experience`) — one per page; SEO fields mirror
  `BlankExperience` so `generateMetadata` works unchanged.
- **Blocks** (`_component`, `sectionEnabled`) — dropped straight into the
  experience, stacked top-to-bottom like the mock.
- **Items** (`_component`, no composition behaviour) — repeated entries held in a
  block's array property. Arrays are one level deep; grouped lists (release
  months, spec platforms, comparison groups, phone regions) use a `Group` string
  on each item rather than nesting.
- Links use the CMS `link` property (picker, text = label). Images use a
  `contentReference` to `_image` plus an optional `ImageUrl` for remote art; a
  gradient placeholder shows when neither resolves (as in the mock).

### Blocks (26)

| Mock component | Type key | Pages |
|---|---|---|
| `HeroSplit`, `OfferHero` | `CorelHeroSplit` (light/dark) | Home, Offers |
| `PageBanner`, `SupportSearch` | `CorelPageBanner` (+ optional search box) | Learn, Support |
| `ProductHero` + `PurchaseOptions` | `CorelProductHero` | Product |
| `TrialHero` | `CorelTrialHero` | Trials |
| `SplitCta` | `CorelSplitCta` | Trials |
| `CtaBanner` | `CorelCtaBanner` | Home, Product, Offers |
| `ProductTierCards` | `CorelTierCards` | Home |
| `OfferCards` | `CorelOfferCards` | Offers |
| `ComparisonTable` | `CorelComparisonTable` | Product |
| `TestimonialCarousel` | `CorelTestimonialCarousel` | Home, Product |
| `LogoMarquee` | `CorelLogoMarquee` | Home, Product |
| `AwardsStrip` | `CorelAwardsStrip` | Product, Trials |
| `GalleryGrid` | `CorelGalleryGrid` | Product |
| `RatingsBlock` | `CorelRatings` | Product, Trials |
| `StickySubNav`, `SectionSubNav` | `CorelSubNav` (sticky/dark) | Product, Learn |
| `IntroSplit` | `CorelIntroSplit` | Product |
| `AppGrid` | `CorelAppGrid` | Product |
| `IncludedApps` | `CorelIncludedApps` | Trials |
| `IndustryGrid`, `CapabilityGrid` | `CorelCardGrid` (image/icon, optional slider) | Product |
| `ReleaseCarousel`, `TryCardCarousel` | `CorelCardCarousel` (release/tile) | Product, Trials |
| `FeatureSpotlight` | `CorelFeatureSpotlight` | Product |
| `FaqAccordion` | `CorelFaqAccordion` | Product |
| `TechSpecs` | `CorelTechSpecs` | Product |
| `IconLinkCards`, `InspireCards` | `CorelIconLinkCards` (cards/inspire) | Learn, Support |
| `Announcements` | `CorelAnnouncements` | Support |
| `ContactOptions` | `CorelContactOptions` | Support |

### Items (14)

`CorelImageItem`, `CorelTextCard`, `CorelCustomerStory`, `CorelTier`,
`CorelPurchasePlan`, `CorelAppItem`, `CorelRatingItem`, `CorelComparisonRow`,
`CorelFaqItem`, `CorelSpecItem`, `CorelOffer`, `CorelIconCard`,
`CorelContactCard`, `CorelPhoneEntry`.

### Page compositions

- **Home**: HeroSplit → TierCards → TestimonialCarousel → LogoMarquee → CtaBanner
- **Product**: ProductHero → SubNav → IntroSplit → AwardsStrip → AppGrid →
  CardGrid (industries) → LogoMarquee → TestimonialCarousel → Ratings →
  CardCarousel (releases) → FeatureSpotlight → CardCarousel (try cards) →
  CardGrid (capabilities) → ComparisonTable → FaqAccordion → TechSpecs →
  GalleryGrid → CtaBanner
- **Offers**: HeroSplit (dark) → OfferCards → CtaBanner (light)
- **Trials**: TrialHero → CardCarousel (tiles) → CardCarousel (releases) →
  IncludedApps → SplitCta → AwardsStrip → Ratings
- **Learn**: SubNav (dark) → PageBanner → IconLinkCards (overlap) →
  IconLinkCards (inspire)
- **Support**: PageBanner (search) → IconLinkCards (overlap, 5 cols) →
  Announcements → ContactOptions

## 4. Out of scope / follow-ups

- **Content seeding** — creating the six experiences and their blocks in the CMS.
  `/demo/corel-blocks` renders every block from sample data ported from the mock
  and doubles as the seed reference.
- **PromoModal** (home pop-up) — not modelled; the promo *bar* is site chrome
  (`lib/siteConfig.ts`).
- **Trial sign-up form** — UI only, like the mock: nothing is sent anywhere.
  Wiring a real endpoint needs a server action with validation + rate limiting.
- **Feature icons** on tier cards — the mock pulls per-feature SVGs from
  coreldraw.com; the CMS model stores plain text and renders a check icon.
