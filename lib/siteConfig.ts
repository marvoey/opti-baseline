/**
 * Site config — the single place to rebrand the non-colour chrome for a new
 * demo. Colours live in app/globals.css (the `@theme` token block); everything
 * else — site name, logo, nav links, footer columns, legal copy — lives here.
 *
 * To stand up a new demo: edit this file, drop a new logo in /public, and tweak
 * the hex values in app/globals.css. No component edits required.
 */

export type NavLink = { label: string; href: string };
export type FooterColumn = { heading: string; links: NavLink[] };

export const siteConfig = {
  /** Used for the document <title> fallback and the logo alt text. */
  name: 'Corel',
  /** Default browser-tab title (per-page titles override via CMS MetaTitle). */
  title: 'Corel | Professional graphics software for designers',
  /** Default meta description. */
  description:
    'Your all-in-one vector illustration, layout, and photo editing toolbox for endless creativity with no time wasted.',

  /** Header logo — colour wordmark for light backgrounds (asset lives in /public). */
  logoSrc: '/corel-wordmark.svg',
  /** Footer logo — white-text variant for the black footer. */
  footerLogoSrc: '/corel-wordmark-white.svg',
  logoAlt: 'Corel',

  /** Top utility bar. */
  topNavLinks: [
    { label: 'About', href: 'https://www.corel.com/en/about/' },
    { label: 'Contact', href: 'https://www.corel.com/en/about/contact/' },
  ] satisfies NavLink[],

  /** Primary header navigation. */
  mainNavLinks: [
    { label: 'Products', href: 'https://www.corel.com/en/all-products/' },
    { label: 'Free trials', href: 'https://www.corel.com/en/free-trials/' },
    { label: 'Special offers', href: 'https://www.corel.com/en/special-offers/' },
    { label: 'Partners', href: 'https://www.corel.com/en/partner-program/' },
    { label: 'Support', href: 'https://www.corel.com/en/support/' },
  ] satisfies NavLink[],
  /** Header call-to-action button. */
  primaryCta: {
    label: 'Try free',
    href: 'https://www.corel.com/en/free-trials/',
  } satisfies NavLink,
  /** Account / login button. */
  accountLabel: 'Sign in',
  accountHref: 'https://myaccount.corel.com?sso-brandId=corel&sso-locale=en_US',

  /** Footer. */
  footerTagline:
    'Professional graphics software for designers — vector illustration, layout, and photo editing for endless creativity.',
  footerColumns: [
    {
      heading: 'Products',
      links: [
        { label: 'All products', href: 'https://www.corel.com/en/all-products/' },
        { label: 'Special offers', href: 'https://www.corel.com/en/special-offers/' },
        { label: 'Free trials', href: 'https://www.corel.com/en/free-trials/' },
      ],
    },
    {
      heading: 'Quick links',
      links: [
        { label: 'Support', href: 'https://www.corel.com/en/support/' },
        { label: 'Partners', href: 'https://www.corel.com/en/partner-program/' },
        { label: 'Find a partner', href: 'https://www.corel.com/en/partner-locator/' },
        { label: 'My account', href: 'https://myaccount.corel.com?sso-brandId=corel&sso-locale=en_US' },
        { label: 'About', href: 'https://www.corel.com/en/about/' },
        { label: 'Contact', href: 'https://www.corel.com/en/about/contact/' },
        { label: 'News', href: 'https://www.corel.com/en/newsroom/' },
        { label: 'Careers', href: 'https://www.corel.com/en/careers/' },
      ],
    },
    {
      heading: 'Legal',
      links: [
        { label: 'Terms of use', href: 'https://www.corel.com/en/terms-of-use/' },
        { label: 'Privacy', href: 'https://www.corel.com/en/privacy/' },
        { label: 'Cookies', href: 'https://www.corel.com/en/cookies/' },
        { label: 'EULA', href: 'https://www.corel.com/en/eula/' },
        { label: 'Legal', href: 'https://www.corel.com/en/legal-information/' },
        { label: 'Imprint', href: 'https://www.corel.com/en/imprint/' },
      ],
    },
  ] satisfies FooterColumn[],
  footerLegal: 'Copyright © Corel Corporation. All rights reserved.',
  footerLegalLinks: [
    { label: 'Privacy', href: 'https://www.corel.com/en/privacy/' },
    { label: 'Terms of use', href: 'https://www.corel.com/en/terms-of-use/' },
    { label: 'Do not sell/share my information', href: 'https://www.corel.com/en/privacy/form/' },
    { label: 'Manage my cookies', href: 'https://www.corel.com/en/cookies/' },
  ] satisfies NavLink[],
} as const;

export type SiteConfig = typeof siteConfig;
