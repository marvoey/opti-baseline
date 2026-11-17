'use client';

import React, { useState, useEffect, useRef } from 'react';
import { siteConfig } from '@/lib/siteConfig';
import { SCENES, TIMELINE } from './_scenes';
import { openChannel, PRESENTER_URL, PRESENTER_WINDOW } from './_sync';

/* =====================================================================
   H&R Block · "Tuesday of Week 11" · clickable demo prototype
   Simulates every scene in the demo script (Section 11). All content,
   offices, audiences and results are SYNTHETIC.

   This window is the one you screen-share, so it shows only what the audience
   should see. Presenter notes, scene list, status tags, reset and the visitor's
   typed answer live in the presenter window (_presenter.jsx), opened with S.
   Scene script data: _scenes.js. Window link: _sync.js.
   ===================================================================== */

const BRAND = 'H&R Block';

/* H&R Block global palette, from the official brand portal (hrblock.com/brandportal).
   Logo Green is for the logo only; the design palette is Global Green, Dark Green, Sand and the HRB neon accent. */
const HRB = {
  green: '#005D1F',      // Global Green (PANTONE 349C) – primary, AAA-accessible
  dark: '#003512',       // Global Dark Green (PANTONE 567C)
  sand: '#F6F4E9',       // Global Sand (PANTONE 7527C) – neutral backgrounds
  warm: '#F8F8F5',       // Warm White
  black: '#262626',      // Black
  neon: '#00E95C',       // HRB Neon (PANTONE 7479C) – highlights and CTAs
  logo: '#14AA40',       // Logo Green (PANTONE 2422C) – logo only
};
/* Photography: H&R Block's own images, loaded from their public Scene7 CDN (the files hrblock.com uses). */
const IMG = (name, w) => `https://hrbent.scene7.com/is/image/hrblock/${name}?fmt=webp-alpha&wid=${w}&bfc=on`;

/* ---------------------------- data ---------------------------- */
/* Hero copy follows Build Plan 5.4: campaign copy only from claims that appear on hrblock.com.
   ev = the Feature Experimentation event key on [primary, secondary] button ('none' = no event). */
const HERO = {
  Original: { accent: 'tax help', eyebrow: 'Still time to file', headline: 'No one offers more ways to get tax help than H&R Block.', sub: 'Work with your pro however is most convenient, in person or online.', cta: 'File with a tax pro', cta2: 'File online', ev: ['appointment_cta_click', 'none'] },
  UrgencyB: { accent: 'April 15', eyebrow: 'Still time to file', headline: 'April 15 is close. Let a trusted tax pro handle it all.', sub: 'Choose your pro or get matched, and file in as little as one hour.', cta: 'Start with a tax pro', cta2: 'File online', ev: ['appointment_cta_click', 'none'] },
  DiyAbandoner: { accent: 'expert help', eyebrow: 'Welcome back', headline: 'File your own taxes with expert help.', sub: 'Live support from tax pros and AI Tax Assist included from the start.', cta: 'Start with expert help', cta2: 'File with a tax pro', ev: ['diy_start_click', 'appointment_cta_click'] },
};
const HERO_ES = { accent: 'Todavía hay tiempo', eyebrow: 'Temporada de impuestos 2027 · Últimas semanas', headline: 'Todavía hay tiempo para declarar. Hágalo con un experto.', sub: 'Reserve una cita con un profesional de impuestos hoy, o termine en línea.', cta: 'Reservar una cita', cta2: 'Declarar en línea' };

const OFFICES0 = [
  { id: 'HRB-0412', name: 'Westside Plaza', city: 'Kansas City, MO', hours: 'Mon–Sat 9–7, Sun 11–5', langs: 'English, Español', slots: 0 },
  { id: 'HRB-0188', name: 'Metcalf Crossing', city: 'Overland Park, KS', hours: 'Mon–Sat 9–8', langs: 'English', slots: 6 },
  { id: 'HRB-0731', name: 'Domain Square', city: 'Austin, TX', hours: 'Mon–Sat 9–7, Sun 12–5', langs: 'English, Español', slots: 3 },
  { id: 'HRB-0555', name: 'Camelback Center', city: 'Phoenix, AZ', hours: 'Mon–Fri 9–6, Sat 10–4', langs: 'English, Español', slots: 11 },
];

const ASSETS = [
  { id: 'a1', name: 'TS27 late-season hero (wide)', tags: ['late season', 'hero', 'assisted'], img: 'hrb-image-client-and-tax-pro-shaking-hands-at-desk-906x484', w: 906, h: 484, rights: 'Perpetual (stock)', lang: 'EN' },
  { id: 'a2', name: 'DIY hero: laptop at home', tags: ['diy', 'hero'], img: 'hrb-image-diy-client-on-laptop-in-living-room-906x484', w: 906, h: 484, rights: 'Through Dec 2027', lang: 'EN' },
  { id: 'a3', name: 'Tax pro with client (talent)', tags: ['assisted', 'hero', 'talent'], img: 'hrb-image-sang-v-tax-pro-action-card-310x400', w: 310, h: 400, rights: 'Talent rights expire Apr 30, 2027', expiring: true, lang: 'EN' },
  { id: 'a4', name: 'Late-season hero (Español)', tags: ['late season', 'hero', 'spanish'], img: 'hrb-image-client-and-tax-pro-shaking-hands-at-desk-906x484', w: 906, h: 484, rights: 'Perpetual (stock)', lang: 'ES', variantOf: 'a1' },
];

/* ---------------------------- helpers ---------------------------- */
function useTypewriter(text, run, step = 4, speed = 12) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) { setN(0); return undefined; }
    setN(0);
    const id = setInterval(() => setN((v) => (v >= text.length ? v : v + step)), speed);
    return () => clearInterval(id);
  }, [run, text, step, speed]);
  return text.slice(0, n);
}

const Btn = ({ children, onClick, kind = 'primary', disabled, className = '' }) => {
  const k = {
    primary: 'bg-green-700 text-white hover:bg-green-800',
    dark: 'hrb-dark text-white hover:opacity-90',
    ghost: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50',
    paste: 'bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100',
    mark: 'bg-indigo-600 text-white hover:bg-indigo-700',
  }[kind];
  return (
    <button onClick={onClick} disabled={disabled} className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${k} ${className}`}>
      {children}
    </button>
  );
};

const Pill = ({ children, cls = 'bg-slate-100 text-slate-700' }) => (
  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>{children}</span>
);

function Frame({ url, label, children, accent = 'bg-slate-100' }) {
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

function Spinner() {
  return <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-green-700 align-middle" />;
}

/* ---------------------------- Live App ---------------------------- */
/* Shows the whole image at its own aspect ratio: never cropped. Width is requested no larger than the
   native file (w x h from the asset), so nothing is upscaled. Tall images in the small slots are letterboxed. */
function HeroImage({ asset, small }) {
  const a = asset || ASSETS[0];
  const [err, setErr] = useState(false);
  useEffect(() => setErr(false), [a.id]);
  const ratio = `${a.w} / ${a.h}`;
  const maxH = small ? '16rem' : '28rem';
  return (
    <div className="relative overflow-hidden rounded-2xl hrb-sand">
      {a.img && !err ? (
        <img src={IMG(a.img, Math.min(a.w, small ? 400 : 960))} alt={a.name} onError={() => setErr(true)} className="block w-full object-contain" style={{ aspectRatio: ratio, maxHeight: maxH }} />
      ) : (
        <div className="flex w-full items-end p-3 text-xs font-semibold" style={{ color: HRB.green, aspectRatio: ratio, maxHeight: maxH }}>{small ? '' : a.name}</div>
      )}
      {!small && <span className="absolute bottom-0 left-0 h-6 w-6" style={{ background: HRB.neon }} />}
    </div>
  );
}

/* The real logo, the same asset and size the app's global layout uses (MainNav: siteConfig.logoSrc). */
function HrbLogo() {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={siteConfig.logoSrc} alt={siteConfig.logoAlt} className="h-8 w-auto" />;
}

function Accent({ text, accent, onDark }) {
  if (!accent || !text || !text.includes(accent)) return text;
  const i = text.indexOf(accent);
  return (
    <>
      {text.slice(0, i)}
      <span style={{ color: onDark ? HRB.neon : HRB.green }}>{accent}</span>
      {text.slice(i + accent.length)}
    </>
  );
}

function OfficeCard({ o, badge, flash, promo }) {
  const open = o.slots > 0;
  return (
    <div className={`relative flex flex-col gap-1 rounded-2xl border bg-white p-5 transition duration-500 ${flash ? 'border-amber-300 ring-4 ring-amber-200' : 'hrb-line'}`}>
      {badge && <span className="absolute right-3 top-3"><Pill cls="bg-indigo-100 text-indigo-700">🔗 Connected</Pill></span>}
      <div className="pr-20 text-lg font-semibold" style={{ color: HRB.black }}>{o.name}</div>
      <div className="text-xs text-slate-500">{o.city} · {o.id}</div>
      <div className="text-xs text-slate-500">{o.hours}</div>
      <div className="text-xs text-slate-500">Languages: {o.langs}</div>
      <div className={`mt-2 w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ${open ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
        {open ? `${o.slots} appointments open today` : 'Fully booked today: join the waitlist'}
      </div>
      {promo && <div className="text-xs font-medium text-green-800">{promo}</div>}
      <span className="mt-3 w-fit rounded-lg px-4 py-2 text-xs font-semibold text-white" style={{ background: HRB.green }}>Book at this office</span>
    </div>
  );
}

function LiveApp({ variant = 'Original', lang = 'en', offices = OFFICES0.slice(0, 3), heroOverride, asset, bg = 'green', flashId, officeBadge = false, promo }) {
  const es = lang === 'es';
  const h = heroOverride || (es ? HERO_ES : HERO[variant]);
  const onDark = bg === 'green';
  const heroCls = { green: 'hrb-dark text-white', light: 'hrb-sand', white: 'bg-white' }[bg];
  const nav = es ? ['Impuestos', 'Productos financieros', 'Servicios para negocios', 'Herramientas y recursos'] : ['Taxes', 'Financial products', 'Business services', 'Tools and resources'];
  const cards = es
    ? [['HÁGALO USTED MISMO', 'Declare en línea a su ritmo', 'Pasos guiados en cualquier dispositivo, con ayuda cuando la necesite.', ['Empiece ahora y termine cuando quiera', 'Agregue la revisión de un profesional en cualquier momento'], 'Comenzar en línea'],
       ['PREPARACIÓN COMPLETA', 'Deje que un profesional se encargue', 'En persona o en línea, uno a uno.', ['Elija a su profesional o le asignamos uno', 'Conozca su precio antes de empezar'], 'Reservar una cita']]
    : [['DO-IT-YOURSELF', 'File online at your own pace', 'Guided steps on any device, with help when you need it.', ['Start now, finish whenever you are ready', 'Add a tax pro review at any time'], 'Start online'],
       ['FULL-SERVICE TAX PREP', 'Let a tax pro handle it all', 'In person or online, one-on-one.', ['Choose your pro or get matched', 'Know your price before you start'], 'Book an appointment']];
  return (
    <div style={{ color: HRB.black }}>
      <div className="hrb-dark flex gap-5 px-6 py-1.5 text-[11px] font-semibold tracking-wide" style={{ color: HRB.sand }}>
        <span style={{ color: HRB.neon }}>{BRAND}</span><span className="opacity-80">Block Advisors</span><span className="opacity-80">Spruce</span>
      </div>
      <div className="flex items-center justify-between border-b bg-white px-6 py-3 hrb-line">
        <div className="flex items-center gap-2"><HrbLogo /><span className="text-xs text-slate-400">(demo)</span></div>
        <div className="hidden gap-5 text-sm font-medium md:flex">{nav.map((x) => <span key={x}>{x}</span>)}</div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="hidden sm:inline">{es ? 'Buscar una oficina' : 'Find an office'}</span>
          <span style={{ color: HRB.green }}>{es ? 'Iniciar sesión en MyBlock' : 'Sign in to MyBlock'}</span>
        </div>
      </div>

      <div className={`${heroCls} px-8 py-10 transition-colors duration-500`}>
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: onDark ? HRB.neon : HRB.green }}>{h.eyebrow}</div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight"><Accent text={h.headline} accent={h.accent} onDark={onDark} /></h1>
            <p className="text-base opacity-90">{h.sub}</p>
            {h.countdown && <div className="w-fit rounded-full px-3 py-1 text-xs font-bold" style={{ background: HRB.sand, color: HRB.dark }}>⏰ 3 days left to file</div>}
            <div className="flex flex-wrap gap-3 pt-1">
              <span className="rounded-lg px-5 py-2.5 text-sm font-semibold" style={onDark ? { background: HRB.neon, color: HRB.dark } : { background: HRB.green, color: '#fff' }}>{h.cta}</span>
              <span className="rounded-lg border-2 px-5 py-2.5 text-sm font-semibold" style={{ borderColor: onDark ? '#fff' : HRB.green, color: onDark ? '#fff' : HRB.green }}>{h.cta2}</span>
            </div>
          </div>
          <HeroImage asset={asset || (es ? ASSETS[3] : ASSETS[0])} />
        </div>
      </div>

      <div className="grid gap-5 bg-white px-8 py-8 md:grid-cols-2">
        {cards.map(([eyebrow, title, sub, bullets, cta]) => (
          <div key={eyebrow} className="flex flex-col rounded-2xl border p-6 hrb-line">
            <div className="text-xs font-semibold tracking-widest" style={{ color: HRB.green }}>{eyebrow}</div>
            <div className="mt-2 text-2xl font-semibold leading-snug">{title}</div>
            <div className="mt-2 text-sm font-semibold">{sub}</div>
            <ul className="mt-3 space-y-2 text-sm">
              {bullets.map((x) => <li key={x} className="flex items-start gap-2"><span className="mt-1.5 h-2 w-2 shrink-0" style={{ background: HRB.green }} />{x}</li>)}
            </ul>
            <div className="mt-5 flex items-center gap-4">
              <span className="rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{ background: HRB.green }}>{cta}</span>
              <span className="text-sm font-semibold underline" style={{ color: HRB.green }}>{es ? 'Más información' : 'Learn more'}</span>
            </div>
          </div>
        ))}
      </div>

      {offices.length > 0 && (
        <div className="hrb-sand px-8 py-8">
          <div className="mb-4 text-xl font-semibold">{es ? 'Oficinas cercanas · disponibilidad de hoy' : 'Offices near you · availability today'}</div>
          <div className={`grid gap-4 ${offices.length > 1 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
            {offices.map((o) => <OfficeCard key={o.id} o={o} badge={officeBadge} flash={flashId === o.id} promo={promo} />)}
          </div>
        </div>
      )}

      <div className="border-t bg-white px-8 py-4 text-xs leading-relaxed text-slate-500 hrb-line">
        {es
          ? 'Divulgación de demostración TS27-LATE-01: contenido sintético solo con fines de demostración. No es una oferta. La disponibilidad y los plazos son ilustrativos.'
          : 'Demo disclosure TS27-LATE-01: synthetic content for demonstration only. Not an offer. Availability, timing and results are illustrative.'}
        <span className="ml-2"><Pill cls="bg-slate-100 text-slate-500">Shared block · owned by Legal</Pill></span>
      </div>
    </div>
  );
}

/* ---------------------------- Scene 1 ---------------------------- */
function S1() {
  const [slide, setSlide] = useState(0);
  return (
    <div className="space-y-4">
      <div className="rounded-2xl hrb-dark hrb-motif px-10 py-12 text-white shadow-lg">
        {slide === 0 && (
          <div className="space-y-8">
            <div>
              <div className="text-sm uppercase tracking-widest text-green-200">{BRAND} · Integrated marketing RFP · What you told us</div>
              <h1 className="mt-2 text-4xl font-extrabold leading-tight">150+ tests in a 16-week season, and the winner published immediately.</h1>
              <p className="mt-2 text-green-100">From your RFP’s operating-scale slide.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ['“150+ tests in a 16-week tax season”', 'Your RFP', false],
                ['“Capacity to scale tests and immediately publish the winning version”', 'Your RFP', false],
                ['≈ 9 tests a week, every week', 'Our arithmetic: 150 ÷ 16 = 9.4', true],
              ].map(([q, src, ours]) => (
                <div key={q} className={`rounded-xl p-5 ${ours ? 'border border-dashed border-green-200 bg-white/5' : 'bg-white/10'}`}>
                  <div className="text-xl font-bold leading-snug">{q}</div>
                  <div className={`mt-3 text-xs font-semibold uppercase tracking-wider ${ours ? 'text-amber-200' : 'text-green-200'}`}>{src}</div>
                </div>
              ))}
            </div>
            <div className="space-y-1 text-xs text-green-200">
              <div>Quotes: {BRAND} RFP deck, slide “{'Integrated Marketing Scale & Requirements'}” (“Operating scale for RFP partner capacity assessment”). The weekly pace is our arithmetic, not an {BRAND} figure.</div>
              <div>The demo that follows uses synthetic content and data.</div>
            </div>
          </div>
        )}
        {slide === 1 && (
          <div className="space-y-6">
            <h2 className="text-4xl font-extrabold leading-tight">The bottleneck isn’t data.<br />It’s the time between a decision and a live change.</h2>
            <div className="flex flex-wrap gap-3 text-sm">
              {['16-week season (your RFP)', '150+ tests (your RFP)', '1 week of lag ≈ 6% of the season (1 ÷ 16, our arithmetic)'].map((x) => <span key={x} className="rounded-full bg-white/15 px-4 py-1.5">{x}</span>)}
            </div>
          </div>
        )}
        {slide === 2 && (
          <div className="space-y-6">
            <div>
              <div className="text-sm uppercase tracking-widest text-green-200">One question before we start</div>
              <h2 className="mt-2 text-2xl font-bold">When Test 47 wins on a Tuesday, when is it live on hrblock.com, and who has to touch it?</h2>
            </div>
            <div className="rounded-xl bg-white/10 p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-green-200">The story we will follow</div>
              <p className="mt-1 text-base">Tuesday of Week 11, early April. Maya, a seasonal campaign manager, has until Thursday to get a “Still time to file” campaign live, and until April 15 to prove it works and make it better.</p>
              <p className="mt-1 text-xs text-green-200">Everything you will see is a demo build with synthetic content and data, not {BRAND} data.</p>
            </div>
            <div>
              <div className="mb-2 text-sm font-bold text-green-200">Watch for three things</div>
              <ol className="space-y-2 text-lg">
                <li>1. The winning version goes live in seconds, with no dev ticket.</li>
                <li>2. A marketer launches a test on her own in minutes.</li>
                <li>3. It plugs into what you already have instead of replacing everything.</li>
              </ol>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-center gap-3">
        <Btn kind="ghost" onClick={() => setSlide(Math.max(0, slide - 1))} disabled={slide === 0}>‹ Slide</Btn>
        {[0, 1, 2].map((i) => <button key={i} onClick={() => setSlide(i)} className={`h-2.5 w-2.5 rounded-full ${slide === i ? 'bg-green-700' : 'bg-slate-300'}`} />)}
        <Btn kind="ghost" onClick={() => setSlide(Math.min(2, slide + 1))} disabled={slide === 2}>Slide ›</Btn>
      </div>
    </div>
  );
}

/* ---------------------------- Scene 2 ---------------------------- */
function S2({ lang, setLang }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-600">Visitor view:</span>
        <Btn kind={lang === 'en' ? 'primary' : 'ghost'} onClick={() => setLang('en')}>English</Btn>
        <Btn kind={lang === 'es' ? 'primary' : 'ghost'} onClick={() => setLang('es')}>Español (Luis)</Btn>
      </div>
      <Frame url={`https://hrblock.optimoey.com${lang === 'es' ? '/es' : ''}/still-time-to-file`} label="Live App">
        <LiveApp lang={lang} />
      </Frame>
    </div>
  );
}

/* ---------------------------- Scene 3 ---------------------------- */
const BRIEF = `Campaign brief: "Still time to file – get expert help"

Objective
Increase tax-pro appointments booked before the filing deadline.
Secondary: DIY starts from late filers.

Audiences
• DIY filers who started a return but did not finish
• Returning assisted clients with no appointment yet
• Late filers worried about the deadline
• Spanish-preferred clients

Key message
There's still time, and an expert can help you finish.

Deliverables
Landing page hero (EN + ES), 2 hero variations, appointment CTA,
office cards, approved disclosure TS27-LATE-01.

⚠ Needs Legal review
• "Free" help claims
• Refund timing language
• Deadline statements`;

function S3({ stamp }) {
  const blank = { title: '', goal: '', aud: '', needed: '', legal: '' };
  const [f, setF] = useState(blank);
  const [phase, setPhase] = useState('form');
  const [run, setRun] = useState(false);
  const text = useTypewriter(BRIEF, run);
  useEffect(() => { if (run && text.length >= BRIEF.length) stamp('brief'); }, [run, text, stamp]);
  const paste = () => setF({
    title: 'Still time to file – expert help (late season)',
    goal: 'More tax-pro appointments booked in the final 10 days of the season',
    aud: 'DIY filers who started but did not finish; returning assisted clients; late filers',
    needed: 'Thursday',
    legal: 'Yes – free help, refund timing and deadline claims',
  });
  const field = (k, label) => (
    <label className="block text-xs font-semibold text-slate-600">{label} <span className="text-red-500">*</span>
      <input value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm font-normal text-slate-900" />
    </label>
  );
  const valid = Object.values(f).every((v) => v.trim());
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Frame url="cmp.optimizely.com/requests" label="CMP · Requests" accent="bg-violet-50">
        <div className="space-y-3 p-4">
          {phase === 'form' ? (
            <>
              <div className="flex items-center justify-between">
                <div className="font-bold">New request · Seasonal campaign request</div>
                <Btn kind="paste" onClick={paste}>Paste C1</Btn>
              </div>
              {field('title', 'Request title')}
              {field('goal', 'Goal')}
              {field('aud', 'Audiences')}
              <div className="grid grid-cols-2 gap-3">{field('needed', 'Needed by')}{field('legal', 'Legal review needed')}</div>
              <Btn onClick={() => { setPhase('routed'); stamp('req'); }} disabled={!valid}>Submit request</Btn>
              {!valid && <div className="text-xs text-slate-500">Required fields keep requests from arriving half-baked.</div>}
            </>
          ) : (
            <div className="space-y-3">
              <div className="rounded-lg border border-violet-200 bg-violet-50 p-3">
                <div className="text-xs font-semibold text-violet-700">REQUEST #TS27-0418</div>
                <div className="font-bold">{f.title}</div>
                <div className="mt-1 text-sm text-slate-600">{f.goal}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-slate-500">Routed to:</span> <b>Seasonal Campaigns</b></div>
                <div><span className="text-slate-500">Owner:</span> <b>Maya</b></div>
                <div><span className="text-slate-500">Status:</span> {phase === 'accepted' ? <Pill cls="bg-green-100 text-green-800">Accepted</Pill> : <Pill cls="bg-amber-100 text-amber-800">New</Pill>}</div>
                <div><span className="text-slate-500">Priority:</span> {phase === 'accepted' ? <Pill cls="bg-red-100 text-red-700">High</Pill> : '—'}</div>
              </div>
              {phase === 'routed' && <Btn onClick={() => setPhase('accepted')}>Accept and set priority High</Btn>}
              {phase === 'accepted' && <div className="text-sm text-green-800">✓ Routed automatically, no inbox forwarding. Timestamped for the audit trail.</div>}
            </div>
          )}
        </div>
      </Frame>
      <Frame url="mark.optimizely.com" label="Mark" accent="bg-indigo-50">
        <div className="space-y-3 p-4">
          <div className="rounded-lg bg-slate-100 p-3 font-mono text-xs text-slate-700">
            @campaign_brief_generation Campaign type – Late-season conversion… Target Audience – DIY abandoners, returning assisted, late filers, Spanish-preferred… Objective – appointments before the deadline… Assets – hero EN+ES, 2 hero variations, office cards, disclosure. Flag Legal claims.
          </div>
          <Btn kind="mark" onClick={() => setRun(true)} disabled={phase !== 'accepted' || run}>{'Paste C2 & send'}</Btn>
          {phase !== 'accepted' && <div className="text-xs text-slate-500">Accept the request first.</div>}
          {run && <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-lg border border-indigo-100 bg-white p-3 font-sans text-sm text-slate-800">{text}{text.length < BRIEF.length && <span className="animate-pulse">▍</span>}</pre>}
        </div>
      </Frame>
    </div>
  );
}

/* ---------------------------- Scene 4 ---------------------------- */
const STEPS = ['Brief', 'Copy', 'Legal / Compliance review', 'Build', 'QA', 'Publish'];
function S4({ stamp }) {
  const [cur, setCur] = useState(2);
  const [comment, setComment] = useState('');
  const [team, setTeam] = useState([
    { name: 'Alex (Copy)', h: 46 }, { name: 'Rita (Copy)', h: 41 }, { name: 'Ben (Design)', h: 18 }, { name: 'Lee (Copy)', h: 14 },
  ]);
  const [moved, setMoved] = useState(false);
  const approve = () => { setCur(3); stamp('legal'); };
  const reassign = () => {
    setTeam((t) => t.map((p) => (p.name.startsWith('Alex') ? { ...p, h: p.h - 10 } : p.name.startsWith('Lee') ? { ...p, h: p.h + 10 } : p)));
    setMoved(true);
  };
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Frame url="cmp.optimizely.com/tasks/TS27-late-season-landing" label="CMP · Task workflow" accent="bg-violet-50">
        <div className="space-y-4 p-4">
          <div className="font-bold">TS27 Late Season – landing page</div>
          <ol className="space-y-2">
            {STEPS.map((s, i) => (
              <li key={s} className={`flex items-center gap-3 rounded-lg border p-2.5 text-sm ${i === cur ? 'border-violet-400 bg-violet-50' : i < cur ? 'border-green-200 bg-green-50' : 'border-slate-200'}`}>
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${i < cur ? 'bg-green-600 text-white' : i === cur ? 'bg-violet-600 text-white' : 'bg-slate-200 text-slate-600'}`}>{i < cur ? '✓' : i + 1}</span>
                <span className="flex-1 font-medium">{s}</span>
                {s.startsWith('Legal') && <Pill cls="bg-red-100 text-red-700">Mandatory · Jordan · due Wed 12:00</Pill>}
                {i === cur && s === 'Build' && <Pill cls="bg-violet-100 text-violet-700">Maya notified</Pill>}
              </li>
            ))}
          </ol>
          {cur === 2 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between"><span className="text-xs font-semibold text-slate-600">Jordan’s review comment</span><Btn kind="paste" onClick={() => setComment('Approved. Use disclosure TS27-LATE-01 on every variation. No new pricing or refund-timing claims in hero copy without another review.')}>Paste C3</Btn></div>
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} className="w-full rounded-md border border-slate-300 p-2 text-sm" />
              <Btn onClick={approve} disabled={!comment.trim()}>Approve step</Btn>
            </div>
          ) : (
            <div className="rounded-lg bg-green-50 p-3 text-sm text-green-800">✓ Legal approved: “{comment.slice(0, 80)}…” The Build step is now Maya’s.</div>
          )}
        </div>
      </Frame>
      <Frame url="cmp.optimizely.com/resources/workload" label="CMP · Resources" accent="bg-violet-50">
        <div className="space-y-4 p-4">
          <div className="flex items-center justify-between"><div className="font-bold">Workload · week of Apr 5 (capacity 32 h)</div>
            <Btn kind="ghost" onClick={reassign} disabled={moved}>Reassign “Hero copy ES” → Lee</Btn></div>
          {team.map((p) => {
            const over = p.h > 32;
            return (
              <div key={p.name}>
                <div className="flex justify-between text-sm"><span>{p.name}</span><span className={over ? 'font-bold text-red-600' : 'text-slate-600'}>{p.h} h</span></div>
                <div className="mt-1 h-3 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-3 rounded-full transition-all duration-700 ${over ? 'bg-red-500' : p.h > 26 ? 'bg-amber-400' : 'bg-green-500'}`} style={{ width: `${Math.min(100, (p.h / 48) * 100)}%` }} />
                </div>
              </div>
            );
          })}
          <div className="rounded-lg border border-slate-200 p-3">
            <div className="mb-2 text-xs font-bold text-slate-600">Reports · estimated vs actual hours (last season)</div>
            <table className="w-full text-sm"><thead><tr className="text-left text-xs text-slate-500"><th>Step</th><th>Est.</th><th>Actual</th></tr></thead>
              <tbody>{[['Copy', 6, 9], ['Legal review', 2, 5], ['Build', 4, 3]].map(([s, e, a]) => <tr key={s}><td>{s}</td><td>{e} h</td><td className={a > e ? 'text-red-600' : 'text-green-700'}>{a} h</td></tr>)}</tbody></table>
          </div>
        </div>
      </Frame>
    </div>
  );
}

/* ---------------------------- Scene 5 ---------------------------- */
function S5({ asset, setAsset, stamp }) {
  const [q, setQ] = useState('late season hero');
  const [sel, setSel] = useState(null);
  const words = q.toLowerCase().split(' ').filter(Boolean);
  const results = ASSETS.filter((a) => words.length === 0 || words.some((w) => (a.name + a.tags.join(' ')).toLowerCase().includes(w)));
  return (
    <Frame url="cmp.optimizely.com/library/TS27-late-season" label="CMP · Library (DAM)" accent="bg-violet-50">
      <div className="grid gap-4 p-4 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Search assets…" />
          <div className="grid gap-3 sm:grid-cols-2">
            {results.map((a) => (
              <button key={a.id} onClick={() => setSel(a)} className={`rounded-xl border p-2 text-left transition ${sel?.id === a.id ? 'border-green-600 ring-2 ring-green-200' : 'border-slate-200 hover:border-slate-400'}`}>
                <HeroImage asset={a} small />
                <div className="mt-2 text-sm font-semibold">{a.name}</div>
                <div className="mt-1 flex flex-wrap gap-1">{a.tags.map((t) => <Pill key={t}>{t}</Pill>)}{a.expiring && <Pill cls="bg-red-100 text-red-700">Rights expiring</Pill>}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 p-3 text-sm">
          {!sel ? <div className="text-slate-500">Select an asset to see metadata and rights.</div> : (
            <div className="space-y-2">
              <HeroImage asset={sel} small />
              <div className="font-bold">{sel.name}</div>
              <div><span className="text-slate-500">Language:</span> {sel.lang}</div>
              <div><span className="text-slate-500">Owner:</span> Brand Studio</div>
              <div className={sel.expiring ? 'rounded bg-red-50 p-2 font-semibold text-red-700' : ''}><span className="text-slate-500">Usage rights:</span> {sel.rights}{sel.expiring && ' ⚠ flagged before use on a page'}</div>
              {sel.id === 'a1' && <button onClick={() => setSel(ASSETS[3])} className="text-left text-green-800 underline">Spanish variant: Late-season hero (Español) →</button>}
              {sel.variantOf && <div className="text-slate-500">Variant of: TS27 late-season hero (wide)</div>}
              <Btn onClick={() => { setAsset(sel); stamp('assets'); }} disabled={sel.expiring}>{asset?.id === sel.id ? '✓ Selected for campaign' : 'Use in campaign'}</Btn>
              {sel.expiring && <div className="text-xs text-red-600">Blocked: rights expire mid-season.</div>}
            </div>
          )}
        </div>
      </div>
    </Frame>
  );
}

/* ---------------------------- Scene 6 ---------------------------- */
function S6({ asset, stamp, phoenix, setPhoenix }) {
  const [phase, setPhase] = useState(phoenix ? 'published' : 'tree');
  const [headline, setHeadline] = useState(phoenix?.headline || HERO.Original.headline);
  const [img, setImg] = useState(phoenix?.img || asset || ASSETS[0]);
  const [bg, setBg] = useState(phoenix?.bg || 'green');
  const [office, setOffice] = useState(phoenix?.office || null);
  const [promo, setPromo] = useState(phoenix?.promo || '');
  const [picker, setPicker] = useState(null);
  const publish = () => { setPhoenix({ headline, img, bg, office, promo }); setPhase('published'); stamp('phoenix'); };
  if (phase === 'tree') {
    return (
      <Frame url="app.cms.optimizely.com/content" label="CMS Editor" accent="bg-sky-50">
        <div className="grid gap-4 p-4 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 p-3 text-sm">
            <div className="mb-2 text-xs font-bold text-slate-500">CONTENT TREE · HRB Demo</div>
            {['🏠 Home', '— Still time to file', '— File online', '— File with a tax pro', '— Find an office', '📁 HRB Demo / assets'].map((x) => <div key={x} className="py-1">{x}</div>)}
          </div>
          <div className="space-y-3 md:col-span-2">
            <div className="rounded-lg border border-dashed border-sky-300 bg-sky-50 p-4">
              <div className="font-bold">Blueprint: “Still time to file – landing”</div>
              <div className="text-sm text-slate-600">Hero · Offer cards · Office cards · FAQ · Compliance disclosure (shared)</div>
              <Btn className="mt-3" onClick={() => setPhase('build')}>New from blueprint → “Still time to file – Phoenix”</Btn>
            </div>
          </div>
        </div>
      </Frame>
    );
  }
  return (
    <div className="grid gap-4 xl:grid-cols-5">
      <div className="xl:col-span-2">
        <Frame url="app.cms.optimizely.com/visual-builder/phoenix" label="Visual Builder" accent="bg-sky-50">
          <div className="space-y-4 p-4 text-sm">
            <div className="flex items-center justify-between"><div className="font-bold">Still time to file – Phoenix</div>{phase === 'published' ? <Pill cls="bg-green-100 text-green-800">Published</Pill> : <Pill cls="bg-amber-100 text-amber-800">Draft</Pill>}</div>
            <div>
              <div className="flex items-center justify-between"><span className="text-xs font-semibold text-slate-600">[HRB] Hero · Headline</span><Btn kind="paste" onClick={() => setHeadline("Phoenix, there's still time to file with an expert.")}>Paste C4</Btn></div>
              <input value={headline} onChange={(e) => setHeadline(e.target.value)} className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-600">Image (from DAM)</div>
              <div className="mt-1 flex items-center gap-2"><div className="w-16"><HeroImage asset={img} small /></div><span className="flex-1 text-xs">{img.name}</span><Btn kind="ghost" onClick={() => setPicker(picker === 'img' ? null : 'img')}>More (…) › Replace</Btn></div>
              {picker === 'img' && (
                <div className="mt-2 grid grid-cols-2 gap-2 rounded-lg border border-slate-200 p-2">
                  {ASSETS.filter((a) => !a.expiring).map((a) => <button key={a.id} onClick={() => { setImg(a); setPicker(null); }} className="rounded border border-slate-200 p-1 text-left text-xs hover:border-green-600"><HeroImage asset={a} small />{a.name}</button>)}
                </div>
              )}
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-600">Section style (approved options only)</div>
              <select value={bg} onChange={(e) => setBg(e.target.value)} className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5"><option value="green">Brand green</option><option value="light">Sand</option><option value="white">White</option></select>
            </div>
            <div className="rounded-lg bg-slate-50 p-2 text-xs text-slate-600">🔒 Compliance Disclosure TS27-LATE-01 · shared block owned by Legal (not editable here)</div>
            <div>
              <div className="text-xs font-semibold text-slate-600">[HRB] Office Card</div>
              {office ? <div className="mt-1"><Pill cls="bg-slate-100 text-slate-700">{office.name} · typed in by hand</Pill></div>
                : <Btn kind="ghost" className="mt-1" onClick={() => setPicker(picker === 'office' ? null : 'office')}>Type the Phoenix office details</Btn>}
              {picker === 'office' && (
                <div className="mt-2 space-y-1 rounded-lg border border-slate-200 p-2">
                  <div className="text-xs text-slate-500">Office details (typed in; there is no connected source)</div>
                  {OFFICES0.map((o) => <button key={o.id} onClick={() => { setOffice(o); setPicker(null); }} className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-green-50">{o.name} · {o.city} · {o.id}</button>)}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between"><span className="text-xs font-semibold text-slate-600">Local promo (editable)</span><Btn kind="paste" onClick={() => setPromo('Walk-ins welcome until 6 pm, Monday to Friday, through April 15.')} disabled={!office}>Paste promo</Btn></div>
              <input value={promo} onChange={(e) => setPromo(e.target.value)} disabled={!office} className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 disabled:bg-slate-100" />
            </div>
            <Btn onClick={publish} disabled={!office}>Publish</Btn>
            {phase === 'published' && <div className="text-xs text-green-800">✓ Live at /still-time-to-file-phoenix. No developer, no ticket.</div>}
          </div>
        </Frame>
      </div>
      <div className="xl:col-span-3">
        <Frame url="hrblock.optimoey.com/still-time-to-file-phoenix" label={phase === 'published' ? 'Live App' : 'Preview'}>
          <LiveApp heroOverride={{ ...HERO.Original, headline }} asset={img} bg={bg} offices={office ? [office] : []} promo={promo} officeBadge={false} />
        </Frame>
      </div>
    </div>
  );
}

/* ---------------------------- Scene 7 ---------------------------- */
const PATTERN = [
  ['1 · The system keeps its data', 'Office hours and availability stay in the office system. Nothing is copied into the CMS.'],
  ['2 · It is indexed into Graph', 'The source indexes its records into an Optimizely Graph custom source. The CMS sees them as connected content.'],
  ['3 · A card is bound to a record', 'In Visual Builder an Office Card is connected to one record. A link badge shows it is bound, mapped fields are read-only, and the promo line stays editable.'],
  ['4 · The site follows the source', 'When the source changes, the card changes. No CMS edit and no publish.'],
];
function S7({ stamp }) {
  const [step, setStep] = useState(0);
  const next = () => { const n = Math.min(PATTERN.length - 1, step + 1); setStep(n); if (n === PATTERN.length - 1) stamp('office'); };
  const box = (i, t, d) => (
    <div className={`rounded-xl border p-4 text-sm transition ${step >= i ? 'border-green-500 bg-green-50' : 'border-slate-200 bg-white opacity-60'}`}>
      <div className="font-bold">{t}</div><div className="text-xs text-slate-600">{d}</div>
    </div>
  );
  return (
    <div className="space-y-4">
      <div><Pill cls="bg-amber-100 text-amber-800">Illustrative pattern · not running live in this demo</Pill></div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Frame url="docs.optimizely.com/cms-saas/docs/integrate-external-resources" label="Docs · Connected Content" accent="bg-sky-50">
          <div className="space-y-3 p-4 text-sm">
            {PATTERN.map(([t, d], i) => (
              <div key={t} className={`rounded-lg border p-3 ${i === step ? 'border-green-600 bg-green-50' : i < step ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50 text-slate-400'}`}>
                <div className="font-semibold">{t}</div>{i <= step && <div className="text-xs text-slate-600">{d}</div>}
              </div>
            ))}
            <div className="flex items-center gap-3">
              <Btn onClick={next} disabled={step === PATTERN.length - 1}>{step === PATTERN.length - 1 ? '✓ Pattern shown' : 'Next step ›'}</Btn>
              <a href="https://docs.optimizely.com/cms-saas/docs/integrate-external-resources" target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-green-800 underline">Open the docs page</a>
            </div>
          </div>
        </Frame>
        <Frame url="slide 5 · coexistence" label="Pattern" accent="bg-slate-100">
          <div className="grid items-center gap-3 p-5 md:grid-cols-5">
            <div className="md:col-span-1">{box(0, 'Office system', 'owns the data')}</div>
            <div className="text-center text-2xl text-slate-400">→</div>
            <div className="md:col-span-1">{box(1, 'Graph source', 'indexed records')}</div>
            <div className="text-center text-2xl text-slate-400">→</div>
            <div className="md:col-span-1">{box(2, 'Office Card', 'bound in the CMS')}</div>
          </div>
          <div className={`px-5 pb-5 text-sm transition ${step >= 3 ? 'text-green-800' : 'text-slate-300'}`}>When the source changes, the card follows. No CMS edit, no publish.</div>
        </Frame>
      </div>
    </div>
  );
}

/* ---------------------------- Scene 8 ---------------------------- */
function S8({ stamp, overlay }) {
  const [preview, setPreview] = useState('DiyAbandoner');
  const [seg, setSeg] = useState('');          // the hrb_segment cookie, set by the URL switch
  const [lastUrl, setLastUrl] = useState('');  // '' | 'become' | 'clear'
  const isDana = seg === 'diy_abandoner';
  const variant = isDana ? 'DiyAbandoner' : 'Original';
  const become = () => { setSeg('diy_abandoner'); setLastUrl('become'); stamp('perso'); };
  const clear = () => { setSeg(''); setLastUrl('clear'); };
  const query = lastUrl === 'become' ? '?hrb_segment=diy_abandoner' : lastUrl === 'clear' ? '?hrb_segment=' : '';
  return (
    <div className="grid gap-4 xl:grid-cols-5">
      <div className="space-y-4 xl:col-span-2">
        <Frame url="app.cms.optimizely.com/visual-builder/still-time-to-file" label="Visual Builder · Variations" accent="bg-sky-50">
          <div className="space-y-2 p-4 text-sm">
            <select value={preview} onChange={(e) => setPreview(e.target.value)} className="w-full rounded-md border border-slate-300 px-2 py-1.5">
              {Object.keys(HERO).map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
            <div className="rounded-lg bg-green-800 p-4 text-white"><div className="text-xs uppercase opacity-80">{HERO[preview].eyebrow}</div><div className="text-lg font-bold">{HERO[preview].headline}</div></div>
            <div className="text-xs text-slate-500">Only the hero changes; the rest of the page is identical. Copied from Original, then the hero edited.</div>
          </div>
        </Frame>
        <Frame url="app.optimizely.com/audiences/HRB DIY Abandoner" label="Feature Experimentation · Audience" accent="bg-blue-50">
          <div className="space-y-2 p-4 text-sm">
            <div className="font-bold">HRB DIY Abandoner</div>
            <div className="rounded border border-green-200 bg-green-50 p-2">Custom attribute <code>hrb_segment</code> · equals · <code>diy_abandoner</code></div>
            <div className="rounded border border-slate-200 p-2 text-xs">Rule <code>hrb_diy_abandoner_delivery</code> on <code>hrb_landing_personalization</code> serves <b>DiyAbandoner</b> to this audience (100%).</div>
            <div className="text-xs text-slate-500">In this demo a link sets the attribute. In production it would come from your CDP, ODP or the Adobe stack. On-site behavior only (consent-aware, IRC 7216).</div>
          </div>
        </Frame>
      </div>
      <div className="space-y-2 xl:col-span-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-slate-600">Visitor window:</span>
          <Btn kind={isDana ? 'primary' : 'ghost'} onClick={become}>Become Dana (?hrb_segment=diy_abandoner)</Btn>
          <Btn kind="ghost" onClick={clear}>Clear segment (?hrb_segment=)</Btn>
        </div>
        <div className="relative">
          <Frame url={`hrblock.optimoey.com/still-time-to-file${query}`} label={isDana ? 'Live App (visitor: Dana)' : 'Live App (visitor window)'}>
            <LiveApp variant={variant} />
          </Frame>
          {overlay && (
            <div className="absolute bottom-3 left-3 rounded-lg bg-black/80 px-3 py-2 font-mono text-xs text-white shadow-lg">
              <div><b>Variation:</b> {variant}</div>
              <div><b>Flag / rule:</b> {isDana ? 'hrb_landing_personalization / hrb_diy_abandoner_delivery' : 'hrb_landing_hero_test / hrb_hero_urgency_test'}</div>
              <div><b>Audience:</b> {isDana ? 'HRB DIY Abandoner (hrb_segment=diy_abandoner)' : 'none · visitor bucketed into Original (sticky cookie hrb_vid)'}</div>
              <div><b>Button events:</b> {HERO[variant].ev.map((e) => (e === 'none' ? 'none' : e)).join(' · ')}</div>
              <div className="text-green-300">decided server-side · no flicker</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- Scene 9 ---------------------------- */
const IDEAS = [
  { t: 'Point the hero at a tax pro with the April 15 deadline (“April 15 is close. Let a trusted tax pro handle it all.”)', s: 92 },
  { t: 'Show live appointment availability next to the CTA', s: 84 },
  { t: 'Lead with “live support from tax pros included” for DIY starters', s: 77 },
  { t: 'Shorten the hero subhead to one line on mobile', s: 61 },
];
function S9({ stamp }) {
  const emptyRule = { name: '', vars: '', metric: '', excl: '' };
  const [running, setRunning] = useState(false);
  const [secs, setSecs] = useState(0);
  const [ideas, setIdeas] = useState('idle');
  const [idea, setIdea] = useState(null);
  const [rule, setRule] = useState(emptyRule);
  const [review, setReview] = useState(false);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);
  const mmss = `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`;
  const pasteRule = () => setRule({ ...rule, name: 'Hero test: Original vs UrgencyB (live build)', vars: 'Original | UrgencyB (50/50)', metric: 'appointment_cta_click' });
  const ready = rule.name && rule.vars && rule.metric; // the exclusion group is optional
  const start = () => { setStarted(true); setRunning(false); stamp('test'); };
  const resetAll = () => { setRunning(false); setSecs(0); setStarted(false); setIdeas('idle'); setIdea(null); setReview(false); setRule(emptyRule); };
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4 rounded-xl bg-slate-900 px-5 py-3 text-white">
        <span className="font-mono text-4xl font-bold tabular-nums">{mmss}</span>
        <Btn kind="primary" onClick={() => setRunning(true)} disabled={running || started}>Start timer</Btn>
        <Btn kind="ghost" onClick={resetAll}>Reset</Btn>
        {started && <span className="text-green-300">✓ Idea to running test in {mmss}{secs < 300 ? ', under five minutes' : ''}</span>}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Frame url="mark.optimizely.com" label="Mark · @test_ideation" accent="bg-indigo-50">
          <div className="space-y-3 p-4 text-sm">
            <div className="rounded-lg bg-slate-100 p-2 font-mono text-xs">@test_ideation https://hrblock.optimoey.com/still-time-to-file · Goal: increase appointment_cta_click from visitors who are not in a personalized segment</div>
            <Btn kind="mark" onClick={() => { setIdeas('loading'); setTimeout(() => setIdeas('done'), 1300); }} disabled={ideas !== 'idle'}>{'Paste C6 & send'}</Btn>
            {ideas === 'loading' && <div><Spinner /> Analyzing the page and past results…</div>}
            {ideas === 'done' && IDEAS.map((i, k) => (
              <button key={i.t} onClick={() => setIdea(k)} className={`flex w-full items-center justify-between gap-2 rounded-lg border p-2 text-left ${idea === k ? 'border-green-600 bg-green-50' : 'border-slate-200 hover:border-slate-400'}`}>
                <span>{i.t}</span><Pill cls="bg-indigo-100 text-indigo-700">score {i.s}</Pill>
              </button>
            ))}
          </div>
        </Frame>
        <Frame url="app.optimizely.com/flags/hrb_landing_sandbox" label="Feature Experimentation" accent="bg-blue-50">
          <div className="space-y-3 p-4 text-sm">
            <div className="flex items-center justify-between"><div className="font-bold">hrb_landing_sandbox · Add rule › A/B Test</div><div className="flex gap-1"><Pill cls="bg-amber-100 text-amber-800">Development</Pill><Pill cls="bg-slate-100 text-slate-600">Sandbox · not read by the site</Pill></div></div>
            <div className="flex justify-end"><Btn kind="paste" onClick={pasteRule} disabled={idea === null}>Paste C7</Btn></div>
            {[['name', 'Rule name'], ['vars', 'Variations (cms-saas-content-variation)'], ['metric', 'Primary metric']].map(([k, l]) => (
              <label key={k} className="block text-xs font-semibold text-slate-600">{l}<input value={rule[k]} onChange={(e) => setRule({ ...rule, [k]: e.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 font-normal text-slate-900" /></label>
            ))}
            <label className="block text-xs font-semibold text-slate-600">Exclusion group
              <select value={rule.excl} onChange={(e) => setRule({ ...rule, excl: e.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 font-normal text-slate-900"><option value="">None (skip; optional)</option><option value="HRB landing tests">HRB landing tests (only if you created one)</option></select>
            </label>
            <div className="text-xs text-slate-500">Audience: Everyone · Traffic 100% · Secondary metric: diy_start_click</div>
            <Btn kind="mark" onClick={() => setReview(true)} disabled={!ready || review}>Pre-launch review (Mark)</Btn>
            {review && (
              <div className="space-y-1 rounded-lg border border-indigo-100 bg-indigo-50 p-2 text-xs">
                <div>✅ Primary metric matches the hypothesis</div>
                <div>{rule.excl ? '✅ Exclusion group prevents overlap with other landing-page tests' : 'ℹ No exclusion group chosen: add this test to one if you run several landing-page tests'}</div>
                <div>💡 Keep diy_start_click as a guardrail (already set)</div>
              </div>
            )}
            <Btn onClick={start} disabled={!review || started}>{started ? '✓ Running on the sandbox flag (Development)' : 'Save and start'}</Btn>
          </div>
        </Frame>
      </div>
    </div>
  );
}

/* ---------------------------- Scene 10 ---------------------------- */
const SUMMARY = 'UrgencyB increased appointment clicks by about 20% (7.2% vs 6.0%) and reached statistical significance. DIY starts were unchanged, so the urgency message did not pull visitors away from filing online. Recommendation: roll out UrgencyB to all visitors, then test live appointment availability next to the CTA. (Simulated data.)';
function ResultBar({ label, pct, n, win }) {
  return (
    <div>
      <div className="flex justify-between text-sm"><span className="font-medium">{label}</span><span>{pct.toFixed(1)}% <span className="text-xs text-slate-500">({n} visitors)</span></span></div>
      <div className="mt-1 h-4 rounded-full bg-slate-100"><div className={`h-4 rounded-full ${win ? 'bg-green-600' : 'bg-slate-400'}`} style={{ width: `${(pct / 8) * 100}%` }} /></div>
    </div>
  );
}
function S10({ answer, shipped, setShipped, stamp }) {
  const [sum, setSum] = useState(false);
  const text = useTypewriter(SUMMARY, sum, 3, 14);
  const [count, setCount] = useState(null);
  useEffect(() => {
    if (count === null) return undefined;
    if (count === 0) { setShipped(true); stamp('ship'); setCount(null); return undefined; }
    const id = setTimeout(() => setCount(count - 1), 1000);
    return () => clearTimeout(id);
  }, [count, setShipped, stamp]);
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <div className="space-y-4">
        <Frame url="app.optimizely.com/flags/hrb_landing_hero_test/results" label="Feature Experimentation · Results" accent="bg-blue-50">
          <div className="space-y-4 p-4 text-sm">
            <div className="flex flex-wrap items-center gap-2"><b>Hero test: Original vs UrgencyB</b><Pill cls="bg-amber-100 text-amber-800">Development · seeded</Pill><Pill cls="bg-slate-100 text-slate-600">Simulated traffic</Pill></div>
            <div className="text-xs font-bold text-slate-500">PRIMARY · appointment_cta_click</div>
            <ResultBar label="Original" pct={6.0} n="14,012" />
            <ResultBar label="UrgencyB" pct={7.2} n="13,988" win />
            <div className="flex flex-wrap gap-2"><Pill cls="bg-green-100 text-green-800">+20.0% relative lift</Pill><Pill cls="bg-green-100 text-green-800">Statistically significant</Pill></div>
            <div className="text-xs text-slate-500">Stats Engine: sequential testing with false discovery rate control, safe to check every day.</div>
            <div className="rounded border border-slate-200 p-2 text-xs"><b>Secondary · diy_start_click:</b> 9.1% vs 9.0%, no significant change</div>
            <Btn kind="mark" onClick={() => setSum(true)} disabled={sum}>Summarize Results</Btn>
            {sum && <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-3 text-sm">{text}{text.length < SUMMARY.length && <span className="animate-pulse">▍</span>}</div>}
            <Btn onClick={() => setCount(5)} disabled={shipped || count !== null}>{shipped ? '✓ UrgencyB live for everyone' : 'Conclude and deploy UrgencyB to everyone'}</Btn>
            {count !== null && <div className="text-sm text-slate-600"><Spinner /> Live App picks up the change on its next poll (30 s once the interval is changed, plus time to reach the CDN; sped up here): {count}s</div>}
          </div>
        </Frame>
        {shipped && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm">
            <div className="font-bold text-green-900">Winner live in seconds, with no dev ticket.</div>
            {answer.trim() && <div className="mt-1 text-green-900">Earlier you said: <i>“{answer}”</i>. That difference is the gap we close.</div>}
          </div>
        )}
      </div>
      <Frame url="hrblock.optimoey.com/still-time-to-file" label="Live App (visitor window)">
        <LiveApp variant={shipped ? 'UrgencyB' : 'Original'} />
      </Frame>
    </div>
  );
}

/* ---------------------------- Scene 11 ---------------------------- */
const SEG = {
  all: { label: 'All visitors', cr: [3.1, 3.5], rpv: [7.42, 8.31], lift: '+12.9%' },
  new: { label: 'New clients', cr: [2.4, 2.8], rpv: [5.9, 6.86], lift: '+16.7%' },
  returning: { label: 'Returning clients', cr: [4.2, 4.6], rpv: [9.8, 10.62], lift: '+9.5%' },
};
function PairBars({ title, vals, fmt, max }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="text-xs font-bold text-slate-500">{title}</div>
      {['Original', 'UrgencyB'].map((v, i) => (
        <div key={v} className="mt-2">
          <div className="flex justify-between text-sm"><span>{v}</span><b>{fmt(vals[i])}</b></div>
          <div className="mt-1 h-3 rounded-full bg-slate-100"><div className={`h-3 rounded-full transition-all duration-700 ${i ? 'bg-green-600' : 'bg-slate-400'}`} style={{ width: `${(vals[i] / max) * 100}%` }} /></div>
        </div>
      ))}
    </div>
  );
}
function S11({ stamp }) {
  const [seg, setSeg] = useState('all');
  useEffect(() => { stamp('impact'); }, [stamp]);
  const d = SEG[seg];
  return (
    <Frame url="analytics.optimizely.com/explorations/ts27-hero-impact" label="Optimizely Analytics · warehouse-native" accent="bg-emerald-50">
      <div className="space-y-4 p-4 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <Pill cls="bg-sky-100 text-sky-800">❄ Snowflake (synthetic dataset)</Pill>
          <span className="text-slate-500">Segment:</span>
          {Object.entries(SEG).map(([k, v]) => <Btn key={k} kind={seg === k ? 'primary' : 'ghost'} onClick={() => setSeg(k)}>{v.label}</Btn>)}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-green-800 p-4 text-white"><div className="text-xs opacity-80">Lift in completed returns</div><div className="text-4xl font-extrabold">{d.lift}</div><div className="text-xs opacity-80">{d.label} · UrgencyB vs Original</div></div>
          <PairBars title="COMPLETED RETURN RATE" vals={d.cr} fmt={(v) => `${v.toFixed(1)}%`} max={5} />
          <PairBars title="REVENUE PER VISITOR" vals={d.rpv} fmt={(v) => `$${v.toFixed(2)}`} max={12} />
        </div>
        <div className="text-xs text-slate-500">Measured on the warehouse, with no copy of client data. Experiments are causal, so results can calibrate your mix model.</div>
      </div>
    </Frame>
  );
}

/* ---------------------------- Scene 12 ---------------------------- */
function S12({ stamps, stamp }) {
  const [state, setState] = useState('idle');
  const run = () => { setState('loading'); setTimeout(() => { setState('done'); stamp('digest'); }, 1500); };
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Frame url="mark.optimizely.com" label="Mark · Experimentation Program Overview" accent="bg-indigo-50">
        <div className="space-y-3 p-4 text-sm">
          <div className="rounded-lg bg-slate-100 p-2 font-mono text-xs">@experimentation_program_overview · Project: Marvin Demo · last 7 days vs previous 7 · email report</div>
          <Btn kind="mark" onClick={run} disabled={state !== 'idle'}>{'Paste C9 & send'}</Btn>
          {state === 'loading' && <div><Spinner /> Compiling velocity, win rate and learnings…</div>}
          {state === 'done' && (
            <div className="space-y-3 rounded-lg border border-indigo-100 p-3">
              <div className="font-bold">Weekly decision digest · Week 11 (synthetic)</div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[['9', 'tests / week'], ['38%', 'win rate (up from 31%)'], ['4', 'concluded']].map(([a, b]) => <div key={b} className="rounded bg-indigo-50 p-2"><div className="text-xl font-bold">{a}</div><div className="text-xs text-slate-600">{b}</div></div>)}
              </div>
              <div><div className="text-xs font-bold text-slate-500">TOP WINNERS</div>
                <ol className="list-decimal pl-5"><li>Landing hero: deadline urgency (+20% appointment clicks)</li><li>Office card availability badge (+8% office bookings)</li><li>DIY reassurance copy (+4% DIY starts)</li></ol></div>
              <div><div className="text-xs font-bold text-slate-500">LEARNINGS</div>
                <ul className="list-disc pl-5"><li>Urgency beats price messaging in the final two weeks</li><li>Personalizing for DIY abandoners lifts assisted bookings</li></ul></div>
              <div className="text-xs text-green-800">✓ Emailed to leadership, Friday 8:00</div>
            </div>
          )}
        </div>
      </Frame>
      <div className="rounded-xl hrb-dark hrb-motif p-6 text-white shadow-sm">
        <div className="text-sm uppercase tracking-widest text-green-200">Maya’s week</div>
        <ol className="mt-3 space-y-2">
          {TIMELINE.map(([k, t, l]) => (
            <li key={k} className={`flex items-center gap-3 ${stamps[k] ? '' : 'opacity-40'}`}>
              <span className="w-28 shrink-0 rounded bg-black/30 px-2 py-0.5 text-center font-mono text-xs">{t}</span>
              <span className="flex-1 text-sm">{l}</span><span>{stamps[k] ? '✓' : '·'}</span>
            </li>
          ))}
        </ol>
        <div className="mt-5 space-y-1 border-t border-white/20 pt-4 text-sm">
          <div>1. The winning version went live in seconds, with no dev ticket.</div>
          <div>2. A marketer launched a test on her own in minutes.</div>
          <div>3. It plugged into what you already have.</div>
          <div className="pt-2 italic text-green-200">Expert-led, technology-enabled: the technology getting out of the experts’ way.</div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- Scene 13 ---------------------------- */
function ArchBox({ t, d, cls }) {
  return <div className={`rounded-lg border p-3 ${cls}`}><div className="text-sm font-bold">{t}</div><div className="text-xs opacity-80">{d}</div></div>;
}
function S13() {
  const trust = [
    ['Consent-aware personalization (IRC 7216)', 'Design principle', 'bg-green-100 text-green-800'],
    ['ODP · U.S. region hosting', 'Documented', 'bg-green-100 text-green-800'],
    ['Optimizely Analytics · AWS US-East-1', 'Documented', 'bg-green-100 text-green-800'],
    ['Mark · U.S. region', 'Documented', 'bg-green-100 text-green-800'],
    ['CMS SaaS, Experimentation, CMP residency incl. backups and logs', 'Confirming in writing', 'bg-amber-100 text-amber-800'],
    ['IRC 7216 contractual position', 'Confirming in writing', 'bg-amber-100 text-amber-800'],
  ];
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 font-bold">Coexistence architecture</div>
        <div className="grid items-center gap-4 lg:grid-cols-7">
          <div className="space-y-2 lg:col-span-2">
            <div className="text-xs font-bold text-slate-500">YOU ALREADY HAVE</div>
            {[['AEP · Real-Time CDP', 'profiles and audiences'], ['Journey Optimizer · SFMC', '60M seasonal emails'], ['Snowflake / Databricks', 'system of record'], ['Office systems', 'locations and availability']].map(([t, d]) => <ArchBox key={t} t={t} d={d} cls="border-slate-300 bg-slate-50" />)}
          </div>
          <div className="text-center text-3xl text-slate-400">⇄</div>
          <div className="space-y-2 lg:col-span-2">
            <div className="text-xs font-bold text-green-700">OPTIMIZELY ADDS</div>
            {[['CMS SaaS + Graph', 'governed content, connected sources'], ['Feature Experimentation', 'server-side decisions and tests'], ['Your CDP or ODP', 'audiences (a URL attribute stands in today)'], ['CMP + DAM', 'intake, approvals, assets'], ['Analytics · Mark', 'warehouse-native insight, agents']].map(([t, d]) => <ArchBox key={t} t={t} d={d} cls="border-green-300 bg-green-50 text-green-900" />)}
          </div>
          <div className="text-center text-3xl text-slate-400">→</div>
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-500">CHANNELS</div>
            {[['Web', 'hrblock.com'], ['App', 'same decisions'], ['Messaging', 'content by API']].map(([t, d]) => <ArchBox key={t} t={t} d={d} cls="border-blue-200 bg-blue-50" />)}
          </div>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 font-bold">Taxpayer trust</div>
          {trust.map(([t, s, c]) => (
            <div key={t} className="flex items-center justify-between gap-2 border-b border-slate-100 py-2 text-sm"><span>{t}</span><Pill cls={c}>{s}</Pill></div>
          ))}
        </div>
        <div className="rounded-xl hrb-dark hrb-motif p-5 text-white shadow-sm">
          <div className="text-sm uppercase tracking-widest text-green-200">Proposed next step</div>
          <div className="mt-2 text-2xl font-bold">Scoped proof of concept</div>
          <ul className="mt-3 space-y-1 text-sm"><li>• One late-season landing page</li><li>• One CMS-driven experiment</li><li>• One CMP workflow with Legal approval</li></ul>
          <div className="mt-4 rounded-lg bg-white/10 p-3 text-sm">Measured against the clock you described: <b>time from decision to live.</b></div>
          <div className="mt-3 text-sm italic text-green-200">“Who should we work with to set that up?”</div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- brand theme ---------------------------- */
const BRAND_CSS = `
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
function BrandStyles() { return <style>{BRAND_CSS}</style>; }

/* ---------------------------- app ---------------------------- */
const clampIdx = (i) => Math.max(0, Math.min(SCENES.length - 1, Number(i) || 0));

export default function App() {
  const [idx, setIdx] = useState(0);
  const [stamps, setStamps] = useState({});
  const [answer, setAnswer] = useState('');
  const [lang, setLang] = useState('en');
  const [asset, setAsset] = useState(ASSETS[0]);
  const [shipped, setShipped] = useState(false);
  const [phoenix, setPhoenix] = useState(null);
  const [overlay, setOverlay] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const presenterWin = useRef(null);
  const chan = useRef(null);
  const latest = useRef('');
  const onCommand = useRef(() => {});

  const stamp = React.useCallback((k) => setStamps((st) => (st[k] ? st : { ...st, [k]: true })), []);

  const resetAll = () => {
    setStamps({}); setAnswer(''); setLang('en'); setAsset(ASSETS[0]);
    setShipped(false); setPhoenix(null); setOverlay(true); setIdx(0); setResetKey((k) => k + 1);
  };

  /* S opens (or focuses) the presenter window. */
  const openPresenter = () => {
    const w = presenterWin.current;
    if (w && !w.closed) { w.focus(); return; }
    presenterWin.current = window.open(PRESENTER_URL, PRESENTER_WINDOW, 'popup=yes,width=560,height=940');
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target && e.target.tagName) || '';
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag) || (e.target && e.target.isContentEditable)) return;
      if (e.key === 'ArrowRight') setIdx((i) => Math.min(SCENES.length - 1, i + 1));
      if (e.key === 'ArrowLeft') setIdx((i) => Math.max(0, i - 1));
      if (e.key === 's' || e.key === 'S') { e.preventDefault(); openPresenter(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* Commands from the presenter window. Reassigned every render so it always sees fresh handlers. */
  useEffect(() => {
    onCommand.current = (m) => {
      if (m.type === 'step') setIdx((i) => clampIdx(i + Number(m.delta || 0)));
      else if (m.type === 'goto') setIdx(clampIdx(m.idx));
      else if (m.type === 'answer') setAnswer(String(m.value ?? ''));
      else if (m.type === 'overlay') setOverlay(!!m.value);
      else if (m.type === 'reset') resetAll();
    };
  });

  /* Channel to the presenter window (declared before the state broadcast so it exists on first run). */
  useEffect(() => {
    const ch = openChannel();
    if (!ch) return undefined;
    chan.current = ch;
    ch.onmessage = (e) => {
      const m = e.data || {};
      if (m.type === 'hello') { if (latest.current) ch.postMessage({ type: 'state', payload: latest.current }); }
      else onCommand.current(m);
    };
    return () => { ch.close(); chan.current = null; };
  }, []);

  const payload = JSON.stringify({ idx, stamps, answer, overlay, resetKey });
  useEffect(() => {
    latest.current = payload;
    chan.current?.postMessage({ type: 'state', payload });
  }, [payload]);

  const s = SCENES[idx];

  const stage = () => {
    switch (s.n) {
      case 1: return <S1 />;
      case 2: return <S2 lang={lang} setLang={setLang} />;
      case 3: return <S3 stamp={stamp} />;
      case 4: return <S4 stamp={stamp} />;
      case 5: return <S5 asset={asset} setAsset={setAsset} stamp={stamp} />;
      case 6: return <S6 asset={asset} stamp={stamp} phoenix={phoenix} setPhoenix={setPhoenix} />;
      case 7: return <S7 stamp={stamp} />;
      case 8: return <S8 stamp={stamp} overlay={overlay} />;
      case 9: return <S9 stamp={stamp} />;
      case 10: return <S10 answer={answer} shipped={shipped} setShipped={setShipped} stamp={stamp} />;
      case 11: return <S11 stamp={stamp} />;
      case 12: return <S12 stamps={stamps} stamp={stamp} />;
      default: return <S13 />;
    }
  };

  return (
    <div className="hrb-app flex h-screen flex-col bg-slate-100 font-sans text-slate-900">
      <BrandStyles />
      <header className="hrb-dark px-5 py-3 text-white">
        <div className="text-xs uppercase tracking-widest text-green-200">{BRAND} · Optimizely demo</div>
      </header>

      <main className="flex min-w-0 flex-1 flex-col">
        <div className="border-b border-slate-200 bg-white px-5 py-3">
          <div className="text-xs text-slate-500">{s.act}</div>
          <div className="text-lg font-bold">{s.title}</div>
        </div>
        <div className="flex-1 overflow-y-auto p-5" key={`${idx}-${resetKey}`}>
          {stage()}
        </div>
      </main>
    </div>
  );
}
