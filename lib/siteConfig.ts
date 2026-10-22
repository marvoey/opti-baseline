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
  name: 'Jackson Hewitt',
  /** Default browser-tab title (per-page titles override via CMS MetaTitle). */
  title: 'Jackson Hewitt | Tax Preparation & Maximum Refund Guarantee',
  /** Default meta description. */
  description:
    'File with a Jackson Hewitt Tax Pro at 5,200+ offices and 2,600+ Walmart locations, or file online for a flat $25. Maximum Refund and 100% Accuracy Guarantees.',

  /** Header logo (place the asset in /public). */
  logoSrc: '/jh-logo.svg',
  logoAlt: 'Jackson Hewitt Tax Service',

  /** Customer service line shown in the utility bar. */
  phone: '1-800-234-1040',

  /** Top utility bar. */
  topNavLinks: [
    { label: 'Office Locator', href: '#' },
    { label: 'Tax Tips & Topics', href: '/tax-help/tax-tips-topics/filing-your-taxes' },
    { label: '1-800-234-1040', href: 'tel:18002341040' },
  ] satisfies NavLink[],

  /** Primary header navigation. */
  mainNavLinks: [
    { label: 'File with a Tax Pro', href: '/file-taxes-options-products' },
    { label: 'File Online ($25)', href: '/file-taxes-options-products/file-taxes-online' },
    { label: 'Walmart Locations', href: '#' },
    { label: 'Refund Advance', href: '/refund-advance' },
    { label: 'Tax Tips', href: '/tax-help/tax-tips-topics/filing-your-taxes' },
  ] satisfies NavLink[],
  /** Header call-to-action button. */
  primaryCta: { label: 'Find an Office', href: '#' } satisfies NavLink,
  /** Account / login button label. */
  accountLabel: 'Sign in to MyJH',

  /** Footer. */
  footerTagline:
    'Tax preparation backed by our Maximum Refund and 100% Accuracy Guarantees. In-store, at Walmart, or online.',
  footerColumns: [
    {
      heading: 'File Your Taxes',
      links: [
        { label: 'File with a Tax Pro', href: '#' },
        { label: 'File Online ($25)', href: '#' },
        { label: 'Drop Off Your Taxes', href: '#' },
        { label: 'Walmart Locations', href: '#' },
      ],
    },
    {
      heading: 'Refunds & Loans',
      links: [
        { label: 'Refund Advance', href: '/refund-advance' },
        { label: 'Refund Calculator', href: '#' },
        { label: 'Where\'s My Refund?', href: '#' },
        { label: 'Maximum Refund Guarantee', href: '#' },
      ],
    },
    {
      heading: 'Tax Help',
      links: [
        { label: 'Standard Deduction', href: '#' },
        { label: 'Earned Income Tax Credit', href: '#' },
        { label: 'Tax Calculators', href: '#' },
        { label: 'Tax Resolution', href: '#' },
      ],
    },
  ] satisfies FooterColumn[],
  footerLegal: `© ${2026} Jackson Hewitt Tax Service. All rights reserved.`,
  footerLegalLinks: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Settings', href: '#' },
  ] satisfies NavLink[],
} as const;

export type SiteConfig = typeof siteConfig;
