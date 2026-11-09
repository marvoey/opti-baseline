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

  /** Top utility bar (jacksonhewitt.com: Find an office · Search · Contact Us · Log in). */
  topNavLinks: [
    { label: 'Contact Us', href: '#' },
    { label: 'Tax Tips & Topics', href: '/tax-help/tax-tips-topics/filing-your-taxes' },
    { label: '1-800-234-1040', href: 'tel:18002341040' },
  ] satisfies NavLink[],

  /** Primary header navigation (mirrors the three top-level menus on jacksonhewitt.com). */
  mainNavLinks: [
    { label: 'File Your Taxes', href: '/file-taxes-options-products' },
    { label: 'Resolve Tax Issues', href: '#' },
    { label: 'Tax Resources', href: '/tax-help/tax-tips-topics/filing-your-taxes' },
  ] satisfies NavLink[],
  /** Header call-to-action button. */
  primaryCta: { label: 'Find an Office', href: '#' } satisfies NavLink,
  /** Account / login button label. */
  accountLabel: 'Log in | Sign up',

  /** Footer. */
  footerTagline: 'Get every dollar you deserve®',
  footerColumns: [
    {
      heading: 'Tax Services',
      links: [
        { label: 'File with a Tax Pro', href: '/file-taxes-options-products' },
        { label: 'File Online ($25)', href: '/file-taxes-options-products/file-taxes-online' },
        { label: 'Drop Off Your Taxes', href: '#' },
        { label: 'Refund Advance', href: '/refund-advance' },
      ],
    },
    {
      heading: 'Tax Resources',
      links: [
        { label: 'Tax Tips & Topics', href: '/tax-help/tax-tips-topics/filing-your-taxes' },
        { label: 'Tax Calculators', href: '#' },
        { label: 'Standard Deduction', href: '#' },
        { label: 'Earned Income Tax Credit', href: '#' },
      ],
    },
    {
      heading: 'Meet Jackson Hewitt',
      links: [
        { label: 'About Us', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Maximum Refund Guarantee', href: '#' },
        { label: 'Walmart Locations', href: '#' },
      ],
    },
    {
      heading: 'Account & Support',
      links: [
        { label: 'Log in | Sign up', href: '#' },
        { label: 'Where\'s My Refund?', href: '#' },
        { label: 'Contact Us', href: '#' },
        { label: 'Find an Office', href: '#' },
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
