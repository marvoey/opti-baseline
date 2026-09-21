import Link from 'next/link';
import { Icons } from '../_components/icons';
import { RequestDemoButton } from '../_components/request-demo-button';
import { IntegrationsExplorer } from '../_components/integrations-explorer';

// =========================================================================
// PLATFORM PAGE (Architecture & Ontic AI Deep Dive) — server-rendered
// =========================================================================
export default function PlatformPage() {
  return (
    <div>
      {/* Platform Hero (dark navy page-title band) */}
      <div className="bg-[#0A0E1A] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-[#E96822] font-bold text-xs uppercase tracking-wider">Physical Security Platform</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-2 leading-tight">
              Unified Security Operations, Powered by Ontic AI
            </h1>
            <p className="text-lg text-slate-300 mt-4 leading-relaxed">
              Data silos make it impossible to see the whole picture. Ontic unifies people, processes, and intelligence into a single AI-powered system of record to surface clear, decision-ready insights.
            </p>
            <div className="flex gap-4 mt-6">
              <RequestDemoButton className="bg-[#E96822] hover:bg-[#D15A16] text-white font-bold px-6 py-3 rounded-lg text-sm shadow-lg shadow-orange-600/30">
                See Ontic In Action
              </RequestDemoButton>
              <Link
                href="/demo-mock/solutions"
                className="border border-slate-700 bg-slate-900 text-slate-200 font-semibold px-6 py-3 rounded-lg text-sm hover:bg-slate-800"
              >
                View Solutions Matrix
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 bg-white">
        {/* 5 Core Pillars Architecture Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900">The Ontic Platform Architecture</h2>
            <p className="text-slate-500 text-sm mt-2">Built specifically for corporate security governance, operational scale, and audit defensibility.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 text-[#E96822] flex items-center justify-center mb-4">
                <Icons.Shield />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">1. System of Record</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Maintain an immutable history of threats, persons of interest, assessments, and investigations with granular role-based permissions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-600 flex items-center justify-center mb-4">
                <Icons.MapPin />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">2. Maps {'&'} Visualizations</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Global dynamic situational mapping. Overlay personnel travel, static facilities, active threats, and weather hazards in real-time.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center mb-4">
                <Icons.Sparkles />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">3. Ontic AI {'&'} Workflow Automation</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Context-aware natural language summarization, automated case risk scoring, identity resolution, and task dispatch routing.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
                <Icons.Activity />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">4. Metrics {'&'} Executive Reporting</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Show leadership concrete ROI. Track incident volume trends, cost avoidance, time-to-mitigate, and compliance metrics.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
                <Icons.Lock />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">5. Governance {'&'} Access Control</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                FedRAMP® Moderate, SOC 2, HIPAA, and GDPR compliant infrastructure ensuring multi-tenant isolation and strict data confidentiality.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-white border border-orange-200 flex flex-col justify-center">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Deploy in Weeks, Not Years</h3>
              <p className="text-sm text-slate-600 mb-4">
                No-code configuration allows you to adapt workflows and intake forms without relying on internal IT sprints.
              </p>
              <RequestDemoButton className="text-xs font-bold text-[#E96822] hover:text-[#D15A16] uppercase tracking-wider inline-flex items-center gap-1 w-fit">
                Schedule Platform Architecture Review <Icons.ChevronRight />
              </RequestDemoButton>
            </div>
          </div>
        </div>

        {/* 60+ Ecosystem Integrations Explorer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 border-t border-slate-200">
          <IntegrationsExplorer />
        </div>
      </div>
    </div>
  );
}
