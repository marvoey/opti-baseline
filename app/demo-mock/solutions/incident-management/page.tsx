import Link from 'next/link';
import { RequestDemoButton } from '../../_components/request-demo-button';
import { IncidentTriageBoard } from '../../_components/incident-triage-board';

// =========================================================================
// LANDING PAGE - INCIDENT MANAGEMENT — server-rendered
// =========================================================================
export default function IncidentManagementPage() {
  return (
    <div>
      {/* Incident Hero (dark navy bookend) */}
      <div className="bg-[#0A0E1A] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <span className="text-[#E96822] font-bold text-xs uppercase tracking-wider">Incident Management and Dispatch</span>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-2 leading-tight">
                Cut Incident Response Time by 50%
              </h1>
              <p className="text-slate-300 text-base mt-4 leading-relaxed">
                Transform chaotic security reports into structured, coordinated action. Connect every call, automated sensor alert, and field guard dispatch into a defensible system of record.
              </p>
              <div className="flex gap-4 mt-6">
                <RequestDemoButton className="bg-[#E96822] hover:bg-[#D15A16] text-white font-bold px-6 py-3 rounded-lg text-sm shadow-lg shadow-orange-600/30">
                  Schedule Incident Response Demo
                </RequestDemoButton>
                <Link
                  href="/demo-mock/solutions"
                  className="border border-slate-700 bg-slate-900 text-slate-300 px-6 py-3 rounded-lg text-sm hover:bg-slate-800"
                >
                  View Solutions
                </Link>
              </div>
            </div>

            {/* Interactive Incident Triage Console */}
            <IncidentTriageBoard />
          </div>
        </div>
      </div>

      {/* Metrics Banner (light body section) */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-3xl font-extrabold text-[#E96822]">50%</div>
              <div className="text-xs text-slate-500 mt-1 uppercase font-semibold">Faster Incident Response</div>
            </div>
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-3xl font-extrabold text-slate-900">200+</div>
              <div className="text-xs text-slate-500 mt-1 uppercase font-semibold">Investigations Closed in 6 Mos</div>
            </div>
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-3xl font-extrabold text-slate-900">$2M+</div>
              <div className="text-xs text-slate-500 mt-1 uppercase font-semibold">Measurable Cost Avoidance</div>
            </div>
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-3xl font-extrabold text-emerald-600">100%</div>
              <div className="text-xs text-slate-500 mt-1 uppercase font-semibold">Defensible Audit Trail</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
