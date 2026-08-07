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
  name: 'Specialty Food Association',
  /** Default browser-tab title (per-page titles override via CMS MetaTitle). */
  title: 'Specialty Food Association | The Business of Specialty Food',
  /** Default meta description. */
  description:
    'The Specialty Food Association is the leading trade organization for specialty food makers, importers, and buyers. Discover awards, events, and industry resources.',

  /** Header logo (place the asset in /public). */
  logoSrc: '/logo.svg',
  logoAlt: 'Specialty Food Association',

  /** Top utility bar. */
  topNavLinks: [
    { label: 'Member Resources', href: '#' },
    { label: 'Industry Insights', href: '#' },
  ] satisfies NavLink[],

  /** Primary header navigation. */
  mainNavLinks: [
    { label: 'Membership', href: '#' },
    { label: 'Events', href: '#' },
    { label: 'Awards', href: '#' },
    { label: 'News', href: '#' },
    { label: 'Resources', href: '#' },
  ] satisfies NavLink[],
  /** Header call-to-action button. */
  primaryCta: { label: 'Become a Member', href: '#' } satisfies NavLink,
  /** Account / login button label. */
  accountLabel: 'Log in',

  /** Footer. */
  footerTagline:
    'The definitive community for specialty food professionals — connecting makers, buyers, and innovators since 1952.',
  footerColumns: [
    {
      heading: 'Membership',
      links: [
        { label: 'Join Today', href: '#' },
        { label: 'Member Benefits', href: '#' },
        { label: 'Find a Member', href: '#' },
        { label: 'Renew Membership', href: '#' },
      ],
    },
    {
      heading: 'Events & Shows',
      links: [
        { label: 'Summer Fancy Food Show', href: '#' },
        { label: 'Winter FancyFaire', href: '#' },
        { label: 'sofi™ Awards', href: '#' },
        { label: 'All Events', href: '#' },
      ],
    },
    {
      heading: 'Resources',
      links: [
        { label: 'State of the Industry', href: '#' },
        { label: 'Trendspotter Report', href: '#' },
        { label: 'SFA Blog', href: '#' },
        { label: 'Supplier Directory', href: '#' },
      ],
    },
  ] satisfies FooterColumn[],
  footerLegal: `© ${2026} Specialty Food Association. All rights reserved.`,
  footerLegalLinks: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Use', href: '#' },
    { label: 'Cookie Settings', href: '#' },
  ] satisfies NavLink[],
} as const;

export type SiteConfig = typeof siteConfig;
