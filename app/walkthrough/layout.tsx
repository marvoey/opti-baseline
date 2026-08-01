import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Walkthrough · Progressive × Optimizely',
  description: '80-minute evaluator demo walkthrough — KM requirement coverage',
};

export default function WalkthroughLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
