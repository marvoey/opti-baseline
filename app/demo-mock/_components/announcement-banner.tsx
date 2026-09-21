import Link from 'next/link';
import { Icons } from './icons';

// --- 1. Global Announcement Banner (static, server-rendered) ---
export function AnnouncementBanner() {
  return (
    <div className="bg-gradient-to-r from-[#E96822] via-[#C24E12] to-[#F1854C] text-white text-xs sm:text-sm font-medium py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="bg-black/20 text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded tracking-wide">
            Announcement
          </span>
          <span>Ontic Achieves FedRAMP® Moderate Authorization for Public Sector {'&'} Federal Agencies</span>
        </div>
        <Link
          href="/demo-mock/platform"
          className="hidden md:inline-flex items-center gap-1 font-semibold underline underline-offset-2 hover:opacity-90 transition-opacity ml-4 text-xs whitespace-nowrap"
        >
          Learn More <Icons.ChevronRight />
        </Link>
      </div>
    </div>
  );
}
