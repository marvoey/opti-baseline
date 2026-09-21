import Link from 'next/link';
import { ClientLoginLink } from './client-login-link';

// --- 2. Utility Header (static, server-rendered) ---
export function UtilityBar() {
  return (
    <div className="border-b border-slate-800/80 bg-[#070A13] text-xs text-slate-400 px-4 py-1.5 hidden md:block">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-6">
          <span>Corporate Security Intelligence System of Record</span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            All Systems Operational {'&'} FedRAMP Ready
          </span>
        </div>
        <div className="flex items-center gap-5">
          <a href="tel:512-572-7400" className="hover:text-white transition-colors">Call: 512-572-7400</a>
          <Link href="/demo-mock/platform" className="hover:text-white transition-colors">Careers</Link>
          <ClientLoginLink />
        </div>
      </div>
    </div>
  );
}
