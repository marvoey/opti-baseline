import { Eye, EyeOff, Terminal } from "lucide-react";
import type { TeaserStep, TelemetryLog } from "./types";

const TEASERS: { step: TeaserStep; label: string }[] = [
  { step: 1, label: "Teaser 1: ODP Recognition" },
  { step: 2, label: "Teaser 2: 10-Market Scale" },
  { step: 3, label: "Teaser 3: Zero-CSV Ingestion" },
];

interface ControlBarProps {
  activeTeaser: TeaserStep;
  onTeaserChange: (step: TeaserStep) => void;
  presenterMode: boolean;
  onPresenterModeChange: (value: boolean) => void;
  showConsole: boolean;
  onShowConsoleChange: (value: boolean) => void;
  telemetryLogs: TelemetryLog[];
}

export function ControlBar({
  activeTeaser,
  onTeaserChange,
  presenterMode,
  onPresenterModeChange,
  showConsole,
  onShowConsoleChange,
  telemetryLogs,
}: ControlBarProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-[#7DDD3D]/40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#E4F0DA] px-3 py-1.5 rounded-full border border-[#7DDD3D]/50 text-xs font-bold text-[#102412]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#3AB533] animate-pulse" />
            Sandler Micro-Fulfillment
          </div>

          <div className="flex items-center bg-[#F4F9F0] p-1 rounded-xl border border-[#7DDD3D]/30">
            {TEASERS.map((teaser) => (
              <button
                key={teaser.step}
                onClick={() => onTeaserChange(teaser.step)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeTeaser === teaser.step
                    ? "bg-[#3AB533] text-white shadow-sm"
                    : "text-slate-600 hover:text-[#102412]"
                }`}
              >
                <span>{teaser.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onShowConsoleChange(!showConsole)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              showConsole
                ? "bg-[#102412] text-[#ABFF44] border-[#102412]"
                : "bg-white text-slate-700 border-slate-300 hover:bg-[#E4F0DA]"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Live API Logs</span>
          </button>

          <button
            onClick={() => onPresenterModeChange(!presenterMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              presenterMode
                ? "bg-[#ABFF44] text-[#102412] border-[#7DDD3D] shadow-sm"
                : "bg-white text-slate-700 border-slate-300 hover:bg-[#E4F0DA]"
            }`}
          >
            {presenterMode ? <Eye className="w-3.5 h-3.5 text-[#3AB533]" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{presenterMode ? "Presenter Cues (ON)" : "Client View (Clean)"}</span>
          </button>
        </div>
      </div>

      {showConsole && (
        <div className="bg-[#102412] text-slate-200 border-t border-slate-800 px-4 py-2.5 font-mono text-[11px] animate-fadeIn">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap">
              <span className="text-[#ABFF44] font-bold">EDGE TELEMETRY:</span>
              {telemetryLogs.slice(0, 2).map((log, i) => (
                <span key={i} className="text-slate-300">
                  <span className="text-slate-500">[{log.ts}]</span>{" "}
                  <strong className="text-cyan-300">{log.type}:</strong> {log.msg}
                </span>
              ))}
            </div>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              20ms Latency
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
