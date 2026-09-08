import type { NavLink } from './siteConfig';

export type BrandThemeId = 'peacock' | 'nowtv';

/**
 * Chrome data for the Peacock/NOW header + footer (app/_components/BrandHeader.tsx
 * / BrandFooter.tsx), ported faithfully from the two app/mock reference pages'
 * <header>/<footer> markup. Optimizely's chrome doesn't go through this — it
 * keeps its own original TopNav/MainNav/Footer, driven by lib/siteConfig.ts.
 */
export type BrandThemeConfig = {
  id: BrandThemeId;
  logoComponent: 'PeacockMark' | 'NowMark';
  /** NOW shows a "Help Centre" label next to its logo; Peacock doesn't. */
  headerLabel?: string;
  navLinks: NavLink[];
  ctaLabel: string;
  ctaHref: string;
  /** Peacock's CTA text is black on its yellow/orange gradient; NOW's is white. */
  ctaTextClass: string;
  footerBrandHeading: string;
  footerBrandLinks: NavLink[];
  footerHelpLinks: NavLink[];
  footerLegalLinks: NavLink[];
  socialLabels: string[];
  footerCopyright: string;
  footerDisclaimer: string;
};

export const brandThemes: Record<BrandThemeId, BrandThemeConfig> = {
  peacock: {
    id: 'peacock',
    logoComponent: 'PeacockMark',
    navLinks: [
      { label: 'Help', href: '#' },
      { label: 'Plans', href: '#' },
      { label: 'Shows & Movies', href: '#' },
    ],
    ctaLabel: 'Get Started',
    ctaHref: '#',
    ctaTextClass: 'text-black',
    footerBrandHeading: 'Peacock',
    footerBrandLinks: [
      { label: 'About', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' },
    ],
    footerHelpLinks: [
      { label: 'Help Center', href: '#' },
      { label: 'Kids Help', href: '#' },
      { label: 'Accessibility', href: '#' },
    ],
    footerLegalLinks: [
      { label: 'Terms of Service', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'CA Notice', href: '#' },
      { label: 'Ad Choices', href: '#' },
    ],
    socialLabels: ['f', 'ig', 'yt', 'x', 'tt'],
    footerCopyright: '© 2026 Peacock TV LLC. All Rights Reserved.',
    footerDisclaimer: 'Not affiliated with or endorsed by Peacock TV or NBCUniversal.',
  },

  nowtv: {
    id: 'nowtv',
    logoComponent: 'NowMark',
    headerLabel: 'Help Centre',
    navLinks: [
      { label: 'TV', href: '#' },
      { label: 'Sport', href: '#' },
      { label: 'Cinema', href: '#' },
      { label: 'Help', href: '#' },
    ],
    ctaLabel: 'Get Started',
    ctaHref: '#',
    ctaTextClass: 'text-white',
    footerBrandHeading: 'NOW',
    footerBrandLinks: [
      { label: 'About Us', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' },
    ],
    footerHelpLinks: [
      { label: 'Help Centre', href: '#' },
      { label: 'Contact Us', href: '#' },
      { label: 'Accessibility Support', href: '#' },
      { label: 'Complaints Code of Practice', href: '#' },
    ],
    footerLegalLinks: [
      { label: 'Terms & Conditions', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Cookies', href: '#' },
    ],
    socialLabels: ['f', 'ig', 'yt', 'x'],
    footerCopyright: '© 2026 NOW. All Rights Reserved.',
    footerDisclaimer: 'Not affiliated with or endorsed by NOW, Sky UK, or Comcast.',
  },
};
