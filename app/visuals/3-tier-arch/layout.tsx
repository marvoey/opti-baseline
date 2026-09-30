import type { ReactNode } from 'react';
import { PresentationProvider } from './_lib/presentation';
import { Shell } from './_components/Shell';

export const metadata = { title: 'CCO 3-Tier Solution Blueprint' };

export default function ThreeTierLayout({ children }: { children: ReactNode }) {
  return (
    <PresentationProvider>
      <Shell>{children}</Shell>
    </PresentationProvider>
  );
}
