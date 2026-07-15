import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Progressive | Opti Demo',
  description: 'Experience Progressive\'s content-driven insurance platform, powered by Optimizely CMS.',
  icons: { icon: [{ url: 'https://images.contentstack.io/v3/assets/blt62d40591b3650da3/blt4a6e0a9548045e84/favicon.svg', type: 'image/svg+xml' }] },
  openGraph: {
    description: 'Experience Progressive\'s content-driven insurance platform, powered by Optimizely CMS.',
    images: [{ url: '/Optimizely_Primary-Logo_Medium_Green_RGB.png' }],
  },
};

export default function DemoV2Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
