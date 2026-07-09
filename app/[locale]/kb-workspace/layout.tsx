import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Progressive | Opti Demo',
  icons: { icon: [{ url: 'https://images.contentstack.io/v3/assets/blt62d40591b3650da3/blt4a6e0a9548045e84/favicon.svg', type: 'image/svg+xml' }] },
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
