import { AnnouncementBanner } from './_components/announcement-banner';
import { UtilityBar } from './_components/utility-bar';
import { SiteHeader } from './_components/site-header';
import { SiteFooter } from './_components/site-footer';

// --- Ontic Theme & Design Tokens (matched to ontic.co) ---
// Primary Orange: #E96822 (from the official logo mark), hover #D15A16
// Dark bookends (header/hero/footer): #0A0E1A, #0F172A, #070A13
// Light body sections: #FFFFFF / #F8FAFC with slate-900/slate-500 text
// Typography: Modern crisp geometric sans-serif

export default function DemoMockLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#E96822] selection:text-white antialiased">
      <AnnouncementBanner />
      <UtilityBar />
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
