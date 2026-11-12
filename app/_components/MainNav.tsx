'use client';

import { useState } from 'react';
import { ChevronDown, Menu, User, X } from 'lucide-react';
import ChromeLink from './ChromeLink';
import { siteConfig, type MegaMenu, type NavItem } from '@/lib/siteConfig';

const SIGN_IN = '__signin';

const hasMenu = (item: NavItem): item is Extract<NavItem, { menu: MegaMenu }> => 'menu' in item;

function MegaMenuPanel({ menu, onNavigate }: { menu: MegaMenu; onNavigate: () => void }) {
  return (
    <div className="absolute top-full right-0 left-0 z-40 border-t border-gray-100 bg-white shadow-2xl">
      <div className="site-container grid gap-8 py-8 md:grid-cols-4">
        {menu.columns.map((col, i) => (
          <div key={i} className="space-y-6">
            {col.groups.map((g) => (
              <div key={g.title}>
                <div className="mb-3 text-xs font-bold tracking-wider text-gray-500 uppercase">{g.title}</div>
                <ul className="space-y-2">
                  {g.links.map((l) => (
                    <li key={l.label}>
                      <ChromeLink href={l.href} onClick={onNavigate} className="text-[15px] text-gray-800 hover:text-brand">
                        {l.label}
                      </ChromeLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
        {menu.feature && (
          <div className="grid gap-4 md:col-span-2 lg:col-span-2">
            <ChromeLink
              href={menu.feature.href}
              onClick={onNavigate}
              className="flex min-h-[140px] items-end rounded-2xl bg-gradient-to-br from-brand to-emerald-800 p-6 text-white hover:opacity-95"
            >
              <span className="text-xl font-bold">{menu.feature.title} →</span>
            </ChromeLink>
            <ul className="space-y-2">
              {menu.feature.links.map((l) => (
                <li key={l.label}>
                  <ChromeLink href={l.href} onClick={onNavigate} className="font-medium text-gray-800 hover:text-brand">
                    {l.label}
                  </ChromeLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Sticky site header: logo, primary nav with hover/click mega menus, sign-in
 * dropdown and primary CTA on desktop; a collapsible accordion menu on mobile.
 * Content comes from lib/siteConfig.
 */
const MainNav = () => {
  // Label of the open mega menu, SIGN_IN for the account dropdown, or null.
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [mobileSub, setMobileSub] = useState<string | null>(null);
  const close = () => {
    setOpen(null);
    setMobile(false);
  };

  const openItem = siteConfig.mainNav.find((i): i is Extract<NavItem, { menu: MegaMenu }> => hasMenu(i) && i.label === open);

  return (
    <header
      className="sticky top-0 z-50 border-b border-gray-200 bg-white"
      data-cms-group="Navigation"
      onMouseLeave={() => setOpen(null)}
    >
      <div className="site-container flex h-16 items-center gap-6">
        <button
          type="button"
          className="lg:hidden"
          onClick={() => setMobile(!mobile)}
          aria-label="Toggle navigation"
          aria-expanded={mobile}
        >
          {mobile ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="navbar-brand flex items-center" data-cms-field="brand_logo">
          <ChromeLink href="/" title="Go to home page" onClick={close} className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={siteConfig.logoSrc} alt={siteConfig.logoAlt} className="h-7 w-auto" />
          </ChromeLink>
        </div>

        <nav className="hidden flex-1 items-center gap-1 lg:flex">
          {siteConfig.mainNav.map((item) =>
            hasMenu(item) ? (
              <button
                key={item.label}
                type="button"
                aria-expanded={open === item.label}
                onMouseEnter={() => setOpen(item.label)}
                onClick={() => setOpen(open === item.label ? null : item.label)}
                className={`flex items-center gap-1 px-3 py-5 text-[15px] font-medium hover:text-brand ${
                  open === item.label ? 'text-brand' : 'text-gray-800'
                }`}
              >
                {item.label}
                <ChevronDown size={16} className={`transition ${open === item.label ? 'rotate-180' : ''}`} />
              </button>
            ) : (
              <ChromeLink
                key={item.label}
                href={item.href}
                onClick={close}
                onMouseEnter={() => setOpen(null)}
                className="px-3 py-5 text-[15px] font-medium text-gray-800 hover:text-brand"
              >
                {item.label}
              </ChromeLink>
            ),
          )}
        </nav>

        <div className="ml-auto hidden items-center gap-4 lg:flex">
          <div className="relative" onMouseEnter={() => setOpen(SIGN_IN)}>
            <button
              type="button"
              aria-expanded={open === SIGN_IN}
              className="flex items-center gap-2 py-5 text-[15px] font-medium text-gray-800 hover:text-brand"
            >
              <User size={20} /> {siteConfig.signInLabel} <ChevronDown size={16} />
            </button>
            {open === SIGN_IN && (
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

      {openItem && <MegaMenuPanel menu={openItem.menu} onNavigate={close} />}

      {mobile && (
        <div className="max-h-[80vh] overflow-y-auto border-t border-gray-200 bg-white lg:hidden">
          {siteConfig.mainNav.map((item) =>
            hasMenu(item) ? (
              <div key={item.label} className="border-b border-gray-100">
                <button
                  type="button"
                  aria-expanded={mobileSub === item.label}
                  onClick={() => setMobileSub(mobileSub === item.label ? null : item.label)}
                  className="flex w-full items-center justify-between px-5 py-4 font-medium"
                >
                  {item.label}
                  <ChevronDown size={16} className={mobileSub === item.label ? 'rotate-180' : ''} />
                </button>
                {mobileSub === item.label && (
                  <div className="space-y-4 px-5 pb-4">
                    {item.menu.columns
                      .flatMap((c) => c.groups)
                      .map((g) => (
                        <div key={g.title}>
                          <div className="mb-1 text-xs font-bold text-gray-500 uppercase">{g.title}</div>
                          {g.links.map((l) => (
                            <ChromeLink key={l.label} href={l.href} onClick={close} className="block py-1 text-gray-700">
                              {l.label}
                            </ChromeLink>
                          ))}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ) : (
              <ChromeLink
                key={item.label}
                href={item.href}
                onClick={close}
                className="block border-b border-gray-100 px-5 py-4 font-medium"
              >
                {item.label}
              </ChromeLink>
            ),
          )}
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
