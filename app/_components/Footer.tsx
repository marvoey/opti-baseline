import Link from 'next/link';
import { siteConfig } from '@/lib/siteConfig';

const link =
  'text-white/70 lg:text-white/90 hover:text-blue-300 transition-colors';

const Footer = () => (
  <footer
    className="bg-gradient-dark-navy text-white pt-16 pb-16 lg:pb-32 overflow-hidden"
    data-cms-group="Footer"
  >
    <div className="mx-auto w-full max-w-[1200px] px-4 lg:px-10 grid gap-12">
      <div className="grid grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)] gap-x-5 gap-y-10 lg:gap-x-10">
        <div className="col-span-2 lg:col-span-1 flex flex-col items-start gap-4">
          <Link href="/" aria-label={siteConfig.logoAlt}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={siteConfig.logoInvertedSrc} alt={siteConfig.logoAlt} width={83} height={50} className="h-[50px] w-[83px]" />
          </Link>
          <p className="text-sm">{siteConfig.footerTagline}</p>
          <Link
            href={siteConfig.footerCta.href}
            className="mt-2 inline-flex items-center min-h-11 px-6 rounded-full border-[1.5px] border-blue-700 bg-blue-50 text-blue-700 font-medium hover:bg-blue-300 hover:border-blue-300 transition-colors"
          >
            {siteConfig.footerCta.label}
          </Link>
        </div>
        {siteConfig.footerColumns.map((col) => (
          <nav key={col.heading} aria-label={col.heading} className="flex flex-col gap-4">
            <h3 className="text-[0.71875rem] lg:text-lg font-bold lg:font-medium uppercase lg:normal-case tracking-[0.065em] lg:tracking-normal">
              {col.heading}
            </h3>
            <ul className="flex flex-col gap-2 text-base">
              {col.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className={link}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-white/10 pt-6 flex flex-col gap-3 text-sm text-white/80">
        <div className="flex flex-wrap items-center gap-2">
          <p>{siteConfig.footerAddress}</p>
          <ul className="inline-flex flex-wrap items-center gap-2" aria-label="Legal Information">
            {siteConfig.footerLegalLinks.map((l) => (
              <li key={l.label} className="inline-flex items-center gap-2">
                <span aria-hidden className="opacity-50 select-none">|</span>
                <a href={l.href} className={link}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p>{siteConfig.footerServiceMarks}</p>
        <p>{siteConfig.footerLegal}</p>
      </div>
    </div>
  </footer>
);

export default Footer;
