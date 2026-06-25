'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Menu, X } from 'lucide-react';
import {
  isAllowedImageUrl,
  isItemVisible,
  isSafeUrl,
  type FeaturedNavCard,
  type NavItem,
  type NavUser,
  type NavigationConfig,
} from '@/lib/navigation';
import { NavIcon } from './nav/icons';

/**
 * MainNav — a data-driven top navigation bar (dev-notes/main-nav-spec.md).
 *
 * Presentational only: `config` comes from the parent (lib/chrome.ts → CMS, with
 * siteConfig fallback). Dropdowns open on CLICK (never hover — touch-friendly),
 * but hovering a sibling while one is already open swaps to it. Supports single /
 * cols2 / cols3 / mega layouts, a mega featured card, a mobile accordion drawer,
 * and the spec's full keyboard + ARIA contract. Every CMS url is run through
 * isSafeUrl before becoming an href; visibility rules filter items out of the DOM.
 */
interface MainNavProps {
  config: NavigationConfig;
  logo?: React.ReactNode;
  actions?: React.ReactNode;
  currentUser?: NavUser | null;
  className?: string;
}

const MENUITEM_SELECTOR = '[role="menuitem"]:not([aria-disabled="true"])';

/** Anchor that renders a safe href, an internal <Link>, or a plain <span> for unsafe/empty urls. */
function SafeLink({
  url,
  openInNewTab,
  className,
  role,
  children,
  onClick,
  tabIndex,
}: {
  url: string | null;
  openInNewTab?: boolean;
  className?: string;
  role?: string;
  children: React.ReactNode;
  onClick?: () => void;
  tabIndex?: number;
}) {
  if (!isSafeUrl(url)) {
    if (url) console.warn(`[MainNav] blocked unsafe url: ${url}`);
    return (
      <span className={className} role={role}>
        {children}
      </span>
    );
  }
  const target = openInNewTab ? '_blank' : undefined;
  const rel = openInNewTab ? 'noreferrer noopener' : undefined;
  const shared = { className, role, target, rel, onClick, tabIndex };
  // Root-relative paths get client-side routing; external links use a plain anchor.
  return url.startsWith('/') ? (
    <Link href={url} {...shared}>
      {children}
    </Link>
  ) : (
    <a href={url} {...shared}>
      {children}
    </a>
  );
}

/** A dropdown row: icon + label + optional description. */
function DropdownRow({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  return (
    <SafeLink
      url={item.url}
      openInNewTab={item.openInNewTab}
      role="menuitem"
      onClick={onNavigate}
      className="flex items-start gap-3 rounded-lg px-3 py-2.5 text-slate-700 transition-colors hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"
    >
      {item.icon ? (
        <span className="mt-0.5 text-blue-800">
          <NavIcon slug={item.icon} />
        </span>
      ) : null}
      <span className="min-w-0">
        <span className="block font-semibold leading-tight">{item.label}</span>
        {item.description ? (
          <span className="mt-0.5 block text-sm leading-snug text-slate-500">
            {item.description}
          </span>
        ) : null}
      </span>
    </SafeLink>
  );
}

/** Mega-menu promotional card. Image renders only when allowlisted and alt is set (spec §7.5, §8.2). */
function FeaturedCard({ card, onNavigate }: { card: FeaturedNavCard; onNavigate: () => void }) {
  const showImage = isAllowedImageUrl(card.imageUrl) && !!card.imageAlt?.trim();
  return (
    <SafeLink
      url={card.url}
      role="menuitem"
      onClick={onNavigate}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-50 transition-colors hover:border-blue-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={card.imageUrl as string} alt={card.imageAlt} className="h-32 w-full object-cover" />
      ) : null}
      <span className="flex flex-1 flex-col p-4">
        {card.tag ? (
          <span className="mb-2 inline-block w-fit rounded bg-blue-800 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
            {card.tag}
          </span>
        ) : null}
        <span className="block font-bold leading-tight text-slate-900">{card.heading}</span>
        {card.description ? (
          <span className="mt-1 block text-sm leading-snug text-slate-500">{card.description}</span>
        ) : null}
        <span className="mt-3 text-sm font-semibold text-blue-800 group-hover:underline">
          {card.ctaLabel} →
        </span>
      </span>
    </SafeLink>
  );
}

const COLUMN_CLASS: Record<string, string> = {
  single: 'grid-cols-1 w-72',
  cols2: 'grid-cols-2 w-[34rem]',
  cols3: 'grid-cols-3 w-[46rem]',
};

/** The dropdown panel for an open top-level item. */
function DropdownPanel({
  item,
  id,
  visibleChildren,
  onNavigate,
}: {
  item: NavItem;
  id: string;
  visibleChildren: NavItem[];
  onNavigate: () => void;
}) {
  const layout = item.columnLayout ?? 'single';

  if (layout === 'mega') {
    return (
      <div id={id} role="menu" aria-label={item.label} className="flex gap-6 p-4">
        <div className="grid flex-1 grid-cols-2 gap-1">
          {visibleChildren.map((child) => (
            <DropdownRow key={child.id} item={child} onNavigate={onNavigate} />
          ))}
        </div>
        {item.featuredItem ? (
          <div className="hidden w-64 shrink-0 md:block">
            <FeaturedCard card={item.featuredItem} onNavigate={onNavigate} />
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div
      id={id}
      role="menu"
      aria-label={item.label}
      className={`grid gap-1 p-3 ${COLUMN_CLASS[layout] ?? COLUMN_CLASS.single}`}
    >
      {visibleChildren.map((child) => (
        <DropdownRow key={child.id} item={child} onNavigate={onNavigate} />
      ))}
    </div>
  );
}

export default function MainNav({
  config,
  logo,
  actions,
  currentUser,
  className,
}: MainNavProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [flip, setFlip] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const panelWrapRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const items = config.items.filter((item) => isItemVisible(item, currentUser));
  const visibleChildrenOf = useCallback(
    (item: NavItem) => item.children.filter((c) => isItemVisible(c, currentUser)),
    [currentUser],
  );

  const close = useCallback((focusTrigger = false) => {
    setOpenId((current) => {
      if (current && focusTrigger) triggerRefs.current.get(current)?.focus();
      return null;
    });
  }, []);

  // Close on outside click and on Escape (Escape returns focus to the trigger).
  useEffect(() => {
    if (!openId) return;
    function onPointerDown(e: PointerEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) close();
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        close(true);
      }
    }
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [openId, close]);

  // Measure the open panel via a callback ref and flip it to right-align when it
  // would overflow the viewport (spec §6.3). Done in the ref (not an effect) so the
  // measurement happens at commit without a cascading-render setState-in-effect.
  const setPanelRef = useCallback((el: HTMLDivElement | null) => {
    panelWrapRef.current = el;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setFlip(rect.right > window.innerWidth - 8);
  }, []);

  // Roving focus within an open dropdown (spec §7.2).
  function onPanelKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const panel = panelWrapRef.current?.querySelector('[role="menu"]');
    if (!panel) return;
    const menuitems = Array.from(panel.querySelectorAll<HTMLElement>(MENUITEM_SELECTOR));
    if (menuitems.length === 0) return;
    const currentIndex = menuitems.indexOf(document.activeElement as HTMLElement);
    const focusAt = (i: number) => {
      e.preventDefault();
      menuitems[(i + menuitems.length) % menuitems.length]?.focus();
    };
    switch (e.key) {
      case 'ArrowDown':
        return focusAt(currentIndex + 1);
      case 'ArrowUp':
        return focusAt(currentIndex - 1);
      case 'Home':
        return focusAt(0);
      case 'End':
        return focusAt(menuitems.length - 1);
    }
  }

  function onTriggerKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, id: string) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpenId(id);
      // Focus first menuitem once the panel has rendered.
      requestAnimationFrame(() => {
        panelWrapRef.current?.querySelector<HTMLElement>(MENUITEM_SELECTOR)?.focus();
      });
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white shadow-sm">
      <nav
        ref={navRef}
        aria-label={config.label || 'Main'}
        className={`container mx-auto flex h-20 items-center justify-between gap-4 px-4 ${className ?? ''}`}
      >
        {/* Brand logo */}
        <div className="flex shrink-0 items-center">{logo}</div>

        {/* Desktop nav */}
        <ul role="list" className="hidden items-center gap-1 lg:flex">
          {items.map((item) => {
            const children = visibleChildrenOf(item);
            const hasDropdown = children.length > 0;
            const isOpen = openId === item.id;
            const panelId = `dropdown-${item.id}`;

            if (!hasDropdown) {
              return (
                <li key={item.id}>
                  <SafeLink
                    url={item.url}
                    openInNewTab={item.openInNewTab}
                    className="flex items-center rounded-lg px-3 py-2 font-semibold text-slate-700 transition-colors hover:text-blue-800"
                  >
                    {item.label}
                  </SafeLink>
                </li>
              );
            }

            return (
              <li
                key={item.id}
                className="relative"
                onMouseEnter={() => {
                  // Hover swaps only when a dropdown is already open (no hover-to-open).
                  if (openId !== null) setOpenId(item.id);
                }}
              >
                <button
                  type="button"
                  ref={(el) => {
                    if (el) triggerRefs.current.set(item.id, el);
                    else triggerRefs.current.delete(item.id);
                  }}
                  aria-haspopup="true"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  onKeyDown={(e) => onTriggerKeyDown(e, item.id)}
                  className={`flex items-center gap-1 rounded-lg px-3 py-2 font-semibold transition-colors hover:text-blue-800 ${
                    isOpen ? 'is-active text-blue-800' : 'text-slate-700'
                  }`}
                >
                  {item.label}
                  <ChevronDown
                    size={16}
                    aria-hidden="true"
                    className={`transition-transform motion-reduce:transition-none ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isOpen ? (
                  <div
                    ref={setPanelRef}
                    onKeyDown={onPanelKeyDown}
                    className={`absolute top-full mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl ${
                      flip ? 'right-0' : 'left-0'
                    }`}
                  >
                    <DropdownPanel
                      item={item}
                      id={panelId}
                      visibleChildren={children}
                      onNavigate={() => close()}
                    />
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>

        {/* Actions + mobile toggle */}
        <div className="flex items-center gap-3">
          {actions}
          <button
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-drawer"
            onClick={() => setMobileOpen((v) => !v)}
            className="p-2 text-slate-700 lg:hidden"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div
          id="mobile-nav-drawer"
          className="border-t border-slate-100 bg-white lg:hidden"
        >
          <ul role="list" className="container mx-auto flex flex-col gap-1 px-4 py-3">
            {items.map((item) => {
              const children = visibleChildrenOf(item);
              const hasDropdown = children.length > 0;
              const expanded = mobileExpanded === item.id;

              if (!hasDropdown) {
                return (
                  <li key={item.id}>
                    <SafeLink
                      url={item.url}
                      openInNewTab={item.openInNewTab}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-lg px-3 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      {item.label}
                    </SafeLink>
                  </li>
                );
              }

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={`mobile-${item.id}`}
                    onClick={() => setMobileExpanded(expanded ? null : item.id)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    {item.label}
                    <ChevronDown
                      size={18}
                      aria-hidden="true"
                      className={`transition-transform motion-reduce:transition-none ${expanded ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {expanded ? (
                    <ul id={`mobile-${item.id}`} role="list" className="mb-1 pl-3">
                      {children.map((child) => (
                        <li key={child.id}>
                          <SafeLink
                            url={child.url}
                            openInNewTab={child.openInNewTab}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-slate-600 hover:bg-slate-50"
                          >
                            <NavIcon slug={child.icon} size={16} />
                            {child.label}
                          </SafeLink>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </header>
  );
}
