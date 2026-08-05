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
  name: 'CI Assante Wealth Management',
  /** Default browser-tab title (per-page titles override via CMS MetaTitle). */
  title: 'CI Assante Wealth Management',
  /** Default meta description. */
  description:
    "CI Assante — Canada's leading network of independent financial advisors, managing $69 billion of Canadian wealth.",

  /** Header logo (place the asset in /public). */
  logoSrc: '/Optimizely_Primary-Logo_Medium_Green_RGB.png',
  logoAlt: 'CI Assante Wealth Management',

  /** Top utility bar. */
  topNavLinks: [
    { label: 'For Advisors', href: '#' },
    { label: 'For Investors', href: '#' },
  ] satisfies NavLink[],

  /** Primary header navigation. */
  mainNavLinks: [
    { label: 'About Us', href: '#' },
    { label: 'Services', href: '#' },
    { label: 'Find an Advisor', href: '#' },
    { label: 'Insights', href: '#' },
    { label: 'Contact', href: '#' },
  ] satisfies NavLink[],
  /** Header call-to-action button. */
  primaryCta: { label: 'Find an Advisor', href: '#' } satisfies NavLink,
  /** Account / login button label. */
  accountLabel: 'Client Login',

  /** Footer. */
  footerTagline:
    "Canada's leading network of independent financial advisors — personalized wealth management strategies for every stage of life.",
  footerColumns: [
    {
      heading: 'Services',
      links: [
        { label: 'Investment Management', href: '#' },
        { label: 'Retirement Planning', href: '#' },
        { label: 'Tax Planning', href: '#' },
        { label: 'Estate Planning', href: '#' },
        { label: 'Insurance & Risk', href: '#' },
      ],
    },
    {
      heading: 'Resources',
      links: [
        { label: 'Market Insights', href: '#' },
        { label: 'Retirement Guide', href: '#' },
        { label: 'ESG Investing', href: '#' },
        { label: 'Client Portal', href: '#' },
      ],
    },
    {
      heading: 'Company',
      links: [
        { label: 'About CI Assante', href: '#' },
        { label: 'Find an Advisor', href: '#' },
        { label: 'Join Our Network', href: '#' },
        { label: 'News & Media', href: '#' },
      ],
    },
  ] satisfies FooterColumn[],
  footerLegal: `© ${2026} CI Assante Wealth Management. CI Assante is regulated by CIRO and is a member of the Canadian Investor Protection Fund.`,
  footerLegalLinks: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Legal', href: '#' },
    { label: 'Accessibility', href: '#' },
  ] satisfies NavLink[],
} as const;

export type SiteConfig = typeof siteConfig;
