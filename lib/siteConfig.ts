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
  name: 'CIBC Mellon',
  /** Default browser-tab title (per-page titles override via CMS MetaTitle). */
  title: 'CIBC Mellon | Institutional Asset Servicing',
  /** Default meta description. */
  description:
    "CIBC Mellon — the operational infrastructure for Canada's institutional investment industry.",

  /** Header logo (place the asset in /public). */
  logoSrc: '/logo.svg',
  logoAlt: 'CIBC Mellon',

  /** Top utility bar. */
  topNavLinks: [
    { label: 'Client Access', href: '#' },
    { label: 'Insights', href: '#' },
    { label: 'Contact', href: '#' },
  ] satisfies NavLink[],
  phone: '1-800-387-0825',

  /** Primary header navigation. */
  mainNavLinks: [
    { label: 'Solutions', href: '/solutions' },
    { label: 'Client Access', href: '/client-access' },
    { label: 'Straight Talk', href: '/straight-talk' },
    { label: 'Market Bulletins', href: '/market-bulletins' },
  ] satisfies NavLink[],
  /** Header call-to-action button. */
  primaryCta: { label: 'Get Started', href: '#' } satisfies NavLink,
  /** Account / login button label. */
  accountLabel: 'Sign In',

  /** Footer. */
  footerTagline:
    "The operational infrastructure for Canada's institutional investment industry — asset servicing, settlement and analytics at scale.",
  footerColumns: [
    {
      heading: 'Solutions',
      links: [
        { label: 'Asset Servicing', href: '#' },
        { label: 'Settlement', href: '#' },
        { label: 'Analytics', href: '#' },
      ],
    },
    {
      heading: 'Client Access',
      links: [
        { label: 'Online Services', href: '#' },
        { label: 'Reporting', href: '#' },
        { label: 'Account Management', href: '#' },
      ],
    },
    {
      heading: 'Insights',
      links: [
        { label: 'Straight Talk', href: '#' },
        { label: 'Market Bulletins', href: '#' },
        { label: 'Careers', href: '#' },
      ],
    },
  ] satisfies FooterColumn[],
  footerLegal: `© ${'2026'} CIBC Mellon. A global leader in asset servicing infrastructure.`,
  footerLegalLinks: [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
  ] satisfies NavLink[],
} as const;

export type SiteConfig = typeof siteConfig;
