import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Roboto, Roboto_Condensed, Roboto_Mono } from 'next/font/google';
import s from './setup-guide.module.css';

/**
 * Layout for /setup-guide: the colleague setup guide.
 *
 * It sits outside app/[locale], so it is not a CMS page and uses none of the site chrome
 * (nav, footer). proxy.ts excludes /setup-guide so the request is not rewritten into the
 * CMS catch-all. Styles come only from setup-guide.module.css.
 */

// Roboto is the brand fallback for Die Grotesk (body) and VC Nudge (headlines), which are licensed.
const body = Roboto({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--sg-font-body' });
const display = Roboto_Condensed({ subsets: ['latin'], weight: ['700', '800'], variable: '--sg-font-display' });
const mono = Roboto_Mono({ subsets: ['latin'], weight: ['400', '600'], variable: '--sg-font-mono' });

export const metadata: Metadata = {
  title: 'Setup guide · opti-baseline',
  description:
    'Step-by-step setup for building an Optimizely CMS demo site with opti-baseline, for macOS and Windows. No coding experience needed.',
  // Internal how-to: keep it out of search engines.
  robots: { index: false, follow: false },
};

export default function SetupGuideLayout({ children }: { children: ReactNode }) {
  return <div className={`${body.variable} ${display.variable} ${mono.variable} ${s.frame}`}>{children}</div>;
}
