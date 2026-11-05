/**
 * Site config — the single place to rebrand the non-colour chrome for a new
 * demo. Colours live in app/globals.css (the `@theme` token block); everything
 * else — site name, logo, nav links, footer columns, legal copy — lives here.
 *
 * To stand up a new demo: edit this file, drop a logo into /public and point
 * `logoSrc` at it, and tweak the tokens in app/globals.css. No component edits
 * required.
 *
 * Nav labels below follow the OpenTable restaurant-solutions site; footer
 * columns, taglines and all `#` links are placeholders to replace.
 */

export type NavLink = { label: string; href: string };
export type FooterColumn = { heading: string; links: NavLink[] };

export const siteConfig = {
  /** Used for the document <title> fallback, the logo alt text and the text wordmark. */
  name: 'OpenTable',
  /** Default browser-tab title (per-page titles override via CMS MetaTitle). */
  title: 'OpenTable Restaurant Solutions',
  /** Default meta description. */
  description:
    'Restaurant reservation, guest relationship and marketing tools that help restaurants fill tables and build loyal guests.',

  /**
   * Header/footer logo (place the asset in /public). While this is empty the
   * chrome renders `name` as a text wordmark instead. The footer sits on a dark
   * background, so it renders the logo in white (see Footer.tsx).
   * opentable-logo.svg is OpenTable's default logo, 162×36.
   */
  logoSrc: '/opentable-logo.svg' as string,
  logoAlt: 'OpenTable',
  logoWidth: 162,
  logoHeight: 36,

  /** Top utility bar. */
  topNavLinks: [
    { label: 'For diners', href: '#' },
    { label: 'Support', href: '#' },
  ] satisfies NavLink[],

  /** Primary header navigation. */
  mainNavLinks: [
    { label: 'Solutions & benefits', href: '/another-page' },
    { label: 'Why OpenTable', href: '#' },
    { label: 'Who we serve', href: '#' },
    { label: 'Resources', href: '#' },
    { label: 'Pricing and plans', href: '#' },
  ] satisfies NavLink[],
  /** Header call-to-action button. */
  primaryCta: { label: 'Get started', href: '#' } satisfies NavLink,
  /** Account / login button label. */
  accountLabel: 'Log in',

  /** Footer. */
  footerTagline:
    'Tools that help restaurants fill tables, know their guests and run service smoothly.',
  footerColumns: [
    {
      heading: 'Solutions',
      links: [
        { label: 'Restaurant reservation software', href: '#' },
        { label: 'Restaurant CRM software', href: '#' },
        { label: 'Marketing tools', href: '#' },
        { label: 'Pricing and plans', href: '#' },
      ],
    },
    {
      heading: 'Who we serve',
      links: [
        { label: 'Independent restaurants', href: '#' },
        { label: 'Restaurant groups', href: '#' },
        { label: 'Hotels and resorts', href: '#' },
      ],
    },
    {
      heading: 'Resources',
      links: [
        { label: 'Industry insights', href: '#' },
        { label: 'Guides', href: '#' },
        { label: 'Webinars', href: '#' },
        { label: 'Support', href: '#' },
      ],
    },
  ] satisfies FooterColumn[],
  footerLegal: `© ${2026} OpenTable. All rights reserved.`,
  footerLegalLinks: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Settings', href: '#' },
  ] satisfies NavLink[],
} as const;

export type SiteConfig = typeof siteConfig;
