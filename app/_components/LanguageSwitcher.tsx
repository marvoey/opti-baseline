'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Globe, ChevronDown } from 'lucide-react';
import { LOCALES, localizePath, stripLocale, findLocale } from '@/lib/locales';

/**
 * Language switcher driven by the CMS-enabled locales (lib/locales.generated.ts).
 * Derives the current locale from the URL and links to the same page in each
 * other locale, keeping the user on their current path. Renders nothing when
 * only one locale is enabled.
 *
 * Lives in the footer language bar and opens upward. Opens on click and stays open until you pick a locale, click outside, or press
 * Escape — deliberately NOT hover-based, which closed too eagerly on small mouse
 * movements / when crossing the gap to the menu.
 */
export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname() || '/';

  // While open, close on a click/tap outside the switcher or on Escape.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  if (LOCALES.length < 2) return null;

  const { localeKey, cleanPath } = stripLocale(pathname);
  const current = findLocale(localeKey) ?? LOCALES[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-sm text-gray-300 hover:text-white"
      >
        <Globe size={16} />
        <span>{current.displayName}</span>
        <ChevronDown size={16} className={open ? 'rotate-180 transition-transform' : 'transition-transform'} />
      </button>

      {open ? (
        <ul
          role="listbox"
          className="absolute bottom-full left-0 z-[60] mb-2 min-w-[12rem] rounded-xl bg-white p-3 text-sm text-gray-800 shadow-xl"
        >
          {LOCALES.map((locale) => {
            const active = locale.key === current.key;
            return (
              <li key={locale.key} role="option" aria-selected={active}>
                <Link
                  href={localizePath(cleanPath, locale.key)}
                  onClick={() => setOpen(false)}
                  className={`block py-1 hover:text-brand ${active ? 'font-bold text-brand' : ''}`}
                >
                  {locale.displayName}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
