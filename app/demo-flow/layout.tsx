import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agentic CMS Demo Flow | Optimizely × Progressive',
  description: 'See the agentic CMS demo flow — Optimizely and Progressive creating content-driven experiences together.',
  openGraph: {
    description: 'See the agentic CMS demo flow — Optimizely and Progressive creating content-driven experiences together.',
    images: [{ url: '/Optimizely_Primary-Logo_Medium_Green_RGB.png' }],
  },
};

export default function DemoFlowLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
