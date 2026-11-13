'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, User, X } from 'lucide-react';
import ChromeLink from './ChromeLink';
import { siteConfig, type NavLink } from '@/lib/siteConfig';
import { stripLocale } from '@/lib/locales';

/** Locale-less path with a trailing slash, so "/product", "/product/" and "/fr/product/" compare equal. */
const normalise = (path: string) => stripLocale(path.split(/[?#]/)[0] || '/').cleanPath.replace(/\/?$/, '/');

/**
 * Sticky site header: logo, the primary nav, a sign-in dropdown and the primary CTA on
 * desktop; a collapsible list on mobile. The nav `links` are the published child pages of
 * the Corel home page, loaded from the CMS by SiteChrome (lib/cms/navigation.ts). Everything
 * else (logo, sign-in, CTA) comes from lib/siteConfig.
 */
const MainNav = ({ links }: { links: NavLink[] }) => {
  const [signInOpen, setSignInOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const pathname = usePathname() ?? '/';
  const current = normalise(pathname);
  const isCurrent = (href: string) => normalise(href) === current;
  const close = () => {
    setSignInOpen(false);
    setMobile(false);
  };

  return (
    <header
      className="sticky top-0 z-50 border-b border-gray-200 bg-white"
      data-cms-group="Navigation"
      onMouseLeave={() => setSignInOpen(false)}
    >
      <div className="site-container flex h-16 items-center gap-6">
        {links.length > 0 && (
          <button
            type="button"
            className="lg:hidden"
            onClick={() => setMobile(!mobile)}
            aria-label="Toggle navigation"
            aria-expanded={mobile}
          >
            {mobile ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}

        <div className="navbar-brand flex items-center" data-cms-field="brand_logo">
          <ChromeLink href="/" title="Go to home page" onClick={close} className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={siteConfig.logoSrc} alt={siteConfig.logoAlt} className="h-7 w-auto" />
          </ChromeLink>
        </div>

        <nav aria-label="Main" className="hidden flex-1 items-center gap-1 lg:flex">
          {links.map((link) => (
            <ChromeLink
              key={link.href}
              href={link.href}
              onClick={close}
              aria-current={isCurrent(link.href) ? 'page' : undefined}
              className={`px-3 py-5 text-[15px] font-medium hover:text-brand ${isCurrent(link.href) ? 'text-brand' : 'text-gray-800'}`}
            >
              {link.label}
            </ChromeLink>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-4 lg:flex">
          <div className="relative" onMouseEnter={() => setSignInOpen(true)}>
            <button
              type="button"
              aria-expanded={signInOpen}
              onClick={() => setSignInOpen(!signInOpen)}
              className="flex items-center gap-2 py-5 text-[15px] font-medium text-gray-800 hover:text-brand"
            >
              <User size={20} /> {siteConfig.signInLabel} <ChevronDown size={16} />
            </button>
            {signInOpen && (
              <div className="absolute top-full right-0 w-56 rounded-xl border border-gray-100 bg-white p-4 shadow-xl">
                <div className="mb-2 text-xs font-bold tracking-wider text-gray-500 uppercase">Sign in options</div>
                {siteConfig.signInLinks.map((l) => (
                  <ChromeLink key={l.label} href={l.href} className="block py-1.5 text-gray-800 hover:text-brand">
                    {l.label}
                  </ChromeLink>
                ))}
              </div>
            )}
          </div>
          <ChromeLink href={siteConfig.primaryCta.href} className="btn-brand px-4 py-2 text-sm">
            {siteConfig.primaryCta.label}
          </ChromeLink>
        </div>
      </div>

      {mobile && (
        <div className="max-h-[80vh] overflow-y-auto border-t border-gray-200 bg-white lg:hidden">
          <nav aria-label="Main">
            {links.map((link) => (
              <ChromeLink
                key={link.href}
                href={link.href}
                onClick={close}
                aria-current={isCurrent(link.href) ? 'page' : undefined}
                className={`block border-b border-gray-100 px-5 py-4 font-medium ${isCurrent(link.href) ? 'text-brand' : ''}`}
              >
                {link.label}
              </ChromeLink>
            ))}
          </nav>
          <div className="flex flex-col gap-3 p-5">
            <ChromeLink
              href={siteConfig.signInLinks[0].href}
              className="inline-flex items-center justify-center rounded-full border border-gray-900 px-6 py-3 font-semibold text-gray-900 transition hover:bg-gray-900 hover:text-white"
            >
              {siteConfig.signInLabel}
            </ChromeLink>
            <ChromeLink href={siteConfig.primaryCta.href} className="btn-brand px-6 py-3">
              {siteConfig.primaryCta.label}
            </ChromeLink>
          </div>
        </div>
      )}
    </header>
  );
};

export default MainNav;
