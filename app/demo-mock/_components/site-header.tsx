'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from './icons';
import { OnticLogo } from './ontic-logo';
import { RequestDemoButton } from './request-demo-button';

const ROUTES = {
  home: '/demo-mock',
  platform: '/demo-mock/platform',
  solutions: '/demo-mock/solutions',
  solutionsEp: '/demo-mock/solutions/executive-protection',
  solutionsIm: '/demo-mock/solutions/incident-management',
};

// --- 3. Main Navigation Bar (client: mega menu hover, mobile flyout, active link) ---
export function SiteHeader() {
  const pathname = usePathname();
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinkClass = (href: string) =>
    `flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
      pathname === href ? 'text-[#E96822]' : 'text-slate-200 hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0A0E1A]/95 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href={ROUTES.home} className="focus:outline-none">
            <OnticLogo />
          </Link>

          {/* Desktop Navigation Links with Mega Menus */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* Solutions Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveMegaMenu('solutions')}
              onMouseLeave={() => setActiveMegaMenu(null)}
            >
              <Link href={ROUTES.solutions} className={navLinkClass(ROUTES.solutions)}>
                Solutions <Icons.ChevronDown />
              </Link>

              {activeMegaMenu === 'solutions' && (
                <div className="absolute top-full left-0 w-[640px] bg-[#0F172A] border border-slate-700/80 rounded-xl p-6 shadow-2xl grid grid-cols-2 gap-6 mt-1 backdrop-blur-lg">
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">By Program</h4>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Link
                          href={ROUTES.solutionsEp}
                          onClick={() => setActiveMegaMenu(null)}
                          className="flex items-center justify-between w-full text-left text-slate-300 hover:text-[#E96822] hover:bg-slate-800/50 p-2 rounded transition-all"
                        >
                          <div>
                            <div className="font-semibold text-white">Executive Protection</div>
                            <div className="text-xs text-slate-400">Protect leaders from modern threats</div>
                          </div>
                          <Icons.ChevronRight />
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={ROUTES.solutionsIm}
                          onClick={() => setActiveMegaMenu(null)}
                          className="flex items-center justify-between w-full text-left text-slate-300 hover:text-[#E96822] hover:bg-slate-800/50 p-2 rounded transition-all"
                        >
                          <div>
                            <div className="font-semibold text-white">Incident Management</div>
                            <div className="text-xs text-slate-400">Cut incident response time by 50%</div>
                          </div>
                          <Icons.ChevronRight />
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={ROUTES.solutions}
                          onClick={() => setActiveMegaMenu(null)}
                          className="flex items-center justify-between w-full text-left text-slate-300 hover:text-[#E96822] hover:bg-slate-800/50 p-2 rounded transition-all"
                        >
                          <div>
                            <div className="font-semibold text-white">Threat Intelligence</div>
                            <div className="text-xs text-slate-400">Actionable OSINT {'&'} signals</div>
                          </div>
                          <Icons.ChevronRight />
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={ROUTES.solutions}
                          onClick={() => setActiveMegaMenu(null)}
                          className="flex items-center justify-between w-full text-left text-slate-300 hover:text-[#E96822] hover:bg-slate-800/50 p-2 rounded transition-all"
                        >
                          <div>
                            <div className="font-semibold text-white">Corporate Investigations</div>
                            <div className="text-xs text-slate-400">Audit-ready connected case files</div>
                          </div>
                          <Icons.ChevronRight />
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="border-l border-slate-800 pl-6">
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">By Industry</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 mb-5">
                      <span className="hover:text-white cursor-pointer py-1">Healthcare</span>
                      <span className="hover:text-white cursor-pointer py-1">Retail</span>
                      <span className="hover:text-white cursor-pointer py-1">Financial Services</span>
                      <span className="hover:text-white cursor-pointer py-1">Manufacturing</span>
                      <span className="hover:text-white cursor-pointer py-1">Government</span>
                      <span className="hover:text-white cursor-pointer py-1">Tech {'&'} Telecom</span>
                    </div>
                    <div className="bg-gradient-to-br from-slate-900 to-[#1e1b2e] border border-orange-500/20 p-3.5 rounded-lg">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#E96822] block mb-1">Spotlight</span>
                      <p className="text-xs font-semibold text-white mb-1">Corporate Security AI Readiness</p>
                      <p className="text-[11px] text-slate-400 mb-2">Assess if your team's data foundation is ready for AI workflows.</p>
                      <Link
                        href={ROUTES.platform}
                        onClick={() => setActiveMegaMenu(null)}
                        className="text-xs text-[#E96822] font-bold hover:underline inline-flex items-center gap-1"
                      >
                        Explore Assessment <Icons.ChevronRight />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Platform / Products Link */}
            <Link href={ROUTES.platform} className={navLinkClass(ROUTES.platform)}>
              Platform {'&'} AI
            </Link>

            {/* Solutions Quick Direct Links */}
            <Link href={ROUTES.solutionsEp} className={navLinkClass(ROUTES.solutionsEp)}>
              Executive Protection
            </Link>

            <Link href={ROUTES.solutionsIm} className={navLinkClass(ROUTES.solutionsIm)}>
              Incident Response
            </Link>
          </nav>
        </div>

        {/* Action CTAs */}
        <div className="hidden lg:flex items-center gap-3">
          <Link href={ROUTES.platform} className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2">
            See Product Tour
          </Link>
          <RequestDemoButton className="bg-[#E96822] hover:bg-[#D15A16] text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-orange-600/25 active:scale-95 flex items-center gap-2">
            Request a Demo
            <Icons.ChevronRight />
          </RequestDemoButton>
        </div>

        {/* Mobile Menu Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-300 hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Flyout Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-[#0F172A] px-6 py-6 space-y-4">
          <Link
            href={ROUTES.home}
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-left font-medium text-slate-200 py-1"
          >
            Home
          </Link>
          <Link
            href={ROUTES.platform}
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-left font-medium text-slate-200 py-1"
          >
            Platform {'&'} AI
          </Link>
          <Link
            href={ROUTES.solutions}
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-left font-medium text-slate-200 py-1"
          >
            Solutions Matrix
          </Link>
          <Link
            href={ROUTES.solutionsEp}
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-left font-medium text-slate-200 py-1"
          >
            Executive Protection
          </Link>
          <Link
            href={ROUTES.solutionsIm}
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-left font-medium text-slate-200 py-1"
          >
            Incident Management
          </Link>
          <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
            <RequestDemoButton className="w-full bg-[#E96822] text-white font-semibold py-2.5 rounded-lg text-center">
              Request a Demo
            </RequestDemoButton>
          </div>
        </div>
      )}
    </header>
  );
}
