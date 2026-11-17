import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { CtaButton } from '@/cms/hrb/ui';
import { DEFAULT_LOCALE, findLocale } from '@/lib/locales';
import { siteConfig } from '@/lib/siteConfig';
import { trackPageView } from '@/lib/odpTracking';
import NewsletterForm from './NewsletterForm';

type Props = { params: Promise<{ locale: string }> };

const TITLE = `Newsletter | ${siteConfig.name}`;

export const metadata: Metadata = {
  title: TITLE,
  description:
    'The Tax Letter: plain-English tax deadlines, credits and life-change checklists, in one short email.',
};

const INSIDE = [
  {
    label: 'Filing, simplified',
    title: 'Know what to do, and when',
    body: 'Plain-English checklists for your filing status, the documents you will need, and what happens if you file late or take an extension.',
    bullets: ['Deadline reminders', 'Document checklists', 'Extension basics'],
  },
  {
    label: 'Keep more of your refund',
    title: 'Credits and deductions, explained',
    body: 'A rotating spotlight on the credits and deductions people commonly miss, who qualifies, and which receipts are worth keeping.',
    bullets: ['Credits explained', 'Deduction finders', 'Receipt-keeping tips'],
  },
  {
    label: 'Life changes, handled',
    title: 'What the big moments do to your taxes',
    body: 'Marriage, a new baby, a new job, a move or a side business: what each one changes and the first thing to do about it.',
    bullets: ['New job or side business', 'Marriage and family', 'Moving and home'],
  },
];

const SAMPLE = [
  { tag: 'Deadline', text: 'Still time to file: what to do before April 15' },
  { tag: 'Credit', text: 'Three credits first-time filers often overlook' },
  { tag: 'How-to', text: 'File on your own or with a pro? How to choose' },
  { tag: 'Life event', text: 'Started a side business? Your first-year tax checklist' },
];

const FAQ = [
  ['Is the Tax Letter free?', 'Yes. It is free to join, and there is nothing to buy.'],
  [
    'How often will I hear from you?',
    'Weekly through tax season, and a lighter monthly note the rest of the year.',
  ],
  ['Can I unsubscribe?', 'Any time, with one click from the footer of any issue.'],
  [
    'What do you do with my email?',
    'We use it to send the Tax Letter and to make what we send more relevant to you, which includes connecting your activity on this site to your email. We never ask for your Social Security number by email.',
  ],
];

export default async function NewsletterPage({ params }: Props) {
  const { locale } = await params;
  // Only CMS locales are valid first segments (same rule as the catch-all route).
  if (!findLocale(locale)) notFound();

  const pagePath = locale === DEFAULT_LOCALE ? '/newsletter' : `/${locale}/newsletter`;
  trackPageView(await headers(), pagePath, TITLE);

  return (
    <>
      {/* Hero + signup */}
      <section data-dark className="group w-full bg-blue-950 px-6 py-10 text-white md:py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-blue-400">
              The H&amp;R Block Tax Letter
            </div>
            <h1 className="max-w-3xl text-3xl font-semibold leading-tight md:text-5xl">
              Tax tips worth opening.
            </h1>
            <p className="mt-4 max-w-2xl text-base opacity-85 md:text-lg">
              One short email with the deadlines, credits and life-change checklists that matter right now,
              written in plain English by people who do taxes for a living.
            </p>
            <ul className="mt-6 space-y-3 text-base">
              {[
                'Deadlines before they sneak up on you',
                'Credits and deductions people commonly miss',
                'Free to join. Unsubscribe in one click.',
              ].map((b) => (
                <li key={b} className="flex gap-3">
                  <span aria-hidden className="text-blue-400">✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div id="subscribe" className="relative scroll-mt-8 rounded-2xl border border-hrb-border bg-white p-6 text-hrb-ink shadow-lg md:p-8">
            <NewsletterForm pagePath={pagePath} />
          </div>
        </div>
      </section>

      {/* What's inside */}
      <section className="w-full bg-hrb-warm-white px-6 py-10 text-hrb-ink md:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-semibold">What&rsquo;s in every issue</h2>
          <p className="mt-3 max-w-2xl opacity-80">
            Built to be read in about two minutes, with one thing to do at the end.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {INSIDE.map((c) => (
              <article key={c.label} className="flex h-full flex-col rounded-2xl border border-hrb-border bg-white p-6">
                <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-800">{c.label}</div>
                <h3 className="mt-2 text-xl font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm opacity-80">{c.body}</p>
                <ul className="mt-4 space-y-2 text-sm">
                  {c.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span aria-hidden className="text-blue-800">✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* A look inside */}
      <section className="w-full bg-hrb-sand px-6 py-10 text-hrb-ink md:py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-blue-800">A look inside</div>
            <h2 className="text-3xl font-semibold">Short, practical and easy to act on</h2>
            <p className="mt-3 opacity-80">
              Every issue leads with the thing that matters this week, then gives you two or three ways to keep
              more of what you earn. No jargon, no long reads.
            </p>
            <div className="mt-6">
              <CtaButton label="Join the Tax Letter" url={{ default: '#subscribe' }} dark={false} />
            </div>
          </div>
          <div className="rounded-2xl border border-hrb-border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.12em] text-blue-800">
              <span>Late-season edition</span>
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5">Sample issue</span>
            </div>
            <ul className="mt-4 divide-y divide-hrb-border">
              {SAMPLE.map((s) => (
                <li key={s.text} className="flex items-start gap-3 py-3">
                  <span className="mt-0.5 w-20 shrink-0 text-[11px] font-semibold uppercase tracking-wider opacity-60">
                    {s.tag}
                  </span>
                  <span className="font-semibold">{s.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full bg-hrb-warm-white px-6 py-10 text-hrb-ink md:py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-semibold">Questions, answered</h2>
          <div className="mt-6 divide-y divide-hrb-border rounded-2xl border border-hrb-border bg-white">
            {FAQ.map(([q, a]) => (
              <details key={q} className="group/faq px-6 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  {q}
                  <span aria-hidden className="text-blue-800 transition-transform group-open/faq:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm opacity-80">{a}</p>
              </details>
            ))}
          </div>
          <p className="mt-6 text-xs opacity-60">
            Demo page: in this demonstration, subscribing sends your email address to an Optimizely Data Platform
            instance, and no newsletter is actually sent.
          </p>
        </div>
      </section>

      {/* Closing banner */}
      <section data-dark className="group w-full bg-blue-950 px-6 py-10 text-white md:py-14">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-semibold md:text-3xl">Ready when you are.</h2>
            <p className="mt-2 opacity-85">Get the next Tax Letter in your inbox.</p>
          </div>
          <CtaButton label="Subscribe free" url={{ default: '#subscribe' }} />
        </div>
      </section>
    </>
  );
}
