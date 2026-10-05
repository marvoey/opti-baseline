# Floor & Decor Category Landing Page (CLP) Build Guide & Stakeholder Rationale

This document outlines the step-by-step procedure to assemble the Category Landing Page (CLP) in the Optimizely CMS SaaS Visual Builder, accompanied by the strategic and technical rationale for each step tied directly to Floor & Decor's discovery call stakeholders (**Rachel, Dawn, Allycia, Ben, and Trey**).

---

## Strategic Stakeholder Rationale Matrix

| Step / Component | Primary Stakeholder | Discovery Call Pain Point / Request | Strategic Rationale for Demonstration |
|---|---|---|---|
| **Phase 1: Seed Shared Blocks** | Rachel & Dawn | Marketers must submit tickets to devs in Amplience to update images, banners, or accessory links. | Proves that atomic blocks and product accessories can be authored independently once and composed flexibly into any experience. |
| **Section 1: `FdScheduledSlot`** | Rachel & Dawn | Lack of visibility into slot assignments; emergency dev deploys needed when sales start/end. | Demonstrates slot-level, block-level, and component-level countdown timers with automated fallback experiences without code redeployment. |
| **Section 2: `FdFeatureGrid`** | Rachel & Brand | Replicating authentic Floor & Decor category look-and-feel (Marble, Wood, Subway, Hexagon). | Builds trust immediately by matching their live e-commerce visual standards and navigation hierarchy. |
| **Section 3: `FdProductGrid`** | Allycia & Rachel | Managing 24,000 SKUs manually is impossible; need seamless integration with SFCC merchandising and facets. | Proves Optimizely's modular shell architecture dynamically ingests catalog feeds while exposing instant facet filtering (material, DCOF, in-stock). |
| **Section 4: `FdProjectBundle`** | Trey | Expanding basket size; collection and variant selling (tile requires matching grout, thinset, trim, and tools). | Directly answers Trey's question on collection selling by showing an automated "Complete Your Project" 1-click bundle with square-footage synchronization. |
| **Section 5: `FdContentDistributionFeed`** | Allycia | Blogs (Amplience) and Videos (TV Page) are manually stitched into carousels across thousands of pages. | "Create Once, Publish Everywhere": Demonstrates Optimizely Graph automatically querying and distributing media across all relevant landing pages via taxonomy tags (`Category: Tile`). |
| **Section 6: `FdExperimentContainer`** | Ben | Dynamic Yield audience targeting creates campaign collisions, degrades the funnel, and breaks the global holdout. | Proves Optimizely's native Mutual Exclusion Groups (MEG) mathematically isolate concurrent experiments while enforcing a protected Global 5% Holdout. |

---

## Prerequisites

All Floor & Decor content types (`FdPromoSplit`, `HeroBlock`, `FdFeatureGrid`, `FdProduct`, `FdProductGrid`, `FdScheduledSlot`, `FdProjectBundle`, `FdContentDistributionFeed`, `FdExperimentContainer`, etc.) have **already been pushed to the CMS**. No schema push is needed to follow this guide, so every step below happens in the CMS UI.

---

## Phase 1: Create Shared Building Blocks (Shared Assets Folder)

Before assembling the Experience, create the promotional items and bundle accessories in the shared assets folder whose ID is set in `.env` as `ASSET_BASE_FOLDER_ID`. **Every shared block in this phase must be created in that folder** (not elsewhere in the content tree). The same ID is listed, with a copy button, on `/admin/asset-folders`.

> **Shortcut:** `npm run seed:blocks` creates and publishes all four blocks below in that folder (see `scripts/seed-shared-blocks.mjs`). It tracks what it created in `scripts/.seed-shared-blocks.state.json`, so re-running it never makes duplicates. The Hero's **Background Image** is an image asset reference, so add it by hand afterwards.

### Step 1.1: Create the Active Weekend Promo Block (`FdPromoSplit`)
* **Rationale:** Establishes the high-urgency promotional state for Rachel's scheduled slot demo.
1. In the CMS Content Tree, open the folder whose ID matches `ASSET_BASE_FOLDER_ID` (the **SysSiteAssets** folder for this site).
2. Click **Create New** $\rightarrow$ select **F&D Promo Split** (`FdPromoSplit`).
3. Set properties:
   * **Name / Title:** `Tile Promo - Weekend Flash Sale`
   * **Eyebrow:** `Limited Time Event`
   * **Heading:** `⚡ Weekend Flash Sale: Extra 10% Off All Porcelain Slabs`
   * **Body:** `Transform your kitchen or bath with commercial-grade porcelain. Everyday low warehouse prices with same-day store pickup.`
   * **Checklist (one per line):**
     ```text
     Over 1,000,000+ sq. ft. ready in warehouse
     Rectified edges for slim 1/16-in grout lines
     Impervious to water and staining
     ```
   * **CTA Label:** `Shop Porcelain Deals`
   * **CTA URL:** `#products`
   * **Image URL:** `https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80`
4. Click **Publish**.

### Step 1.2: Create the Evergreen Fallback Hero Block (`HeroBlock`)
* **Rationale:** Proves to Rachel that when a promotional timer expires on Sunday night, the page gracefully rolls back to an evergreen brand banner without an engineer waking up to push code.
1. In the `ASSET_BASE_FOLDER_ID` folder, click **Create New** $\rightarrow$ select **Hero Block** (`HeroBlock`).
2. Set properties:
   * **Name / Title:** `Tile Category - Standard Evergreen Hero`
   * **Eyebrow:** `Unmatched Selection. Unbelievable Prices.`
   * **Headline:** `High Quality Tile & Stone Flooring`
   * **Subheadline:** `Shop first-quality porcelain, marble, and handcrafted zellige directly from the warehouse.`
   * **Primary CTA Label:** `Explore All Tile`
   * **Primary CTA URL:** `#products`
   * **Background Image:** Upload (or pick) a tile/stone image asset, e.g. one downloaded from `https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80` *(this is an image content reference, not a URL field)*
3. Click **Publish**.

### Step 1.3: Create Installation Accessory SKUs (`FdProduct`)
* **Rationale:** Supports Trey's request for collection and variant selling by modeling installation essentials.
1. In the `ASSET_BASE_FOLDER_ID` folder, click **Create New** $\rightarrow$ **F&D Product** (`FdProduct`):
   * **Name:** `Mapei Ultracolor Plus FA (Avalanche #38)`
   * **SKU:** `3001899` | **Brand:** `Mapei`
   * **Price per sq. ft. / Unit:** `18.99`
   * **Nominal Size:** `10 lb Bag`
   * **Images:** `https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=600&q=80`
   * **Publish**.
2. In the same folder, click **Create New** $\rightarrow$ **F&D Product** (`FdProduct`):
   * **Name:** `Schluter Schiene Satin Nickel Profile`
   * **SKU:** `4001449` | **Brand:** `Schluter Systems`
   * **Price per sq. ft. / Unit:** `14.49`
   * **Nominal Size:** `3/8 in. x 8 ft.`
   * **Images:** `https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=600&q=80`
   * **Publish**.

---

## Phase 2: Visual Builder Experience Assembly (Step-by-Step)

**Parent item:** every experience and page built in this phase must be created as a **sub item (child)** of the **Floor & Decor Home** page, ID `7a5a03b5-9a40-46a9-aa55-eea5bc673218` (key `7a5a03b59a4046a9aa55eea5bc673218`). In the CMS Content Tree, select that page and use **Create New** from it, so the new item's container is that ID. Don't create them at the root of the tree or under any other item.

Create the **Tile & Stone CLP** page (`BlankExperience`, route segment `tile-clp`; the existing "Tile & Stone" `Page` already owns `/tile`) as a sub item of that parent, open it in Optimizely Visual Builder, and add the following 6 sections in vertical order.

> **Prerequisite:** the `Page` content type must allow `BlankExperience` children (`mayContainTypes: ['Page', 'BlankExperience']` in `cms/Page.tsx`). Push that change with `npm run cms:push:all` before creating the experience, otherwise the CMS rejects it with *"BlankExperience is not allowed to be created under parent of content type 'Page'"*.
>
> **Shortcut:** `npm run seed:clp` builds the whole experience below (all 6 sections, linked to the Phase 1 blocks and the catalog products), publishes it, and also creates the two experiment blocks Section 6 links to (`Tile CLP - Standard CTA`, `Tile CLP - Urgent In-Store Pickup CTA`). Run `npm run seed:blocks` first. It tracks what it created in `scripts/.seed-clp-experience.state.json`, so re-running never makes duplicates.

```
┌────────────────────────────────────────────────────────────────────────┐
│ SECTION 1: FdScheduledSlot (Rachel & Dawn)                             │
│ • Active: Weekend Flash Sale Promo Split                               │
│ • Auto-Expire: Sunday 11:59 PM → Fallback: Evergreen Hero              │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION 2: FdFeatureGrid (Authentic Look & Style Navigation)           │
│ • Sub-categories: Marble Look, Wood Look, Subway, Hexagon, Slabs       │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION 3: FdProductGrid (Allycia & Rachel: 24k SKUs + SFCC Facets)    │
│ • ShowFilters: true (Facet sidebar: Material, Look, DCOF, In-Stock)    │
│ • Products: Venato White, Andover White, Emporio Black, Artisan Greige │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION 4: FdProjectBundle (Trey: Collection Selling Kit)              │
│ • Primary: Venato White 12x24 Tile                                     │
│ • Grout: Mapei Avalanche #38 | Trim: Schluter Satin Nickel             │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION 5: FdContentDistributionFeed (Allycia: Graph Taxonomy Engine)  │
│ • Tag: "Tile" → Auto-aggregates TV Page Videos & Blog Guides           │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION 6: FdExperimentContainer (Ben: Collision-Free Experimentation) │
│ • MEG ID: #MEG-402 | Holdout: 5.0% Traffic Shielded                    │
└────────────────────────────────────────────────────────────────────────┘
```

---

### Section 1: Scheduled Campaign Slot (`FdScheduledSlot`)
* **Objective:** Show marketers controlling time-sensitive campaigns visually.
1. Click **Add Section** $\rightarrow$ select **Floor & Decor Scheduled Campaign Slot** (`FdScheduledSlot`).
2. Set properties in the Inspector:
   * **Slot Identifier:** `CLP_Tile_TopPromo_Slot`
   * **Campaign Start:** Current date (e.g., `2026-10-02T00:00:00Z`).
   * **Campaign End (Auto-Expire):** Sunday night (`2026-10-04T23:59:59Z`).
   * **Active Promotional Block:** Select `Tile Promo - Weekend Flash Sale`.
   * **Fallback Content:** Select `Tile Category - Standard Evergreen Hero`.
* **Live Demo Moment:** Tell Rachel: *"Notice that neither your developers nor your marketing team need to log in at midnight on Sunday to pull this banner down. The slot evaluates expiration dynamically and transitions to the fallback hero automatically."*

---

### Section 2: Sub-Category Visual Navigation (`FdFeatureGrid`)
* **Objective:** Match Floor & Decor's live navigation taxonomy.
1. Click **Add Section** $\rightarrow$ select **F&D Feature Grid** (`FdFeatureGrid`).
2. Set properties:
   * **Heading:** `Shop by Popular Look & Trend`
   * **Layout:** `Text tiles` or `Image cards`
   * Add 5 quick items: *Marble Look, Wood Look, Subway Tile, Hexagon, Large Format Slabs*.

---

### Section 3: Catalog Listing & Facet Filtering (`FdProductGrid`)
* **Objective:** Show how a single standardized component shell drives product listings across 24,000 SKUs.
1. Click **Add Section** $\rightarrow$ select **F&D Product Grid** (`FdProductGrid`).
2. Set properties:
   * **Eyebrow:** `Everyday Low Warehouse Prices`
   * **Heading:** `Porcelain & Ceramic Tile Flooring`
   * **Show filters & sort (PLP):** Toggle to **`true`** *(renders the interactive facet sidebar for Material, Finish, Slip Resistance/DCOF, and In-Stock store availability)*.
   * **Products:** Link your 4 catalog products:
     1. `Venato White Polished Porcelain Tile`
     2. `Andover White Matte Marble Look Porcelain`
     3. `Emporio Black Marble Look Hexagon Porcelain`
     4. `Artisan Greige Handmade Ceramic Subway Tile`
* **Live Demo Moment:** Point out to Allycia that product attributes (price/sqft, box coverage, DCOF ratings) flow directly from the data layer, while marketing can reorder products or update badges directly in the Visual Builder.

---

### Section 4: Collection Selling Project Bundle (`FdProjectBundle`)
* **Objective:** Address Trey's request for collection selling and variant packages.
1. Click **Add Section** $\rightarrow$ select **Floor & Decor Project Bundle (Collection Selling)** (`FdProjectBundle`).
2. Set properties:
   * **Section Heading:** `Complete Your Installation Kit`
   * **Primary Flooring Product:** Link `Venato White Polished Porcelain Tile`.
   * **Matching Grout:** Link `Mapei Ultracolor Plus FA (Avalanche #38)`.
   * **Recommended Trim:** Link `Schluter Schiene Satin Nickel Profile`.
* **Live Demo Moment:** Tell Trey: *"Flooring is rarely bought in isolation. By pairing the primary tile with the exact color-matched Mapei grout and Schluter transition profile, you eliminate cart abandonment caused by installation uncertainty and increase average order value (AOV)."*

---

### Section 5: Automated Content Syndication (`FdContentDistributionFeed`)
* **Objective:** Eliminate manual Amplience + TV Page carousel assembly.
1. Click **Add Section** $\rightarrow$ select **Floor & Decor Automated Content Feed (Graph)** (`FdContentDistributionFeed`).
2. Set properties:
   * **Feed Heading:** `Installation Inspiration & Pro Video Guides`
   * **Subheading:** `Content automatically syndicated via Optimizely Graph tags`
   * **Target Taxonomy Tag:** `Tile`
   * **Max Items to Display:** `3`
* **Live Demo Moment:** Tell Allycia: *"In your current stack, your team spends hours manually stitching blogs from Amplience and videos from TV Page into carousels on hundreds of category pages. In Optimizely, editors tag a video or guide with 'Tile', and Optimizely Graph automatically distributes it everywhere that tag is queried."*

---

### Section 6: Collision-Free Experimentation & Holdout (`FdExperimentContainer`)
* **Objective:** Directly address Ben's frustration with Dynamic Yield's broken holdouts and campaign interference.
1. Click **Add Section** $\rightarrow$ select **Floor & Decor Experimentation & Holdout Container** (`FdExperimentContainer`).
2. Set properties:
   * **Optimizely Experiment Key:** `exp_clp_conversion_v1`
   * **Mutual Exclusion Group ID:** `#MEG-402 (Checkout Protection)`
   * **Global Holdout %:** `5.0`
   * **Control Experience:** Link standard CTA.
   * **Challenger Variation A:** Link high-urgency red in-store pickup CTA.
* **Live Demo Moment:** Tell Ben: *"In Dynamic Yield, targeting one audience in a promo test can inadvertently contaminate another test or cannibalize your holdout. Optimizely's Stats Engine and Mutual Exclusion Groups guarantee that visitors assigned to this experiment cannot enter conflicting checkout tests, while 5% of traffic is systematically shielded to prove true annual incremental lift."*

---

## Phase 3: Preview Verification & Live Call Delivery Checklist

1. **Publish Experience:** In Visual Builder, click **Publish**.
2. **Start Local App:**
   ```bash
   npm run dev
   ```
3. **Open Preview:** Navigate to `http://localhost:3009/tile-clp` or view inside the Optimizely CMS Preview iframe.
4. **Pre-Flight Verification:**
   - [ ] Top promo displays the `FdScheduledSlot` with countdown logic.
   - [ ] Product grid renders with the facet filter sidebar (`ShowFilters: true`).
   - [ ] Project bundle displays the primary tile + Mapei grout + Schluter trim.
   - [ ] Content feed shows the 3 aggregated videos/articles.
   - [ ] Experiment banner confirms MEG `#MEG-402` and 5% holdout protection.
5. **Fast Field Demo Rehearsal:** Keep `cms/FdProduct.tsx` open in VS Code ready to add `CommercialWarranty: { type: 'string', format: 'shortString', displayName: 'Commercial Warranty (Years)', sortOrder: 170 }`. This is the only schema push left, and you run it yourself live. Because `FdProduct` already exists in the CMS, use `npm run cms:push:all` (plain `cms:push` skips types that already exist) to prove seconds-fast schema extensibility.
