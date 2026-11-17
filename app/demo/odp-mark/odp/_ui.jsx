'use client';

import React, { useState } from 'react';

/* Shared look of the ODP + Web Experimentation demo: H&R Block brand sheet and small UI primitives.
   Used by the audience window (page.jsx) and the presenter window (_presenter.jsx / _reference.jsx). */

/* =====================================================================
   UI PRIMITIVES
   Brand tokens (H&R Block): Global Green #005D1F, Global Dark Green #003512,
   Global Sand #F6F4E9, Warm White #F8F8F5, Black #262626, HRB Neon #00E95C.
   Layout uses Tailwind utilities; only brand colours live in this small sheet.
   ===================================================================== */
export const CSS = `
.hb-root{font-family:Graphik,"Helvetica Neue",Helvetica,Arial,system-ui,sans-serif;color:#262626;background:#F8F8F5;line-height:1.5;min-height:100%}
.hb-root *{box-sizing:border-box}
:where(.hb-root) :where(h1,h2,h3,h4,p,ul,ol,pre,figure){margin:0}
:where(.hb-root) :where(ul,ol){padding:0;list-style:none}
.hb-root .list-disc{list-style:disc}.hb-root .list-decimal{list-style:decimal}
.hb-root .hb-btop{border-top:1px solid #E4E0CC}
:where(.hb-root) :where(h1,h2,h3,h4){font-weight:700;letter-spacing:-0.01em}
:where(.hb-root) :where(table){border-collapse:collapse}
:where(.hb-root) :where(button,input,select){font:inherit;color:inherit}
.hb-bg-green{background:#005D1F}.hb-bg-dark{background:#003512}.hb-bg-sand{background:#F6F4E9}.hb-bg-warm{background:#F8F8F5}.hb-bg-white{background:#fff}.hb-bg-neon{background:#00E95C}
.hb-tx-green{color:#005D1F}.hb-tx-dark{color:#003512}.hb-tx-white{color:#fff}.hb-tx-neon{color:#00E95C}.hb-tx-sand{color:#F6F4E9}.hb-tx-muted{color:#5B5B55}.hb-tx-ink{color:#262626}
.hb-card{background:#fff;border:1px solid #E4E0CC;border-radius:16px}
.hb-card-sand{background:#F6F4E9;border:1px solid #E4E0CC;border-radius:16px}
.hb-card-dark{background:#003512;color:#F6F4E9;border-radius:16px}
.hb-rule{border-color:#E4E0CC}
.hb-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:9999px;padding:9px 18px;font-weight:600;font-size:14px;line-height:1.2;border:2px solid transparent;cursor:pointer;transition:background .15s,color .15s,border-color .15s,filter .15s;font-family:inherit}
.hb-btn-primary{background:#005D1F;color:#fff}.hb-btn-primary:hover{background:#003512}
.hb-btn-neon{background:#00E95C;color:#003512}.hb-btn-neon:hover{filter:brightness(.92)}
.hb-btn-outline{background:transparent;border-color:#005D1F;color:#005D1F}.hb-btn-outline:hover{background:#005D1F;color:#fff}
.hb-btn-outline-light{background:transparent;border-color:#fff;color:#fff}.hb-btn-outline-light:hover{background:rgba(255,255,255,.14)}
.hb-btn-sm{padding:6px 13px;font-size:13px}
.hb-btn:disabled{opacity:.4;cursor:not-allowed}
.hb-btn:focus-visible,.hb-tab:focus-visible,.hb-input:focus-visible,.hb-step:focus-visible,.hb-row:focus-visible,.hb-pick:focus-visible{outline:3px solid #005D1F;outline-offset:2px}
.hb-dark-zone .hb-btn:focus-visible,.hb-dark-zone .hb-tab:focus-visible{outline-color:#00E95C}
.hb-tab{border-radius:9999px;padding:9px 16px;font-size:14px;font-weight:600;color:#F6F4E9;background:transparent;border:2px solid rgba(246,244,233,.35);cursor:pointer;font-family:inherit;white-space:nowrap}
.hb-tab:hover{background:rgba(255,255,255,.1)}
.hb-tab[aria-selected="true"]{background:#00E95C;color:#003512;border-color:#00E95C}
.hb-step{border-radius:12px;padding:8px 12px;font-size:13px;font-weight:600;color:#005D1F;background:#fff;border:1.5px solid #CFCBB5;cursor:pointer;text-align:left;font-family:inherit}
.hb-step:hover{border-color:#005D1F}
.hb-step[aria-current="step"]{background:#005D1F;color:#fff;border-color:#005D1F}
.hb-step[data-done="true"]{background:#F6F4E9}
.hb-step[aria-current="step"][data-done="true"]{background:#005D1F}
.hb-chip{display:inline-flex;align-items:center;gap:4px;border-radius:9999px;padding:2px 10px;font-size:12px;font-weight:600;line-height:1.5;white-space:nowrap}
.hb-chip-sand{background:#F6F4E9;color:#003512;border:1px solid #DAD5BC}
.hb-chip-green{background:#005D1F;color:#fff}
.hb-chip-neon{background:#00E95C;color:#003512}
.hb-chip-dark{background:#003512;color:#F6F4E9}
.hb-chip-outline{background:#fff;color:#262626;border:1.5px solid #262626}
.hb-input{border:1.5px solid #CFCBB5;border-radius:10px;padding:6px 10px;background:#fff;font-size:14px;color:#262626;font-family:inherit;max-width:100%}
.hb-code{background:#003512;color:#F6F4E9;border-radius:12px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;line-height:1.6;padding:14px 16px;overflow:auto;white-space:pre;margin:0}
.hb-mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
.hb-th{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#5B5B55;text-align:left;padding:8px 10px;border-bottom:1.5px solid #E4E0CC}
.hb-td{padding:9px 10px;border-bottom:1px solid #EEEAD8;font-size:14px;vertical-align:top}
.hb-row{cursor:pointer}.hb-row:hover{background:#F6F4E9}
.hb-bar{height:12px;border-radius:9999px;background:#EDE9D6;overflow:hidden;display:flex}
.hb-pick{width:100%;text-align:left;border-radius:12px;border:1.5px solid #E4E0CC;background:#fff;padding:10px 12px;cursor:pointer;font-family:inherit;color:#262626}
.hb-pick:hover{border-color:#005D1F}
.hb-pick[aria-pressed="true"]{border-color:#005D1F;background:#F6F4E9;box-shadow:inset 4px 0 0 #005D1F}
.hb-changed{outline:2px dashed #00E95C;outline-offset:3px;border-radius:6px}
.hb-stage{border-radius:12px;border:1.5px solid #E4E0CC;background:#fff;padding:10px 12px}
.hb-stage[data-on="true"]{border-color:#005D1F;background:#F6F4E9}
.hb-num{display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:9999px;font-size:13px;font-weight:700;background:#EDE9D6;color:#003512;flex-shrink:0}
.hb-stage[data-on="true"] .hb-num{background:#005D1F;color:#fff}
.hb-scroll{scrollbar-width:thin}
@keyframes hb-in{from{opacity:0;transform:translateX(28px)}to{opacity:1;transform:none}}
@keyframes hb-fadeup{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.hb-slide-in{animation:hb-in .35s ease-out both}
.hb-fade{animation:hb-fadeup .4s ease-out both}
.hb-seg{flex:1;height:6px;padding:0;border:0;border-radius:9999px;background:rgba(246,244,233,.28);cursor:pointer}
.hb-seg:hover{background:rgba(246,244,233,.55)}
.hb-seg[data-done="true"]{background:#00E95C}
.hb-seg[aria-current="true"]{background:#fff}
.hb-seg:focus-visible{outline:3px solid #00E95C;outline-offset:2px}
.hb-dot{width:10px;height:10px;border-radius:9999px;background:rgba(246,244,233,.3)}
.hb-dot[data-on="true"]{background:#00E95C}
@media (prefers-reduced-motion: reduce){.hb-btn{transition:none}.hb-slide-in,.hb-fade{animation:none}}
`;

export function Chip({ children, tone = 'sand', title }) {
  const tones = { sand: 'hb-chip-sand', green: 'hb-chip-green', neon: 'hb-chip-neon', dark: 'hb-chip-dark', outline: 'hb-chip-outline' };
  return <span title={title} className={'hb-chip ' + tones[tone]}>{children}</span>;
}
export function Eyebrow({ children, light }) {
  return <div className={'text-xs font-semibold uppercase tracking-widest ' + (light ? 'hb-tx-neon' : 'hb-tx-green')}>{children}</div>;
}
export function SectionTitle({ eyebrow, title, children, light }) {
  return (
    <div className="mb-4">
      {eyebrow ? <Eyebrow light={light}>{eyebrow}</Eyebrow> : null}
      <h2 className={'mt-1 text-2xl md:text-3xl ' + (light ? 'hb-tx-white' : 'hb-tx-dark')}>{title}</h2>
      {children ? <p className={'mt-2 max-w-3xl text-base ' + (light ? 'hb-tx-sand' : 'hb-tx-muted')}>{children}</p> : null}
    </div>
  );
}
export function DocLink({ href, children }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className="font-semibold underline hb-tx-green">{children} {'\u2197'}</a>;
}
export function Callout({ title, children, dark, compact }) {
  return (
    <div className={(dark ? 'hb-card-dark' : 'hb-card-sand') + (compact ? ' p-3' : ' p-4')}>
      {title ? <div className={'text-sm font-bold ' + (dark ? 'hb-tx-neon' : 'hb-tx-dark')}>{title}</div> : null}
      <div className={'text-sm ' + (title ? 'mt-1 ' : '') + (dark ? 'hb-tx-sand' : 'hb-tx-ink')}>{children}</div>
    </div>
  );
}
export function Stat({ value, label, light }) {
  return (
    <div>
      <div className={'text-3xl font-bold md:text-4xl ' + (light ? 'hb-tx-neon' : 'hb-tx-green')}>{value}</div>
      <div className={'mt-1 text-sm ' + (light ? 'hb-tx-sand' : 'hb-tx-muted')}>{label}</div>
    </div>
  );
}
export function StackedBar({ segments }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  return (
    <div className="hb-bar" role="img" aria-label={segments.map((s) => s.label + ' ' + s.value).join(', ')}>
      {segments.map((s) => (
        <div key={s.label} title={s.label + ': ' + s.value} style={{ width: (s.value / total) * 100 + '%', background: s.color }} />
      ))}
    </div>
  );
}
export function CopyButton({ text, label = 'Copy' }) {
  const [done, setDone] = useState(false);
  const copy = () => {
    const finish = () => { setDone(true); setTimeout(() => setDone(false), 1400); };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(finish, finish);
        return;
      }
    } catch (e) { /* fall through */ }
    finish();
  };
  return <button type="button" className="hb-btn hb-btn-outline-light hb-btn-sm" onClick={copy}>{done ? 'Copied' : label}</button>;
}
export function Code({ code, label, maxH }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <div className="text-xs font-semibold uppercase tracking-wider hb-tx-muted">{label}</div>
        <span className="hb-bg-dark rounded-full"><CopyButton text={code} /></span>
      </div>
      <pre className="hb-code" style={maxH ? { maxHeight: maxH } : undefined}>{code}</pre>
    </div>
  );
}
export const TH = ({ children }) => <th className="hb-th">{children}</th>;
export const TD = ({ children, className = '' }) => <td className={'hb-td ' + className}>{children}</td>;
export function AttrRows({ rows }) {
  return (
    <div className="mt-1">
      {rows.map(([k, v]) => (
        <div key={k} className="flex items-center justify-between gap-3 py-1" style={{ borderBottom: '1px solid #EEEAD8' }}>
          <span className="hb-mono text-xs hb-tx-muted break-all">{k}</span>
          <span className="font-semibold">{v}</span>
        </div>
      ))}
    </div>
  );
}
