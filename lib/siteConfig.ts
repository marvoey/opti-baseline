/**
 * Site config — the single place to rebrand the non-colour chrome for a new
 * demo. Colours live in app/globals.css (the `@theme` token block); everything
 * else — site name, logo, nav links, footer columns, legal copy — lives here.
 *
 * The logo itself is the <OnticLogo/> component (app/_components/OnticLogo.tsx),
 * rendered directly by MainNav/Footer rather than an <img src=...> here, since
 * it's an inline SVG, not a static asset.
 */

export type NavLink = { label: string; href: string };
export type FooterColumn = { heading: string; links: NavLink[] };

export const siteConfig = {
  /** Used for the document <title> fallback. */
  name: 'Ontic',
  /** Default browser-tab title (per-page titles override via CMS MetaTitle). */
  title: 'Ontic | Protective Intelligence Platform',
  /** Default meta description. */
  description:
    'Ontic is the protective intelligence software platform built to unify threat data, automate security workflows, and safeguard people and physical operations.',

  /** Top utility bar. */
  topNavLinks: [
    { label: 'Careers', href: '/demo-mock/platform' },
    { label: 'Call: 512-572-7400', href: 'tel:512-572-7400' },
  ] satisfies NavLink[],

  /** Primary header navigation. */
  mainNavLinks: [
    { label: 'Platform & AI', href: '/demo-mock/platform' },
    { label: 'Solutions', href: '/demo-mock/solutions' },
    { label: 'Executive Protection', href: '/demo-mock/solutions/executive-protection' },
    { label: 'Incident Response', href: '/demo-mock/solutions/incident-management' },
  ] satisfies NavLink[],
  /** Header call-to-action button. */
  primaryCta: { label: 'Request a Demo', href: '/demo-mock' } satisfies NavLink,
  /** Account / login button label. */
  accountLabel: 'Client Login',

  /** Footer. */
  footerTagline:
    'Ontic is the protective intelligence software platform built to unify threat data, automate security workflows, and safeguard people and physical operations.',
  footerColumns: [
    {
      heading: 'Solutions',
      links: [
        { label: 'Executive Protection', href: '/demo-mock/solutions/executive-protection' },
        { label: 'Incident Management', href: '/demo-mock/solutions/incident-management' },
        { label: 'Threat Intelligence', href: '/demo-mock/solutions' },
        { label: 'Corporate Investigations', href: '/demo-mock/solutions' },
      ],
    },
    {
      heading: 'Products',
      links: [
        { label: 'Ontic Platform', href: '/demo-mock/platform' },
        { label: 'Ontic AI Engine', href: '/demo-mock/platform' },
        { label: 'Risk Intelligence', href: '/demo-mock/platform' },
        { label: '60+ Integrations', href: '/demo-mock/platform' },
      ],
    },
    {
      heading: 'Company',
      links: [
        { label: 'About Us', href: '/demo-mock' },
        { label: 'Client Stories', href: '/demo-mock' },
        { label: 'Trust and Security', href: '/demo-mock/platform' },
        { label: 'Request Demo', href: '/demo-mock' },
      ],
    },
  ] satisfies FooterColumn[],
  footerLegal: `© 2026 Ontic Technologies, Inc. All rights reserved.`,
  footerLegalLinks: [
    { label: 'Privacy Notice', href: '#' },
    { label: 'Terms of Use', href: '#' },
    { label: 'Security Overview', href: '#' },
    { label: 'Cookie Preferences', href: '#' },
  ] satisfies NavLink[],
} as const;

export type SiteConfig = typeof siteConfig;
