/**
 * Site config — the single place to rebrand the non-colour chrome for a new
 * demo. Colours live in app/globals.css (the `@theme` token block); everything
 * else — site name, logo, nav links, footer columns, legal copy — lives here.
 *
 * To stand up a new demo: edit this file, drop a new public/logo.svg, and tweak
 * the hex values in app/globals.css. No component edits required.
 */

type NavLink = { label: string; href: string };
type FooterColumn = { heading: string; links: NavLink[] };

export const siteConfig = {
  /** Used for the document <title> fallback and the logo alt text. */
  name: 'Demo Site',
  /** Default browser-tab title (per-page titles override via CMS MetaTitle). */
  title: 'Demo Site',
  /** Default meta description. */
  description: 'A reference Optimizely CMS + Next.js demo site.',

  /** Header logo (place the asset in /public). */
  logoSrc: '/logo.svg',
  logoAlt: 'Demo Site',

  /** Top utility bar. */
  topNavLinks: [
    { label: 'For Business', href: '#' },
    { label: 'For Partners', href: '#' },
    { label: 'Support', href: '#' },
  ] satisfies NavLink[],
  phone: '1-800-000-0000',

  /** Primary header navigation. */
  mainNavLinks: [
    { label: 'Products', href: '#' },
    { label: 'Solutions', href: '#' },
    { label: 'Resources', href: '/services' },
    { label: 'About', href: '/locations' },
  ] satisfies NavLink[],
  /** Header call-to-action button. */
  primaryCta: { label: 'Get Started', href: '#' } satisfies NavLink,
  /** Account / login button label. */
  accountLabel: 'Sign In',

  /** Footer. */
  footerTagline:
    'A reference base for building Optimizely CMS demos on Next.js. Replace this copy in lib/siteConfig.ts.',
  footerColumns: [
    {
      heading: 'Product',
      links: [
        { label: 'Overview', href: '#' },
        { label: 'Features', href: '#' },
        { label: 'Pricing', href: '#' },
      ],
    },
    {
      heading: 'Resources',
      links: [
        { label: 'Docs', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Careers', href: '#' },
      ],
    },
  ] satisfies FooterColumn[],
  footerLegal: `© ${'2026'} Demo Site. All rights reserved.`,
  footerLegalLinks: [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
  ] satisfies NavLink[],
} as const;

