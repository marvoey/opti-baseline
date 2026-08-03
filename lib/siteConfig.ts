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
export type SocialLink = { platform: string; href: string };

export const siteConfig = {
  /** Used for the document <title> fallback and the logo alt text. */
  name: 'Zscaler',
  /** Default browser-tab title (per-page titles override via CMS MetaTitle). */
  title: 'Zscaler | Zero Trust Security',
  /** Default meta description. */
  description:
    'Zscaler — the world\'s largest security cloud, delivering zero trust exchange for every user, workload, and location.',

  /** Header logo (place the asset in /public). */
  logoSrc: '/logo.svg',
  logoAlt: 'Zscaler',

  /** Top utility bar. */
  topNavLinks: [
    { label: 'ThreatLabz', href: '#' },
    { label: 'Customer Success Stories', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Partners', href: '#' },
    { label: 'Support', href: '#' },
  ] satisfies NavLink[],
  phone: '1-408-533-0288',

  /** Primary header navigation. */
  mainNavLinks: [
    { label: 'Platform', href: '#' },
    { label: 'Products', href: '#' },
    { label: 'Solutions', href: '#' },
    { label: 'Resources', href: '#' },
    { label: 'Company', href: '#' },
  ] satisfies NavLink[],
  /** Primary header call-to-action (filled button). */
  primaryCta: { label: 'Request a demo', href: '#' } satisfies NavLink,
  /** Secondary header call-to-action (outlined button). */
  secondaryCta: { label: 'Take a product tour', href: '#' } satisfies NavLink,
  /** Account / login button label (utility bar). */
  accountLabel: 'Sign In',

  /** Footer. */
  footerTagline:
    'The world\'s largest security cloud — protecting thousands of enterprises from cyberattacks and data loss with zero trust.',
  footerColumns: [
    {
      heading: 'Platform',
      links: [
        { label: 'Zero Trust Exchange', href: '#' },
        { label: 'AI Security', href: '#' },
        { label: 'Data Security', href: '#' },
        { label: 'SecOps', href: '#' },
        { label: 'Industries', href: '#' },
      ],
    },
    {
      heading: 'Company',
      links: [
        { label: 'About', href: '#' },
        { label: 'Leadership', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Investors', href: '#' },
        { label: 'Press', href: '#' },
      ],
    },
    {
      heading: 'Popular Links',
      links: [
        { label: 'Community', href: '#' },
        { label: 'Analysts', href: '#' },
        { label: 'Events', href: '#' },
        { label: 'ThreatLabz', href: '#' },
        { label: 'Executive App', href: '#' },
      ],
    },
    {
      heading: 'Resources',
      links: [
        { label: 'Library', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Webinars', href: '#' },
        { label: 'Zpedia', href: '#' },
        { label: 'Academy', href: '#' },
      ],
    },
    {
      heading: 'Support',
      links: [
        { label: 'Help Portal', href: '#' },
        { label: 'Advisories', href: '#' },
        { label: 'Vulnerability Disclosure', href: '#' },
        { label: 'Compliance', href: '#' },
      ],
    },
  ] satisfies FooterColumn[],
  footerSocialLinks: [
    { platform: 'Facebook', href: '#' },
    { platform: 'LinkedIn', href: '#' },
    { platform: 'X', href: '#' },
    { platform: 'YouTube', href: '#' },
    { platform: 'Instagram', href: '#' },
  ] satisfies SocialLink[],
  footerLegal: `© ${'2026'} Zscaler, Inc. All rights reserved. Zscaler™ and other trademarks are registered trademarks of Zscaler, Inc.`,
  footerLegalLinks: [
    { label: 'Sitemap', href: '#' },
    { label: 'Privacy', href: '#' },
    { label: 'Legal', href: '#' },
    { label: 'Security', href: '#' },
    { label: 'Cookie Preferences', href: '#' },
  ] satisfies NavLink[],
} as const;

export type SiteConfig = typeof siteConfig;
