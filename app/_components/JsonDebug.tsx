'use client';

import { useState } from 'react';

interface JsonObject { [key: string]: JsonValue }
type JsonValue = string | number | boolean | null | JsonValue[] | JsonObject;

function JsonNode({ value, depth = 0 }: { value: JsonValue; depth?: number }) {
  const [open, setOpen] = useState(depth < 2);

  if (value === null) return <span className="text-slate-500">null</span>;
  if (typeof value === 'boolean') return <span className="text-blue-400">{String(value)}</span>;
  if (typeof value === 'number') return <span className="text-yellow-300">{value}</span>;
  if (typeof value === 'string') return <span className="text-green-400">"{value}"</span>;

  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-slate-500">[]</span>;
    return (
      <span>
        <button
          onClick={() => setOpen(o => !o)}
          className="text-slate-400 hover:text-white"
        >
          {open ? '▾' : '▸'} <span className="text-slate-500">[{value.length}]</span>
        </button>
        {open && (
          <div className="ml-4 border-l border-slate-700 pl-3">
            {value.map((item, i) => (
              <div key={i} className="my-px">
                <span className="text-slate-500">{i}: </span>
                <JsonNode value={item as JsonValue} depth={depth + 1} />
              </div>
            ))}
          </div>
        )}
      </span>
    );
  }

  const entries = Object.entries(value as Record<string, JsonValue>);
  if (entries.length === 0) return <span className="text-slate-500">{'{}'}</span>;

  return (
    <span>
      <button
        onClick={() => setOpen(o => !o)}
        className="text-slate-400 hover:text-white"
      >
        {open ? '▾' : '▸'} <span className="text-slate-500">{'{'}…{'}'}</span>
      </button>
      {open && (
        <div className="ml-4 border-l border-slate-700 pl-3">
          {entries.map(([k, v]) => (
            <div key={k} className="my-px">
              <span className="text-purple-400">"{k}"</span>
              <span className="text-slate-500">: </span>
              <JsonNode value={v as JsonValue} depth={depth + 1} />
            </div>
          ))}
        </div>
      )}
    </span>
  );
}

export default function JsonDebug({ value, label }: { value: unknown; label?: string }) {
  return (
    <div className="overflow-auto rounded bg-slate-950 p-4 font-mono text-xs leading-5 text-slate-200 ring-1 ring-slate-800">
      {label && <p className="mb-2 text-slate-500">{label}</p>}
      <JsonNode value={value as JsonValue} />
    </div>
  );
}
