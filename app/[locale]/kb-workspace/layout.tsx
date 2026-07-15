import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Progressive | Opti Demo',
  description: 'Meet Opal — Progressive\'s AI-powered Knowledge Assistant. Ask questions, find policy content, and get instant answers from the knowledge base.',
  icons: { icon: [{ url: 'https://images.contentstack.io/v3/assets/blt62d40591b3650da3/blt4a6e0a9548045e84/favicon.svg', type: 'image/svg+xml' }] },
  openGraph: {
    description: 'Meet Opal — Progressive\'s AI-powered Knowledge Assistant. Ask questions, find policy content, and get instant answers from the knowledge base.',
    images: [{ url: '/Optimizely_Primary-Logo_Medium_Green_RGB.png' }],
  },
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
