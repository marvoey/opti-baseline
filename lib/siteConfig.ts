/**
 * Site config — the single place to rebrand the non-colour chrome for a new
 * demo. Colours live in app/globals.css (the `@theme` token block); everything
 * else — site name, logo, nav links, footer columns, legal copy — lives here.
 *
 * To stand up a new demo: edit this file, drop a new public/logo.svg, and tweak
 * the hex values in app/globals.css. No component edits required.
 */

export type NavLink = { label: string; href: string; active?: boolean };
export type UtilityLink = { label: string; href: string; icon: 'office' | 'search' | 'headset' };
export type FooterSection = { heading: string; links: NavLink[] };

export const siteConfig = {
  /** Used for the document <title> fallback and the logo alt text. */
  name: 'Optimizely',
  /** Default browser-tab title (per-page titles override via CMS MetaTitle). */
  title: 'Optimizely | Digital Experience Platform',
  /** Default meta description. */
  description:
    'Optimizely — the digital experience platform that helps teams create, test, and optimize digital experiences at scale.',

  /** Header logo (place the asset in /public). */
  logoSrc: '/hrb-logo.svg',
  logoAlt: 'H&R Block',

  /** Top brand strip (the H&R Block family of brands). `active` = current brand tab. */
  topNavLinks: [
    { label: 'H&R BLOCK', href: '/', active: true },
    { label: 'Block Advisors', href: '#' },
    { label: 'Spruce', href: '#' },
  ] satisfies NavLink[],

  /** Primary header navigation. */
  mainNavLinks: [
    { label: 'Taxes', href: '#' },
    { label: 'Financial products', href: '#' },
    { label: 'Business services', href: '#' },
    { label: 'Tools and resources', href: '#' },
  ] satisfies NavLink[],
  /** Header utility links (icon is chosen in MainNav by `icon`). */
  utilityLinks: [
    { label: 'Find an office', href: '#', icon: 'office' },
    { label: 'Search', href: '#', icon: 'search' },
  ] satisfies UtilityLink[],
  /** Header account pill: small `prefix` line over a bold `label` line. */
  accountCta: { prefix: 'Sign in to', label: 'MyBlock', href: '#' },

  /** Footer: "Need support?" row. */
  footerSupportHeading: 'Need support?',
  footerSupportLinks: [
    { label: 'Customer help', href: '#', icon: 'headset' },
    { label: 'Find an office', href: '#', icon: 'office' },
    { label: 'Search', href: '#', icon: 'search' },
  ] satisfies UtilityLink[],
  /** Footer link columns. Each column is a stack of headed sections. */
  footerColumns: [
    [
      {
        heading: 'Tax Services',
        links: [
          { label: 'Reschedule or manage appointment', href: '#' },
          { label: 'Online tax filing', href: '#' },
          { label: 'File with a tax pro', href: '#' },
          { label: 'Free online tax filing', href: '#' },
          { label: 'Tax software', href: '#' },
          { label: 'Second Look Review', href: '#' },
          { label: 'Peace of Mind', href: '#' },
          { label: 'Tax Identity Shield', href: '#' },
          { label: 'Audit & Tax Notice Support', href: '#' },
          { label: 'Expat tax services', href: '#' },
        ],
      },
      {
        heading: 'Small Business Services',
        links: [
          { label: 'Small business taxes', href: '#' },
          { label: 'Small business bookkeeping', href: '#' },
          { label: 'Small business payroll', href: '#' },
          { label: 'Business formation services', href: '#' },
          { label: 'Wave Financial', href: '#' },
        ],
      },
    ],
    [
      {
        heading: 'Tax Tools',
        links: [
          { label: 'MyBlock', href: '#' },
          { label: 'Tax calculator', href: '#' },
          { label: 'Tax prep checklist', href: '#' },
          { label: 'Appointment Prep Guide', href: '#' },
          { label: 'Refund & payment options', href: '#' },
          { label: 'Tax payment center', href: '#' },
          { label: "Where's my refund?", href: '#' },
          { label: 'W-4 calculator', href: '#' },
        ],
      },
      {
        heading: 'Legal',
        links: [
          { label: 'Terms', href: '#' },
          { label: 'Privacy notice', href: '#' },
          { label: 'Manage Cookie Settings', href: '#' },
          { label: 'Pathward privacy notice', href: '#' },
        ],
      },
    ],
    [
      {
        heading: 'Financial Services',
        links: [
          { label: 'Explore loans', href: '#' },
          { label: 'Spruce', href: '#' },
          { label: 'Emerald Card', href: '#' },
          { label: 'Refund Transfer', href: '#' },
          { label: 'Emerald Advance Loan', href: '#' },
          { label: 'Refund Advance', href: '#' },
        ],
      },
      {
        heading: 'Resources',
        links: [
          { label: 'Customer help & support', href: '#' },
          { label: 'Tax questions', href: '#' },
          { label: 'Office locations', href: '#' },
          { label: 'International locations', href: '#' },
          { label: 'Sitemap', href: '#' },
        ],
      },
    ],
    [
      {
        heading: 'About H&R Block',
        links: [
          { label: 'About us', href: '#' },
          { label: 'Fund Her Future', href: '#' },
          { label: 'Careers', href: '#' },
          { label: 'Buy or sell an office', href: '#' },
          { label: 'Income tax course', href: '#' },
          { label: 'News Center', href: '#' },
          { label: 'Investor relations', href: '#' },
          { label: 'The Tax Institute', href: '#' },
          { label: 'Guarantees', href: '#' },
        ],
      },
    ],
  ] satisfies FooterSection[][],
  /** Footer social icons (icon is chosen in Footer by `label`). */
  footerSocial: [
    { label: 'TikTok', href: '#' },
    { label: 'Facebook', href: '#' },
    { label: 'Instagram', href: '#' },
    { label: 'YouTube', href: '#' },
    { label: 'LinkedIn', href: '#' },
  ] satisfies NavLink[],
  footerLegal: 'Copyright © 2026 HRB Digital LLC. All Rights Reserved.',
  footerPrivacyChoices: { label: 'Your Privacy Choices', href: '#' },
} as const;

export type SiteConfig = typeof siteConfig;
