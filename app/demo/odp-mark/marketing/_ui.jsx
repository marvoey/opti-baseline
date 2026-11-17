'use client';

import React from 'react';

/* Shared look of the marketing demo (Optimizely Brand Pack): palette, fonts and the small UI pieces used by both
   the audience window (page.jsx) and the presenter window (_presenter.jsx). */

/* Optimizely Brand Pack palette */
export const C = {
  lf: "#ABFF44",
  go: "#3AB533",
  n3: "#E4F0DA",
  n2: "#EFF6E9",
  blue: "#91DBDA",
  fir: "#08251A",
  white: "#FFFFFF",
  e3: "#40A142",
  e4: "#2E8C45",
  e6: "#166E49",
  e8: "#0D593E",
};

export const FONT_CSS = `@import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@600;900&family=Roboto:wght@400;500;700&family=Roboto+Mono&display=swap');
.f-h{font-family:'Roboto Condensed','Arial Narrow',sans-serif;font-weight:900;letter-spacing:-0.03em;line-height:1;}
.f-h2{font-family:'Roboto Condensed','Arial Narrow',sans-serif;font-weight:900;letter-spacing:-0.02em;line-height:1.05;}
.f-h3{font-family:'Roboto Condensed','Arial Narrow',sans-serif;font-weight:600;letter-spacing:-0.02em;line-height:1.1;}
.f-sub{font-family:Roboto,Arial,sans-serif;font-weight:700;line-height:1.15;}
.f-b{font-family:Roboto,Arial,sans-serif;font-weight:400;line-height:1.35;}
.f-m{font-family:'Roboto Mono',ui-monospace,monospace;letter-spacing:0.03em;line-height:1.3;}
.f-btn{font-family:'Roboto Condensed','Arial Narrow',sans-serif;font-weight:600;letter-spacing:-0.01em;}
@keyframes odpIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.odp-in{animation:odpIn .35s ease-out both}
@keyframes odpPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}
.odp-pulse{animation:odpPulse 1s ease-in-out infinite}
@media (prefers-reduced-motion: reduce){.odp-in,.odp-pulse{animation:none}}`;

export function Btn({ children, onClick, kind = "primary", disabled, className = "" }) {
  const k = {
    primary: "bg-[#ABFF44] text-[#08251A]",
    dark: "bg-[#08251A] text-white",
    ghost: "bg-white text-[#08251A]",
    paste: "bg-[#91DBDA] text-[#08251A]",
  }[kind];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`f-btn inline-flex items-center gap-2 rounded-full border-2 border-[#08251A] px-4 py-1.5 text-sm transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 ${k} ${className}`}
    >
      {children}
    </button>
  );
}

export function Pill({ children, bg = C.n2, className = "" }) {
  return (
    <span className={`f-m inline-block whitespace-nowrap rounded-full border-2 border-[#08251A] px-2.5 py-0.5 text-[11px] uppercase text-[#08251A] ${className}`} style={{ background: bg }}>
      {children}
    </span>
  );
}

export function Eyebrow({ children, className = "" }) {
  return <p className={`f-m text-[11px] uppercase text-[#08251A] ${className}`}>{children}</p>;
}
