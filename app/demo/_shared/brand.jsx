'use client';

import React from 'react';

/* H&R Block look and feel shared by the demo prototypes (same values as app/demo/prototype/page.jsx).
   Global palette from the official brand portal (hrblock.com/brandportal). Logo Green is for the logo only. */
export const BRAND = 'H&R Block';

export const HRB = {
  green: '#005D1F',      // Global Green (PANTONE 349C) – primary, AAA-accessible
  dark: '#003512',       // Global Dark Green (PANTONE 567C)
  sand: '#F6F4E9',       // Global Sand (PANTONE 7527C) – neutral backgrounds
  warm: '#F8F8F5',       // Warm White
  black: '#262626',      // Black
  neon: '#00E95C',       // HRB Neon (PANTONE 7479C) – highlights and CTAs
  logo: '#14AA40',       // Logo Green (PANTONE 2422C) – logo only
};

export const Btn = ({ children, onClick, kind = 'primary', disabled, className = '' }) => {
  const k = {
    primary: 'bg-green-700 text-white hover:bg-green-800',
    dark: 'hrb-dark text-white hover:opacity-90',
    ghost: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50',
  }[kind];
  return (
    <button onClick={onClick} disabled={disabled} className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${k} ${className}`}>
      {children}
    </button>
  );
};

export const Pill = ({ children, cls = 'bg-slate-100 text-slate-700' }) => (
  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>{children}</span>
);

/* Browser-chrome frame used around simulated tools. */
export function Frame({ url, label, children, accent = 'bg-slate-100' }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className={`flex items-center gap-2 border-b border-slate-200 px-3 py-2 ${accent}`}>
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        <div className="ml-2 flex-1 truncate rounded bg-white px-2 py-0.5 text-xs text-slate-500">{url}</div>
        {label && <span className="text-xs font-semibold text-slate-600">{label}</span>}
      </div>
      <div>{children}</div>
    </div>
  );
}

export function Spinner() {
  return <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-green-700 align-middle" />;
}

/* Brand theme: remaps stock Tailwind green/slate classes to the H&R Block palette, scoped under .hrb-app. */
export const BRAND_CSS = `
  .hrb-app, .font-sans { font-family: Graphik, "Helvetica Neue", Helvetica, Arial, system-ui, sans-serif !important; }
  .hrb-app .font-mono, .hrb-app pre, .hrb-app code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace !important; }
  .hrb-app .font-extrabold { font-weight: 700 !important; }
  .hrb-dark { background-color: ${HRB.dark} !important; }
  .hrb-sand { background-color: ${HRB.sand} !important; }
  .hrb-line { border-color: #E4E0CF !important; }
  .hrb-motif { position: relative; overflow: hidden; }
  .hrb-motif::after { content: ""; position: absolute; right: 28px; top: 28px; width: 18px; height: 18px; background: ${HRB.neon}; }
  .hrb-app .bg-slate-100, .hrb-app .bg-slate-50 { background-color: ${HRB.warm} !important; }
  .hrb-app .text-slate-900 { color: ${HRB.black} !important; }
  .hrb-app .bg-green-50 { background-color: ${HRB.sand} !important; }
  .hrb-app .bg-green-100 { background-color: #DCEBDF !important; }
  .hrb-app .bg-green-400, .hrb-app .bg-green-500 { background-color: ${HRB.neon} !important; }
  .hrb-app .bg-green-600, .hrb-app .bg-green-700, .hrb-app .bg-green-800 { background-color: ${HRB.green} !important; }
  .hrb-app .hover\\:bg-green-800:hover, .hrb-app .bg-green-900 { background-color: ${HRB.dark} !important; }
  .hrb-app .text-green-700, .hrb-app .text-green-800 { color: ${HRB.green} !important; }
  .hrb-app .text-green-900 { color: ${HRB.dark} !important; }
  .hrb-app .text-green-100 { color: ${HRB.sand} !important; }
  .hrb-app .text-green-200, .hrb-app .text-green-300 { color: ${HRB.neon} !important; }
  .hrb-app .border-green-100, .hrb-app .border-green-200 { border-color: #CFE3D4 !important; }
  .hrb-app .border-green-600, .hrb-app .hover\\:border-green-600:hover { border-color: ${HRB.green} !important; }
  .hrb-app .ring-green-200 { --tw-ring-color: ${HRB.neon} !important; }
  .hrb-app .border-t-green-700 { border-top-color: ${HRB.green} !important; }
`;
export function BrandStyles() { return <style>{BRAND_CSS}</style>; }
