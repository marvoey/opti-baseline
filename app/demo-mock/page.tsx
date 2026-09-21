import Link from 'next/link';
import { Icons } from './_components/icons';
import { RequestDemoButton } from './_components/request-demo-button';
import { HomeHeroPreview } from './_components/home-hero-preview';
import { ProgramsShowcase } from './_components/programs-showcase';
import { TestimonialSlider } from './_components/testimonial-slider';

const BRAND_LOGOS = ['SALESFORCE', 'CHIPOTLE', 'WASHINGTON POST', 'HONEYWELL', 'MEIJER', 'EXPEDIA GROUP'];

// =========================================================================
// HOME PAGE (Ontic Main Page Reproduction) — server-rendered
// =========================================================================
export default function HomePage() {
  return (
    <div>
      {/* HERO SECTION (dark navy, matches ontic.co's header/hero band) */}
      <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32 bg-gradient-to-b from-[#0A0E1A] via-[#0D1426] to-[#0A0E1A]">
        {/* Subtle decorative grid background & glow */}
        <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#E96822]/10 blur-[130px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Copy */}
            <div className="lg:col-span-6 text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-[#E96822] text-xs font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-[#E96822] animate-pulse"></span>
                Connected Intelligence for Leading Security Teams
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                One <span className="text-[#E96822]">connected</span> view of your entire security operation
              </h1>

              <p className="text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
                Ontic brings your data, workflows, and teams together so you can spot risk sooner, accelerate investigations, and act with decisive confidence.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <RequestDemoButton className="bg-[#E96822] hover:bg-[#D15A16] text-white font-bold px-7 py-3.5 rounded-lg text-base transition-all shadow-xl shadow-orange-600/30 flex items-center justify-center gap-2 hover:-translate-y-0.5">
                  Contact Us
                  <Icons.ChevronRight />
                </RequestDemoButton>
                <Link
                  href="/demo-mock/platform"
                  className="border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 font-semibold px-6 py-3.5 rounded-lg text-base transition-all flex items-center justify-center gap-2.5 backdrop-blur-sm"
                >
                  <span className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[#E96822]">
                    <Icons.Play />
                  </span>
                  See Ontic In Action
                </Link>
              </div>

              {/* Badges / Micro Social Proof */}
              <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Icons.Check />
                  <span>FedRAMP® Moderate Authorized</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icons.Check />
                  <span>SOC 2 Type II and ISO 27001</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icons.Check />
                  <span>Frost Radar™ Growth and Innovation Leader</span>
                </div>
              </div>
            </div>

            {/* Hero Right: Live Interactive Security Ops Preview */}
            <div className="lg:col-span-6">
              <HomeHeroPreview />
            </div>
          </div>
        </div>
      </section>

      {/* CLIENT LOGO STRIP (light body section) */}
      <section className="py-12 border-y border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-6">
            TRUSTED BY HUNDREDS OF GLOBAL ORGANIZATIONS AND FORTUNE 500 LEADERS
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center opacity-80 grayscale hover:grayscale-0 transition-all">
            {BRAND_LOGOS.map((brand) => (
              <div key={brand} className="py-2 px-4 rounded border border-slate-200 bg-slate-50 text-sm font-extrabold tracking-wider text-slate-500">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE PROBLEM / ACCIDENTAL SILOS SECTION (light body section) */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-[#E96822] font-bold text-xs uppercase tracking-wider">The Real Operational Challenge</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
              Disconnected tools keep security teams reactive
            </h2>
            <p className="text-slate-500 text-base mt-4 leading-relaxed">
              When threats arise across physical facilities, digital harassment, and executive travel, security teams waste critical hours stitching together 10 different tools and spreadsheets.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-7 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-[#E96822] flex items-center justify-center mb-5">
                <Icons.Network />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Connected Data</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                Unify 25+ data feeds — from public record databases and social listening to access control logs — into one authoritative record.
              </p>
              <div className="text-xs text-[#E96822] font-semibold flex items-center gap-1">
                Zero data silos <Icons.ChevronRight />
              </div>
            </div>

            <div className="p-7 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center mb-5">
                <Icons.Activity />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Streamlined Operations</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                Automate repetitive alert triage, field tasking, and incident logging so security analysts focus on actionable defense.
              </p>
              <div className="text-xs text-cyan-600 font-semibold flex items-center gap-1">
                50% faster resolution <Icons.ChevronRight />
              </div>
            </div>

            <div className="p-7 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-5">
                <Icons.Sparkles />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Elevated AI Insights</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                Ontic AI extracts patterns across cases, links disguised persons of interest, and generates board-ready summaries automatically.
              </p>
              <div className="text-xs text-purple-600 font-semibold flex items-center gap-1">
                Proactive intelligence <Icons.ChevronRight />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE PROGRAMS SHOWCASE TABS (light body section) */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-[#E96822] font-bold text-xs uppercase tracking-wider">Programs We Serve</span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Tailored for every security discipline</h2>
            </div>
            <Link
              href="/demo-mock/solutions"
              className="mt-4 md:mt-0 text-sm font-semibold text-[#E96822] hover:underline flex items-center gap-1"
            >
              Explore All Solutions <Icons.ChevronRight />
            </Link>
          </div>

          <ProgramsShowcase />
        </div>
      </section>

      {/* CLIENT TESTIMONIAL SLIDER (light body section) */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TestimonialSlider />
        </div>
      </section>

      {/* CALL TO ACTION BANNER (dark navy bookend before the footer) */}
      <section className="py-20 bg-gradient-to-b from-[#0A0E1A] to-[#070A13]">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="text-xs uppercase font-bold tracking-widest text-[#E96822] block mb-2">Modernize Your Operation</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
            Ready to transform your physical security program?
          </h2>
          <p className="text-slate-300 text-base max-w-2xl mx-auto mb-8">
            Join hundreds of forward-thinking enterprise security leaders using Ontic to streamline case workflows and anticipate risks.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <RequestDemoButton className="bg-[#E96822] hover:bg-[#D15A16] text-white font-bold px-8 py-3.5 rounded-lg text-base shadow-xl shadow-orange-600/30">
              Request a Custom Demo
            </RequestDemoButton>
            <Link
              href="/demo-mock/platform"
              className="border border-slate-700 bg-slate-800 text-slate-200 hover:text-white font-semibold px-8 py-3.5 rounded-lg text-base"
            >
              Explore Ontic Platform
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
