/**
 * Site config — the single place to rebrand the non-colour chrome for a new
 * demo. Colours live in app/globals.css (the `@theme` token block); everything
 * else — site name, nav links, footer columns, legal copy — lives here. The
 * logo is the inline SVG in app/_components/LibertyLogo.tsx.
 *
 * Copy matches the Ask Liberty and Independent Agent Portal mockups
 * (public/use-case-1-ask-liberty.html, public/use-case-2-agent-portal.html).
 */

export type NavLink = { label: string; href: string };
export type FooterColumn = { heading: string; links: NavLink[] };

export const siteConfig = {
  /** Used for the document <title> fallback and the logo alt text. */
  name: 'Liberty Mutual',
  /** Default browser-tab title (per-page titles override via CMS MetaTitle). */
  title: 'Liberty Mutual Insurance',
  /** Default meta description. */
  description:
    'Liberty Mutual Insurance — get clear answers about car, home and renters insurance, manage claims, and find a local agent.',

  logoAlt: 'Liberty Mutual Insurance',

  /** Slim utility row above the header (the language switcher sits at its right). */
  topNavLinks: [
    { label: 'Help', href: '#' },
  ] satisfies NavLink[],

  /** Primary header navigation. */
  mainNavLinks: [
    { label: 'Shop insurance', href: '#' },
    { label: 'Claims', href: '#' },
    { label: 'Customer support', href: '#' },
    { label: 'Find a local agent', href: '#' },
  ] satisfies NavLink[],
  /** Header search label. */
  searchLabel: 'Search',
  /** Account / login button label. */
  accountLabel: 'Log in',

  /** Footer. */
  footerColumns: [
    {
      heading: 'Get a quote',
      links: [
        { label: 'Get a quote online', href: '#' },
        { label: 'Find a local agent', href: '#' },
        { label: '24/7 Roadside Assistance', href: '#' },
      ],
    },
    {
      heading: 'About Liberty Mutual',
      links: [
        { label: 'About our company', href: '#' },
        { label: 'Careers at Liberty Mutual', href: '#' },
        { label: 'Corporate sustainability', href: '#' },
      ],
    },
    {
      heading: 'Quick links',
      links: [
        { label: 'Car insurance', href: '#' },
        { label: 'Homeowners insurance', href: '#' },
        { label: 'Renters insurance', href: '#' },
      ],
    },
  ] satisfies FooterColumn[],
  footerLegal: `© ${new Date().getFullYear()} Liberty Mutual Insurance, 175 Berkeley Street, Boston, MA 02116.`,
  footerDisclaimer:
    'Coverage provided and underwritten by Liberty Mutual Insurance Company or its affiliates. Coverages and features not available in all states. Eligibility is subject to underwriting guidelines.',
  footerLegalLinks: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Security Policy', href: '#' },
    { label: 'Web Accessibility Policy', href: '#' },
    { label: 'Terms and Conditions', href: '#' },
    { label: 'Site Map', href: '#' },
  ] satisfies NavLink[],
} as const;

export type SiteConfig = typeof siteConfig;
