'use client';

import { ArrowDown, ArrowUp } from 'lucide-react';
import { CONNECTORS, LAYERS, slugFor, variantLabel } from '../_data/layers';
import { usePresentation } from '../_lib/presentation';

function ConnectorPill({ index, dir }: { index: number; dir: 'up' | 'down' }) {
  const c = CONNECTORS[index];
  const Arrow = dir === 'down' ? ArrowDown : ArrowUp;
  return (
    <div className="flex flex-col items-center">
      <div className={`h-6 w-px bg-gradient-to-b ${c.line}`} />
      <div className="bg-slate-900 border border-slate-700/80 px-5 py-2 rounded-full text-sm font-mono text-slate-200 flex items-center gap-2 shadow-lg">
        <c.icon className={`w-4 h-4 animate-pulse ${c.iconColor}`} />
        <span>{c.text}</span>
        <Arrow className="w-4 h-4 text-slate-400" />
      </div>
      <div className={`h-6 w-px bg-gradient-to-b ${c.line}`} />
    </div>
  );
}

export function LayerView({ index }: { index: 0 | 1 | 2 }) {
  const layer = LAYERS[index];
  const { persona, employer } = usePresentation();
  const a = layer.accent;

  return (
    <div className="space-y-2">
      {index > 0 && <ConnectorPill index={index - 1} dir="up" />}

      <section className={`rounded-2xl border bg-slate-900/90 p-8 relative overflow-hidden ${a.border}`}>
        <div className={`absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl pointer-events-none ${a.glow}`} />

        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className={`p-3.5 rounded-xl border ${a.iconBox}`}>
              <layer.icon className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-sm uppercase font-bold tracking-wider ${a.label}`}>Layer {layer.n}</span>
                <span className="text-slate-500 text-sm">•</span>
                <span className="text-sm text-slate-400">{layer.tag}</span>
              </div>
              <h2 className="text-3xl font-bold text-white">{layer.title}</h2>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm bg-slate-800/80 border border-slate-700/60 px-4 py-1.5 rounded-full text-slate-300">
            <layer.owner.icon className={`w-4 h-4 ${layer.owner.color}`} />
            <span>{layer.owner.text}</span>
          </div>
        </div>

        <div className={`grid grid-cols-1 gap-4 ${layer.cols}`}>
          {layer.cards.map((card) => (
            <div key={card.title} className="bg-slate-950/70 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center gap-2.5 text-lg font-semibold text-slate-100 mb-3">
                <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                <span>{card.title}</span>
              </div>
              <p className="text-base text-slate-400 leading-relaxed [&_strong]:text-slate-200">{card.body(employer)}</p>
              <div className={`mt-4 flex items-center gap-2 text-sm font-mono ${a.foot}`}>
                {card.foot.map((f, i) => (
                  <span key={f} className="flex items-center gap-2">
                    {i > 0 && <span>•</span>}
                    {f}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {index === 0 && (
          <div className="mt-6 pt-4 border-t border-slate-800/70 flex items-center justify-between flex-wrap gap-2 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Simulated Active Variant:</span>
              <span className="text-white font-medium">{variantLabel(persona)}</span>
            </div>
            <span className="text-slate-500 font-mono text-xs">Slug: {slugFor(employer, persona)}</span>
          </div>
        )}
      </section>

      {index < CONNECTORS.length && <ConnectorPill index={index} dir="down" />}
    </div>
  );
}
