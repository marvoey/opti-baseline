/**
 * Site config - the single place to rebrand the non-colour chrome for a new
 * demo. Colours live in app/globals.css (the `@theme` token block); everything
 * else - site name, logo, nav links, promo strip, footer columns, legal copy -
 * lives here.
 *
 * To stand up a new demo: edit this file, set `logoSrc` to a file in /public
 * (or leave it null to render the text wordmark), and tweak the hex values in
 * app/globals.css. Fonts are set in app/layout.tsx.
 */

export type NavLink = {
  label: string;
  href: string;
  /** Shows a dropdown chevron next to the label (header nav only). */
  menu?: boolean;
};
export type FooterColumn = { heading: string; links: NavLink[] };

export const siteConfig = {
  /** Used for the document <title> fallback and the logo alt text. */
  name: 'eHealth',
  /** Default browser-tab title (per-page titles override via CMS MetaTitle). */
  title: 'eHealth | Compare Medicare & Health Insurance Plans',
  /** Default meta description. */
  description:
    'Compare Medicare, individual & family, small business, dental, vision and short-term health insurance plans from top carriers, then enroll online or with a licensed agent.',

  /**
   * Header logo image (place the asset in /public). Null renders the built-in
   * text wordmark (see app/_components/SiteLogo.tsx) - swap in the official
   * eHealth logo file here when you have it.
   */
  logoSrc: null as string | null,
  logoAlt: 'eHealth',

  /** Magenta promo strip under the header. */
  promoBanner: {
    message: 'Medicare Annual Enrollment is here!',
    linkLabel: 'Compare 2027 Medicare plans below',
    href: '#',
  },

  /** Primary header navigation. */
  mainNavLinks: [
    { label: 'Find Health Insurance', href: '#', menu: true },
    { label: 'Learn', href: '#', menu: true },
  ] satisfies NavLink[],
  /**
   * Dynamic header navigation, built from the CMS content tree (see lib/nav.ts).
   * Direct children of `rootKey` become the menu items and their children become
   * the dropdown. `mainNavLinks` above is only the fallback when the tree is
   * empty or Graph can't be reached.
   */
  nav: {
    /** Content key (no dashes) of the container whose children form the menu: "eHealth Home". */
    rootKey: '055218e17aa84576a1d733c08ebf7b02',
    /** Cap on top-level menu items. */
    maxItems: 8,
    /** Cap on dropdown items per menu item. */
    maxChildren: 12,
    /** Content keys (no dashes) of pages to keep out of the menu. */
    excludeKeys: [] as string[],
  },
  /** Phone number shown in the header. */
  phone: { label: '(877) 378-1318', href: 'tel:+18773781318' },
  /** Account / login button label. */
  accountLabel: 'Sign in',

  /** Footer (placeholder links - confirm against the live site). */
  footerColumns: [
    {
      heading: 'Products',
      links: [
        { label: 'Medicare', href: '/medicare' },
        { label: 'Medicare Advantage', href: '#' },
        { label: 'Individual & Family', href: '/individual-and-family' },
        { label: 'Small Business', href: '/small-business' },
        { label: 'Dental', href: '/dental-and-vision/dental' },
        { label: 'Vision', href: '/dental-and-vision/vision' },
        { label: 'Short-Term Medical', href: '/short-term' },
      ],
    },
    {
      heading: 'Services',
      links: [
        { label: 'MatchFinder', href: '#' },
        { label: 'Live Advise', href: '#' },
        { label: 'Compare Carriers', href: '#' },
        { label: 'Speak with an Agent', href: '#' },
      ],
    },
    {
      heading: 'Company',
      links: [
        { label: 'About Us', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Investor Relations', href: '#' },
        { label: 'Press', href: '#' },
      ],
    },
    {
      heading: 'Connect',
      links: [
        { label: 'Facebook', href: '#' },
        { label: 'Instagram', href: '#' },
        { label: 'YouTube', href: '#' },
      ],
    },
  ] satisfies FooterColumn[],
  footerLegal: `© ${2026} eHealthInsurance Services, Inc.`,
  footerLegalLinks: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Use', href: '#' },
    { label: 'Site Map', href: '#' },
  ] satisfies NavLink[],
} as const;

export type SiteConfig = typeof siteConfig;
