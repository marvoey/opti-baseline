import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'From Word to Structured Content · Progressive × Optimizely',
  description: 'How flat Word documents become smart, reusable, atomic content blocks in Optimizely CMS',
};

export default function DocsPresentationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
