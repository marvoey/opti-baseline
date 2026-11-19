import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { siteConfig } from '@/lib/siteConfig';

/**
 * Secondary in-page navigation (Overview / GTA Online / GTA+ / Guides / Support).
 * Horizontally scrollable on small screens.
 */
const SubNav = () => (
  <nav aria-label="Section" className="border-b border-rs-line bg-rs-black">
    <div className="container mx-auto flex gap-6 overflow-x-auto px-4 text-sm font-bold text-white/60 [scrollbar-width:none]">
      {siteConfig.subNavLinks.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          className="inline-flex shrink-0 items-center gap-1 border-b-2 border-transparent py-3 transition-colors hover:border-rs-yellow hover:text-white"
        >
          {link.label}
          {'external' in link && link.external ? <ArrowUpRight size={13} className="opacity-70" /> : null}
        </Link>
      ))}
    </div>
  </nav>
);

export default SubNav;
