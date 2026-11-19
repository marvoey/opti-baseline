import type { Metadata } from 'next';
import { Roboto_Condensed, Roboto_Mono } from 'next/font/google';
import QuickLinks from './_sections/QuickLinks';
import Angle from './_sections/Angle';
import Inventory from './_sections/Inventory';
import DemoFlow from './_sections/DemoFlow';
import Gaps from './_sections/Gaps';
import Personalization from './_sections/Personalization';
import RfiCoverage from './_sections/RfiCoverage';
import DiscoveryQuestions from './_sections/DiscoveryQuestions';
import Checklist from './_sections/Checklist';
import './flow.css';

/**
 * /demo/flow - eHealth Friday demo flow and gap plan.
 *
 * GENERATED from the ehealth_friday_demo_flow.html canvas (version 8, 18 Nov
 * 2026) by converting its <body> markup to JSX: this file holds the header and
 * contents nav, and ./_sections holds one component per section. Visible text
 * and all 99 links were checked identical to the canvas. The canvas's only
 * script (forcing target="_blank" on external links) is dropped: every link
 * already has it. One deliberate difference from the canvas: its four "RFI summary
 * canvas" links point at /demo/rfi instead of the Mark canvas. If the canvas changes,
 * regenerate rather than hand-merge, then re-apply that change.
 *
 * Lives outside app/[locale]: proxy.ts already excludes /demo from the locale
 * rewrite, so this is a plain static route, not CMS content. It holds internal
 * prep notes, so it is noindex and not linked from site navigation.
 */

const condensed = Roboto_Condensed({
  variable: '--font-dfl-condensed',
  subsets: ['latin'],
  weight: ['600', '800'],
});

const mono = Roboto_Mono({
  variable: '--font-dfl-mono',
  subsets: ['latin'],
  weight: ['400'],
});

export const metadata: Metadata = {
  title: 'eHealth × Optimizely: Friday demo flow and gap plan',
  description: 'Demo flow, gap plan, personalization recipe and RFI coverage map for the eHealth call.',
  robots: { index: false, follow: false },
};

export default function DemoFlowPage() {
  return (
    <div className={`dfl ${condensed.variable} ${mono.variable}`}>
      <header className="max-w-6xl mx-auto px-5 pt-10 pb-6">
        <div className="flex flex-wrap gap-2">
          <span className="chip c-green">eHealth · Friday 20 Nov 2026</span>
          <span className="chip c-blue">Demo flow + gap plan</span>
          <span className="chip c-n">Built from live site, CMS and source on 18 Nov</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mt-4 leading-tight">&quot;Ship it during enrollment, without a ticket&quot;</h1>
        <p className="mt-3 max-w-3xl">A 60-minute demo built around <a className="link" href="https://ehealth.optimoey.com" target="_blank" rel="noopener noreferrer">ehealth.optimoey.com</a>, which already runs on Optimizely CMS SaaS. It&apos;s mapped to eHealth&apos;s RFI, and each step says whether it&apos;s <strong>ready today</strong>, <strong>needs a build before Friday</strong>, or is <strong>talk track only</strong>.</p>
        <div className="flex flex-wrap gap-2 mt-4 text-sm">
          <span className="chip c-green">READY: works on the site today</span>
          <span className="chip c-warn">BUILD: close the gap before Friday</span>
          <span className="chip c-n">TALK: slide or narrative only</span>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-5 pb-16 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
        <aside className="hidden lg:block">
          <nav className="card p-4! sticky top-4 toc">
            <div className="chip c-n mb-3">Contents</div>
            <a href="#links">★ Quick links</a>
            <a href="#angle">1. The angle</a>
            <a href="#inventory">2. What&apos;s on the site today</a>
            <a href="#flow">3. Demo flow (60 min)</a>
            <a href="#gaps">4. Gaps to close</a>
            <a href="#personalization">5. Personalization build recipe</a>
            <a href="#rfi">6. RFI coverage map</a>
            <a href="#questions">7. Discovery questions</a>
            <a href="#checklist">8. Pre-call checklist</a>
          </nav>
        </aside>
        <div className="space-y-8">
          {/* QUICK LINKS */}
          <QuickLinks />
          {/* 1 ANGLE */}
          <Angle />
          {/* 2 INVENTORY */}
          <Inventory />
          {/* 3 FLOW */}
          <DemoFlow />
          {/* 4 GAPS */}
          <Gaps />
          {/* 5 PERSONALIZATION */}
          <Personalization />
          {/* 6 RFI MAP */}
          <RfiCoverage />
          {/* 7 QUESTIONS */}
          <DiscoveryQuestions />
          {/* 8 CHECKLIST */}
          <Checklist />
        </div>
      </main>
    </div>
  );
}
