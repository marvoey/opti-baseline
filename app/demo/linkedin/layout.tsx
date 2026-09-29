import type { Metadata } from 'next';

/**
 * page.tsx here is a 'use client' component, which can't export `metadata`
 * itself — this server layout carries the browser-tab title instead.
 */
export const metadata: Metadata = {
  title: 'LinkedIn',
};

export default function LinkedInDemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
