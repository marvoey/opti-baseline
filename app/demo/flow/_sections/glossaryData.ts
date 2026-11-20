// Glossary shown in the sticky sidebar of /demo/flow (see ./Glossary.tsx).
// Hand-written, not part of the generated canvas. Every term is one that appears on the page.

export type GlossaryTerm = { term: string; meaning: string };
export type GlossaryGroup = { title: string; terms: GlossaryTerm[] };

export const GLOSSARY: GlossaryGroup[] = [
  {
    title: 'Insurance and audiences',
    terms: [
      {
        term: 'AEP',
        meaning:
          'Annual Enrollment Period. Medicare’s yearly window (Oct 15 to Dec 7) to switch Medicare Advantage or Part D plans. Drives the "Medicare Annual Enrollment is here!" banner and the AepSwitcher hero.',
      },
      {
        term: 'OEP',
        meaning:
          'Open Enrollment Period. The yearly window to sign up for ACA plans. It starts Nov 1; end dates vary by state and year, so confirm them. The AcaOep hero is named after it.',
      },
      {
        term: 'ACA',
        meaning:
          'Affordable Care Act. The law behind Marketplace health plans for individuals and families. ?utm_campaign=aca shows the Individual & Family hero.',
      },
      {
        term: 'IFP',
        meaning: 'Individual & Family Plans. eHealth’s ACA product line, as opposed to Medicare or Small Business.',
      },
      {
        term: 'T65',
        meaning:
          'Turning 65. People about to become eligible for Medicare (their first enrollment window runs from 3 months before to 3 months after the 65th birthday month). ?utm_campaign=t65 shows the Turning65 hero.',
      },
      {
        term: 'Medicare vs ACA',
        meaning:
          'The two overlapping enrollment seasons the demo is built around: Medicare (AEP, T65) and Individual & Family (ACA, OEP). Both marketers share one homepage.',
      },
    ],
  },
  {
    title: 'Marketing and SEO',
    terms: [
      {
        term: 'UTM / utm_campaign',
        meaning:
          'A URL parameter that names the ad campaign a visitor came from. The site reads it to decide which hero to show.',
      },
      { term: 'CTA', meaning: 'Call to action: the main button or link, such as "Compare dental & vision plans".' },
      { term: 'SEO', meaning: 'Search Engine Optimization. Getting pages to rank in Google and similar.' },
      {
        term: 'AEO',
        meaning:
          'Answer Engine Optimization. Getting cited by ChatGPT, Perplexity and AI Overviews. The FAQ block and /llms.txt are the proof points.',
      },
      { term: 'GEO', meaning: 'Generative Engine Optimization. Close to AEO; the "GEO audit" checks how AI engines see a page.' },
      {
        term: 'Yoast',
        meaning:
          'A WordPress SEO plugin that eHealth uses today. The RFI asks for "Yoast parity" (titles, descriptions, canonicals, sitemaps).',
      },
      {
        term: 'JSON-LD',
        meaning:
          'Structured data in the page source that tells search and answer engines what the page is. FAQPage is the type used for the FAQ block.',
      },
      { term: 'Canonical', meaning: 'A link telling search engines which URL is the preferred version of a page.' },
      { term: 'hreflang', meaning: 'Links that point to the same page in other languages (English and Spanish here).' },
      { term: 'noindex', meaning: 'A tag asking search engines not to list the page. Set on the paid landing page /lp/aca-2027.' },
      { term: 'OG', meaning: 'Open Graph. The title and image shown when a page is shared on social media.' },
      {
        term: 'llms.txt',
        meaning: 'A file that tells AI crawlers what the site contains. Generated from the CMS tree, like sitemap.xml and robots.txt.',
      },
      { term: 'es', meaning: 'The Spanish locale (language setting) in the CMS. /es is the Spanish site.' },
    ],
  },
  {
    title: 'Optimizely',
    terms: [
      { term: 'CMS SaaS', meaning: 'Optimizely’s hosted content management system. The marketers’ editor, and the source of all page content.' },
      {
        term: 'Graph',
        meaning:
          'Optimizely Graph. The GraphQL content API the site queries to fetch pages. It also powers the /demo/groups query view and site search.',
      },
      {
        term: 'Visual Builder',
        meaning: 'The CMS’s drag-and-drop page editor with inline editing. Marketers compose pages from approved blocks.',
      },
      {
        term: 'FX',
        meaning:
          'Feature Experimentation. The Optimizely product that decides which variant a visitor gets (personalization and A/B tests), server-side.',
      },
      { term: 'Mark', meaning: 'Optimizely’s AI agent tool (mark.optimizely.com). Used here for SEO audits, alt text and translation.' },
      { term: 'Opti ID', meaning: 'Optimizely’s account and admin sign-in. Generative AI can be switched off there.' },
      { term: 'Web Experimentation', meaning: 'Optimizely’s browser-side testing product. Deliberately not used in this demo (G11).' },
      { term: 'Applications', meaning: 'A CMS setting where each front end gets its own host and preview URL (multi-app delivery).' },
    ],
  },
  {
    title: 'Content and build terms',
    terms: [
      { term: 'Experience', meaning: 'A full page in Visual Builder. eHealth Home is a BlankExperience.' },
      { term: 'Block / Eh*', meaning: 'A reusable page section. Blocks starting with "Eh" (EhHero, EhFaq...) are eHealth’s own, one code file each.' },
      { term: 'Display template', meaning: 'Approved style options for a section. EhSectionStyle offers background and spacing choices, so marketers never touch CSS.' },
      {
        term: 'Content variation',
        meaning:
          'An alternate version of a page at the same URL, picked by a variation key. Turning65, AepSwitcher and AcaOep are the three on eHealth Home. Not the same thing as an FX "variation".',
      },
      { term: 'Content key', meaning: 'The CMS ID of an item (a long hex string). Listed in the Quick links section to find items fast.' },
      { term: 'v1695', meaning: 'A CMS version number. Home’s default page is v1695 (variations v1676 to v1678). Shows how many edits it has had.' },
      { term: 'Taxonomy', meaning: 'The categories used to group pages: Product line (Medicare, IFP...) and Channel (Paid, Organic).' },
      { term: 'Paid / Organic', meaning: 'Paid: pages reached from ads. Organic: pages reached from unpaid search.' },
    ],
  },
  {
    title: 'Experimentation (FX)',
    terms: [
      { term: 'Flag', meaning: 'The FX container for rules and variables. Here: ehealth_home_hero.' },
      {
        term: 'Flag variable',
        meaning: 'cms-saas-content-variation. Its value must match the CMS variation key exactly, including case.',
      },
      { term: 'Attribute', meaning: 'A fact the code sends about a visitor. Here: ehealth_campaign (aca, t65 or none).' },
      { term: 'Audience', meaning: 'A group defined by attributes, such as "eHealth Turning 65" (ehealth_campaign = t65).' },
      { term: 'Targeted delivery', meaning: 'A rule that sends 100% of an audience to one variation. No statistics.' },
      { term: 'A/B rule', meaning: 'A randomized, measured test. Here: Original vs AepSwitcher, 50/50, for visitors not in a campaign audience.' },
      { term: 'Event / metric', meaning: 'What the test counts. Here: plan_finder_submit (primary) and agent_call_click.' },
      { term: 'Dev / Production', meaning: 'FX environments. The rules run in Development only, and the live demo site uses the Dev SDK key.' },
      { term: 'eh_vid / eh_campaign', meaning: 'Cookies set by proxy.ts: an anonymous visitor ID, and the remembered campaign. ?fx_reset=1 re-rolls the visitor.' },
    ],
  },
  {
    title: 'Other tools and companies',
    terms: [
      {
        term: 'Adobe Target',
        meaning:
          'eHealth’s current personalization and testing tool. The demo shows that it could replace FX as the decision-maker with no CMS change (lib/fx.ts).',
      },
      { term: 'at.js', meaning: 'Adobe Target’s browser (client-side) script. Asked about in discovery: at.js or server-side?' },
      { term: 'Akamai', meaning: 'A CDN (content delivery network) that can sit in front of the site for speed and caching.' },
      { term: 'Vercel', meaning: 'Where the demo site is hosted.' },
      { term: 'Next.js', meaning: 'The React framework the site is built with. proxy.ts is its routing layer.' },
      { term: 'WordPress / Gutenberg', meaning: 'eHealth’s current CMS and its block editor. The migration path maps Gutenberg blocks to Eh* blocks.' },
    ],
  },
  {
    title: 'How to read this page',
    terms: [
      { term: 'Act 0 to 8', meaning: 'The steps of the 60-minute demo in section 3.' },
      { term: 'G1 to G12', meaning: 'Gaps: build tasks listed in section 4. G1 personalization, G2 site settings, G3 cleanup, G4 SEO files, G5 Spanish, G6 taxonomy.' },
      { term: 'RFI / RFI 5.12', meaning: 'Request for Information: eHealth’s written requirements. Numbers like 5.12 or §8 are requirement IDs.' },
      { term: 'POC', meaning: 'Proof of concept: a small trial build. Don\u2019t raise it yourself; only talk about it if they do.' },
      { term: 'READY / BUILD / TALK', meaning: 'Works today / needs a build before the call / slide or narrative only. DONE, FIXED and LIVE mean it’s finished.' },
    ],
  },
];
