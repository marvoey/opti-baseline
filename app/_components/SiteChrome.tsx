import PromoBar from './PromoBar';
import MainNav from './MainNav';
import Footer from './Footer';
import { getMainNav } from '@/lib/cms/navigation';
import { DEFAULT_LOCALE } from '@/lib/locales';

/**
 * Shared site chrome — promo bar, header (MainNav) and Footer — wrapped around a page
 * body. Used by BOTH the published CMS route (app/[locale]/layout) and the /preview
 * experience shell so the Visual Builder preview matches the published page. `flex-1`
 * lets the body grow so the footer sits at the bottom (the root <body> is
 * `min-h-full flex flex-col`).
 *
 * The header's links are the published child pages of the Corel home page, loaded from
 * the CMS (see lib/cms/navigation.ts) for the given locale.
 */
export default async function SiteChrome({
  children,
  locale = DEFAULT_LOCALE,
}: {
  children: React.ReactNode;
  locale?: string;
}) {
  const links = await getMainNav(locale);
  return (
    <>
      <PromoBar />
      <MainNav links={links} />
      <div className="flex-1">{children}</div>
      <Footer />
    </>
  );
}
