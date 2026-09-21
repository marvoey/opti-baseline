import Link from 'next/link';
import { Icons } from '../_components/icons';

const SOLUTION_CARDS = [
  {
    id: 'ep',
    title: 'Executive Protection',
    route: '/demo-mock/solutions/executive-protection',
    tag: 'Principal Safety',
    desc: 'Protect executives and high-profile individuals from digital harassment, physical stalking, and travel vulnerabilities.',
    capabilities: ['POI Management and Geofencing', 'Itinerary Risk Scoring', 'Mobile Agent Briefings'],
  },
  {
    id: 'im',
    title: 'Incident Management and Dispatch',
    route: '/demo-mock/solutions/incident-management',
    tag: 'Ops Response',
    desc: 'Cut response time by 50%. Centralize intake, dispatch security guards, and log tamper-evident post-incident audits.',
    capabilities: ['Field Response Dispatch', 'Dynamic Incident Triage', 'Pattern and Cluster Analysis'],
  },
  {
    id: 'ti',
    title: 'Threat Intelligence',
    route: '/demo-mock/solutions',
    tag: 'OSINT and Signals',
    desc: 'Surface real threats from noise. Aggregate multi-source open web, social media, and dark web indicators into verified intelligence.',
    capabilities: ['Identity Resolution', 'Dark Web and Social Harassment', 'Automated Threat Grading'],
  },
  {
    id: 'ci',
    title: 'Corporate Investigations',
    route: '/demo-mock/solutions',
    tag: 'Case Management',
    desc: 'Investigate smarter with ten tools in one platform. Build audit-proof case binders and prove risk reduction to the C-suite.',
    capabilities: ['Associates Relationship Graph', 'Evidence Locker and Chain of Custody', 'Executive Dossier Exports'],
  },
  {
    id: 'va',
    title: 'Risk and Vulnerability Assessments',
    route: '/demo-mock/platform',
    tag: 'Site Auditing',
    desc: 'Digitize facility site assessments. Replace clunky spreadsheets with standardized checklists and track corrective remediation.',
    capabilities: ['Standardized Physical Audits', 'Vulnerability Remediation Tracker', 'Board-Level Risk Heatmaps'],
  },
  {
    id: 'gsoc',
    title: 'GSOC Situational Awareness',
    route: '/demo-mock/platform',
    tag: 'Command Center',
    desc: 'Coordinate global operations with live feeds, geofenced threat alerts, and automated mass notifications in a single glass pane.',
    capabilities: ['Multi-Monitor Video Wall Sync', 'Emergency Broadcasts', 'VMS and Access Control Linking'],
  },
];

// =========================================================================
// SOLUTIONS OVERVIEW PAGE (Matrix & Program Index) — server-rendered
// =========================================================================
export default function SolutionsOverviewPage() {
  return (
    <div>
      {/* Page-title band (dark navy bookend) */}
      <div className="bg-[#0A0E1A] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-[#E96822] font-bold text-xs uppercase tracking-wider">Solutions Catalog</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-2">
              Manage Threats and Mitigate Risks Across Your Enterprise
            </h1>
            <p className="text-slate-300 text-base mt-4 leading-relaxed">
              Whether protecting a C-suite leader overseas or managing thousands of daily facility alerts, Ontic gives security teams the specialized tools they need.
            </p>
          </div>
        </div>
      </div>

      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SOLUTION_CARDS.map((card) => (
              <div
                key={card.id}
                className="rounded-2xl bg-white border border-slate-200 shadow-sm p-7 flex flex-col justify-between hover:border-orange-300 hover:shadow-lg transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#E96822] bg-orange-500/10 px-2.5 py-1 rounded">
                      {card.tag}
                    </span>
                    <div className="text-slate-400 group-hover:text-[#E96822] transition-colors">
                      <Icons.Shield />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2">{card.title}</h3>
                  <p className="text-sm text-slate-500 mb-6 leading-relaxed">{card.desc}</p>

                  <div className="space-y-2 mb-6">
                    {card.capabilities.map((cap) => (
                      <div key={cap} className="text-xs text-slate-700 flex items-center gap-2">
                        <Icons.Check />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <Link
                    href={card.route}
                    className="w-full text-xs font-bold text-[#E96822] hover:text-[#D15A16] flex items-center justify-between group-hover:translate-x-1 transition-all"
                  >
                    <span>Explore {card.title}</span>
                    <Icons.ChevronRight />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
