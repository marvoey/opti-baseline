# Section 1: Demonstration of Platform Interface (15 min)

*Goal: Hook the business stakeholders. Open with the operational cost of the current state, then show the platform as infrastructure — not a website. Every action ties to a real page with real CIBC Mellon content.*

*Primary audience: Marketing, Business stakeholders. IT is in the room but this segment is not for them yet.*

---

## Opening — The Cost of Inaction (2 min)

*   **Talk Track [Challenger Reframe]:** "Before we look at any features, I want to start with a number. CIBC Mellon administers more than C$3.6 trillion in assets on behalf of Canada's pension funds, investment managers, insurance companies, and corporations. Every one of those relationships depends on timely, accurate, governed communication — regulatory updates, product briefings, compliance notices. Right now, how long does it take your team to publish a new briefing like the one I'm about to show you, and get it through compliance review, into both languages, and live on the site? That latency is the cost of inaction. What I'm showing you today is not a new website — it's the operational layer that eliminates that bottleneck."

---

## Live App — The Strategic Briefing Page (5 min)

*   **Action [Live App Demo]:** Navigate to `/stack-strategic-briefing-demo` — the "Strategic Expansion Briefing: European Equities" page.

*   **Talk Track:** "This is a page a CIBC Mellon relationship manager publishes for a Pension Fund client evaluating European equity exposure. Look at what's on it: a full-bleed hero banner, a 25/75 sidebar layout with a table of contents that auto-generates from the article headings, a pre-trade checklist sitting next to a locked compliance notice, a feed of the three relevant CIBC Mellon service cards — Custody, FX, Securities Lending — and a closing brief. This entire page was assembled and published by a marketer. No developer was involved after initial setup."

*   **Action [Live App Demo]:** Scroll slowly down the page, pausing at each section:

    1.  **HeroSection** — *"Full-bleed banner. Background image pulled from the DAM, copy authored in the CMS. The design token palette — colours, typography — is set once by a developer and then locked. Marketing owns everything above that line."*

    2.  **SidebarSection** — *"This is the 25/75 layout — the narrower left column is the 'In This Brief' navigation, the right is the article body. Notice the table of contents in the sidebar is not hand-coded — it's generated automatically from the heading structure of the Paragraph block. When the relationship manager updates the article, the TOC updates with it."*

    3.  **SplitSection** — *"Here is where it gets interesting for your compliance team. The left column is an operational checklist — seven steps from account configuration to income processing. The right column is a locked Compliance Notice. That amber block cannot be edited by a marketer, cannot be touched by the AI content engine. It goes through a mandatory approval workflow before it can go live. That is a platform-level governance control, not a process note in a Word document."*

    4.  **FeedSection** — *"Below that, a feed of the three required CIBC Mellon solutions for this mandate — Custody, FX, Securities Lending. Each card is a reusable block. The same Global Custody card can appear on ten different pages. Update it once in the CMS and it refreshes everywhere."*

    5.  **ActionBlock** — *"'Schedule an Onboarding Assessment.' One button. The form behind this connects directly to your CRM via a standard API handshake — we'll cover that in Section 6."*

---

## Mobile Responsiveness (1 min)

*   **Action [Live App Demo]:** Resize the browser window to a narrow viewport.

*   **Talk Track:** "Full mobile parity. The sidebar collapses to a single column, the checklist stacks, the feed re-flows. This is structural — Tailwind CSS utility classes driven by the component definitions — not a separate mobile stylesheet someone has to maintain. Schedule D requires mobile-friendly views. This is compliant out of the box."

---

## Bilingual Architecture (2 min)

*   **Action [Live App Demo]:** Use the `LanguageSwitcher` in the top nav to switch to `/fr/stack-strategic-briefing-demo`.

*   **Talk Track:** "French content is content — not a separate codebase, not a separate deployment, not a ticket to the dev team. When a marketer publishes a French variant of this briefing in the CMS, it surfaces at the `/fr/` URL automatically. The routing layer handles bilingual compliance and SEO clean URLs natively. No page reload, clean URL structure, same governance controls in both languages. For a Canadian institution operating under federal bilingual requirements, this is the architecture you want."

---

## CMS Editor — The Marketer's View (5 min)

*   **Action [CMS Editor Demo]:** Switch tabs into the Optimizely CMS Visual Builder for the same page.

*   **Talk Track:** "Now let me show you how this page was built. This is the Visual Builder — the marketer's view."

*   **Action [CMS Editor Demo]:** Point out the section structure in the left panel:
    *   HeroSection
    *   SidebarSection (25/75)
    *   SplitSection (60/40)
    *   FeedSection
    *   HeroBlockv2
    *   BlankSection (CTA)

    *"A marketer assembles this page by dragging pre-built sections from the panel on the left and dropping blocks inside them. The section types enforce the layout — SidebarSection always gives you the 25/75 split, SplitSection always gives you 60/40. The marketer can't break the grid."*

*   **Action [CMS Editor Demo]:** Click on the **Paragraph block** inside the SidebarSection main column. Show the content fields (Text, Intent, Persona, Geo).

    *"Notice the taxonomy fields on this block — Intent is set to 'Educate & Govern', Persona is 'Pension Fund', Geo is 'Europe'. Every piece of content is tagged at authoring time. Remember these fields — in Section 3 I'll show you exactly how they power personalisation without a developer writing a single targeting rule."*

*   **Action [CMS Editor Demo]:** Click on the **ComplianceBlock**. Show the lock state and Jurisdiction field ("Cross-Border / Multi-Jurisdiction").

    *"This is the compliance governance model in practice. The block is locked. A marketer can see it, can see the jurisdiction tag, but cannot edit the body copy. Any change triggers an approval workflow routed to the Regulatory Affairs desk. This is the control CIBC Mellon's compliance team requires — and it's enforced by the platform, not by policy."*

*   **Action [CMS Editor Demo]:** Click **Preview**.

*   **Talk Track:** "Real-time, high-fidelity preview of draft content — rendered natively in the Next.js app. Exactly what the Pension Fund client will see before anything goes live. No staging server, no email chain asking 'does this look right?' — the marketer sees the final output and publishes with confidence."

---

## Transition to Section 2

*   **Talk Track:** "That's the platform as infrastructure. Now let me walk you through a specific journey — let's follow a Pension Fund Manager researching regulatory considerations, and show how the platform supports that journey end to end."
