'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Globe, ChevronDown, Search } from 'lucide-react';
import { LOCALES, localizePath, stripLocale, findLocale } from '@/lib/locales';

/**
 * Language switcher driven by the CMS-enabled locales (lib/locales.generated.ts).
 * Derives the current locale from the URL and links to the same page in each
 * other locale, keeping the user on their current path. Renders nothing when
 * only one locale is enabled.
 *
 * Opens on click and stays open until you pick a locale, click outside, or press
 * Escape — deliberately NOT hover-based, which closed too eagerly on small mouse
 * movements / when crossing the gap to the menu.
 */
/** Show the search box once there are more locales than this. */
const SEARCH_THRESHOLD = 8;

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname() || '/';
  const router = useRouter();

  const close = () => {
    setOpen(false);
    setQuery('');
  };

  // While open, close on a click/tap outside the switcher or on Escape.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
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

  const searchable = LOCALES.length > SEARCH_THRESHOLD;
  const q = query.trim().toLowerCase();
  const visible = q
    ? LOCALES.filter((l) => l.displayName.toLowerCase().includes(q) || l.key.toLowerCase().includes(q))
    : LOCALES;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => (open ? close() : setOpen(true))}
        className="flex items-center gap-1 text-blue-950 hover:underline"
      >
        <Globe size={14} />
        <span>{current.displayName}</span>
        <ChevronDown size={14} className={open ? 'rotate-180 transition-transform' : 'transition-transform'} />
      </button>

      {open ? (
        <div className="absolute right-0 z-[60] mt-1 w-64 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
          {searchable ? (
            <div className="relative border-b border-slate-200 p-2">
              <Search size={14} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                autoFocus
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && visible[0]) {
                    router.push(localizePath(cleanPath, visible[0].key));
                    close();
                  }
                }}
                placeholder="Search languages…"
                aria-label="Search languages"
                className="w-full rounded border border-slate-200 py-1.5 pl-7 pr-2 text-sm text-slate-700 outline-none focus:border-blue-800"
              />
            </div>
          ) : null}
          <ul role="listbox" className="max-h-72 overflow-y-auto py-1">
            {visible.map((locale) => {
              const active = locale.key === current.key;
              return (
                <li key={locale.key} role="option" aria-selected={active}>
                  <Link
                    href={localizePath(cleanPath, locale.key)}
                    onClick={close}
                    className={`block px-4 py-2 text-sm transition-colors hover:bg-slate-50 ${
                      active ? 'font-bold text-blue-800' : 'text-slate-600'
                    }`}
                  >
                    {locale.displayName}
                    {searchable ? <span className="ml-2 text-xs text-slate-400">{locale.key}</span> : null}
                  </Link>
                </li>
              );
            })}
            {visible.length === 0 ? <li className="px-4 py-2 text-sm text-slate-400">No matches</li> : null}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
