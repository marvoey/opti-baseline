'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

type NavLink = { label: string; href: string };

/**
 * Hamburger button + dropdown panel that stands in for the inline nav below the
 * `lg` (1024px) breakpoint. It is the only interactive part of the header, so it
 * is the only part shipped as a Client Component; MainNav stays a Server Component.
 *
 * Render it inside `.lmig-FloatingHeader-inner` — the panel positions itself
 * against that bar (it is `position: relative`).
 *
 * Closes on: link click, Escape (focus returns to the button), a tap outside, and
 * the viewport growing to the desktop layout (so it can't reappear stale later).
 */
export default function MobileMenu({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    const desktop = window.matchMedia('(min-width: 1024px)');
    function onBreakpoint(e: MediaQueryListEvent) {
      if (e.matches) setOpen(false);
    }
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    desktop.addEventListener('change', onBreakpoint);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      desktop.removeEventListener('change', onBreakpoint);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className="order-3 flex items-center lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-11 items-center justify-center rounded-full text-navy hover:bg-navy/5"
      >
        {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
      </button>

      <nav
        id={panelId}
        hidden={!open}
        aria-label="Mobile navigation"
        className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-50 flex flex-col rounded-2xl bg-white p-2 shadow-xl"
      >
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            onClick={() => setOpen(false)}
            className="flex min-h-12 items-center rounded-xl px-4 text-base font-medium text-navy hover:bg-[#F5F5F5]"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
