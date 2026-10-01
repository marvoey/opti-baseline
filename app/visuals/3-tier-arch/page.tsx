'use client';

import Link from 'next/link';
import { ArrowDown, ChevronRight } from 'lucide-react';
import { CONNECTORS, LAYERS } from './_data/layers';

// Overview: one compact row per layer. Click through to zoom into a layer.
export default function CCOArchitectureOverview() {
  return (
    <div className="max-w-6xl w-full mx-auto h-full flex flex-col justify-between">
      {LAYERS.map((layer, i) => {
        const a = layer.accent;
        const c = CONNECTORS[i];
        return (
          <div key={layer.n} className="flex-1 min-h-0 flex flex-col">
            <Link
              href={layer.path}
              className={`group flex-1 flex items-center rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 relative overflow-hidden transition-all ${a.hover}`}
            >
              <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none ${a.glow}`} />
              <div className="flex items-center gap-4 w-full">
                <div className={`p-3 rounded-xl border ${a.iconBox}`}>
                  <layer.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs uppercase font-bold tracking-wider ${a.label}`}>Layer {layer.n}</span>
                    <span className="text-slate-500 text-xs">•</span>
                    <span className="text-xs text-slate-400">{layer.tag}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">{layer.title}</h2>
                  <p className="text-sm text-slate-400 mt-1">{layer.summary}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
              </div>
            </Link>

            {c && (
              <div className="flex flex-col items-center">
                <div className={`h-2 w-px bg-gradient-to-b ${c.line}`} />
                <div className="bg-slate-900 border border-slate-700/80 px-4 py-1.5 rounded-full text-xs font-mono text-slate-300 flex items-center gap-2 shadow-lg">
                  <c.icon className={`w-3.5 h-3.5 ${c.iconColor}`} />
                  <span>{c.label}</span>
                  <ArrowDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div className={`h-2 w-px bg-gradient-to-b ${c.line}`} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
