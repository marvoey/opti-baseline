import LibertyLogo from '@/app/_components/LibertyLogo';
import { portalConfig } from '@/lib/agent/portalConfig';

/** Independent Agent Portal footer: same layout as the LM.com footer, portal links and legal line. */
export default function PortalFooter() {
  return (
    <footer className="mt-12 md:mt-16">
      <div className="mx-auto max-w-6xl sm:px-6">
        <div className="grid grid-cols-1 gap-6 rounded-t-3xl bg-[#F5F5F5] px-6 py-8 text-sm sm:grid-cols-2 md:grid-cols-4 md:gap-8 md:px-10 md:py-10">
          <div>
            <div
              className="flex h-[76px] w-[221px] max-w-full overflow-hidden rounded-xl"
              style={{ backgroundColor: 'var(--lmig-FloatingHeader-brand-color, #FFD000)' }}
            >
              <div className="flex flex-1 items-center justify-center">
                <LibertyLogo className="w-[157px]" />
              </div>
            </div>
          </div>
          {portalConfig.footerColumns.map((col) => (
            <div key={col.heading}>
              <div className="font-medium text-navy">{col.heading}</div>
              <div className="mt-2">
                {col.links.map((link) => (
                  <a key={link.label} href={link.href} className="lk block py-1.5">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-navy text-xs text-white/80">
        <div className="mx-auto max-w-6xl space-y-3 px-6 py-6">
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            {portalConfig.footerLegalLinks.map((link) => (
              <a key={link.label} href={link.href} className="inline-block py-1 underline">
                {link.label}
              </a>
            ))}
          </div>
          <p>{portalConfig.footerLegal}</p>
        </div>
      </div>
    </footer>
  );
}
