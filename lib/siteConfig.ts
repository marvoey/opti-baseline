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
export type SignInAccount = { label: string; href: string };
export type SocialLink = { label: string; href: string; icon: string };

export const siteConfig = {
  /** Used for the document <title> fallback and the logo alt text. */
  name: 'ESL Federal Credit Union',
  /** Default browser-tab title (per-page titles override via CMS MetaTitle). */
  title: 'ESL Federal Credit Union | Serving Greater Rochester, NY',
  /** Default meta description. */
  description:
    'ESL Federal Credit Union has been serving the Greater Rochester, NY area since 1941. Personal banking, business banking, mortgages, loans, and wealth management.',

  /** Header logo (place the asset in /public). */
  logoSrc: '/esl-logo.png',
  logoAlt: 'ESL Federal Credit Union',

  /** Top utility bar. */
  topNavLinks: [
    { label: 'Rates', href: '#' },
    { label: 'Locations & ATMs', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact Us', href: '#' },
  ] satisfies NavLink[],

  /** Primary header navigation. */
  mainNavLinks: [
    { label: 'Personal', href: '#' },
    { label: 'Business', href: '#' },
    { label: 'Wealth', href: '#' },
    { label: 'Community', href: '#' },
    { label: 'About Us', href: '#' },
    { label: 'Financial Wellness', href: '#' },
  ] satisfies NavLink[],

  /** Header call-to-action button. */
  primaryCta: { label: 'Open an Account', href: '#' } satisfies NavLink,

  /** Account sign-in label and per-account-type links. */
  accountLabel: 'Sign In',
  signInAccounts: [
    { label: 'Personal Banking', href: '#' },
    { label: 'Business Banking', href: '#' },
    { label: 'Investment / Wealth', href: '#' },
    { label: 'Trust Services', href: '#' },
  ] satisfies SignInAccount[],

  /** Footer. */
  footerTagline: 'Serving Greater Rochester, New York since 1941.',
  footerAddress: '225 Chestnut Street, Rochester, NY 14604',
  footerPhone: '585-336-1000',

  footerColumns: [
    {
      heading: 'Personal Banking',
      links: [
        { label: 'Checking Accounts', href: '#' },
        { label: 'Savings Accounts', href: '#' },
        { label: 'Personal Loans', href: '#' },
        { label: 'Mortgages', href: '#' },
        { label: 'Credit Cards', href: '#' },
      ],
    },
    {
      heading: 'Business Banking',
      links: [
        { label: 'Business Checking', href: '#' },
        { label: 'Business Savings', href: '#' },
        { label: 'Business Loans', href: '#' },
        { label: 'Merchant Services', href: '#' },
        { label: 'Treasury Management', href: '#' },
      ],
    },
    {
      heading: 'Quick Links',
      links: [
        { label: 'ATM Locator', href: '#' },
        { label: 'Rates', href: '#' },
        { label: 'Financial Calculators', href: '#' },
        { label: 'Forms & Applications', href: '#' },
        { label: 'Fraud Protection', href: '#' },
      ],
    },
  ] satisfies FooterColumn[],

  footerSocialLinks: [
    { label: 'Facebook', href: '#', icon: 'Facebook' },
    { label: 'Instagram', href: '#', icon: 'Instagram' },
    { label: 'Twitter / X', href: '#', icon: 'Twitter' },
    { label: 'YouTube', href: '#', icon: 'Youtube' },
    { label: 'LinkedIn', href: '#', icon: 'Linkedin' },
  ] satisfies SocialLink[],

  footerLegal: `© ${2026} ESL Federal Credit Union. All rights reserved. Federally insured by NCUA. Equal Housing Lender.`,
  footerLegalLinks: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Accessibility', href: '#' },
    { label: 'Disclosures', href: '#' },
  ] satisfies NavLink[],
} as const;

export type SiteConfig = typeof siteConfig;
