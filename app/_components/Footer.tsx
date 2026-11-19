import { siteConfig } from '@/lib/siteConfig';

/**
 * Brand footer: newsletter band, top links, social pills, legal links and the
 * studio sign-off (wordmark, cities, established year).
 */
const Footer = () => {
  const { newsletter, footerStudio } = siteConfig;

  return (
    <footer className="bg-rs-black text-white" data-cms-group="Footer">
      {/* Newsletter band */}
      <div className="container mx-auto px-4 pt-16">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-rs-card p-8 md:flex-row md:items-center md:p-10">
          <div className="max-w-2xl">
            <h5 className="text-xl font-extrabold tracking-tight">{newsletter.heading}</h5>
            <p className="mt-2 text-sm leading-relaxed text-rs-muted">{newsletter.body}</p>
          </div>
          <a
            href={newsletter.cta.href}
            className="shrink-0 rounded-full bg-white px-6 py-3 text-sm font-extrabold text-black transition-colors hover:bg-rs-yellow"
          >
            {newsletter.cta.label}
          </a>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-10 pt-12">
        {/* Top links + socials */}
        <div className="flex flex-col gap-8 border-b border-rs-line pb-10 lg:flex-row lg:items-center lg:justify-between">
          <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-bold">
            {siteConfig.footerTopLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="text-white/80 transition-colors hover:text-white">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <ul className="flex flex-wrap gap-2">
            {siteConfig.socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 items-center rounded-full bg-white/10 px-3.5 text-xs font-bold text-white/80 transition-colors hover:bg-rs-yellow hover:text-black"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal + studio sign-off */}
        <div className="flex flex-col gap-8 pt-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-white/50">
              {siteConfig.footerLegalLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="transition-colors hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-xs text-white/35">{siteConfig.footerLegal}</p>
          </div>

          <div className="text-left lg:text-right">
            <p className="text-2xl font-black tracking-tight">{footerStudio.wordmark}</p>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.25em] text-white/45">
              {footerStudio.cities.join(' \u00b7 ')}
            </p>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.25em] text-rs-yellow">
              Est. {footerStudio.established}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
