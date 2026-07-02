/**
 * Site config — the single place to rebrand the non-colour chrome for a new
 * demo. Colours live in app/globals.css (the `@theme` token block); everything
 * else — site name, logo, nav links, footer columns, legal copy — lives here.
 *
 * To stand up a new demo: edit this file, drop a new public/logo.svg, and tweak
 * the hex values in app/globals.css. No component edits required.
 */

export type NavLink = { label: string; href: string };
export type FooterColumn = { heading: string; links: NavLink[] };

export const siteConfig = {
  /** Used for the document <title> fallback and the logo alt text. */
  name: 'Capital One',
  /** Default browser-tab title (per-page titles override via CMS MetaTitle). */
  title: 'Capital One | Banking, Credit Cards & Loans',
  /** Default meta description. */
  description:
    'Capital One Financial — credit cards, checking accounts, savings accounts, and auto loans for individuals and businesses.',

  /** Header logo (place the asset in /public). */
  logoSrc: '/logo.svg',
  logoAlt: 'Capital One',

  /** Top utility bar. */
  topNavLinks: [
    { label: 'About Capital One', href: '#' },
    { label: 'Investor Relations', href: '#' },
    { label: 'Security Center', href: '#' },
  ] satisfies NavLink[],
  phone: '1-877-383-4802',

  /** Primary header navigation. */
  mainNavLinks: [
    { label: 'Credit Cards', href: '#' },
    { label: 'Banking', href: '#' },
    { label: 'Auto Loans', href: '#' },
    { label: 'Business', href: '#' },
  ] satisfies NavLink[],
  /** Header call-to-action button. */
  primaryCta: { label: 'Sign In', href: '#' } satisfies NavLink,
  /** Account / login button label. */
  accountLabel: 'My Account',

  /** Footer. */
  footerTagline:
    'Banking products built for real life — find the right card, account, or loan and manage everything in one place.',
  footerColumns: [
    {
      heading: 'Products',
      links: [
        { label: 'Credit Cards', href: '#' },
        { label: 'Checking Accounts', href: '#' },
        { label: 'Savings Accounts', href: '#' },
        { label: 'Auto Loans', href: '#' },
      ],
    },
    {
      heading: 'Resources',
      links: [
        { label: 'Financial Education', href: '#' },
        { label: 'Security Center', href: '#' },
        { label: 'Careers', href: '#' },
      ],
    },
  ] satisfies FooterColumn[],
  footerLegal: `© ${'2026'} Capital One. All rights reserved.`,
  footerLegalLinks: [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'Accessibility', href: '#' },
  ] satisfies NavLink[],
} as const;

export type SiteConfig = typeof siteConfig;
