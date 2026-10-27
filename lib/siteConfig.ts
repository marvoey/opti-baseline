/**
 * Site config — the single place to rebrand the non-colour chrome for a new
 * demo. Colours live in app/globals.css (the `@theme` token block); everything
 * else — site name, logo, nav links, footer columns, legal copy — lives here.
 *
 * To stand up a new demo: edit this file, drop new logo SVGs in /public, and tweak
 * the hex values in app/globals.css. No component edits required.
 */

export type NavLink = { label: string; href: string };
export type FooterColumn = { heading: string; links: NavLink[] };

export const siteConfig = {
  /** Used for the document <title> fallback and the logo alt text. */
  name: 'ESL Federal Credit Union',
  /** Default browser-tab title (per-page titles override via CMS MetaTitle). */
  title: 'ESL Federal Credit Union',
  /** Default meta description. */
  description:
    'Member-owned banking, built around the people and places we call home.',

  /** Header logo (navy) and footer logo (white). Place the assets in /public. */
  logoSrc: '/brand-logo-navy.svg',
  logoInvertedSrc: '/brand-logo.svg',
  logoAlt: 'ESL Federal Credit Union',

  /** Top utility bar. */
  topNavLinks: [
    { label: 'Locations', href: '#' },
    { label: 'Help', href: '#' },
  ] satisfies NavLink[],

  /** Primary header navigation. */
  mainNavLinks: [
    { label: 'Personal', href: '#' },
    { label: 'Business', href: '#' },
    { label: 'Wealth', href: '#' },
    { label: 'Membership', href: '#' },
  ] satisfies NavLink[],
  /** Header call-to-action button. */
  primaryCta: { label: 'Join', href: '#' } satisfies NavLink,
  /** Account / login button label. */
  accountLabel: 'Sign in',

  /** Footer. */
  footerTagline:
    'Member-owned banking, built around the people and places we call home.',
  footerCta: { label: 'Become a member', href: '#' } satisfies NavLink,
  footerColumns: [
    {
      heading: 'Member Tools',
      links: [
        { label: 'Sign in to online banking', href: '#' },
        { label: 'Find a branch or ATM', href: '#' },
        { label: 'Rates at a glance', href: '#' },
        { label: 'Become a Member', href: '#' },
      ],
    },
    {
      heading: 'Help & Support',
      links: [
        { label: 'Common questions', href: '#' },
        { label: 'How-to guides', href: '#' },
        { label: 'Contact us', href: '#' },
        { label: 'Report fraud', href: '#' },
      ],
    },
    {
      heading: 'Manage',
      links: [
        { label: 'Free Checking', href: '#' },
        { label: 'Savings', href: '#' },
        { label: 'Credit Cards', href: '#' },
        { label: 'Mortgages', href: '#' },
      ],
    },
    {
      heading: 'About ESL',
      links: [
        { label: 'Our story', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Community', href: '#' },
        { label: 'Social Channels', href: '#' },
      ],
    },
  ] satisfies FooterColumn[],
  footerAddress: '225 Chestnut Street, Rochester NY 14604',
  footerServiceMarks:
    'ESL, TEL-E$L, and CheckOK are registered service marks of ESL Federal Credit Union. Membership is subject to eligibility.',
  footerLegal: `© ${2026} ESL Federal Credit Union. All rights reserved.`,
  footerLegalLinks: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Disclosures', href: '#' },
    { label: 'Security', href: '#' },
  ] satisfies NavLink[],
} as const;

export type SiteConfig = typeof siteConfig;
