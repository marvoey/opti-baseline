'use client';

import React, { useEffect, useState } from 'react';

/* Scene 3 · UI pieces shared by the scene page and the presenter clipboard window.
   Private folder file (leading underscore): not a route. */

export const Btn = ({ children, onClick, kind = 'primary', disabled }) => {
  const k = {
    primary: 'bg-green-700 text-white hover:bg-green-800',
    ghost: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50',
    paste: 'bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100',
    mark: 'bg-indigo-600 text-white hover:bg-indigo-700',
  }[kind];
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${k}`}>
      {children}
    </button>
  );
};

export function Frame({ url, label, accent, children }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className={`flex items-center gap-2 border-b border-slate-200 px-3 py-2 ${accent}`}>
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        <div className="ml-2 flex-1 truncate rounded bg-white px-2 py-0.5 text-xs text-slate-500">{url}</div>
        <span className="text-xs font-semibold text-slate-600">{label}</span>
      </div>
      {children}
    </div>
  );
}

/* Reveals `count` items one at a time while `run` is true; returns how many are visible. */
export function useReveal(count, run, ms = 450) {
  const [n, setN] = useState(0);
  // `run` only goes false -> true per mount (Reset remounts via key), so no reset is needed.
  useEffect(() => {
    if (!run) return undefined;
    const id = setInterval(() => setN((v) => (v >= count ? v : v + 1)), ms);
    return () => clearInterval(id);
  }, [run, count, ms]);
  return run ? n : 0;
}
