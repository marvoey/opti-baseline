"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const ReactJson = dynamic(() => import("@microlink/react-json-view"), { ssr: false });
import type { LogEntry } from "../_types";

const LEVEL_STYLES: Record<LogEntry["level"], { dot: string; label: string; detail: string }> = {
  info:    { dot: "bg-[#7DD3FC]",  label: "text-[#7DD3FC]",  detail: "text-gray-400" },
  success: { dot: "bg-green-400",  label: "text-green-400",  detail: "text-gray-400" },
  warn:    { dot: "bg-yellow-400", label: "text-yellow-300", detail: "text-gray-400" },
  error:   { dot: "bg-red-400",    label: "text-red-400",    detail: "text-gray-400" },
};

function formatTime(ts: number): string {
  const d = new Date(ts);
  return [
    String(d.getHours()).padStart(2, '0'),
    String(d.getMinutes()).padStart(2, '0'),
    String(d.getSeconds()).padStart(2, '0'),
  ].join(':') + '.' + String(d.getMilliseconds()).padStart(3, '0');
}

function tryParseJson(value: string): object | null {
  try {
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
    return null;
  } catch {
    return null;
  }
}

function EntryDetail({ detail, className }: { detail: string; className: string }) {
  const json = tryParseJson(detail);
  if (json) {
    return (
      <div className="pl-3.5 mt-1">
        <ReactJson
          src={json}
          theme="monokai"
          name={false}
          collapsed={1}
          displayDataTypes={false}
          displayObjectSize={false}
          enableClipboard={false}
          style={{ background: 'transparent', fontSize: '11px' }}
        />
      </div>
    );
  }
  return (
    <p className={`pl-3.5 break-all leading-relaxed ${className}`}>
      {detail}
    </p>
  );
}

export function DevPanel({
  logs,
  onClear,
}: {
  logs: LogEntry[];
  onClear: () => void;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="flex flex-col h-full bg-gray-950 border-r border-gray-800 font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-gray-300 font-bold tracking-wide uppercase text-[10px]">
            Dev Console
          </span>
        </div>
        <button
          onClick={onClear}
          className="text-gray-600 hover:text-gray-300 transition text-[10px] uppercase tracking-wide"
        >
          Clear
        </button>
      </div>

      {/* Log entries */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5">
        {logs.length === 0 ? (
          <p className="text-gray-700 text-[10px] uppercase tracking-wider mt-2">
            Waiting for activity…
          </p>
        ) : (
          logs.map((entry) => {
            const s = LEVEL_STYLES[entry.level];
            return (
              <div key={entry.id} className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
                  <span className={`font-semibold ${s.label}`}>{entry.label}</span>
                  <span className="text-gray-700 ml-auto">{formatTime(entry.ts)}</span>
                </div>
                {entry.detail && (
                  <EntryDetail detail={entry.detail} className={s.detail} />
                )}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
