import { ArrowRight, Sparkles } from "lucide-react";
import type { LocaleInfo, LocaleKey, PersonaInfo, VisitorProfile } from "./types";

interface SimulatedViewportProps {
  visitorProfile: VisitorProfile;
  selectedLang: LocaleKey;
  currentPersona: PersonaInfo;
  currentLocale: LocaleInfo;
  isResolvingProfile: boolean;
  isLocalizing: boolean;
}

export function SimulatedViewport({
  visitorProfile,
  selectedLang,
  currentPersona,
  currentLocale,
  isResolvingProfile,
  isLocalizing,
}: SimulatedViewportProps) {
  const isRefreshing = isResolvingProfile || isLocalizing;

  return (
    <div className="rounded-t-3xl border-2 border-b-0 border-[#102412] bg-[#070B14] text-white overflow-hidden shadow-2xl relative">
      {/* Simulated Browser Chrome */}
      <div className="bg-[#0B1224] px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          <span className="text-[11px] font-mono text-slate-400 pl-2">
            https://nielseniq.com/global/{selectedLang}/
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-[#00E5FF]">
          <span>
            Graph AST: {visitorProfile.toUpperCase()} &bull; {selectedLang.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Authentic NielsenIQ Header */}
      <div className="border-b border-slate-800/80 bg-[#070B14]/95 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-black tracking-tight text-white flex items-baseline">
            NIQ<span className="w-2 h-2 rounded-full bg-[#00E5FF] ml-0.5 inline-block" />
          </span>
          <div className="hidden md:flex items-center space-x-6 text-xs font-bold text-slate-300">
            <span className="hover:text-white cursor-pointer">Solutions</span>
            <span className="hover:text-white cursor-pointer">Industries</span>
            <span className="hover:text-white cursor-pointer">Insights</span>
            <span className="text-[#00E5FF] cursor-pointer">Optiq AI</span>
            <span className="hover:text-white cursor-pointer">About</span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center gap-1">
            <span>{currentLocale.flag}</span>
            <span className="uppercase">{selectedLang}</span>
          </span>
          <button className="px-4 py-1.5 rounded-full bg-[#2C6CF6] text-white font-bold hover:bg-blue-600 transition-all">
            Contact Us
          </button>
        </div>
      </div>

      {/* Dynamic Hero Section */}
      <div
        className={`p-8 sm:p-12 space-y-6 relative overflow-hidden bg-linear-to-b from-[#070B14] via-[#0A1224] to-[#040812] transition-opacity duration-200 ${
          isRefreshing ? "opacity-60" : "opacity-100"
        }`}
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#2C6CF6]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-xs font-bold text-[#00E5FF]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{currentPersona.heroTag}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight transition-all">
            {currentPersona.headline}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            {currentPersona.subhead}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button className="px-6 py-3 rounded-full bg-[#2C6CF6] hover:bg-blue-600 text-white font-bold text-xs transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2">
              <span>{currentPersona.cta}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button className="px-6 py-3 rounded-full bg-transparent border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold text-xs transition-all">
              View Market Coverage
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80 text-xs">
          <div className="border-l-2 border-[#00E5FF] pl-3">
            <p className="text-2xl font-black text-white">{currentLocale.stat1}</p>
            <p className="text-slate-400 text-[11px]">{currentLocale.stat1Lbl}</p>
          </div>
          <div className="border-l-2 border-[#2C6CF6] pl-3">
            <p className="text-2xl font-black text-[#00E5FF]">90+</p>
            <p className="text-slate-400 text-[11px]">Countries with transaction coverage</p>
          </div>
          <div className="border-l-2 border-[#00E5FF] pl-3">
            <p className="text-2xl font-black text-white">{currentLocale.stat2}</p>
            <p className="text-slate-400 text-[11px]">{currentLocale.stat2Lbl}</p>
          </div>
          <div className="border-l-2 border-[#2C6CF6] pl-3">
            <p className="text-2xl font-black text-white">3.1T</p>
            <p className="text-slate-400 text-[11px]">Data records processed weekly</p>
          </div>
        </div>
      </div>
    </div>
  );
}
