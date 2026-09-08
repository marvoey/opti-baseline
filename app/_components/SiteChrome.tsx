import TopNav from './TopNav';
import MainNav from './MainNav';
import Footer from './Footer';
import BrandHeader from './BrandHeader';
import BrandFooter from './BrandFooter';
import { resolveTheme } from '@/lib/theme';
import { brandThemes } from '@/lib/brandThemes';

/**
 * Shared static site chrome — header and Footer — wrapped around a page body.
 * Used by BOTH the published CMS route (app/[locale]/layout) and the /preview
 * experience shell so the Visual Builder preview matches the published page.
 * `flex-1` lets the body grow so the footer sits at the bottom (the root
 * <body> is `min-h-full flex flex-col`).
 *
 * This is the only place theme branching happens: Optimizely keeps its
 * original TopNav+MainNav+Footer (lib/siteConfig.ts), while Peacock/NOW get
 * the shared BrandHeader/BrandFooter (lib/brandThemes.ts) instead.
 */
export default async function SiteChrome({ children }: { children: React.ReactNode }) {
  const theme = await resolveTheme();

  if (theme === 'peacock' || theme === 'nowtv') {
    const config = brandThemes[theme];
    return (
      <>
        <BrandHeader config={config} />
        <div className="flex-1">{children}</div>
        <BrandFooter config={config} />
      </>
    );
  }

  return (
    <>
      <TopNav />
      <MainNav />
      <div className="flex-1">{children}</div>
      <Footer />
    </>
  );
}
