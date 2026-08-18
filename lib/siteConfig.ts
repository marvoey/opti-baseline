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
  name: 'Living Spaces',
  /** Default browser-tab title (per-page titles override via CMS MetaTitle). */
  title: 'Living Spaces | Home, Décor & Outdoor Furniture Store',
  /** Default meta description. */
  description:
    'Shop quality furniture and home décor at Living Spaces. Find sofas, beds, dining tables, outdoor furniture, and more with free delivery options.',

  /** Header logo (place the asset in /public). */
  logoSrc: '/living-spaces-logo.svg',
  logoAlt: 'Living Spaces',

  /** Top utility bar. */
  topNavLinks: [
    { label: 'Find a Store', href: '#' },
    { label: 'Track Delivery', href: '#' },
  ] satisfies NavLink[],

  /** Primary header navigation — mirrors livingspaces.com main nav. */
  mainNavLinks: [
    { label: 'Bestsellers', href: '#' },
    { label: 'Shop by Room', href: '#' },
    { label: 'Small Spaces', href: '#' },
    { label: 'Contract Grade', href: '#' },
    { label: 'Trade Program', href: '#' },
    { label: 'Catalogs', href: '#' },
    { label: 'Shop by Style', href: '#' },
    { label: 'Financing', href: '#' },
  ] satisfies NavLink[],
  /** Header call-to-action button. */
  primaryCta: { label: 'Find a Store', href: '#' } satisfies NavLink,
  /** Account / login button label. */
  accountLabel: 'Sign in',

  /** Footer. */
  footerTagline:
    'Quality furniture and home décor for every style and budget, with free delivery options across the US.',
  footerColumns: [
    {
      heading: 'Help',
      links: [
        { label: 'Help Center', href: '#' },
        { label: 'Contact Us', href: '#' },
        { label: 'Shipping FAQs', href: '#' },
        { label: 'Track Delivery', href: '#' },
      ],
    },
    {
      heading: 'Our Company',
      links: [
        { label: 'About Us', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Low Price Guarantee', href: '#' },
        { label: 'Accessibility Statement', href: '#' },
      ],
    },
    {
      heading: 'Resources',
      links: [
        { label: 'Ideas + Advice', href: '#' },
        { label: 'Trade Program', href: '#' },
        { label: 'Virtual Design Services', href: '#' },
        { label: 'Care Free Plan', href: '#' },
      ],
    },
  ] satisfies FooterColumn[],
  footerLegal: '© 2026 Living Spaces. All rights reserved.',
  footerLegalLinks: [
    { label: 'Terms & Conditions', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Use', href: '#' },
  ] satisfies NavLink[],
} as const;

export type SiteConfig = typeof siteConfig;
