# SFA Modular Component System Blueprint

Based on the structure of the Specialty Food Association (SFA) Homepage, the sofi™ Awards page, and the Winter FancyFaire* page, here is the flexible, modular component system designed for Optimizely CMS. 

In this system, content is built by creating a set of reusable **Blocks** that content editors can drag and drop into **Content Areas** on various Page Types.

## 1. Global / Structural Components
These are persistent elements used across all pages to maintain brand consistency and primary navigation.

*   **Global Header Block:** Needs to support a deep nested Megamenu, utility links (login/search), social icons, and primary Call-to-Action (CTA) buttons.
*   **Global Footer Block:** A multi-column structure with rich text for addresses, a link list for policies/socials, and a dedicated slot for advertisement embeds.

## 2. Layout & Container Blocks
To give editors the flexibility seen across these three pages, you need layout blocks that act as containers for other content blocks.

*   **Two-Column Split Block:** Used heavily on the FancyFaire page (e.g., Text on left, Video on right) and SFA Homepage. It needs an "Alignment" toggle to flip content left or right to create zig-zag patterns.
*   **Multi-Column Grid Container:** Required for the 3-column feature highlights, 4-column/5-column trade show statistics, and 3-column dates/hours. 
*   **Sidebar Navigation Block:** For pages like sofi™ Awards, you need a vertical, accordion-style tree menu to handle sub-navigation alongside the main content area.

## 3. Hero & Banner Blocks
High-impact visual blocks used to capture attention at the top of pages or separate long sections of content.

*   **Standard Hero Banner:** Used on the sofi™ Awards page. Needs fields for an H1 Title, Rich Text subtitle, breadcrumbs, and CTA buttons.
*   **Media Hero (Video/Slider):** Used on the Homepage and FancyFaire pages. Needs to support auto-playing background videos or image carousels, overlay text, and primary/secondary CTA buttons.
*   **Promo / Alert Callout Banner:** A full-width inline banner. Used for priority notices (like sofi Award entry deadlines) or promotional links (like Premier Providers). Needs background color and border styling toggles.

## 4. Core Content & Media Blocks
The fundamental building blocks for constructing the body of a page.

*   **Rich Text Block:** A standard WYSIWYG block for general body copy, headings, and inline links. Should include a "Background Color" setting (e.g., White, Light Gold, Dark Blue) to break up page flow and create visual hierarchy.
*   **Image Gallery / Grid Block:** For displaying side-by-side or stacked event photos (e.g., FancyFaire crowds).
*   **Metric / KPI Block:** A specific component for the FancyFaire page to display large bold numbers (e.g., "12,000+ Attendees") paired with a text label and an optional icon.

## 5. Interactive & Dynamic Blocks
Advanced blocks that pull in dynamic content, enable user interaction, or embed third-party services.

*   **Card Carousel / Slider Block:** Highly utilized across all pages. You need variations for:
    *   *Testimonials:* Quote text, circular headshot, name, and role.
    *   *Profiles:* "Meet the Buyers" judges headshots and titles.
    *   *Image Sliders:* Event highlights (e.g., "A Taste of Local Neighborhoods").
*   **Dynamic Content Listing (News/Press):** A block used on the SFA Homepage that queries other CMS pages (like Press Releases or News articles) and displays them as a row of cards based on a selected category tag.
*   **Iframe / External Embed Block:** A critical component for embedding third-party tools, including YouTube videos, Ceros interactive modules (used on FancyFaire), and third-party Sidebar Ad banners.

---
**Implementation Tip:** By building these as standard Optimizely CMS **Blocks**, your editors will be able to mix, match, and reorder them within a `MainContentArea` property on your Page Types. This allows them to spin up entirely new event or award pages without needing a developer to write new front-end code.