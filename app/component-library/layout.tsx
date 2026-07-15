import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Progressive | CMS Component Library',
  description: 'Explore the Progressive CMS component library — content blocks built with Optimizely CMS SaaS.',
  icons: { icon: [{ url: 'https://images.contentstack.io/v3/assets/blt62d40591b3650da3/blt4a6e0a9548045e84/favicon.svg', type: 'image/svg+xml' }] },
  openGraph: {
    description: 'Explore the Progressive CMS component library — content blocks built with Optimizely CMS SaaS.',
    images: [{ url: '/Optimizely_Primary-Logo_Medium_Green_RGB.png' }],
  },
};

export default function ComponentLibraryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
