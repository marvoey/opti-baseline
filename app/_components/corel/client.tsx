'use client';

import { useRef, useState } from 'react';
import ChromeLink from '../ChromeLink';
import CorelImg from './CorelImg';
import { Button, Icon, toIconName } from './ui';

/**
 * Interactive pieces of the Corel blocks. Everything here receives plain,
 * serialisable data (or pre-rendered nodes) from the server-rendered block
 * components in cms/corel/.
 */

type Href = { href: string; label: string };

/* ---------- Disclosure ("What else is included +") ---------- */
export function Disclosure({
  label,
  children,
  className = '',
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`mt-8 text-center ${className}`}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 font-semibold text-brand"
      >
        {label} <Icon name={open ? 'minus' : 'plus'} className="h-4 w-4" />
      </button>
      {open && children}
    </div>
  );
}

/* ---------- Horizontal scroller with prev/next ---------- */
export function Scroller({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (d: number) =>
    ref.current?.scrollBy({ left: d * ref.current.clientWidth * 0.8, behavior: 'smooth' });
  return (
    <div className="relative">
      <div ref={ref} className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none]">
        {children}
      </div>
      <div className="mt-2 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => scroll(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-900 hover:text-white"
          aria-label="Previous"
        >
          <Icon name="left" />
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-900 hover:text-white"
          aria-label="Next"
        >
          <Icon name="right" />
        </button>
      </div>
    </div>
  );
}

/* ---------- Featured-customer slider ---------- */
export type Story = { quote: string; name: string; role: string; src?: string };

export function TestimonialSlider({ title, stories, cta }: { title: string; stories: Story[]; cta: Href | null }) {
  const [i, setI] = useState(0);
  const n = stories.length;
  if (n === 0) return null;
  const it = stories[i % n];
  return (
    <>
      <div className="mb-10 flex items-end justify-between">
        <h2 className="text-3xl font-bold md:text-4xl">{title}</h2>
        {n > 1 && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setI((i - 1 + n) % n)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-900 hover:text-white"
              aria-label="Previous"
            >
              <Icon name="left" />
            </button>
            <button
              type="button"
              onClick={() => setI((i + 1) % n)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-900 hover:text-white"
              aria-label="Next"
            >
              <Icon name="right" />
            </button>
          </div>
        )}
      </div>
      <div className="grid min-h-[300px] items-center gap-10 rounded-3xl bg-white p-8 shadow-sm md:grid-cols-5 md:p-12">
        <CorelImg src={it.src} alt={it.name} seed={i} className="h-64 w-full rounded-2xl object-cover md:col-span-2" />
        <div className="md:col-span-3">
          <p className="text-2xl leading-relaxed text-gray-800">“{it.quote}”</p>
          <p className="mt-6 text-lg font-bold">{it.name}</p>
          <p className="text-gray-500">{it.role}</p>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <ul className="flex gap-2">
          {stories.map((_, k) => (
            <li key={k}>
              <button
                type="button"
                onClick={() => setI(k)}
                className={`h-2.5 rounded-full transition-all ${k === i % n ? 'w-8 bg-brand' : 'w-2.5 bg-gray-300'}`}
                aria-label={`Slide ${k + 1}`}
              />
            </li>
          ))}
        </ul>
        {cta && (
          <ChromeLink href={cta.href} className="font-semibold text-brand hover:underline">
            {cta.label} →
          </ChromeLink>
        )}
      </div>
    </>
  );
}

/* ---------- FAQ accordion ---------- */
export function Accordion({ items }: { items: { question: string; answer: React.ReactNode }[] }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="divide-y divide-gray-200 border-y border-gray-200">
      {items.map((it, k) => (
        <div key={k}>
          <button
            type="button"
            onClick={() => setOpen(open === k ? -1 : k)}
            className="flex w-full items-center justify-between py-5 text-left"
            aria-expanded={open === k}
          >
            <h3 className="pr-6 text-lg font-semibold">{it.question}</h3>
            <Icon name={open === k ? 'minus' : 'plus'} className="h-5 w-5 shrink-0 text-brand" />
          </button>
          {open === k && <div className="prose max-w-none pb-6 text-gray-600">{it.answer}</div>}
        </div>
      ))}
    </div>
  );
}

/* ---------- Purchase options (tabbed pricing card) ---------- */
export type Plan = {
  label: string;
  tag: string;
  headline: string;
  blurb: string;
  save: string;
  price: string;
  unit: string;
  was: string;
  cta: Href | null;
  promoTitle: string;
  promoText: string;
  showSubscriptionLinks: boolean;
};

export type PurchaseLinks = {
  heading: string;
  vatNote: string;
  upgrade: Href | null;
  features: Href | null;
  renew: Href | null;
  business: Href | null;
};

export function PurchasePanel({ plans, links }: { plans: Plan[]; links: PurchaseLinks }) {
  const [idx, setIdx] = useState(0);
  if (plans.length === 0) return null;
  const p = plans[idx % plans.length];
  const linkCls = 'text-brand hover:underline';
  return (
    <div className="rounded-3xl bg-white p-6 text-gray-900 shadow-2xl md:p-8">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-bold">{links.heading}</p>
        {links.upgrade && (
          <ChromeLink href={links.upgrade.href} className={`text-sm ${linkCls}`}>
            {links.upgrade.label}
          </ChromeLink>
        )}
      </div>
      <ul className="mb-6 grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(plans.length, 3)}, minmax(0, 1fr))` }} role="tablist">
        {plans.map((v, k) => (
          <li key={k}>
            <button
              type="button"
              role="tab"
              aria-selected={idx === k}
              onClick={() => setIdx(k)}
              className={`h-full w-full rounded-xl border-2 p-3 text-left transition ${
                idx === k ? 'border-brand bg-emerald-50' : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <span className="text-[10px] font-bold text-brand uppercase">{v.tag}</span>
              <h4 className="text-sm font-bold">{v.label}</h4>
              <p className="text-sm text-gray-600">{v.headline}</p>
            </button>
          </li>
        ))}
      </ul>
      <p className="mb-4 text-gray-600">{p.blurb}</p>
      <div className="mb-1 flex items-end gap-3">
        {p.save && <span className="rounded bg-rose-600 px-2 py-1 text-xs font-bold text-white">{p.save}</span>}
        <span className="text-4xl font-extrabold">{p.price}</span>
        {p.unit && <span className="mb-1 text-gray-500">{p.unit}</span>}
        {p.was && <span className="mb-1 text-gray-400 line-through">{p.was}</span>}
      </div>
      {links.vatNote && <p className="mb-5 text-xs text-gray-400">{links.vatNote}</p>}
      {p.cta && (
        <Button href={p.cta.href} className="w-full" size="lg">
          {p.cta.label}
        </Button>
      )}
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm">
        {p.showSubscriptionLinks && links.features && (
          <ChromeLink href={links.features.href} className={linkCls}>
            {links.features.label}
          </ChromeLink>
        )}
        {p.showSubscriptionLinks && links.renew && (
          <ChromeLink href={links.renew.href} className={linkCls}>
            {links.renew.label}
          </ChromeLink>
        )}
        {links.business && (
          <ChromeLink href={links.business.href} className={linkCls}>
            {links.business.label}
          </ChromeLink>
        )}
      </div>
      {(p.promoTitle || p.promoText) && (
        <div className="mt-6 rounded-xl bg-black p-4 text-white">
          <span className="rounded bg-rose-600 px-2 py-0.5 text-[10px] font-bold uppercase">Ends soon!</span>
          <h4 className="mt-2 font-bold">{p.promoTitle}</h4>
          <p className="text-sm text-gray-300">{p.promoText}</p>
        </div>
      )}
    </div>
  );
}

/* ---------- Trial sign-up form (UI only — nothing is submitted anywhere) ---------- */
export function TrialForm({
  intro,
  consent,
  submitLabel,
  successTitle,
  successBody,
}: {
  intro: string;
  consent: string;
  submitLabel: string;
  successTitle: string;
  successBody: string;
}) {
  const [email, setEmail] = useState('');
  const [agree, setAgree] = useState(false);
  const [sent, setSent] = useState(false);
  if (sent) {
    return (
      <div className="py-8 text-center">
        <h4 className="text-2xl font-bold">{successTitle}</h4>
        <p className="mt-3 text-gray-600">{successBody}</p>
      </div>
    );
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (email) setSent(true);
      }}
      className="space-y-5"
    >
      <p className="font-semibold">{intro}</p>
      <label className="block">
        <span className="text-sm font-medium">
          Email Address <span className="text-rose-600">*</span>
        </span>
        <input
          type="email"
          required
          autoComplete="email"
          maxLength={254}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-brand focus:outline-none"
          placeholder="you@example.com"
        />
      </label>
      {consent && (
        <label className="flex gap-3 text-xs text-gray-500">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1" />
          <span>{consent}</span>
        </label>
      )}
      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3 font-semibold text-white hover:bg-brand-dark"
      >
        <Icon name="download" className="h-5 w-5" /> {submitLabel}
      </button>
    </form>
  );
}

/* ---------- Support search box ---------- */
export function SearchForm({ placeholder, searchUrl }: { placeholder: string; searchUrl: string }) {
  const [q, setQ] = useState('');
  // Only https search endpoints are honoured; anything else disables submission.
  const base = /^https:\/\//i.test(searchUrl) ? searchUrl : '';
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (q.trim() && base) window.open(`${base}${encodeURIComponent(q.trim())}`, '_blank', 'noopener,noreferrer');
      }}
      className="mt-8 flex rounded-full bg-white p-1.5 shadow-xl"
    >
      <span className="flex items-center pl-4 text-gray-400">
        <Icon name="search" />
      </span>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        maxLength={200}
        aria-label={placeholder}
        placeholder={placeholder}
        className="flex-1 rounded-full px-3 py-3 text-gray-900 focus:outline-none"
      />
      <button type="submit" className="rounded-full bg-brand px-6 font-semibold text-white">
        Search
      </button>
    </form>
  );
}

/* ---------- Contact options + phone directory ---------- */
export type ContactCard = {
  icon: string;
  title: string;
  description: string;
  links: Href[];
  phone: string;
  showDirectory: boolean;
};
export type PhoneRegion = { region: string; entries: { country: string; number: string }[] };

/** Digits (and a leading +) only — safe for a tel: href. */
const telHref = (n: string) => `tel:${n.replace(/[^\d+]/g, '')}`;

export function ContactPanel({
  cards,
  regions,
  directoryLabel,
}: {
  cards: ContactCard[];
  regions: PhoneRegion[];
  directoryLabel: string;
}) {
  const [phones, setPhones] = useState(false);
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <div key={i} className="rounded-2xl bg-white p-6">
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-brand">
              <Icon name={toIconName(c.icon)} />
            </span>
            <h4 className="font-bold">{c.title}</h4>
            {c.phone ? (
              <a href={telHref(c.phone)} className="mt-1 block text-lg font-semibold">
                {c.phone}
              </a>
            ) : (
              c.description && <p className="mt-1 text-sm text-gray-600">{c.description}</p>
            )}
            <div className="mt-3 flex flex-col gap-1 text-sm">
              {c.links.map((l) => (
                <ChromeLink key={l.href + l.label} href={l.href} className="font-semibold text-brand hover:underline">
                  {l.label}
                </ChromeLink>
              ))}
              {c.showDirectory && regions.length > 0 && (
                <button
                  type="button"
                  aria-expanded={phones}
                  onClick={() => setPhones(!phones)}
                  className="text-left font-semibold text-brand"
                >
                  {directoryLabel} {phones ? '▴' : '▾'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {phones && (
        <div className="mt-6 grid gap-5 rounded-2xl bg-white p-6 md:grid-cols-3">
          {regions.map((r) => (
            <div key={r.region}>
              <h5 className="mb-2 font-bold">{r.region}</h5>
              <ul className="space-y-1 text-sm">
                {r.entries.map((e, k) => (
                  <li key={k} className="flex justify-between gap-4">
                    <span className="text-gray-600">{e.country}</span>
                    <span className="font-medium">{e.number}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
