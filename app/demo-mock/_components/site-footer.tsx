import Link from 'next/link';
import { OnticLogo } from './ontic-logo';
import { RequestDemoButton } from './request-demo-button';

const ROUTES = {
  home: '/demo-mock',
  platform: '/demo-mock/platform',
  solutions: '/demo-mock/solutions',
  solutionsEp: '/demo-mock/solutions/executive-protection',
  solutionsIm: '/demo-mock/solutions/incident-management',
};

// --- 5. Enterprise Footer (static, server-rendered) ---
export function SiteFooter() {
  return (
    <footer className="bg-[#070A13] border-t border-slate-800 text-slate-400 text-xs py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand info */}
          <div className="col-span-2">
            <OnticLogo />
            <p className="text-slate-400 mt-4 text-xs leading-relaxed max-w-sm">
              Ontic is the protective intelligence software platform built to unify threat data, automate security workflows, and safeguard people and physical operations.
            </p>
            <div className="mt-4 text-xs text-slate-500">
              1608 W 5th St., Suite 100, Austin, TX 78703<br />
              Direct: 512-572-7400
            </div>
            <div className="mt-4 inline-block bg-slate-900 border border-slate-800 px-3 py-1.5 rounded text-[11px] text-slate-300">
              FedRAMP® Moderate Authorized
            </div>
          </div>

          {/* Solutions Column */}
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">Solutions</h4>
            <ul className="space-y-2">
              <li><Link href={ROUTES.solutionsEp} className="hover:text-white">Executive Protection</Link></li>
              <li><Link href={ROUTES.solutionsIm} className="hover:text-white">Incident Management</Link></li>
              <li><Link href={ROUTES.solutions} className="hover:text-white">Threat Intelligence</Link></li>
              <li><Link href={ROUTES.solutions} className="hover:text-white">Corporate Investigations</Link></li>
              <li><Link href={ROUTES.platform} className="hover:text-white">GSOC Operations</Link></li>
            </ul>
          </div>

          {/* Platform Column */}
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">Products</h4>
            <ul className="space-y-2">
              <li><Link href={ROUTES.platform} className="hover:text-white">Ontic Platform</Link></li>
              <li><Link href={ROUTES.platform} className="hover:text-white">Ontic AI Engine</Link></li>
              <li><Link href={ROUTES.platform} className="hover:text-white">Risk Intelligence</Link></li>
              <li><Link href={ROUTES.platform} className="hover:text-white">Integrated Research</Link></li>
              <li><Link href={ROUTES.platform} className="hover:text-white">60+ Integrations</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">Company</h4>
            <ul className="space-y-2">
              <li><Link href={ROUTES.home} className="hover:text-white">About Us</Link></li>
              <li><Link href={ROUTES.home} className="hover:text-white">Client Stories</Link></li>
              <li><Link href={ROUTES.platform} className="hover:text-white">Trust and Security</Link></li>
              <li>
                <RequestDemoButton className="hover:text-white text-[#E96822]">
                  Request Demo
                </RequestDemoButton>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Ontic Technologies, Inc. All rights reserved.
          </div>
          <div className="flex gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Notice</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Use</span>
            <span className="hover:text-slate-400 cursor-pointer">Security Overview</span>
            <span className="hover:text-slate-400 cursor-pointer">Cookie Preferences</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
