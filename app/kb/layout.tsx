import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Progressive | Opti Demo',
  description: 'Browse Progressive\'s policy knowledge base, powered by Optimizely CMS and the Opal AI assistant.',
  openGraph: {
    description: 'Browse Progressive\'s policy knowledge base, powered by Optimizely CMS and the Opal AI assistant.',
    images: [{ url: '/Optimizely_Primary-Logo_Medium_Green_RGB.png' }],
  },
};

export default function KbLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
