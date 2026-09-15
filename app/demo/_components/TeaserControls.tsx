import { Database, Globe, Layers } from "lucide-react";
import type { LocaleKey, PluginFilter, TeaserStep, VisitorProfile } from "./types";

const LANGUAGES: { key: LocaleKey; flag: string; label: string }[] = [
  { key: "en", flag: "🇺🇸", label: "Global (EN)" },
  { key: "de", flag: "🇩🇪", label: "Germany (DE)" },
  { key: "fr", flag: "🇫🇷", label: "France (FR)" },
  { key: "ja", flag: "🇯🇵", label: "Japan (JA)" },
];

interface TeaserControlsProps {
  activeTeaser: TeaserStep;
  visitorProfile: VisitorProfile;
  onPersonaChange: (profile: VisitorProfile) => void;
  selectedLang: LocaleKey;
  onLangChange: (lang: LocaleKey) => void;
  selectedPluginFilter: PluginFilter;
  onPluginFilterChange: (filter: PluginFilter) => void;
}

export function TeaserControls({
  activeTeaser,
  visitorProfile,
  onPersonaChange,
  selectedLang,
  onLangChange,
  selectedPluginFilter,
  onPluginFilterChange,
}: TeaserControlsProps) {
  return (
    <div className="rounded-2xl border border-[#7DDD3D]/50 bg-white p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
      {activeTeaser === 1 && (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#3AB533] flex items-center gap-1.5">
            <Database className="w-4 h-4" />
            Simulate Visitor Profile:
          </span>
          <div className="flex items-center gap-1.5 bg-[#E4F0DA] p-1 rounded-xl border border-[#7DDD3D]/40">
            <button
              onClick={() => onPersonaChange("anonymous")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                visitorProfile === "anonymous"
                  ? "bg-white text-[#102412] shadow-sm border border-[#7DDD3D]"
                  : "text-slate-600 hover:text-[#102412]"
              }`}
            >
              Current WPVIP (Anonymous)
            </button>
            <button
              onClick={() => onPersonaChange("cpg")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                visitorProfile === "cpg"
                  ? "bg-[#3AB533] text-white shadow-sm"
                  : "text-slate-600 hover:text-[#102412]"
              }`}
            >
              Enterprise CPG (Unilever)
            </button>
            <button
              onClick={() => onPersonaChange("retail")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                visitorProfile === "retail"
                  ? "bg-[#3AB533] text-white shadow-sm"
                  : "text-slate-600 hover:text-[#102412]"
              }`}
            >
              Omnichannel Retail (Walmart)
            </button>
          </div>
        </div>
      )}

      {activeTeaser === 2 && (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#3AB533] flex items-center gap-1.5">
            <Globe className="w-4 h-4" />
            Select Regional Market:
          </span>
          <div className="flex items-center gap-1.5 bg-[#E4F0DA] p-1 rounded-xl border border-[#7DDD3D]/40">
            {LANGUAGES.map((item) => (
              <button
                key={item.key}
                onClick={() => onLangChange(item.key)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedLang === item.key
                    ? "bg-[#3AB533] text-white shadow-sm"
                    : "text-slate-600 hover:text-[#102412]"
                }`}
              >
                <span>{item.flag}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTeaser === 3 && (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#3AB533] flex items-center gap-1.5">
            <Layers className="w-4 h-4" />
            Plugin Relief Filter:
          </span>
          <div className="flex items-center gap-1.5 bg-[#E4F0DA] p-1 rounded-xl border border-[#7DDD3D]/40 text-xs font-bold">
            <button
              onClick={() => onPluginFilterChange("all")}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedPluginFilter === "all"
                  ? "bg-[#3AB533] text-white shadow-sm"
                  : "text-slate-600 hover:text-[#102412]"
              }`}
            >
              All 9 Plugins ($84k Saved)
            </button>
            <button
              onClick={() => onPluginFilterChange("forms")}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedPluginFilter === "forms"
                  ? "bg-[#3AB533] text-white shadow-sm"
                  : "text-slate-600 hover:text-[#102412]"
              }`}
            >
              Forms &amp; Lead Ingestion
            </button>
            <button
              onClick={() => onPluginFilterChange("content")}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedPluginFilter === "content"
                  ? "bg-[#3AB533] text-white shadow-sm"
                  : "text-slate-600 hover:text-[#102412]"
              }`}
            >
              Content &amp; i18n
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        <span>
          Optimizely Graph Edge: <strong className="text-[#102412]">Sub-20ms Response</strong>
        </span>
      </div>
    </div>
  );
}
