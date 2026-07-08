import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agentic CMS Demo Flow | Optimizely × Progressive',
};

export default function DemoFlowLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
