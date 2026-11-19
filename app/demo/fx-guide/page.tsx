import type { Metadata } from 'next';
import AtAGlance from './_sections/AtAGlance';
import Idea from './_sections/Idea';
import CmsPage from './_sections/CmsPage';
import Vocab from './_sections/Vocab';
import Build from './_sections/Build';
import Runtime from './_sections/Runtime';
import Matrix from './_sections/Matrix';
import Code from './_sections/Code';
import Gotchas from './_sections/Gotchas';
import RunOfShow from './_sections/RunOfShow';
import Verify from './_sections/Verify';
import ToProduction from './_sections/ToProduction';
import References from './_sections/References';
import Sprite from './_sections/Sprite';
import Hero from './_sections/Hero';
import Contents from './_sections/Contents';
import Closing from './_sections/Closing';
import { bodyFont, headFont, monoFont } from './fonts';
import './fx-guide.css';

/**
 * /demo/fx-guide - how Feature Experimentation picks the eHealth home-page hero.
 *
 * A step-by-step guide to the server-side Feature Experimentation + CMS SaaS setup: the CMS
 * page and its variations, the flag, audiences and rules, what happens on each request, the
 * code, gotchas, the Friday run of show and a pre-call test script.
 *
 * GENERATED from the ehealth_fx_implementation_guide.html canvas (19 Nov 2026) by converting
 * its <body> markup to JSX: this file composes the pieces, and ./_sections holds one component
 * per section (plus the hero, contents bar, icon sprite and closing band). The canvas's fonts
 * and illustrations, embedded there as data URIs, are files in ./fonts and ./_assets. One
 * deliberate difference from the canvas: the closing band's "Friday demo flow" mention
 * links to /demo/flow. If the canvas changes, regenerate rather than hand-merge, then
 * re-apply that change.
 *
 * It used to be a route handler serving the canvas as a standalone HTML document. It is a
 * page now, like /demo/flow, /demo/groups and /demo/rfi, so it sits in the site's root layout
 * (and DevQuickLinks lists it) with its styles scoped under .fxg.
 *
 * Lives outside app/[locale]: proxy.ts already excludes /demo from the locale rewrite, so
 * this is a plain static route, not CMS content. It holds internal prep notes, so it is
 * noindex and not linked from site navigation.
 */

export const metadata: Metadata = {
  title: "You're free to experiment: Feature Experimentation + CMS SaaS on the eHealth demo",
  description:
    'How the eHealth home-page hero is picked, built and ordered with Feature Experimentation and CMS SaaS, step by step.',
  robots: { index: false, follow: false },
};

export default function FxGuidePage() {
  return (
    <div className={`fxg ${headFont.variable} ${bodyFont.variable} ${monoFont.variable}`}>
      <Sprite />
      <Hero />
      <Contents />
      <main className="wrap">
        <AtAGlance />
        <Idea />
        <CmsPage />
        <Vocab />
        <Build />
        <Runtime />
        <Matrix />
        <Code />
        <Gotchas />
        <RunOfShow />
        <Verify />
        <ToProduction />
        <References />
      </main>
      <Closing />
    </div>
  );
}
