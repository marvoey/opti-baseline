'use client';

import { useState } from 'react';
import RsImage from './RsImage';

export type CareerCard = {
  title: string;
  category: string | null;
  imageUrl: string | null;
  href: string;
  external: boolean;
};

export type CareerTab = { value: string; label: string };

/** Fallback artwork per category when a card has no image. */
const FALLBACK_BG: Record<string, string> = {
  'contact-missions': 'from-amber-700 to-neutral-950',
  businesses: 'from-emerald-800 to-neutral-950',
  heists: 'from-rose-800 to-neutral-950',
  recreation: 'from-sky-800 to-neutral-950',
  'series-modes': 'from-violet-800 to-neutral-950',
  'special-interests': 'from-orange-700 to-neutral-950',
};
const DEFAULT_BG = 'from-neutral-700 to-neutral-950';

/**
 * Career Progress grid with sticky category filter tabs. Client component only
 * for the active filter; cards and tabs are computed on the server.
 */
export default function CareerGridClient({
  tabs,
  cards,
  progressNote,
}: {
  tabs: CareerTab[];
  cards: CareerCard[];
  progressNote?: string | null;
}) {
  const [active, setActive] = useState('all');
  const labelOf = new Map(tabs.map((t) => [t.value, t.label]));
  const visible = active === 'all' ? cards : cards.filter((c) => c.category === active);
  const allTabs: CareerTab[] = [{ value: 'all', label: 'All' }, ...tabs];

  return (
    <div>
      <div className="sticky top-16 z-30 -mx-6 border-b border-rs-line bg-rs-black/95 px-6 backdrop-blur">
        <div
          role="group"
          aria-label="Filter by category"
          className="flex gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {allTabs.map((tab) => {
            const on = tab.value === active;
            return (
              <button
                key={tab.value}
                type="button"
                aria-pressed={on}
                onClick={() => setActive(tab.value)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  on ? 'bg-rs-yellow text-black' : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <p aria-live="polite" className="mt-6 text-sm font-semibold text-white/50">
        Showing {visible.length} of {cards.length}
      </p>

      <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((card, i) => {
          const bg = (card.category && FALLBACK_BG[card.category]) || DEFAULT_BG;
          const label = card.category ? labelOf.get(card.category) : null;
          return (
            <li key={`${card.title}-${i}`}>
              <a
                href={card.href}
                target={card.external ? '_blank' : undefined}
                rel={card.external ? 'noopener noreferrer' : undefined}
                className={`group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br ${bg} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rs-yellow`}
              >
                <RsImage
                  src={card.imageUrl}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  {label ? (
                    <p className="text-[11px] font-bold uppercase tracking-widest text-rs-yellow">{label}</p>
                  ) : null}
                  <h3 className="mt-1 text-lg font-extrabold leading-tight">{card.title}</h3>
                  {progressNote ? (
                    <div className="mt-3">
                      <div className="h-1 rounded-full bg-white/15" />
                      <p className="mt-1.5 text-[11px] font-semibold text-white/55">{progressNote}</p>
                    </div>
                  ) : null}
                </div>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
