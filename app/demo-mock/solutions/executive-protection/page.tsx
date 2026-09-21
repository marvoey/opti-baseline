import Link from 'next/link';
import { RequestDemoButton } from '../../_components/request-demo-button';
import { EpPoiSimulator } from '../../_components/ep-poi-simulator';

// =========================================================================
// LANDING PAGE - EXECUTIVE PROTECTION — server-rendered
// =========================================================================
export default function ExecutiveProtectionPage() {
  return (
    <div>
      {/* EP Hero (dark navy bookend) */}
      <div className="bg-[#0A0E1A] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <span className="text-[#E96822] font-bold text-xs uppercase tracking-wider">Executive Protection Solution</span>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-2 leading-tight">
                Anticipate risks. Protect your leaders wherever they operate.
              </h1>
              <p className="text-slate-300 text-base mt-4 leading-relaxed">
                Modern executive protection demands more than physical bodyguards. Ontic unifies digital harassment monitoring, person of interest (POI) tracking, and live travel route geofencing so your EP teams act before threats manifest.
              </p>
              <div className="flex gap-4 mt-6">
                <RequestDemoButton className="bg-[#E96822] hover:bg-[#D15A16] text-white font-bold px-6 py-3 rounded-lg text-sm shadow-lg shadow-orange-600/30">
                  Schedule EP Demo
                </RequestDemoButton>
                <Link
                  href="/demo-mock/solutions"
                  className="border border-slate-700 bg-slate-900 text-slate-300 px-6 py-3 rounded-lg text-sm hover:bg-slate-800"
                >
                  Back to Solutions
                </Link>
              </div>
            </div>

            {/* EP Interactive Mockup: Principal Profile & Travel Route */}
            <EpPoiSimulator />
          </div>
        </div>
      </div>

      {/* 3 Pillars of Ontic Executive Protection (light body section) */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Comprehensive Principal Safety Capabilities</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="text-base font-bold text-slate-900 mb-2">1. Person of Interest (POI) Tracking</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Consolidate fixated individuals, disgruntled former employees, and public threats into unified POI profiles with full behavioral assessments.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="text-base font-bold text-slate-900 mb-2">2. Route and Location Intelligence</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Geofence executive residences, offices, flight corridors, and event venues to receive automated early-warning alerts before physical contact occurs.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="text-base font-bold text-slate-900 mb-2">3. Mobile Protection Briefings</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Deliver secure, real-time threat dossiers and contact trees directly to advance agents and close-protection officers on iOS and Android.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
