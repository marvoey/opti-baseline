/**
 * Site config — the single place to rebrand the non-colour chrome for a new
 * demo. Colours live in app/globals.css (the `@theme` token block); everything
 * else — site name, logo, nav links, footer columns, legal copy — lives here.
 *
 * To stand up a new demo: edit this file, drop a new public/logo.svg, and tweak
 * the hex values in app/globals.css. No component edits required.
 */

type NavLink = { label: string; href: string };
type FooterColumn = { heading: string; links: NavLink[] };

export const siteConfig = {
  name: 'Progressive',
  title: 'Car Insurance | Progressive',
  description: 'Get a free car insurance quote and join over 37 million drivers who trust Progressive.',

  logoSrc: '/logo.svg',
  logoAlt: 'Progressive Insurance',

  topNavLinks: [
    { label: 'Claims', href: '#' },
    { label: 'Resources & tools', href: '#' },
    { label: 'About us', href: '#' },
  ] satisfies NavLink[],
  phone: '1-855-347-3749',

  mainNavLinks: [
    { label: 'Insurance & more', href: '#' },
    { label: 'Claims', href: '#' },
    { label: 'Resources & tools', href: '#' },
    { label: 'About us', href: '#' },
  ] satisfies NavLink[],
  primaryCta: { label: 'Get a quote', href: '/demo' } satisfies NavLink,
  accountLabel: 'Log In',

  footerTagline: 'Protecting what matters most to you since 1937. The nation\'s largest car insurance provider.',
  footerColumns: [
    {
      heading: 'Products',
      links: [
        { label: 'Car insurance', href: '#' },
        { label: 'Home insurance', href: '#' },
        { label: 'Renters insurance', href: '#' },
        { label: 'Motorcycle insurance', href: '#' },
        { label: 'Boat insurance', href: '#' },
      ],
    },
    {
      heading: 'Claims',
      links: [
        { label: 'File a claim', href: '#' },
        { label: 'Track a claim', href: '#' },
        { label: 'Roadside assistance', href: '#' },
        { label: 'Glass repair', href: '#' },
      ],
    },
    {
      heading: 'Company',
      links: [
        { label: 'About Progressive', href: '#' },
        { label: 'Investor relations', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Newsroom', href: '#' },
      ],
    },
  ] satisfies FooterColumn[],
  footerLegal: `© ${'2026'} Progressive Casualty Insurance Company. All rights reserved.`,
  footerLegalLinks: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Use', href: '#' },
    { label: 'Accessibility', href: '#' },
  ] satisfies NavLink[],
} as const;
