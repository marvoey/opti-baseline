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
  name: 'Optimizely',
  /** Default browser-tab title (per-page titles override via CMS MetaTitle). */
  title: 'Optimizely | Digital Experience Platform',
  /** Default meta description. */
  description:
    'Optimizely — the digital experience platform that helps teams create, test, and optimize digital experiences at scale.',

  /** Header logo (place the asset in /public). */
  logoSrc: '/Optimizely_Primary-Logo_Medium_Green_RGB.png',
  logoAlt: 'Optimizely',

  /** Top utility bar. */
  topNavLinks: [
    { label: 'Partners', href: '#' },
    { label: 'Support', href: '#' },
  ] satisfies NavLink[],

  /** Primary header navigation. */
  mainNavLinks: [
    { label: 'Products', href: '#' },
    { label: 'Solutions', href: '#' },
    { label: 'Customers', href: '#' },
    { label: 'Resources', href: '#' },
    { label: 'Pricing', href: '#' },
  ] satisfies NavLink[],
  /** Header call-to-action button. */
  primaryCta: { label: 'Get started free', href: '#' } satisfies NavLink,
  /** Account / login button label. */
  accountLabel: 'Log in',

  /** Footer. */
  footerTagline:
    'Create, test, and optimize digital experiences that turn visitors into loyal customers.',
  footerColumns: [
    {
      heading: 'Products',
      links: [
        { label: 'Content Management', href: '#' },
        { label: 'Experimentation', href: '#' },
        { label: 'Commerce', href: '#' },
        { label: 'Personalization', href: '#' },
      ],
    },
    {
      heading: 'Solutions',
      links: [
        { label: 'B2B Commerce', href: '#' },
        { label: 'B2C Commerce', href: '#' },
        { label: 'Digital Marketing', href: '#' },
        { label: 'Customer Journeys', href: '#' },
      ],
    },
    {
      heading: 'Resources',
      links: [
        { label: 'Blog', href: '#' },
        { label: 'Documentation', href: '#' },
        { label: 'Community', href: '#' },
        { label: 'Webinars', href: '#' },
      ],
    },
  ] satisfies FooterColumn[],
  footerLegal: `© ${2026} Optimizely. All rights reserved.`,
  footerLegalLinks: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Settings', href: '#' },
  ] satisfies NavLink[],
} as const;

export type SiteConfig = typeof siteConfig;
