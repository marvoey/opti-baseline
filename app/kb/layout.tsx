import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Progressive | Opti Demo',
};

export default function KbLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
