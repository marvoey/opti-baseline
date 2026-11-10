import TopNav from './TopNav';
import MainNav from './MainNav';
import Footer from './Footer';
import ChromeSwitch from '../_components_portal/ChromeSwitch';
import PortalHeader from '../_components_portal/PortalHeader';
import PortalFooter from '../_components_portal/PortalFooter';
import SignInHeader from '../_components_portal/SignInHeader';

/**
 * Shared static site chrome — header and Footer — wrapped around a page body.
 * Used by BOTH the published CMS route (app/[locale]/layout) and the /preview
 * experience shell so the Visual Builder preview matches the published page.
 * `flex-1` (in ChromeSwitch) lets the body grow so the footer sits at the bottom
 * (the root <body> is `min-h-full flex flex-col`).
 *
 * LM.com pages get TopNav + MainNav + Footer. Pages under /agent get the
 * Independent Agent Portal header and footer instead; ChromeSwitch chooses in
 * the browser from the URL. `force` is for the CMS preview route.
 */
export default function SiteChrome({ children, force }: { children: React.ReactNode; force?: 'portal' | 'signin' | 'agent' | 'plain' }) {
  return (
    <ChromeSwitch
      force={force}
      site={{
        header: (
          <>
            <TopNav />
            <MainNav />
          </>
        ),
        footer: <Footer />,
      }}
      portal={{ header: <PortalHeader />, footer: <PortalFooter /> }}
      signin={{ header: <SignInHeader variant="signin" />, footer: <PortalFooter /> }}
      agent={{ header: <SignInHeader variant="agent" />, footer: <PortalFooter /> }}
      plain={{ header: <SignInHeader variant="plain" />, footer: <PortalFooter /> }}
    >
      {children}
    </ChromeSwitch>
  );
}
